import { useState } from 'react'
import CrudTablica from '../components/CrudTablica'
import { normalizirajReg } from '../constants'
import { useLista } from '../hooks'
import NaplataService from '../services/NaplataService'
import VoziloService from '../services/VoziloService'

export default function Vozila({ idi }) {

    const vozila = useLista(VoziloService)
    const naplate = useLista(NaplataService)
    const [upit, setUpit] = useState('')

    const brojNaplata = (s) => naplate.stavke.filter((n) => n.vozilo === s).length
    const prikaz = vozila.stavke.filter((v) => v.registracija.includes(normalizirajReg(upit)))

    function validate(v, uredjuje) {
        const g = {}
        const reg = normalizirajReg(v.registracija)
        if (reg.length < 3) g.registracija = 'Unesite ispravnu registarsku oznaku.'
        else if (vozila.stavke.some((x) => x.sifra !== uredjuje?.sifra && x.registracija === reg)) g.registracija = `Vozilo ${reg} već postoji.`
        return g
    }

    return (
        <CrudTablica
            naslov="Vozila"
            novi="Novo vozilo"
            servis={VoziloService}
            stavke={prikaz}
            osvjezi={vozila.osvjezi}
            prazno="Nema vozila."
            validate={validate}
            alat={(
                <div className="alat">
                    <input type="search" name="trazi" placeholder="Pretraži po registraciji" value={upit} onChange={(e) => setUpit(e.target.value)} />
                </div>
            )}
            fields={[
                { name: 'registracija', label: 'Registarska oznaka', required: true },
                { name: 'drzava', label: 'Država registracije', required: true, default: 'Hrvatska' },
                { name: 'marka', label: 'Marka (nije obavezno)' },
                { name: 'model', label: 'Model (nije obavezno)' },
            ]}
            columns={[
                { render: (v) => <b>{v.registracija}</b>, label: 'Registracija' },
                { key: 'drzava', label: 'Država' },
                { render: (v) => [v.marka, v.model].filter(Boolean).join(' ') || '—', label: 'Vozilo' },
                { render: (v) => <button className="veza" onClick={() => idi('naplate', v.sifra)}>{brojNaplata(v.sifra)} naplata</button>, label: 'Naplate' },
            ]}
            blokirajBrisanje={(v) => (brojNaplata(v.sifra) > 0 ? 'Vozilo ima naplate i ne može se obrisati.' : null)}
        />
    )
}
