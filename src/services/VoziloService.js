import { napraviServis } from './Kolekcija'
import { normalizirajReg } from '../constants'

// Entitet 2: Vozilo. Registarska oznaka se prije spremanja normalizira (OS 123 AB -> OS123AB).
export const vozila = [
    { sifra: 1, registracija: 'OS123AB', drzava: 'Hrvatska', marka: 'Škoda', model: 'Octavia' },
    { sifra: 2, registracija: 'ZG4567CD', drzava: 'Hrvatska', marka: 'Renault', model: 'Clio' },
    { sifra: 3, registracija: 'WN123XY', drzava: 'Austrija', marka: '', model: '' },
]

const osnovni = napraviServis('pk_vozila', vozila)

const normaliziraj = (v) => ({ ...v, registracija: normalizirajReg(v.registracija) })

export default {
    ...osnovni,
    dodaj: (v) => osnovni.dodaj(normaliziraj(v)),
    promijeni: (sifra, v) => osnovni.promijeni(sifra, normaliziraj(v)),
}
