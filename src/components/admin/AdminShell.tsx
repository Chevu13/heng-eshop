'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { createClient } from '@/lib/supabase/client';
import type { AdminSession } from '@/lib/auth';

const NAV = [
  { href: '/admin', label: 'Pregled', exact: true },
  { href: '/admin/proizvodi', label: 'Proizvodi' },
  { href: '/admin/kategorije', label: 'Kategorije' },
  { href: '/admin/porudzbine', label: 'Porudžbine' },
  { href: '/admin/upiti', label: 'Upiti' },
  { href: '/admin/mediji', label: 'Mediji' },
  { href: '/admin/pocetna', label: 'Početna strana' },
  { href: '/admin/podesavanja', label: 'Podešavanja' },
];

export function AdminShell({
  session, children,
}: { session: AdminSession; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const sb = createClient();
    await sb?.auth.signOut();
    router.push('/admin/prijava');
    router.refresh();
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen lg:flex" style={{ background: 'var(--color-ivory-2)' }}>
      {/* Mobilna traka */}
      <div
        className="flex items-center justify-between px-5 py-4 lg:hidden"
        style={{ background: 'var(--color-maroon-deep)' }}
      >
        <Wordmark className="text-[22px]" tone="ivory" href="/admin" />
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-body text-[12px] uppercase tracking-eyebrow text-ivory/75"
          aria-expanded={open}
          aria-controls="admin-nav"
        >
          {open ? 'Zatvori' : 'Meni'}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={`${open ? 'block' : 'hidden'} shrink-0 lg:block lg:w-[248px]`}
        style={{ background: 'var(--color-maroon-deep)' }}
      >
        <div className="flex h-full flex-col p-6 lg:sticky lg:top-0 lg:h-screen">
          <div className="hidden lg:block">
            <Wordmark className="text-[26px]" tone="ivory" href="/admin" />
            <p className="heng-eyebrow mt-3" style={{ color: 'var(--color-gold)' }}>ADMIN</p>
          </div>

          <nav aria-label="Admin navigacija" className="mt-0 lg:mt-10">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className="block rounded-sm px-3 py-2.5 font-body text-[14px] transition-colors duration-200"
                      style={{
                        background: active ? 'rgba(184,147,79,0.16)' : 'transparent',
                        color: active ? 'var(--color-gold)' : 'rgba(239,234,228,0.68)',
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 lg:mt-auto">
            <div className="heng-rule mb-5" />
            <p className="truncate font-body text-[12px] text-ivory/60">{session.email}</p>
            <div className="mt-3 flex items-center gap-4">
              <Link href="/" className="link-gold font-body text-[12px] text-ivory/60">Sajt</Link>
              <button onClick={logout} className="link-gold font-body text-[12px] text-ivory/60">
                Odjava
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
