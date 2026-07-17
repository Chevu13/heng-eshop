import { PageHeader } from './PageHeader';

export interface LegalBlock { heading: string; body: string }

/** Zajednički prikaz pravnih strana — tekst je izmenjiv iz admin podešavanja. */
export function LegalPage({
  title, intro, blocks, custom, crumb,
}: { title: string; intro: string; blocks: LegalBlock[]; custom?: string | null; crumb: string }) {
  return (
    <>
      <PageHeader title={title} crumbs={[{ label: crumb }]} />
      <section className="bg-ivory-2 pb-28">
        <div className="heng-container">
          <div className="max-w-[68ch]">
            <p className="font-body text-[16px] leading-[1.75] text-ink/70">{intro}</p>
            <div className="heng-rule my-10" />

            {custom ? (
              <div className="whitespace-pre-line font-body text-[15px] leading-[1.8] text-ink/70">
                {custom}
              </div>
            ) : (
              <div className="space-y-10">
                {blocks.map((b) => (
                  <div key={b.heading}>
                    <h2 className="font-display text-[20px]" style={{ fontWeight: 600 }}>{b.heading}</h2>
                    <p className="mt-3 whitespace-pre-line font-body text-[15px] leading-[1.8] text-ink/68">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-14 border-t border-ink/12 pt-6 font-body text-[13px] text-ink/45">
              Tekst se uređuje iz admin panela (Podešavanja). Pre objave preporučuje se pravna
              provera u odnosu na važeće propise i konkretne poslovne podatke.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
