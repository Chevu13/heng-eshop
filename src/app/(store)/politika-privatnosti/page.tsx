import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/data/repository';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Politika privatnosti',
  description: 'Kako HENG prikuplja i obrađuje podatke unete kroz porudžbine i upite.',
  alternates: { canonical: '/politika-privatnosti' },
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Politika privatnosti"
      crumb="Politika privatnosti"
      custom={settings.privacy_text}
      intro="Podatke prikupljamo isključivo u meri koja je potrebna da bismo obradili porudžbinu ili odgovorili na upit."
      blocks={[
        {
          heading: 'Koje podatke prikupljamo',
          body: 'Porudžbina: ime i prezime, telefon, email, adresa, grad, poštanski broj i napomena.\nProjektni upit: ime i prezime, kompanija, email, telefon, opis projekta i opcioni prilog.',
        },
        {
          heading: 'Svrha obrade',
          body: 'Podaci se koriste za potvrdu i realizaciju porudžbine, formiranje ponude i komunikaciju povodom upita. Ne koriste se za profilisanje niti se prodaju trećim licima.',
        },
        {
          heading: 'Čuvanje',
          body: 'Podaci se čuvaju u bazi prodavnice sa ograničenim pristupom. Pristup imaju samo ovlašćena lica kroz zaštićen admin panel.',
        },
        {
          heading: 'Kolačići',
          body: 'Sajt ne koristi marketinške kolačiće. Sadržaj korpe čuva se lokalno u vašem pregledaču (localStorage) i ne šalje se serveru dok ne pošaljete porudžbinu.',
        },
        {
          heading: 'Vaša prava',
          body: settings.contact_email
            ? `Možete zatražiti uvid, ispravku ili brisanje svojih podataka pisanjem na ${settings.contact_email}.`
            : 'Možete zatražiti uvid, ispravku ili brisanje svojih podataka putem kontakt obrasca.',
        },
      ]}
    />
  );
}
