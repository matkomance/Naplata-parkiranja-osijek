// Trajno spremanje podataka u localStorage preglednika

export async function ucitaj(kljuc, pocetno) {
    try {
        const sadrzaj = localStorage.getItem(kljuc)
        if (sadrzaj) {
            const podaci = JSON.parse(sadrzaj)
            if (Array.isArray(podaci)) {
                return podaci
            }
        }
    } catch {
        // oštećen zapis ili localStorage nije dostupan: koriste se početni podaci
    }
    return structuredClone(pocetno)
}

// vraća true ako je spremanje uspjelo
export async function spremi(kljuc, podaci) {
    try {
        localStorage.setItem(kljuc, JSON.stringify(podaci))
        return true
    } catch {
        return false
    }
}
