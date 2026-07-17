import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { getSettings } from '@/lib/data/repository';

export const metadata: Metadata = {
  title: 'Poručivanje',
  description: 'Unos podataka za isporuku i izbor načina plaćanja.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/porucivanje' },
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="Poručivanje"
        crumbs={[{ label: 'Korpa', href: '/korpa' }, { label: 'Poručivanje' }]}
      />
      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <CheckoutForm
            deliveryCost={settings.delivery_cost_rsd}
            freeThreshold={settings.free_delivery_threshold_rsd}
            paymentMethods={settings.payment_methods}
          />
        </div>
      </section>
    </>
  );
}
