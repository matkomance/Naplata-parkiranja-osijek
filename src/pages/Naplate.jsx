import { useState } from 'react'
import CrudTablica from '../components/CrudTablica'
import { NACINI_PLACANJA, STATUSI, dodajSate, formatCijena, formatVrijeme, normalizirajReg, sada, statusNaplate } from '../constants'
import { useLista } from '../hooks'
import NaplataService from '../services/NaplataService'
import VoziloService from '../services/VoziloService'
import ZonaService from '../services/ZonaService'

export default function Naplate({ param }) {

    const naplate = useLista(NaplataService)
    const vozila = useLista(VoziloService)
    const zone = useLista(ZonaService)
    const [reg, setReg] = useState('')
    const [zonaF, setZonaF] = useState('')
    const [statusF, setStatusF] = useState('')
    const [nacinF, setNacinF] = useState('')
    const [od, setOd] = useState('')
    const [do_, setDo] = useState('')
    const voziloF = Number(param) || 0

    const vozilo = (s) => vozila.stavke.find((v) => v.sifra === s)
    const zona = (s) => zone.stavke.find((z) => z.sifra === s)
    const trenutak = sada()

    const prikaz = naplate.stavke
        .filter((n) => !voziloF || n.vozilo === voziloF)
        .filter((n) => !reg || (vozilo(n.vozilo)?.registracija ?? '').includes(normalizirajReg(reg)))
        .filter((n) => !zonaF || n.zona === Number(zonaF))
        .filter((n) => !statusF || statusNaplate(n, trenutak) === statusF)
        .filter((n) => !nacinF || n.nacin === nacinF)
        .filter((n) => !od || n.pocetak.slice(0, 10) >= od)
        .filter((n) => !do_ || n.pocetak.slice(0, 10) <= do_)
        .sort((a, b) => b.pocetak.localeCompare(a.pocetak))

    function validate(v) {
        const g = {}
        if (!(Number(v.trajanje) > 0)) g.trajanje = 'Trajanje mora biti veće od 0 sati.'
        const z = zona(Number(v.zona))
        if (z && !z.aktivna) g.zona = 'Zona nije aktivna.'
        return g
    }

    return (
        <CrudTablica
            naslov={voziloF ? `Naplate vozila ${vozilo(voziloF)?.registracija ?? ''}` : 'Naplate parkiranja'}
            novi="Nova naplata"
            servis={NaplataService}
            stavke={prikaz}
            osvjezi={naplate.osvjezi}
            prazno="Nema naplata za zadane uvjete."
            validate={validate}
            alat={(
                <div className="alat filteri">
                    <input type="search" name="registracija" placeholder="Registracija" value={reg} onChange={(e) => setReg(e.target.value)} />
                    <select name="zonaF" value={zonaF} onChange={(e) => setZonaF(e.target.value)}>
                        <option value="">Sve zone</option>
                        {zone.stavke.map((z) => <option key={z.sifra} value={z.sifra}>{z.oznaka}</option>)}
                    </select>
                    <select name="statusF" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
                        <option value="">Svi statusi</option>
                        {STATUSI.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <select name="nacinF" value={nacinF} onChange={(e) => setNacinF(e.target.value)}>
                        <option value="">Svi načini plaćanja</option>
                        {NACINI_PLACANJA.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <label>Od <input type="date" name="od" value={od} onChange={(e) => setOd(e.target.value)} /></label>
                    <label>Do <input type="date" name="do" value={do_} onChange={(e) => setDo(e.target.value)} /></label>
                </div>
            )}
            fields={[
                { name: 'vozilo', label: 'Vozilo', type: 'select', asNumber: true, required: true, options: vozila.stavke.map((v) => ({ value: v.sifra, label: v.registracija })) },
                { name: 'zona', label: 'Parkirna zona', type: 'select', asNumber: true, required: true, options: zone.stavke.map((z) => ({ value: z.sifra, label: `${z.oznaka} – ${z.naziv} (${formatCijena(z.cijenaSat)}/h)${z.aktivna ? '' : ' [neaktivna]'}` })) },
                { name: 'pocetak', label: 'Početak parkiranja', type: 'datetime-local', required: true, default: sada() },
                { name: 'trajanje', label: 'Trajanje (sati)', type: 'number', step: '0.5', required: true, default: 1 },
                { name: 'nacin', label: 'Način plaćanja', type: 'select', required: true, options: NACINI_PLACANJA.map((n) => ({ value: n, label: n })) },
                { name: 'storno', label: 'Stornirano', type: 'checkbox' },
            ]}
            columns={[
                { render: (n) => <b>{vozilo(n.vozilo)?.registracija ?? '—'}</b>, label: 'Vozilo' },
                { render: (n) => zona(n.zona)?.oznaka ?? '—', label: 'Zona' },
                { render: (n) => formatVrijeme(n.pocetak), label: 'Početak' },
                { render: (n) => formatVrijeme(n.zavrsetak ?? dodajSate(n.pocetak, n.trajanje)), label: 'Završetak' },
                { render: (n) => formatCijena(n.iznos), label: 'Iznos' },
                { key: 'nacin', label: 'Plaćanje' },
                { render: (n) => { const s = statusNaplate(n, trenutak); return <span className={s === 'AKTIVNO' ? 'oznaka ok' : 'oznaka'}>{s}</span> }, label: 'Status' },
            ]}
        />
    )
}
