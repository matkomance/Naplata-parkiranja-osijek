import { ucitaj, spremi } from './Pohrana'

// Servis s CRUD operacijama nad jednim entitetom (podaci se učitaju pri prvoj upotrebi)
export function napraviServis(kljuc, pocetno) {

    let stavke = []
    let spremno = null

    function pripremi() {
        spremno ??= ucitaj(kljuc, pocetno).then((podaci) => { stavke = podaci })
        return spremno
    }

    // 1/4 Read od CRUD
    async function get() {
        await pripremi()
        return { data: [...stavke] }
    }

    async function getBySifra(sifra) {
        await pripremi()
        return { data: stavke.find((s) => s.sifra === parseInt(sifra)) }
    }

    // 2/4 Create od CRUD
    async function dodaj(stavka) {
        await pripremi()
        const sifra = stavke.reduce((max, s) => Math.max(max, s.sifra), 0) + 1
        stavke = [...stavke, { ...stavka, sifra }]
        return spremi(kljuc, stavke)
    }

    // 3/4 Update od CRUD
    async function promijeni(sifra, stavka) {
        await pripremi()
        stavke = stavke.map((s) => (s.sifra === parseInt(sifra) ? { ...s, ...stavka } : s))
        return spremi(kljuc, stavke)
    }

    // 4/4 Delete od CRUD
    async function obrisi(sifra) {
        await pripremi()
        stavke = stavke.filter((s) => s.sifra !== parseInt(sifra))
        return spremi(kljuc, stavke)
    }

    return { get, getBySifra, dodaj, promijeni, obrisi }
}
