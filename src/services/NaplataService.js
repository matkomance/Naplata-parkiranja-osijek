import { napraviServis } from './Kolekcija'
import { dodajSate, lokalno } from '../constants'
import ZonaService from './ZonaService'

// Entitet 3: Naplata parkiranja. Završetak i iznos se računaju automatski iz zone i trajanja.
const sad = new Date()
const prije = (min) => lokalno(new Date(sad.getTime() - min * 60000))

export const naplate = [
    { sifra: 1, vozilo: 1, zona: 1, pocetak: prije(30), trajanje: 2, zavrsetak: dodajSate(prije(30), 2), iznos: 2, nacin: 'MOBILNA APLIKACIJA', uplata: prije(30), storno: false },
    { sifra: 2, vozilo: 2, zona: 2, pocetak: prije(24 * 60 + 180), trajanje: 1.5, zavrsetak: dodajSate(prije(24 * 60 + 180), 1.5), iznos: 0.9, nacin: 'SMS', uplata: prije(24 * 60 + 180), storno: false },
    { sifra: 3, vozilo: 3, zona: 1, pocetak: prije(3 * 24 * 60), trajanje: 3, zavrsetak: dodajSate(prije(3 * 24 * 60), 3), iznos: 3, nacin: 'PARKIRNI AUTOMAT', uplata: prije(3 * 24 * 60), storno: true },
]

const osnovni = napraviServis('pk_naplate', naplate)

// završetak = početak + trajanje; iznos = trajanje x cijena sata zone
async function izracunaj(n) {
    const { data: sveZone } = await ZonaService.get()
    const zona = sveZone.find((z) => z.sifra === Number(n.zona))
    const trajanje = Number(n.trajanje)
    return {
        ...n,
        zavrsetak: dodajSate(n.pocetak, trajanje),
        iznos: Math.round(trajanje * (zona?.cijenaSat ?? 0) * 100) / 100,
    }
}

export default {
    ...osnovni,
    dodaj: async (n) => osnovni.dodaj({ ...(await izracunaj(n)), uplata: lokalno(new Date()) }),
    promijeni: async (sifra, n) => osnovni.promijeni(sifra, await izracunaj(n)),
}
