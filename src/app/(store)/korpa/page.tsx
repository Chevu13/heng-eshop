import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { CartView } from '@/components/cart/CartView';
import { getSettings } from '@/lib/data/repository';

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregled izabranih HENG proizvoda pre poručivanja.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/korpa' },
};

export default async function CartPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Korpa" crumbs={[{ label: 'Korpa' }]} />
      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <CartView
            deliveryCost={settings.delivery_cost_rsd}
            freeThreshold={settings.free_delivery_threshold_rsd}
          />
        </div>
      </section>
    </>
  );
}
