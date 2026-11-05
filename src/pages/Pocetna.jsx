import { useState } from 'react'
import { formatCijena, formatVrijeme, normalizirajReg, sada, statusNaplate } from '../constants'
import { useLista } from '../hooks'
import NaplataService from '../services/NaplataService'
import VoziloService from '../services/VoziloService'
import ZonaService from '../services/ZonaService'

export default function Pocetna({ idi }) {

    const [unos, setUnos] = useState('')
    const [trazi, setTrazi] = useState('')
    const vozila = useLista(VoziloService)
    const naplate = useLista(NaplataService)
    const zone = useLista(ZonaService)

    const trenutak = sada()
    const aktivnih = naplate.stavke.filter((n) => statusNaplate(n, trenutak) === 'AKTIVNO').length
    const danasnje = naplate.stavke.filter((n) => !n.storno && n.pocetak.slice(0, 10) === trenutak.slice(0, 10))

    // provjera: aktivna naplata -> plaćeno; postoji samo istekla -> isteklo; inače nije plaćeno
    let rezultat = null
    if (trazi) {
        const v = vozila.stavke.find((x) => x.registracija === trazi)
        const njegove = v ? naplate.stavke.filter((n) => n.vozilo === v.sifra && !n.storno) : []
        const aktivna = njegove.find((n) => n.pocetak <= trenutak && n.zavrsetak >= trenutak)
        if (aktivna) rezultat = { klasa: 'ok', tekst: 'PARKIRANJE JE PLAĆENO', n: aktivna }
        else if (njegove.length) rezultat = { klasa: 'istek', tekst: 'PARKIRANJE JE ISTEKLO', n: [...njegove].sort((a, b) => b.zavrsetak.localeCompare(a.zavrsetak))[0] }
        else rezultat = { klasa: 'nije', tekst: 'PARKIRANJE NIJE PLAĆENO' }
    }

    const provjeri = (e) => { e.preventDefault(); setTrazi(normalizirajReg(unos)) }
    const nazivZone = (s) => zone.stavke.find((z) => z.sifra === s)?.naziv ?? '—'

    return (
        <>
            <h1>Provjera parkiranja</h1>
            <form className="kutija provjera" onSubmit={provjeri}>
                <label>Registarska oznaka
                    <input name="registracija" value={unos} onChange={(e) => setUnos(e.target.value)} placeholder="npr. OS 123 AB" />
                </label>
                <button className="gumb" type="submit">Provjeri</button>
            </form>

            {rezultat && (
                <div className={`kutija rezultat ${rezultat.klasa}`}>
                    <b>{trazi}: {rezultat.tekst}</b>
                    {rezultat.n && <span>Zona {nazivZone(rezultat.n.zona)}, {formatVrijeme(rezultat.n.pocetak)} – {formatVrijeme(rezultat.n.zavrsetak)}</span>}
                </div>
            )}

            <div className="kutije">
                <div className="kutija statistika"><b>{aktivnih}</b><span>Aktivnih parkiranja</span></div>
                <div className="kutija statistika"><b>{danasnje.length}</b><span>Naplata danas</span></div>
                <div className="kutija statistika"><b>{formatCijena(danasnje.reduce((z, n) => z + n.iznos, 0))}</b><span>Naplaćeno danas</span></div>
            </div>
            <button className="gumb" onClick={() => idi('naplate')}>Evidentiraj novu naplatu</button>
        </>
    )
}
