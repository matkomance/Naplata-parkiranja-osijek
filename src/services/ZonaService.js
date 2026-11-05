import { napraviServis } from './Kolekcija'

// Entitet 1: Parkirna zona. Početni podaci su demo.
export const zone = [
    { sifra: 1, oznaka: 'Z1', naziv: 'I. zona (centar)', cijenaSat: 1, od: '07:00', do: '20:00', aktivna: true },
    { sifra: 2, oznaka: 'Z2', naziv: 'II. zona', cijenaSat: 0.6, od: '07:00', do: '20:00', aktivna: true },
    { sifra: 3, oznaka: 'Z3', naziv: 'III. zona', cijenaSat: 0.3, od: '08:00', do: '18:00', aktivna: false },
]

export default napraviServis('pk_zone', zone)
