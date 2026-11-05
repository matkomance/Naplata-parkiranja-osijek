import { formatCijena, sada, statusNaplate } from '../constants'
import { useLista } from '../hooks'
import NaplataService from '../services/NaplataService'
import ZonaService from '../services/ZonaService'

const zbroji = (stavke, kljuc) => {
    const m = {}
    stavke.forEach((n) => {
        const k = kljuc(n)
        m[k] ??= { broj: 0, iznos: 0 }
        m[k].broj += 1
        m[k].iznos += n.iznos
    })
    return Object.entries(m).sort((a, b) => b[0].localeCompare(a[0]))
}

function Tablica({ naslov, prvi, redovi }) {
    return (
        <>
            <h2>{naslov}</h2>
            <div className="kutija tablica-omot">
                <table>
                    <thead><tr><th>{prvi}</th><th>Broj parkiranja</th><th>Naplaćeno</th></tr></thead>
                    <tbody>
                        {redovi.length === 0 && <tr><td colSpan="3">Nema podataka.</td></tr>}
                        {redovi.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v.broj}</td><td>{formatCijena(v.iznos)}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default function Izvjestaji() {

    const naplate = useLista(NaplataService)
    const zone = useLista(ZonaService)

    const vrijede = naplate.stavke.filter((n) => !n.storno)
    const trenutak = sada()
    const aktivnih = naplate.stavke.filter((n) => statusNaplate(n, trenutak) === 'AKTIVNO').length
    const nazivZone = (s) => zone.stavke.find((z) => z.sifra === s)?.oznaka ?? '—'

    return (
        <>
            <h1>Izvještaji</h1>
            <div className="kutije">
                <div className="kutija statistika"><b>{aktivnih}</b><span>Aktivnih parkiranja</span></div>
                <div className="kutija statistika"><b>{vrijede.length}</b><span>Ukupno naplata (bez storniranih)</span></div>
                <div className="kutija statistika"><b>{formatCijena(vrijede.reduce((z, n) => z + n.iznos, 0))}</b><span>Ukupno naplaćeno</span></div>
            </div>
            <Tablica naslov="Naplata po danu" prvi="Dan" redovi={zbroji(vrijede, (n) => n.pocetak.slice(0, 10))} />
            <Tablica naslov="Naplata po mjesecu" prvi="Mjesec" redovi={zbroji(vrijede, (n) => n.pocetak.slice(0, 7))} />
            <Tablica naslov="Naplata po parkirnoj zoni" prvi="Zona" redovi={zbroji(vrijede, (n) => nazivZone(n.zona))} />
        </>
    )
}
