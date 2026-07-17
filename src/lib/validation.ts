import { z } from 'zod';

const req = (msg: string) => z.string({ required_error: msg }).trim().min(1, msg);

export const checkoutSchema = z.object({
  full_name: req('Unesite ime i prezime.').min(2, 'Ime i prezime je prekratko.'),
  phone: req('Unesite broj telefona.')
    .regex(/^[0-9+\s()/-]{6,20}$/, 'Unesite ispravan broj telefona.'),
  email: req('Unesite email adresu.').email('Unesite ispravnu email adresu.'),
  address: req('Unesite adresu.').min(4, 'Adresa je prekratka.'),
  city: req('Unesite grad.'),
  postal_code: req('Unesite poštanski broj.')
    .regex(/^[0-9]{4,6}$/, 'Poštanski broj sadrži 4–6 cifara.'),
  note: z.string().trim().max(1000, 'Napomena je predugačka.').optional().or(z.literal('')),
  payment: z.enum(['pouzecem', 'predracun'], {
    errorMap: () => ({ message: 'Izaberite način plaćanja.' }),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().nullable(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, 'Korpa je prazna.'),
  // Honeypot — popunjava ga samo bot.
  website: z.string().max(0).optional().or(z.literal('')),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const inquirySchema = z.object({
  full_name: req('Unesite ime i prezime.').min(2, 'Ime i prezime je prekratko.'),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  email: req('Unesite email adresu.').email('Unesite ispravnu email adresu.'),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  project_type: z.string().trim().max(80).optional().or(z.literal('')),
  location: z.string().trim().max(120).optional().or(z.literal('')),
  description: req('Opišite projekat.').min(20, 'Opis treba da ima bar 20 karaktera.').max(4000),
  desired_products: z.string().trim().max(500).optional().or(z.literal('')),
  deadline: z.string().trim().max(80).optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Saglasnost je obavezna.' }),
  }),
  website: z.string().max(0).optional().or(z.literal('')),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const productSchema = z.object({
  name: req('Naziv je obavezan.'),
  slug: req('Slug je obavezan.').regex(/^[a-z0-9-]+$/, 'Slug sme da sadrži samo mala slova, brojeve i crtice.'),
  category_id: z.string().uuid().nullable().optional(),
  short_description: z.string().max(400).optional().or(z.literal('')),
  description: z.string().max(8000).optional().or(z.literal('')),
  technical_info: z.string().max(4000).optional().or(z.literal('')),
  installation_info: z.string().max(4000).optional().or(z.literal('')),
  delivery_info: z.string().max(2000).optional().or(z.literal('')),
  material: z.string().max(200).optional().or(z.literal('')),
  dimensions: z.string().max(200).optional().or(z.literal('')),
  sku: z.string().max(60).optional().or(z.literal('')),
  price_rsd: z.number().nonnegative().nullable(),
  sale_price_rsd: z.number().nonnegative().nullable(),
  price_on_request: z.boolean(),
  stock: z.number().int().min(0),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  seo_title: z.string().max(160).optional().or(z.literal('')),
  seo_description: z.string().max(300).optional().or(z.literal('')),
});

export const categorySchema = z.object({
  title: req('Naziv je obavezan.'),
  slug: req('Slug je obavezan.').regex(/^[a-z0-9-]+$/, 'Neispravan slug.'),
  description: z.string().max(1000).optional().or(z.literal('')),
  cover_image: z.string().max(500).optional().or(z.literal('')),
  sort_order: z.number().int(),
  is_published: z.boolean(),
});

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
];
export const ALLOWED_MEDIA_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm',
];

/** Uklanja kontrolne karaktere i skraćuje unos pre upisa u bazu. */
export function sanitize(input: string, max = 4000): string {
  return input.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}
