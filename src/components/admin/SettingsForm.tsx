'use client';

import type { SiteSettings } from '@/types';
import { FormShell } from './FormShell';
import { saveSettings } from '@/lib/admin/actions';

function Section({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-ink/12 bg-white/60 p-6">
      <h2 className="font-display text-[18px]" style={{ fontWeight: 600 }}>{title}</h2>
      {description && <p className="mt-1 max-w-[70ch] font-body text-[13px] text-ink/55">{description}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function F({ label, hint, wide = false, children }: {
  label: string; hint?: string; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <p className="mt-1.5 font-body text-[12px] text-ink/45">{hint}</p>}
    </div>
  );
}

export function SettingsForm({ settings: s, adminEmail }: {
  settings: SiteSettings; adminEmail: string;
}) {
  return (
    <FormShell action={saveSettings} submitLabel="Sačuvaj podešavanja">
      <div className="space-y-8">
        <Section title="Brend i kontakt">
          <F label="Naziv brenda">
            <input name="brand_name" className="field" defaultValue={s.brand_name} />
          </F>
          <F label="Kontakt email" hint="Prikazuje se u podnožju i na strani Kontakt.">
            <input name="contact_email" type="email" className="field" defaultValue={s.contact_email ?? ''} />
          </F>
          <F label="Telefon">
            <input name="phone" className="field" defaultValue={s.phone ?? ''} />
          </F>
          <F label="Instagram">
            <input name="instagram_url" type="url" className="field" defaultValue={s.instagram_url ?? ''} />
          </F>
          <F label="Adresa / područje isporuke" wide>
            <input name="address" className="field" defaultValue={s.address ?? ''} />
          </F>
          <F label="Napomena u podnožju" wide>
            <input name="footer_note" className="field" defaultValue={s.footer_note ?? ''} />
          </F>
        </Section>

        <Section
          title="Dostava i plaćanje"
          description="Vrednosti se primenjuju u korpi, na poručivanju i pri serverskoj proveri porudžbine."
        >
          <F label="Valuta">
            <input name="currency" className="field" defaultValue={s.currency} maxLength={8} />
          </F>
          <F label="Trošak dostave (RSD)" hint="0 znači da se trošak dogovara pri potvrdi.">
            <input
              name="delivery_cost_rsd" type="number" step="0.01" min="0"
              className="field" defaultValue={s.delivery_cost_rsd}
            />
          </F>
          <F label="Prag besplatne dostave (RSD)" hint="Ostavite prazno da biste isključili prag.">
            <input
              name="free_delivery_threshold_rsd" type="number" step="0.01" min="0"
              className="field" defaultValue={s.free_delivery_threshold_rsd ?? ''}
            />
          </F>
          <div className="sm:col-span-2">
            <fieldset>
              <legend className="field-label">Načini plaćanja</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { v: 'pouzecem', l: 'Plaćanje pouzećem' },
                  { v: 'predracun', l: 'Plaćanje po predračunu' },
                ].map((m) => (
                  <label key={m.v} className="flex cursor-pointer items-center gap-3 rounded-sm border border-ink/12 p-4">
                    <input
                      type="checkbox" name="payment_methods" value={m.v}
                      defaultChecked={s.payment_methods.includes(m.v as 'pouzecem' | 'predracun')}
                      className="accent-[color:var(--color-maroon)]"
                    />
                    <span className="font-body text-[14px]">{m.l}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 font-body text-[12px] text-ink/45">
                Onlajn plaćanje karticom zahteva ugovor sa procesorom i posebnu integraciju — nije aktivno.
              </p>
            </fieldset>
          </div>
        </Section>

        <Section title="SEO" description="Podrazumevane vrednosti; stranice proizvoda imaju sopstvena polja.">
          <F label="Podrazumevani naslov" wide>
            <input name="seo_title" className="field" maxLength={160} defaultValue={s.seo_title ?? ''} />
          </F>
          <F label="Podrazumevani opis" wide hint="Preporuka: do 160 karaktera.">
            <textarea name="seo_description" rows={3} className="field resize-y" maxLength={300} defaultValue={s.seo_description ?? ''} />
          </F>
        </Section>

        <Section
          title="Pravne strane"
          description="Ostavite prazno da bi se koristio ugrađeni tekst. Unos zamenjuje ceo sadržaj strane."
        >
          <F label="Uslovi korišćenja" wide>
            <textarea name="terms_text" rows={8} className="field resize-y" defaultValue={s.terms_text ?? ''} />
          </F>
          <F label="Politika privatnosti" wide>
            <textarea name="privacy_text" rows={8} className="field resize-y" defaultValue={s.privacy_text ?? ''} />
          </F>
          <F label="Dostava i povrat" wide>
            <textarea name="delivery_text" rows={8} className="field resize-y" defaultValue={s.delivery_text ?? ''} />
          </F>
        </Section>

        <p className="font-body text-[12px] text-ink/45">
          Prijavljeni administrator: {adminEmail}
        </p>
      </div>
    </FormShell>
  );
}
