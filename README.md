# Naplata parkiranja Osijek

Aplikacija za evidenciju naplate parkiranja na području Grada Osijeka.

Autor: Matko Mance

## Entiteti (CRUD nad svima)

- **Parkirna zona**: oznaka (jedinstvena), naziv, cijena sata, vrijeme naplate od-do, aktivna (kvačica)
- **Vozilo**: registarska oznaka (jedinstvena, sprema se normalizirana: OS 123 AB -> OS123AB), država, marka, model
- **Naplata parkiranja**: vozilo, zona, početak, trajanje, način plaćanja, stornirano. Završetak i iznos računaju se automatski; status (AKTIVNO / ISTEKLO / STORNIRANO) se određuje prema vremenu.

## Funkcije
- Provjera parkiranja po registarskoj oznaci: PLAĆENO / ISTEKLO / NIJE PLAĆENO.
- Pretraživanje naplata po registraciji, zoni, statusu, načinu plaćanja i razdoblju.
- Izvještaji: naplata po danu, mjesecu i zoni, broj aktivnih parkiranja.
- Brisanje uz potvrdu; zona ili vozilo s naplatama ne mogu se obrisati (zona se deaktivira).

Početni podaci su izmišljeni (demo). Podaci se spremaju u `localStorage`.

## Tehnologije
React 19, Vite
