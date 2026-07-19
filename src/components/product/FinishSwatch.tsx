'use client';

/**
 * Uzorak završne obrade — izveden kao materijalni pravougaonik sa finim
 * odsjajem, umesto generičkog obojenog kruga.
 */
export function FinishSwatch({
  name, color, selected, onSelect, size = 'md', tone = 'dark',
}: {
  name: string; color: string; selected: boolean; onSelect: () => void;
  size?: 'sm' | 'md' | 'lg'; tone?: 'dark' | 'light';
}) {
  const dims = size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="group flex w-full flex-col items-center gap-2 outline-offset-4"
      title={name}
    >
      <span
        className={`relative block overflow-hidden rounded-sm transition-all duration-300 ease-heng ${dims}`}
        style={{
          background: color,
          boxShadow: selected
            ? '0 0 0 1px var(--color-gold), 0 0 0 4px rgba(184,147,79,0.18)'
            : '0 0 0 1px rgba(28,20,22,0.14)',
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-90"
          style={{
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.16) 100%)',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: 'rgba(255,255,255,0.22)' }}
        />
      </span>
      <span
        className="max-w-full text-center font-body text-[10px] uppercase leading-tight tracking-eyebrow transition-colors duration-300 sm:text-[11px]"
        style={{
          color: selected
            ? 'var(--color-gold)'
            : tone === 'light' ? 'rgba(239,234,228,0.6)' : 'rgba(28,20,22,0.5)',
        }}
      >
        {name}
      </span>
    </button>
  );
}
