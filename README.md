# HENG — prodavnica i admin panel

Produkciona Next.js aplikacija za brend **HENG** — aluminijumski nosači za vinske flaše i čaše.
Sadrži javni sajt (kolekcija, stranice proizvoda, korpa, poručivanje, projektni upiti) i zaštićen
admin panel za upravljanje katalogom, porudžbinama, upitima, medijima i sadržajem početne strane.

---

## Sadržaj

1. [Tehnologije](#tehnologije)
2. [Instalacija](#instalacija)
3. [Promenljive okruženja](#promenljive-okruženja)
4. [Baza i migracije](#baza-i-migracije)
5. [Storage bucket-i](#storage-bucket-i)
6. [Seed podaci](#seed-podaci)
7. [Kreiranje prvog admin naloga](#kreiranje-prvog-admin-naloga)
8. [Lokalni razvoj](#lokalni-razvoj)
9. [Produkcioni build](#produkcioni-build)
10. [Deployment](#deployment)
11. [Ažuriranje proizvoda](#ažuriranje-proizvoda)
12. [Ažuriranje početne strane](#ažuriranje-početne-strane)
13. [Struktura projekta](#struktura-projekta)
14. [Brend sistem](#brend-sistem)
15. [Asset mapa](#asset-mapa)
16. [Bezbednost](#bezbednost)
17. [Poznata ograničenja](#poznata-ograničenja)

---

## Tehnologije

| Sloj | Izbor |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Jezik | TypeScript (strict) |
| Stilovi | Tailwind CSS + CSS custom properties iz brand guidelines-a |
| Baza | Supabase PostgreSQL |
| Autentikacija | Supabase Auth (email + lozinka) |
| Fajlovi | Supabase Storage |
| Validacija | Zod (klijent i server) |
| Animacija | Motion (suzdržano; poštuje `prefers-reduced-motion`) |
| Fontovi | Fraunces + Lora, samo-hostovani preko Fontsource (bez poziva ka Google Fonts) |

---

## Instalacija

Preduslovi: **Node.js 18.17+** i npm.

```bash
npm install
cp .env.example .env.local
```

Aplikacija se pokreće i **bez** Supabase kredencijala — tada radi u
demonstracionom režimu: katalog se čita iz lokalnog seed sloja
(`src/lib/data/fixtures.ts`), a admin panel prikazuje uputstvo za povezivanje.
Poručivanje i slanje upita u tom režimu vraćaju jasnu poruku i ne upisuju ništa.

---

## Promenljive okruženja

Sve promenljive su opisane u `.env.example`.

| Promenljiva | Obavezno | Opis |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | da | Project URL iz Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | da | Javni anon ključ (RLS ostaje aktivan) |
| `SUPABASE_SERVICE_ROLE_KEY` | da | **Samo server.** Kreiranje porudžbina/upita i seed |
| `NEXT_PUBLIC_SITE_URL` | preporučeno | Canonical, OG, sitemap, robots |
| `SMTP_*` | ne | Obaveštenja e-poštom; bez njih se preskaču |

> `SUPABASE_SERVICE_ROLE_KEY` zaobilazi RLS. Nikada ga ne stavljajte u promenljivu sa
> `NEXT_PUBLIC_` prefiksom, ne komitujte ga i ne uvozite u klijentske komponente.

---

## Baza i migracije

Migracije se nalaze u `supabase/migrations/` i primenjuju se **redom**:

| Fajl | Sadržaj |
|---|---|
| `0001_init.sql` | Tabele, tipovi, indeksi, trigeri, `is_admin()` |
| `0002_rls.sql` | Row Level Security politike |
| `0003_storage.sql` | Storage bucket-i i politike pristupa |

**Opcija A — Supabase Dashboard**
SQL Editor → nalepite sadržaj svakog fajla redom → Run.

**Opcija B — Supabase CLI**

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Šema:

```
profiles ──┐
           ├─ (uloga admin kontroliše sve upise)
categories ─< products ─< product_variants ─< product_media
                       └─< order_items >── orders
project_inquiries
homepage_sections
site_settings (singleton, id = 1)
```

---

## Storage bucket-i

Migracija `0003_storage.sql` kreira ih automatski:

| Bucket | Javni | Namena |
|---|---|---|
| `heng-media` | da | Fotografije i video katalога (čita svako, piše samo admin) |
| `heng-uploads` | ne | Prilozi uz projektne upite (čita samo admin) |

Ako bucket-e pravite ručno (Dashboard → Storage), zadržite iste nazive i primenite
politike iz migracije — inače admin stranica **Mediji** prijavljuje grešku.

---

## Seed podaci

```bash
npm run seed
```

Skripta unosi:

- 4 kategorije,
- 3 modela (Model 01, 02, 03) sa opisima, dimenzijama i tehničkim podacima,
- 11 varijanti završnih obrada sa uzorcima boje,
- kompletne galerije povezane sa obradama,
- 11 sekcija početne strane,
- podešavanja sajta.

Skripta je **idempotentna** — ponovno pokretanje ažurira postojeće zapise po
`slug`/`key` ključu i ne pravi duplikate.

Cene su namerno ostavljene kao `NULL` uz `price_on_request = true`, pa se svuda
prikazuje **„Cena na upit”**. Kada klijent dostavi cenovnik, unosi se kroz admin
panel — nijedan iznos nije izmišljen.

---

## Kreiranje prvog admin naloga

Registracija kroz sajt namerno **ne postoji** — nalozi se prave u Supabase-u.

1. Supabase → **Authentication → Users → Add user**
   Unesite email i lozinku, uključite *Auto Confirm User*.
2. Svaki novi korisnik automatski dobija red u `profiles` sa ulogom `viewer`.
3. Dodelite admin ulogu (SQL Editor):

```sql
update profiles set role = 'admin' where email = 'vas@email.rs';
```

4. Prijavite se na `/admin/prijava`.

Nalog bez `admin` uloge vidi poruku „Pristup odbijen” — ne i sadržaj panela.
Za oporavak lozinke koristi se `/admin/oporavak-lozinke` (zahteva podešen email
provajder u Supabase Auth).

---

## Lokalni razvoj

```bash
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # TypeScript, bez emitovanja
```

---

## Produkcioni build

```bash
npm run build
npm run start
```

Build mora proći bez grešaka i upozorenja koja utiču na rad.

---

## Deployment

### Supabase

1. Napravite projekat i zabeležite Project URL, `anon` i `service_role` ključ.
2. Primenite migracije `0001` → `0002` → `0003`.
3. Proverite da su bucket-i `heng-media` i `heng-uploads` kreirani.
4. Authentication → URL Configuration → dodajte produkcioni domen u *Redirect URLs*
   (potrebno za oporavak lozinke).

### Vercel

1. Uvezite repozitorijum (Framework preset: **Next.js**, bez dodatnog podešavanja).
2. Settings → Environment Variables:

   | Ime | Okruženje |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | **samo Production/Preview**, nikada `NEXT_PUBLIC_` |
   | `NEXT_PUBLIC_SITE_URL` | `https://vas-domen.rs` |

3. Deploy, pa `npm run seed` lokalno uz produkcione kredencijale (jednokratno).
4. Dodajte domen: Settings → Domains.

> `NEXT_PUBLIC_SITE_URL` mora biti tačan pre prvog indeksiranja — od njega zavise
> canonical adrese, `sitemap.xml` i Open Graph.

---

## Ažuriranje proizvoda

Sve u **/admin/proizvodi**:

| Radnja | Gde |
|---|---|
| Novi proizvod | „Novi proizvod” → naziv, slug se generiše sam |
| Cena | Sekcija „Cena i zaliha”; isključite „Cena na upit” da biste uneli iznos |
| Akcija | Akcijska cena + opcioni period trajanja |
| Obrade | Panel „Varijante i obrade” — cena, zaliha, SKU i uzorak po obradi |
| Galerija | Panel „Galerija” — povežite fajl, dodelite obradu, alt tekst i naslovnu |
| Objava | „Objavljen” / „Izdvojen” prekidači ili brze radnje u listi |
| Kopija | „Dupliraj” — kopira varijante i galeriju kao nacrt |
| Arhiva | Sklanja sa sajta, čuva istoriju porudžbina |

Cena i zaliha **varijante** imaju prednost nad vrednostima proizvoda. Zaliha se ponovo
proverava na serveru pri svakoj porudžbini — podaci iz korpe nisu izvor istine.

Fotografije prvo otpremite u **/admin/mediji** (prevlačenjem), pa kopirajte putanju
i nalepite je u polje galerije ili varijante.

---

## Ažuriranje početne strane

**/admin/pocetna** — svaka sekcija ima vidljivost, redosled i sadržaj u JSON obliku.
Ispod polja stoji spisak dozvoljenih ključeva za tu sekciju. Primer za hero:

```json
{
  "eyebrow": "DIZAJNIRANO ZA SAVREMENE ENTERIJERE",
  "heading": "Vino zaslužuje svoje mesto.",
  "body": "Aluminijumski nosači za vino i čaše…",
  "primaryLabel": "Pogledaj kolekciju",
  "primaryHref": "/kolekcija",
  "mediaUrl": "/assets/heng/interiors/mermerni-zid-sa-lusterom.jpg",
  "mediaAlt": "Bar u mermeru sa HENG sistemom",
  "videoUrl": null,
  "videoPoster": null
}
```

Kada stigne video materijal, dovoljno je popuniti `videoUrl` i `videoPoster` — hero
automatski prelazi na video na širim ekranima, uz `muted`, `loop`, `playsInline`,
dugme za pauzu i povratak na fotografiju pri `prefers-reduced-motion` ili sporoj vezi.

**/admin/podesavanja** — kontakt, dostava, načini plaćanja, podrazumevani SEO i tekst
pravnih strana.

---

## Struktura projekta

```
src/
  app/
    (store)/            javni sajt — sopstveni layout sa headerom i podnožjem
      page.tsx          početna
      kolekcija/        katalog + [categorySlug]
      proizvod/         [productSlug]
      korpa/ porucivanje/ porudzbina-uspesna/
      inspiracija/ o-nama/ projekti/ kontakt/
      uslovi-koriscenja/ politika-privatnosti/ dostava-i-povrat/
    admin/              zaštićen panel (force-dynamic)
    api/                porudzbine, upiti (server-side validacija)
    sitemap.ts  robots.ts  layout.tsx  globals.css
  components/
    layout/ home/ product/ catalog/ cart/ forms/ ui/ admin/
  lib/
    data/               fixtures, asset-manifest, repository
    supabase/           browser / server / middleware klijenti
    admin/              queries, server actions, media helpers
    auth.ts pricing.ts orders.ts validation.ts rate-limit.ts seo.tsx
supabase/
  migrations/           0001_init, 0002_rls, 0003_storage
  seed/seed.ts
public/assets/heng/     organizovani brend materijal
```

---

## Brend sistem

Iz `heng.srb_Brand_Guidelines.pdf`, v1.0:

| Token | Vrednost | Upotreba |
|---|---|---|
| `--color-maroon` | `#4B262D` | Primarna pozadina, primarno dugme |
| `--color-maroon-deep` | `#33191E` | Tamne sekcije, podnožje |
| `--color-ivory` | `#EFEAE4` | Tekst na tamnom, svetle površine |
| `--color-ivory-2` | `#F7F4F0` | Pozadina strane |
| `--color-magenta` | `#C6178F` | Hover primarnog dugmeta, akcija |
| `--color-amber` | `#E08A00` | Hover outline dugmeta, linkovi |
| `--color-gold` | `#B8934F` | Linije, ivice, focus ring, eyebrow |
| `--color-ink` | `#1C1416` | Primarni tekst na svetlom |

Tipografija: **Fraunces** (H1–H4, brojevi, istaknuti citati), **Lora** (pasusi, UI,
navigacija, forme). Radijusi 2–4 px. Kontrast: ivory na maroon 7.9:1, ink na ivory 14.6:1 —
magenta i amber se ne koriste za tekst pasusa.

Wordmark je zasad **tekstualni** (Fraunces 700). Prema napomeni iz guidelines-a
(str. 02), po isporuci vektorske verzije zameniti sadržaj `components/ui/Wordmark.tsx`
i `public/favicon.svg`.

---

## Asset mapa

`src/lib/data/asset-manifest.ts` sadrži potpuno preslikavanje
*originalni naziv fajla → organizovana putanja → grupa → alt tekst*.
Grupisanje je izvedeno iz naziva fajlova, vidljivih oznaka obrade
(CRNA MAT / ZLATNA / GRAFIT / SATEN ZLATNA), kotiranih fotografija i geometrije profila:

| Model | Geometrija | Dimenzije | Obrade | Kategorija |
|---|---|---|---|---|
| Model 01 | Rebrasti profil sa uzdužnim prorezom | 31,5 × 8,6 × 2 cm | crna mat, zlatna, saten zlatna | Nosači za vinske čaše |
| Model 02 | Ugaoni nosač sa dugim prorezom | 30 × 10 × 4 cm | crna mat, grafit, zlatna, saten zlatna | Nosači za vinske čaše |
| Model 03 | Pravougaoni okvir za flašu | 27 × 10 × 4 cm | crna mat, grafit, zlatna, saten zlatna | Nosači za vinske flaše |

Fotografije sa narandžastom pozadinom koriste se za galerije proizvoda, izbor obrade i
prikaz dimenzija. Fotografije enterijera koriste se za hero, storytelling i galeriju
inspiracije. Instagram sekcija koristi **lokalne** fajlove — bez hotlinkovanja.

---

## Bezbednost

- **RLS je uključen na svim tabelama.** Javnost čita samo objavljen katalog.
- **Porudžbine i upiti se ne mogu upisati anon ključem** — kreira ih server ruta
  posle Zod validacije i ponovnog obračuna cene i zalihe iz baze.
- **Uloga se čita sa servera** iz tabele `profiles`, nikada iz JWT tvrdnji.
- **Zaštita u dva sloja:** middleware preusmerava neprijavljene, a `requireAdmin()`
  proverava ulogu u svakoj admin ruti; RLS je poslednja linija.
- **Rate limiting:** porudžbine 5/min, upiti 3/2 min po IP adresi. Obe javne forme
  imaju i honeypot polje.
- **Upload:** provera MIME tipa i veličine (10 MB prilozi, 25 MB katalog mediji).
- **Unos se sanitizuje** pre upisa (uklanjanje kontrolnih karaktera, ograničenje dužine).
- **Prilozi upita su u privatnom bucket-u** — otvaraju se potpisanim URL-om koji važi 5 minuta.

---

## Poznata ograničenja

| Stavka | Status |
|---|---|
| **Video materijal** | Nije isporučen uz brief. Podrška je implementirana i čeka fajlove (vidi „Ažuriranje početne strane”). |
| **Vektorski logo** | Nije isporučen. Wordmark je tekstualni Fraunces. |
| **Cene** | Nisu dostavljene. Svuda „Cena na upit”; unose se kroz admin. |
| **Onlajn plaćanje karticom** | Nije integrisano — zahteva ugovor sa procesorom i kredencijale. Aktivni su pouzeće i predračun. |
| **Email obaveštenja** | Pripremljena kuka u `lib/mail.ts`; aktivira se dodavanjem SMTP kredencijala. |
| **Rate limiting** | In-memory (jedna instanca). Za više instanci zameniti Upstash Redis adapterom — interfejs u `lib/rate-limit.ts` ostaje isti. |
| **Višejezičnost** | Kod je pripremljen (sav tekst je u sadržajnom sloju), ali prekidač jezika namerno nije dodat dok ne postoji prevod. |
| **Pravni tekstovi** | Ugrađeni predlog. Pre objave preporučuje se pravna provera i unos konačnog teksta kroz Podešavanja. |
