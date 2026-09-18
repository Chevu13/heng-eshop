import Link from 'next/link';
import { Wordmark } from '@/components/ui/Wordmark';
import type { Category, SiteSettings } from '@/types';

const SITE_LINKS = [
  { href: '/kolekcija', label: 'Proizvodi' },
  { href: '/inspiracija', label: 'Inspiracija' },
  { href: '/projekti', label: 'Projekti' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/kontakt', label: 'Kontakt' },
];

const LEGAL_LINKS = [
  { href: '/dostava-i-povrat', label: 'Dostava i povrat' },
  { href: '/uslovi-koriscenja', label: 'Uslovi korišćenja' },
  { href: '/politika-privatnosti', label: 'Politika privatnosti' },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="heng-eyebrow mb-4 text-ivory/45">{children}</h2>
  );
}

export function Footer({
  settings, categories,
}: { settings: SiteSettings; categories: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--color-maroon-deep)' }}>
      {/* Završni poziv — poslednja prilika da se otvori razgovor. */}
      <div className="heng-container">
        <div className="flex flex-col gap-6 border-b border-ivory/12 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-10">
          <p className="display-caps max-w-[24ch] text-[clamp(1.6rem,2.4vw,2rem)] text-ivory">
            Recite nam kakav prostor uređujete.
          </p>
          <Link href="/kontakt" className="link-arrow shrink-0">
            <span>Pošaljite upit</span>
            <span className="link-arrow__line" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="heng-container py-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <Wordmark className="text-[28px]" tone="ivory" />
            {settings.footer_note && (
              <p className="mt-4 max-w-[30ch] font-body text-[14px] font-light leading-[1.7] text-ivory/60">
                {settings.footer_note}
              </p>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank" rel="noopener noreferrer"
                className="link-gold mt-5 inline-block font-body text-[11px] uppercase tracking-eyebrow text-ivory/70"
              >
                Instagram — @heng.srb
              </a>
            )}
          </div>

          <nav aria-label="Proizvodi" className="col-span-1 lg:col-span-3">
            <ColumnHeading>Proizvodi</ColumnHeading>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/kolekcija/${c.slug}`}
                    className="link-gold font-body text-[14px] font-light text-ivory/72"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kolekcija" className="link-gold font-body text-[14px] font-light text-ivory/72">
                  Svi proizvodi
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Sajt" className="col-span-1 lg:col-span-2">
            <ColumnHeading>Sajt</ColumnHeading>
            <ul className="space-y-2.5">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-gold font-body text-[14px] font-light text-ivory/72">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3">
            <ColumnHeading>Kontakt</ColumnHeading>
            <ul className="space-y-2.5 font-body text-[14px] font-light text-ivory/72">
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="link-gold">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="link-gold">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && <li className="text-ivory/55">{settings.address}</li>}
            </ul>

            <p className="mt-5 max-w-[28ch] font-body text-[12px] font-light leading-[1.7] text-ivory/45">
              Isporuka na teritoriji Srbije · Plaćanje pouzećem ili po predračunu
            </p>
          </div>
        </div>

        <div className="heng-rule mt-10" />

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[12px] font-light text-ivory/45">
            © {year} {settings.brand_name}. Sva prava zadržana.
          </p>
          <ul className="flex flex-wrap gap-x-7 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-gold font-body text-[12px] font-light text-ivory/45">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
