export const IME_APLIKACIJE = 'Naplata parkiranja Osijek'
export const AUTOR = 'Matko Mance'

export const STRANICE = [
    { id: 'pocetna', naziv: 'Provjera', izbornik: true },
    { id: 'naplate', naziv: 'Naplate', izbornik: true },
    { id: 'vozila', naziv: 'Vozila', izbornik: true },
    { id: 'zone', naziv: 'Parkirne zone', izbornik: true },
    { id: 'izvjestaji', naziv: 'Izvještaji', izbornik: true },
]

export const NACINI_PLACANJA = ['SMS', 'PARKIRNI AUTOMAT', 'MOBILNA APLIKACIJA', 'KARTICA', 'GOTOVINA']
export const STATUSI = ['AKTIVNO', 'ISTEKLO', 'STORNIRANO']

// OS 123 AB, os-123-ab -> OS123AB
export const normalizirajReg = (r) => String(r ?? '').toUpperCase().replace(/[^A-Z0-9ČĆŠŽĐ]/g, '')

export const formatCijena = (c) =>
    new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(c)

const dvije = (n) => String(n).padStart(2, '0')

// lokalno vrijeme u obliku 2026-11-02T14:30 (vrijednost polja datetime-local)
export const lokalno = (d) =>
    `${d.getFullYear()}-${dvije(d.getMonth() + 1)}-${dvije(d.getDate())}T${dvije(d.getHours())}:${dvije(d.getMinutes())}`

export const sada = () => lokalno(new Date())

// 2026-11-02T14:30 -> 02. 11. 2026. 14:30
export const formatVrijeme = (v) => {
    if (!v) return ''
    const [d, t] = v.split('T')
    return `${d.split('-').reverse().join('. ')}. ${t}`
}

export const dodajSate = (pocetak, sati) => lokalno(new Date(new Date(pocetak).getTime() + Number(sati) * 3600000))

// STORNIRANO, ISTEKLO ili AKTIVNO ovisno o trenutku
export const statusNaplate = (n, trenutak = sada()) =>
    n.storno ? 'STORNIRANO' : n.zavrsetak < trenutak ? 'ISTEKLO' : 'AKTIVNO'
