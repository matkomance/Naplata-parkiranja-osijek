import { AUTOR, IME_APLIKACIJE, STRANICE } from './constants'
import { useRuta } from './hooks'
import Izvjestaji from './pages/Izvjestaji'
import Naplate from './pages/Naplate'
import Pocetna from './pages/Pocetna'
import Vozila from './pages/Vozila'
import Zone from './pages/Zone'

function App() {
  const { stranica, param, idi } = useRuta(STRANICE)

  return (
    <>
      <header className="zaglavlje">
        <button className="logo" onClick={() => idi('pocetna')}>
          {IME_APLIKACIJE}
          <span className="autor">{AUTOR}</span>
        </button>
        <nav className="izbornik">
          {STRANICE.filter((s) => s.izbornik).map((s) => (
            <button key={s.id} className={s.id === stranica ? 'aktivna' : ''} onClick={() => idi(s.id)}>
              {s.naziv}
            </button>
          ))}
        </nav>
      </header>

      <main className="sadrzaj">
        {stranica === 'naplate' ? <Naplate key={param} param={param} />
          : stranica === 'vozila' ? <Vozila idi={idi} />
          : stranica === 'zone' ? <Zone />
          : stranica === 'izvjestaji' ? <Izvjestaji />
          : <Pocetna idi={idi} />}
      </main>

      <footer className="podnozje">&copy; {IME_APLIKACIJE}</footer>
    </>
  )
}

export default App
