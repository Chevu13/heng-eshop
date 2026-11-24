import Link from 'next/link';
import { HeroMedia } from './HeroMedia';

export interface HeroContent {
  eyebrow?: string; heading?: string; body?: string;
  /** Traka sa akcijom iznad menija (prikazuje je StoreShell). */
  notice?: string; noticeHref?: string;
  primaryLabel?: string; primaryHref?: string;
  mediaUrl?: string; mediaAlt?: string;
  /** Kadar fotografije na računaru, npr. „center 60%” (podrazumevano „center 30%”). */
  mediaPosition?: string;
  /** Opciona uspravna slika za telefon. */
  mediaUrlMobile?: string | null;
  videoUrl?: string | null; videoPoster?: string | null;
}

/**
 * Hero po uzoru na plookdesign.com: fotografija preko cele širine i svetao
 * okvir sa tekstom na sredini. Na telefonu okvir ide ispod fotografije.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative bg-ivory-2">
      <div className="relative h-[118vw] max-h-[560px] overflow-hidden bg-maroon-deep md:h-[52vw] md:max-h-[760px]">
        <HeroMedia
          imageUrl={content.mediaUrl}
          imageUrlMobile={content.mediaUrlMobile}
          imageAlt={content.mediaAlt ?? ''}
          imagePosition={content.mediaPosition || undefined}
          videoUrl={content.videoUrl ?? null}
          videoPoster={content.videoPoster ?? null}
        />
      </div>

      <div className="md:pointer-events-none md:absolute md:inset-0 md:flex md:items-center md:justify-center">
        <div className="bg-ivory-2 px-6 py-12 text-center md:pointer-events-auto md:max-w-[680px] md:px-12 md:py-14">
          <h1 className="home-heading text-[32px] md:text-[48px]">{content.heading}</h1>
          {content.body && (
            <p className="mx-auto mt-4 max-w-[46ch] font-body text-[16px] leading-[1.7] text-ink/70 md:text-[18px]">
              {content.body}
            </p>
          )}
          {content.primaryLabel && content.primaryHref && (
            <Link
              href={content.primaryHref}
              className="mt-8 inline-block border border-maroon bg-maroon px-10 py-3.5 font-body text-[16px] text-ivory transition-colors hover:border-maroon-deep hover:bg-maroon-deep"
            >
              {content.primaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
