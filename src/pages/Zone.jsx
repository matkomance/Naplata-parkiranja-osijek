import CrudTablica from '../components/CrudTablica'
import { formatCijena } from '../constants'
import { useLista } from '../hooks'
import NaplataService from '../services/NaplataService'
import ZonaService from '../services/ZonaService'

export default function Zone() {

    const zone = useLista(ZonaService)
    const naplate = useLista(NaplataService)

    const brojNaplata = (s) => naplate.stavke.filter((n) => n.zona === s).length

    function validate(v, uredjuje) {
        const g = {}
        if (zone.stavke.some((z) => z.sifra !== uredjuje?.sifra && z.oznaka.toLowerCase() === String(v.oznaka).trim().toLowerCase())) g.oznaka = 'Oznaka zone već postoji.'
        if (!(Number(v.cijenaSat) > 0)) g.cijenaSat = 'Cijena sata mora biti veća od 0.'
        if (v.od && v.do && v.do <= v.od) g.do = 'Završetak naplate mora biti nakon početka.'
        return g
    }

    return (
        <CrudTablica
            naslov="Parkirne zone"
            novi="Nova zona"
            servis={ZonaService}
            stavke={zone.stavke}
            osvjezi={zone.osvjezi}
            prazno="Još nema zona."
            validate={validate}
            fields={[
                { name: 'oznaka', label: 'Oznaka', required: true },
                { name: 'naziv', label: 'Naziv', required: true },
                { name: 'cijenaSat', label: 'Cijena sata (€)', type: 'number', step: '0.01', required: true },
                { name: 'od', label: 'Naplata od', type: 'time', required: true, default: '07:00' },
                { name: 'do', label: 'Naplata do', type: 'time', required: true, default: '20:00' },
                { name: 'aktivna', label: 'Aktivna', type: 'checkbox', default: true },
            ]}
            columns={[
                { key: 'oznaka', label: 'Oznaka' },
                { key: 'naziv', label: 'Naziv' },
                { render: (z) => formatCijena(z.cijenaSat), label: 'Cijena / sat' },
                { render: (z) => `${z.od} – ${z.do}`, label: 'Vrijeme naplate' },
                { render: (z) => <span className={z.aktivna ? 'oznaka ok' : 'oznaka'}>{z.aktivna ? 'Aktivna' : 'Neaktivna'}</span>, label: 'Status' },
                { render: (z) => brojNaplata(z.sifra), label: 'Naplata' },
            ]}
            blokirajBrisanje={(z) => (brojNaplata(z.sifra) > 0 ? 'Zona ima naplate. Umjesto brisanja uredite zonu i maknite kvačicu „Aktivna”.' : null)}
        />
    )
}
