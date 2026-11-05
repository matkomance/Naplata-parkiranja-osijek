import { useCallback, useEffect, useState } from 'react'

// Učitava popis iz servisa; osvjezi() ponovno učita nakon izmjene
export function useLista(servis) {
    const [stavke, setStavke] = useState([])
    const [ucitano, setUcitano] = useState(false)

    const osvjezi = useCallback(async () => {
        const odgovor = await servis.get()
        setStavke(odgovor.data)
        setUcitano(true)
    }, [servis])

    useEffect(() => {
        let aktivno = true
        servis.get().then((odgovor) => {
            if (aktivno) {
                setStavke(odgovor.data)
                setUcitano(true)
            }
        })
        return () => { aktivno = false }
    }, [servis])

    return { stavke, ucitano, osvjezi }
}

// Jednostavno usmjeravanje preko hash-a: #/stranica ili #/stranica/parametar
export function useRuta(stranice) {
    const procitaj = () => {
        const [s, p] = window.location.hash.replace(/^#\/?/, '').split('/')
        return { stranica: stranice.some((x) => x.id === s) ? s : stranice[0].id, param: p ?? null }
    }
    const [ruta, setRuta] = useState(procitaj)

    useEffect(() => {
        const naPromjenu = () => {
            const [s, p] = window.location.hash.replace(/^#\/?/, '').split('/')
            setRuta({ stranica: stranice.some((x) => x.id === s) ? s : stranice[0].id, param: p ?? null })
        }
        window.addEventListener('hashchange', naPromjenu)
        return () => window.removeEventListener('hashchange', naPromjenu)
    }, [stranice])

    const idi = (stranica, param) => {
        window.location.hash = param != null ? `#/${stranica}/${param}` : `#/${stranica}`
    }

    return { ...ruta, idi }
}
