import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { breadcrumbLd, JsonLd } from '@/lib/seo';
import { getSettings } from '@/lib/data/repository';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktirajte HENG za informacije o kolekciji, dostupnosti i postavkama po meri.',
  alternates: { canonical: '/kontakt' },
};

export default async function ContactPage({
  searchParams,
}: { searchParams: { proizvod?: string } }) {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Kontakt', url: '/kontakt' }])} />
      <PageHeader
        eyebrow="KONTAKT"
        title="Pišite nam."
        description="Za informacije o modelima, obradama, količinama ili postavci u konkretnom prostoru."
        crumbs={[{ label: 'Kontakt' }]}
      />

      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeading heading="Direktan kontakt" />
              <div className="heng-rule my-8" />

              <dl className="space-y-6">
                {settings.contact_email && (
                  <div>
                    <dt className="heng-eyebrow text-ink/45">Email</dt>
                    <dd className="mt-2">
                      <a href={`mailto:${settings.contact_email}`} className="link-gold font-body text-[16px]">
                        {settings.contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {settings.phone && (
                  <div>
                    <dt className="heng-eyebrow text-ink/45">Telefon</dt>
                    <dd className="mt-2">
                      <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="link-gold font-body text-[16px]">
                        {settings.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {settings.instagram_url && (
                  <div>
                    <dt className="heng-eyebrow text-ink/45">Instagram</dt>
                    <dd className="mt-2">
                      <a
                        href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                        className="link-gold font-body text-[16px]"
                      >
                        @heng.srb
                      </a>
                    </dd>
                  </div>
                )}
                {settings.address && (
                  <div>
                    <dt className="heng-eyebrow text-ink/45">Područje isporuke</dt>
                    <dd className="mt-2 font-body text-[16px] text-ink/70">{settings.address}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-10 border-l-2 pl-4 font-body text-[13px] leading-relaxed text-ink/55"
                 style={{ borderColor: 'var(--color-gold)' }}>
                Za veće postavke i saradnju sa arhitektama koristite{' '}
                <a href="/projekti" className="link-gold">projektni upit</a> — obrazac sadrži polja za
                mere, rok i prilog.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="border border-ink/12 p-7 sm:p-10">
                <InquiryForm compact prefill={searchParams.proizvod} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
