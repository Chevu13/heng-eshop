import Link from 'next/link';
import { Wordmark } from '@/components/ui/Wordmark';
import type { Category, SiteSettings } from '@/types';

export function Footer({
  settings, categories,
}: { settings: SiteSettings; categories: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--color-maroon-deep)' }}>
      <div className="heng-container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark className="text-[30px]" tone="ivory" />
            {settings.footer_note && (
              <p className="mt-5 max-w-xs font-body text-[14px] leading-relaxed text-ivory/62">
                {settings.footer_note}
              </p>
            )}
          </div>

          <nav aria-label="Kolekcija" className="lg:col-span-3">
            <h2 className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>Kolekcija</h2>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/kolekcija/${c.slug}`}
                    className="link-gold font-body text-[14px] text-ivory/72"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kolekcija" className="link-gold font-body text-[14px] text-ivory/72">
                  Svi proizvodi
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informacije" className="lg:col-span-2">
            <h2 className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>Informacije</h2>
            <ul className="space-y-3">
              {[
                { href: '/o-nama', label: 'O nama' },
                { href: '/projekti', label: 'Projekti' },
                { href: '/inspiracija', label: 'Inspiracija' },
                { href: '/dostava-i-povrat', label: 'Dostava i povrat' },
                { href: '/uslovi-koriscenja', label: 'Uslovi korišćenja' },
                { href: '/politika-privatnosti', label: 'Politika privatnosti' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-gold font-body text-[14px] text-ivory/72">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="heng-eyebrow mb-5" style={{ color: 'var(--color-gold)' }}>Kontakt</h2>
            <ul className="space-y-3 font-body text-[14px] text-ivory/72">
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
              {settings.address && <li>{settings.address}</li>}
              {settings.instagram_url && (
                <li>
                  <a
                    href={settings.instagram_url}
                    target="_blank" rel="noopener noreferrer"
                    className="link-gold"
                  >
                    @heng.srb
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="heng-rule mt-14" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[12px] text-ivory/45">
            © {year} {settings.brand_name}. Sva prava zadržana.
          </p>
          <p className="font-body text-[12px] text-ivory/45">
            Isporuka na teritoriji Srbije · Plaćanje pouzećem ili po predračunu
          </p>
        </div>
      </div>
    </footer>
  );
}
