import { useState } from 'react'

// Generički prikaz s punim CRUD-om: popis (Read), obrazac za novi zapis (Create),
// uređivanje (Update) i brisanje s potvrdom (Delete).
export default function CrudTablica({ naslov, novi, servis, stavke, osvjezi, fields, columns, validate, blokirajBrisanje, prazno, alat }) {

    const zadano = (f) => f.default ?? (f.type === 'checkbox' ? false : '')
    const prazna = Object.fromEntries(fields.map((f) => [f.name, zadano(f)]))
    const [vrijednosti, setVrijednosti] = useState(prazna)
    const [uredjuje, setUredjuje] = useState(null)
    const [greske, setGreske] = useState({})
    const [otvoreno, setOtvoreno] = useState(false)
    const [poruka, setPoruka] = useState('')

    const otvoriNovi = () => { setUredjuje(null); setVrijednosti(prazna); setGreske({}); setPoruka(''); setOtvoreno(true) }
    const otvoriUredi = (stavka) => {
        setUredjuje(stavka)
        setVrijednosti(Object.fromEntries(fields.map((f) => [f.name, stavka[f.name] ?? zadano(f)])))
        setGreske({}); setPoruka(''); setOtvoreno(true)
    }
    const zatvori = () => { setOtvoreno(false); setUredjuje(null); setGreske({}) }

    const promijeni = (e) => setVrijednosti({ ...vrijednosti, [e.target.name]: e.target.value })

    async function spremi(e) {
        e.preventDefault()
        const g = {}
        fields.forEach((f) => {
            if (f.required && !String(vrijednosti[f.name]).trim()) g[f.name] = 'Obavezno polje'
        })
        if (Object.keys(g).length === 0 && validate) Object.assign(g, validate(vrijednosti, uredjuje))
        setGreske(g)
        if (Object.keys(g).length) return

        const podaci = {}
        fields.forEach((f) => {
            const v = vrijednosti[f.name]
            if (f.type === 'number' || f.asNumber) podaci[f.name] = v === '' ? null : Number(v)
            else podaci[f.name] = typeof v === 'string' ? v.trim() : v
        })
        const uspjelo = uredjuje ? await servis.promijeni(uredjuje.sifra, podaci) : await servis.dodaj(podaci)
        await osvjezi()
        if (uspjelo) {
            zatvori()
        } else {
            setPoruka('Spremanje nije uspjelo. Preglednik možda blokira spremanje podataka.')
        }
    }

    async function obrisi(stavka) {
        const blok = blokirajBrisanje && blokirajBrisanje(stavka)
        if (blok) { setPoruka(blok); return }
        if (!window.confirm('Jeste li sigurni da želite obrisati zapis?')) return
        const uspjelo = await servis.obrisi(stavka.sifra)
        await osvjezi()
        setPoruka(uspjelo ? '' : 'Brisanje nije uspjelo. Preglednik možda blokira spremanje podataka.')
    }

    return (
        <section>
            <div className="glava">
                <h1>{naslov}</h1>
                {!otvoreno && <button className="gumb" onClick={otvoriNovi}>+ {novi}</button>}
            </div>

            {poruka && <div className="upozorenje">{poruka}</div>}

            {otvoreno && (
                <form className="kutija obrazac" onSubmit={spremi} noValidate>
                    <h2>{uredjuje ? 'Uredi zapis' : novi}</h2>
                    <div className="mreza-obrasca">
                        {fields.map((f) => (
                            <label key={f.name} className={f.type === 'textarea' ? 'puna' : f.type === 'checkbox' ? 'kvacica' : ''}>
                                {f.type === 'checkbox' ? (
                                    <>
                                        <input name={f.name} type="checkbox" checked={!!vrijednosti[f.name]}
                                            onChange={(e) => setVrijednosti({ ...vrijednosti, [f.name]: e.target.checked })} />
                                        {f.label}
                                    </>
                                ) : (
                                    <>
                                        {f.label}
                                        {f.type === 'select' ? (
                                            <select name={f.name} value={vrijednosti[f.name]} onChange={promijeni}>
                                                <option value="">{f.praznoOznaka ?? '— odaberite —'}</option>
                                                {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        ) : f.type === 'textarea' ? (
                                            <textarea name={f.name} rows={3} value={vrijednosti[f.name]} onChange={promijeni} />
                                        ) : (
                                            <input name={f.name} type={f.type || 'text'} step={f.step} value={vrijednosti[f.name]} onChange={promijeni} />
                                        )}
                                    </>
                                )}
                                {greske[f.name] && <em>{greske[f.name]}</em>}
                            </label>
                        ))}
                    </div>
                    <div className="akcije">
                        <button className="gumb" type="submit">Spremi</button>
                        <button className="gumb sporedni" type="button" onClick={zatvori}>Odustani</button>
                    </div>
                </form>
            )}

            {alat}

            <div className="kutija tablica-omot">
                {stavke.length === 0 ? (
                    <p className="prigusen popuna">{prazno}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                {columns.map((c) => <th key={c.label}>{c.label}</th>)}
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {stavke.map((s) => (
                                <tr key={s.sifra}>
                                    {columns.map((c) => <td key={c.label}>{c.render ? c.render(s) : s[c.key]}</td>)}
                                    <td className="akcije-reda">
                                        <button className="veza" onClick={() => otvoriUredi(s)}>Uredi</button>
                                        <button className="veza opasno" onClick={() => obrisi(s)}>Obriši</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    )
}
