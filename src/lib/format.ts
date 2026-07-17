export const CENA_NA_UPIT = 'Cena na upit';

export function formatRsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return CENA_NA_UPIT;
  return new Intl.NumberFormat('sr-Latn-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('sr-Latn-RS', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    č: 'c', ć: 'c', ž: 'z', š: 's', đ: 'dj',
    Č: 'c', Ć: 'c', Ž: 'z', Š: 's', Đ: 'dj',
  };
  return input
    .split('').map((ch) => map[ch] ?? ch).join('')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function orderReference(): string {
  const now = new Date();
  const y = now.getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `HNG-${y}-${rand}`;
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    nova: 'Nova',
    potvrdjena: 'Potvrđena',
    u_pripremi: 'U pripremi',
    poslata: 'Poslata',
    zavrsena: 'Završena',
    otkazana: 'Otkazana',
    nov: 'Nov',
    kontaktiran: 'Kontaktiran',
    zavrsen: 'Završen',
  };
  return map[status] ?? status;
}

export function paymentLabel(method: string): string {
  return method === 'predracun' ? 'Plaćanje po predračunu' : 'Plaćanje pouzećem';
}
