import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { getSettings } from '@/lib/data/repository';
import { formatRsd } from '@/lib/format';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Dostava i povrat',
  description: 'Informacije o isporuci HENG proizvoda, troškovima dostave i povraćaju.',
  alternates: { canonical: '/dostava-i-povrat' },
};

export default async function DeliveryPage() {
  const s = await getSettings();

  const cost =
    s.delivery_cost_rsd > 0
      ? `Trošak dostave iznosi ${formatRsd(s.delivery_cost_rsd)}.`
      : 'Trošak dostave se potvrđuje pri obradi porudžbine, u zavisnosti od količine i adrese.';
  const threshold =
    s.free_delivery_threshold_rsd !== null
      ? ` Za porudžbine preko ${formatRsd(s.free_delivery_threshold_rsd)} dostava je bez naknade.`
      : '';

  return (
    <LegalPage
      title="Dostava i povrat"
      crumb="Dostava i povrat"
      custom={s.delivery_text}
      intro="Isporuka se obavlja na teritoriji Srbije, kurirskom službom, nakon potvrde porudžbine."
      blocks={[
        { heading: 'Trošak dostave', body: cost + threshold },
        {
          heading: 'Rok isporuke',
          body: 'Rok zavisi od modela, izabrane obrade i količine. Konkretan rok potvrđujemo prilikom potvrde porudžbine, pre nego što uđemo u pripremu pošiljke.',
        },
        {
          heading: 'Preuzimanje',
          body: 'Pošiljku pregledajte pri preuzimanju. Ako je transportno pakovanje vidno oštećeno, zabeležite to kod kurira i javite nam istog dana.',
        },
        {
          heading: 'Povrat i reklamacija',
          body: 'Reklamaciju prijavljujete pisanim putem, uz broj porudžbine i fotografiju. Nakon prijema odgovaramo sa daljim koracima. Proizvodi izrađeni po meri i posebnoj specifikaciji ne podležu povratu bez saglasnosti.',
        },
        {
          heading: 'Montaža',
          body: 'Nosači se isporučuju sa otvorima za pričvršćivanje. Montažu izvodi kupac ili izvođač, uz izbor pribora prema vrsti podloge (beton, gips-karton, pločice, drvo).',
        },
      ]}
    />
  );
}
