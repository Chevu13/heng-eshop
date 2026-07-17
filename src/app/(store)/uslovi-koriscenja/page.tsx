import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/data/repository';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Uslovi korišćenja',
  description: 'Uslovi korišćenja sajta i poručivanja HENG proizvoda.',
  alternates: { canonical: '/uslovi-koriscenja' },
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Uslovi korišćenja"
      crumb="Uslovi korišćenja"
      custom={settings.terms_text}
      intro="Uslovi se odnose na korišćenje sajta i poručivanje proizvoda iz HENG kolekcije."
      blocks={[
        {
          heading: 'Predmet',
          body: 'Sajt prikazuje kolekciju nosača za vinske flaše i čaše i omogućava slanje porudžbina i upita. Slanjem porudžbine prihvatate ove uslove.',
        },
        {
          heading: 'Cene i ponuda',
          body: 'Modeli kod kojih je navedeno „Cena na upit” nemaju objavljenu cenu. Za te stavke porudžbina se evidentira, a konačan iznos se potvrđuje pisanim putem pre isporuke. Cene koje su objavljene izražene su u dinarima.',
        },
        {
          heading: 'Porudžbina',
          body: 'Porudžbina je primljena kada dobijete broj porudžbine. Obavezujuća postaje nakon naše potvrde dostupnosti, iznosa i roka isporuke.',
        },
        {
          heading: 'Plaćanje',
          body: `Dostupni načini plaćanja: ${settings.payment_methods.includes('pouzecem') ? 'plaćanje pouzećem' : ''}${settings.payment_methods.length > 1 ? ' i ' : ''}${settings.payment_methods.includes('predracun') ? 'plaćanje po predračunu' : ''}. Onlajn plaćanje karticom trenutno nije aktivno.`,
        },
        {
          heading: 'Odgovornost',
          body: 'Fotografije prikazuju proizvode u realnim enterijerima; ton završne obrade može blago odstupati zavisno od osvetljenja i podešavanja ekrana. Montažu izvodi kupac ili izvođač, uz proveru nosivosti podloge.',
        },
        {
          heading: 'Kontakt',
          body: settings.contact_email
            ? `Za sva pitanja u vezi sa ovim uslovima pišite na ${settings.contact_email}.`
            : 'Za sva pitanja u vezi sa ovim uslovima koristite kontakt obrazac na sajtu.',
        },
      ]}
    />
  );
}
