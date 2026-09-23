'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createAdminSupabase, createServerSupabase } from '@/lib/supabase/server';
import { sendMail } from '@/lib/mail';
import { isEmailConfigured, SITE_URL } from '@/lib/env';
import { sanitize, ALLOWED_MEDIA_TYPES, MAX_UPLOAD_BYTES } from '@/lib/validation';
import { slugify } from '@/lib/format';
import { resolveMediaUrl } from '@/lib/admin/media';
import { ARTICLE_CATEGORIES, ARTICLES, type Article, type ArticleCategory } from '@/lib/data/articles';

export interface ActionResult { ok: boolean; message: string }

const OK = (message: string): ActionResult => ({ ok: true, message });
const FAIL = (message: string): ActionResult => ({ ok: false, message });

async function client() {
  await requireAdmin();
  const sb = createServerSupabase();
  if (!sb) throw new Error('Supabase nije konfigurisan.');
  return sb;
}

function revalidateStore() {
  revalidatePath('/', 'layout');
}

const str = (fd: FormData, key: string, max = 4000): string | null => {
  const v = fd.get(key);
  if (typeof v !== 'string' || !v.trim()) return null;
  return sanitize(v, max);
};
const num = (fd: FormData, key: string): number | null => {
  const v = fd.get(key);
  if (typeof v !== 'string' || !v.trim()) return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};
const bool = (fd: FormData, key: string): boolean => fd.get(key) === 'on' || fd.get(key) === 'true';

// ==================== PROIZVODI ====================

export async function saveProduct(id: string | null, fd: FormData): Promise<ActionResult> {
  const sb = await client();

  const name = str(fd, 'name', 160);
  if (!name) return FAIL('Naziv proizvoda je obavezan.');

  const slug = slugify(str(fd, 'slug', 160) ?? name);
  if (!slug) return FAIL('Slug nije ispravan.');

  const priceOnRequest = bool(fd, 'price_on_request');
  const price = num(fd, 'price_rsd');
  const salePrice = num(fd, 'sale_price_rsd');

  if (!priceOnRequest && price === null) {
    return FAIL('Unesite redovnu cenu ili uključite „Cena na upit”.');
  }
  if (salePrice !== null && price !== null && salePrice >= price) {
    return FAIL('Akcijska cena mora biti niža od redovne.');
  }

  const payload = {
    name,
    slug,
    category_id: str(fd, 'category_id', 60),
    short_description: str(fd, 'short_description', 400),
    description: str(fd, 'description', 8000),
    technical_info: str(fd, 'technical_info', 4000),
    installation_info: str(fd, 'installation_info', 4000),
    delivery_info: str(fd, 'delivery_info', 2000),
    material: str(fd, 'material', 200),
    dimensions: str(fd, 'dimensions', 200),
    sku: str(fd, 'sku', 60),
    price_rsd: priceOnRequest ? null : price,
    sale_price_rsd: priceOnRequest ? null : salePrice,
    sale_starts_at: str(fd, 'sale_starts_at', 40),
    sale_ends_at: str(fd, 'sale_ends_at', 40),
    price_on_request: priceOnRequest,
    stock: Math.max(0, Math.trunc(num(fd, 'stock') ?? 0)),
    tags: (str(fd, 'tags', 300) ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    is_featured: bool(fd, 'is_featured'),
    is_published: bool(fd, 'is_published'),
    sort_order: Math.trunc(num(fd, 'sort_order') ?? 0),
    seo_title: str(fd, 'seo_title', 160),
    seo_description: str(fd, 'seo_description', 300),
    og_image: str(fd, 'og_image', 500),
  };

  if (id) {
    const { error } = await sb.from('products').update(payload).eq('id', id);
    if (error) {
      return FAIL(error.code === '23505' ? 'Slug već postoji.' : 'Izmena nije sačuvana.');
    }
    revalidateStore();
    return OK('Proizvod je sačuvan.');
  }

  const { data, error } = await sb.from('products').insert(payload).select('id').single();
  if (error || !data) {
    return FAIL(error?.code === '23505' ? 'Slug već postoji.' : 'Proizvod nije kreiran.');
  }
  revalidateStore();
  redirect(`/admin/proizvodi/${data.id}`);
}

export async function togglePublished(id: string, next: boolean): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('products').update({ is_published: next }).eq('id', id);
  if (error) return FAIL('Status nije promenjen.');
  revalidateStore();
  return OK(next ? 'Proizvod je objavljen.' : 'Proizvod je povučen sa sajta.');
}

export async function toggleFeatured(id: string, next: boolean): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('products').update({ is_featured: next }).eq('id', id);
  if (error) return FAIL('Status nije promenjen.');
  revalidateStore();
  return OK(next ? 'Proizvod je izdvojen.' : 'Proizvod više nije izdvojen.');
}

export async function archiveProduct(id: string, next: boolean): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb
    .from('products')
    .update({ is_archived: next, is_published: next ? false : undefined })
    .eq('id', id);
  if (error) return FAIL('Arhiviranje nije uspelo.');
  revalidateStore();
  return OK(next ? 'Proizvod je arhiviran.' : 'Proizvod je vraćen iz arhive.');
}

export async function duplicateProduct(id: string): Promise<ActionResult> {
  const sb = await client();

  const { data: source } = await sb
    .from('products').select('*, variants:product_variants(*), media:product_media(*)')
    .eq('id', id).maybeSingle();
  if (!source) return FAIL('Proizvod nije pronađen.');

  const src = source as Record<string, unknown> & {
    variants: Record<string, unknown>[]; media: Record<string, unknown>[];
  };
  const { id: _id, created_at, updated_at, variants, media, ...rest } = src;
  void _id; void created_at; void updated_at;

  const { data: copy, error } = await sb
    .from('products')
    .insert({
      ...rest,
      name: `${String(rest.name)} (kopija)`,
      slug: `${String(rest.slug)}-kopija-${Date.now().toString(36)}`,
      is_published: false,
      is_featured: false,
    })
    .select('id').single();
  if (error || !copy) return FAIL('Kopija nije napravljena.');

  const variantMap = new Map<string, string>();
  for (const v of variants ?? []) {
    const { id: vid, product_id, created_at: vc, updated_at: vu, ...vRest } = v;
    void product_id; void vc; void vu;
    const { data: newVariant } = await sb
      .from('product_variants').insert({ ...vRest, product_id: copy.id }).select('id').single();
    if (newVariant) variantMap.set(String(vid), newVariant.id as string);
  }

  if (media?.length) {
    await sb.from('product_media').insert(
      media.map((m) => {
        const { id: mid, product_id, created_at: mc, variant_id, ...mRest } = m;
        void mid; void product_id; void mc;
        return {
          ...mRest,
          product_id: copy.id,
          variant_id: variant_id ? (variantMap.get(String(variant_id)) ?? null) : null,
        };
      }),
    );
  }

  revalidateStore();
  redirect(`/admin/proizvodi/${copy.id}`);
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) return FAIL('Brisanje nije uspelo. Proizvod je možda vezan za porudžbinu.');
  revalidateStore();
  redirect('/admin/proizvodi');
}

export async function reorderProduct(id: string, sortOrder: number): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('products').update({ sort_order: sortOrder }).eq('id', id);
  if (error) return FAIL('Redosled nije sačuvan.');
  revalidateStore();
  return OK('Redosled je sačuvan.');
}

// ==================== VARIJANTE ====================

export async function saveVariant(
  productId: string, variantId: string | null, fd: FormData,
): Promise<ActionResult> {
  const sb = await client();

  const finishName = str(fd, 'finish_name', 80);
  if (!finishName) return FAIL('Naziv obrade je obavezan.');

  const payload = {
    product_id: productId,
    finish_name: finishName,
    finish_code: slugify(str(fd, 'finish_code', 80) ?? finishName),
    finish_swatch: str(fd, 'finish_swatch', 200),
    sku: str(fd, 'sku', 60),
    price_rsd: num(fd, 'price_rsd'),
    sale_price_rsd: num(fd, 'sale_price_rsd'),
    stock: Math.max(0, Math.trunc(num(fd, 'stock') ?? 0)),
    dimensions: str(fd, 'dimensions', 120),
    main_image: str(fd, 'main_image', 500),
    is_active: bool(fd, 'is_active'),
    sort_order: Math.trunc(num(fd, 'sort_order') ?? 0),
  };

  const query = variantId
    ? sb.from('product_variants').update(payload).eq('id', variantId)
    : sb.from('product_variants').insert(payload);

  const { error } = await query;
  if (error) {
    return FAIL(error.code === '23505' ? 'Ta obrada već postoji na proizvodu.' : 'Varijanta nije sačuvana.');
  }
  revalidateStore();
  revalidatePath(`/admin/proizvodi/${productId}`);
  return OK('Varijanta je sačuvana.');
}

export async function deleteVariant(productId: string, variantId: string): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('product_variants').delete().eq('id', variantId);
  if (error) return FAIL('Varijanta nije obrisana.');
  revalidateStore();
  revalidatePath(`/admin/proizvodi/${productId}`);
  return OK('Varijanta je obrisana.');
}

// ==================== MEDIJI ====================

export async function uploadMedia(fd: FormData): Promise<ActionResult> {
  const sb = await client();
  const files = fd.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return FAIL('Nije izabran nijedan fajl.');

  for (const file of files) {
    if (file.size > MAX_UPLOAD_BYTES * 2.5) {
      return FAIL(`„${file.name}” je veći od dozvoljenih 25 MB.`);
    }
    if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
      return FAIL(`Format „${file.type || 'nepoznat'}” nije podržan.`);
    }
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? 'bin';
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'medij';
    const path = `katalog/${base}-${Date.now().toString(36)}.${ext}`;

    const { error } = await sb.storage
      .from('heng-media')
      .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) return FAIL(`Otpremanje „${file.name}” nije uspelo.`);
  }

  revalidatePath('/admin/mediji');
  return OK(`Otpremljeno: ${files.length} ${files.length === 1 ? 'fajl' : 'fajla'}.`);
}

export async function deleteMediaFile(path: string): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.storage.from('heng-media').remove([path]);
  if (error) return FAIL('Fajl nije obrisan.');
  revalidatePath('/admin/mediji');
  return OK('Fajl je obrisan.');
}

export async function attachMedia(productId: string, fd: FormData): Promise<ActionResult> {
  const sb = await client();
  const url = str(fd, 'url', 500);
  if (!url) return FAIL('Unesite URL medija.');

  const { count } = await sb
    .from('product_media').select('id', { count: 'exact', head: true }).eq('product_id', productId);

  const { error } = await sb.from('product_media').insert({
    product_id: productId,
    variant_id: str(fd, 'variant_id', 60),
    url,
    kind: fd.get('kind') === 'video' ? 'video' : 'image',
    poster_url: str(fd, 'poster_url', 500),
    alt: str(fd, 'alt', 240),
    is_cover: bool(fd, 'is_cover'),
    sort_order: count ?? 0,
  });
  if (error) return FAIL('Medij nije dodat.');

  revalidateStore();
  revalidatePath(`/admin/proizvodi/${productId}`);
  return OK('Medij je dodat.');
}

export async function updateMedia(
  productId: string, mediaId: string, fd: FormData,
): Promise<ActionResult> {
  const sb = await client();
  const isCover = bool(fd, 'is_cover');

  if (isCover) {
    await sb.from('product_media').update({ is_cover: false }).eq('product_id', productId);
  }
  const { error } = await sb
    .from('product_media')
    .update({
      alt: str(fd, 'alt', 240),
      is_cover: isCover,
      sort_order: Math.trunc(num(fd, 'sort_order') ?? 0),
    })
    .eq('id', mediaId);
  if (error) return FAIL('Izmena nije sačuvana.');

  revalidateStore();
  revalidatePath(`/admin/proizvodi/${productId}`);
  return OK('Medij je ažuriran.');
}

export async function detachMedia(productId: string, mediaId: string): Promise<ActionResult> {
  const sb = await client();
  const { error } = await sb.from('product_media').delete().eq('id', mediaId);
  if (error) return FAIL('Medij nije uklonjen.');
  revalidateStore();
  revalidatePath(`/admin/proizvodi/${productId}`);
  return OK('Medij je uklonjen sa proizvoda.');
}

// ==================== KATEGORIJE ====================

export async function saveCategory(id: string | null, fd: FormData): Promise<ActionResult> {
  const sb = await client();

  const title = str(fd, 'title', 120);
  if (!title) return FAIL('Naziv kategorije je obavezan.');
  const slug = slugify(str(fd, 'slug', 120) ?? title);

  const payload = {
    title,
    slug,
    description: str(fd, 'description', 1000),
    cover_image: str(fd, 'cover_image', 500),
    sort_order: Math.trunc(num(fd, 'sort_order') ?? 0),
    is_published: bool(fd, 'is_published'),
  };

  const query = id
    ? sb.from('categories').update(payload).eq('id', id)
    : sb.from('categories').insert(payload);

  const { error } = await query;
  if (error) return FAIL(error.code === '23505' ? 'Slug već postoji.' : 'Kategorija nije sačuvana.');

  revalidateStore();
  revalidatePath('/admin/kategorije');
  return OK('Kategorija je sačuvana.');
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const sb = await client();

  const { count } = await sb
    .from('products').select('id', { count: 'exact', head: true }).eq('category_id', id);
  if ((count ?? 0) > 0) {
    return FAIL(
      `Kategorija sadrži ${count} proizvod(a). Premestite ih u drugu kategoriju pre brisanja.`,
    );
  }

  const { error } = await sb.from('categories').delete().eq('id', id);
  if (error) return FAIL('Kategorija nije obrisana.');
  revalidateStore();
  revalidatePath('/admin/kategorije');
  return OK('Kategorija je obrisana.');
}

// ==================== PORUDŽBINE ====================

export async function updateOrder(id: string, fd: FormData): Promise<ActionResult> {
  const sb = await client();
  const status = String(fd.get('status') ?? '');
  const allowed = ['nova', 'potvrdjena', 'u_pripremi', 'poslata', 'zavrsena', 'otkazana'];
  if (!allowed.includes(status)) return FAIL('Nepoznat status.');

  const { error } = await sb
    .from('orders')
    .update({ status, internal_note: str(fd, 'internal_note', 2000) })
    .eq('id', id);
  if (error) return FAIL('Porudžbina nije ažurirana.');

  revalidatePath('/admin/porudzbine');
  revalidatePath(`/admin/porudzbine/${id}`);
  return OK('Porudžbina je ažurirana.');
}

// ==================== FAKTURE ====================
// PDF se čuva u privatnom bucket-u `heng-uploads`; upis ide preko service_role
// klijenta (admin nema insert politiku na tom bucket-u), a tek posle provere admina.

export async function uploadInvoice(orderId: string, fd: FormData): Promise<ActionResult> {
  const sb = await client();
  const storage = createAdminSupabase();
  if (!storage) return FAIL('Nedostaje SUPABASE_SERVICE_ROLE_KEY na serveru.');

  const file = fd.get('invoice');
  if (!(file instanceof File) || file.size === 0) return FAIL('Izaberite PDF fakture.');
  if (file.size > MAX_UPLOAD_BYTES) return FAIL('PDF je veći od 10 MB.');
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString('latin1') !== '%PDF-') return FAIL('Fajl nije PDF.');

  const { data: order } = await sb.from('orders').select('reference').eq('id', orderId).maybeSingle();
  if (!order) return FAIL('Porudžbina nije pronađena.');

  const path = `fakture/${slugify(order.reference as string)}.pdf`;
  const { error: upErr } = await storage.storage
    .from('heng-uploads')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: true });
  if (upErr) return FAIL('Otpremanje fakture nije uspelo.');

  const { error } = await sb
    .from('orders').update({ invoice_path: path, invoice_sent_at: null }).eq('id', orderId);
  if (error) return FAIL('Faktura je otpremljena, ali nije vezana za porudžbinu. Da li je pokrenuta migracija 0005_invoices.sql?');

  revalidatePath(`/admin/porudzbine/${orderId}`);
  if (bool(fd, 'send')) return sendInvoice(orderId);
  return OK('Faktura je sačuvana.');
}

export async function sendInvoice(orderId: string): Promise<ActionResult> {
  const sb = await client();
  if (!isEmailConfigured) {
    return FAIL('Slanje mejlova nije podešeno (SMTP). Faktura je sačuvana, ali nije poslata.');
  }
  const storage = createAdminSupabase();
  if (!storage) return FAIL('Nedostaje SUPABASE_SERVICE_ROLE_KEY na serveru.');

  const { data: order } = await sb
    .from('orders').select('reference, full_name, email, invoice_path').eq('id', orderId).maybeSingle();
  if (!order?.invoice_path) return FAIL('Porudžbina nema fakturu.');

  const { data: blob, error: dlErr } = await storage.storage.from('heng-uploads').download(order.invoice_path);
  if (dlErr || !blob) return FAIL('Faktura nije pronađena u skladištu.');

  try {
    await sendMail({
      to: order.email,
      subject: `Faktura za porudžbinu ${order.reference} — HENG`,
      text: [
        `Poštovani/a ${order.full_name},`,
        '',
        `u prilogu vam šaljemo fakturu za porudžbinu ${order.reference}.`,
        '',
        'Hvala vam na kupovini.',
        '',
        'HENG',
        SITE_URL,
      ].join('\n'),
      attachments: [{
        filename: `Faktura-${order.reference}.pdf`,
        content: Buffer.from(await blob.arrayBuffer()),
        contentType: 'application/pdf',
      }],
    });
  } catch (err) {
    console.error('[faktura] slanje nije uspelo', err);
    return FAIL('Mejl nije poslat. Proverite SMTP podešavanja.');
  }

  await sb.from('orders').update({ invoice_sent_at: new Date().toISOString() }).eq('id', orderId);
  revalidatePath(`/admin/porudzbine/${orderId}`);
  return OK(`Faktura je poslata na ${order.email}.`);
}

export async function removeInvoice(orderId: string): Promise<ActionResult> {
  const sb = await client();
  const { data: order } = await sb.from('orders').select('invoice_path').eq('id', orderId).maybeSingle();
  if (order?.invoice_path) await sb.storage.from('heng-uploads').remove([order.invoice_path]);
  const { error } = await sb
    .from('orders').update({ invoice_path: null, invoice_sent_at: null }).eq('id', orderId);
  if (error) return FAIL('Faktura nije uklonjena.');
  revalidatePath(`/admin/porudzbine/${orderId}`);
  return OK('Faktura je uklonjena.');
}

export async function invoiceUrl(path: string): Promise<string | null> {
  const sb = await client();
  const { data } = await sb.storage.from('heng-uploads').createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}

// ==================== UPITI ====================

export async function updateInquiry(id: string, fd: FormData): Promise<ActionResult> {
  const sb = await client();
  const status = String(fd.get('status') ?? '');
  if (!['nov', 'kontaktiran', 'zavrsen'].includes(status)) return FAIL('Nepoznat status.');

  const { error } = await sb
    .from('project_inquiries')
    .update({ status, internal_note: str(fd, 'internal_note', 2000) })
    .eq('id', id);
  if (error) return FAIL('Upit nije ažuriran.');

  revalidatePath('/admin/upiti');
  return OK('Upit je ažuriran.');
}

export async function inquiryAttachmentUrl(path: string): Promise<string | null> {
  const sb = await client();
  const { data } = await sb.storage.from('heng-uploads').createSignedUrl(path, 300);
  return data?.signedUrl ?? null;
}

// ==================== POČETNA STRANA ====================

export async function saveSection(id: string, fd: FormData): Promise<ActionResult> {
  const sb = await client();

  const raw = String(fd.get('content') ?? '{}');
  let content: unknown;
  try {
    content = JSON.parse(raw);
  } catch {
    return FAIL('Sadržaj nije ispravan JSON. Proverite zareze i navodnike.');
  }

  const { error } = await sb
    .from('homepage_sections')
    .update({
      title: str(fd, 'title', 120),
      is_visible: bool(fd, 'is_visible'),
      sort_order: Math.trunc(num(fd, 'sort_order') ?? 0),
      content,
    })
    .eq('id', id);
  if (error) return FAIL('Sekcija nije sačuvana.');

  revalidateStore();
  revalidatePath('/admin/pocetna');
  return OK('Sekcija je sačuvana.');
}

// ==================== U PROSTORU (članci i galerija) ====================
// Čuvaju se kao redovi `articles` / `gallery` u homepage_sections, pa ne treba
// nova tabela ni RLS — važe postojeće politike „pocetna: admin upis”.

type Sb = Awaited<ReturnType<typeof client>>;

async function readItems<T>(sb: Sb, key: string, fallback: T[]): Promise<T[]> {
  const { data } = await sb.from('homepage_sections').select('content').eq('key', key).maybeSingle();
  return data ? (((data.content as { items?: T[] }).items) ?? []) : fallback;
}

async function writeItems(sb: Sb, key: string, title: string, items: unknown[]): Promise<boolean> {
  const { error } = await sb.from('homepage_sections').upsert(
    // Red mora biti vidljiv: javni sajt čita samo vidljive sekcije.
    { key, title, is_visible: true, content: { items } },
    { onConflict: 'key' },
  );
  if (error) return false;
  revalidateStore();
  revalidatePath('/admin/u-prostoru');
  return true;
}

export async function saveArticle(originalSlug: string | null, fd: FormData): Promise<ActionResult> {
  const sb = await client();

  const title = str(fd, 'title', 160);
  if (!title) return FAIL('Naslov je obavezan.');
  const slug = slugify(str(fd, 'slug', 160) ?? title);
  if (!slug) return FAIL('Slug nije ispravan.');
  const category = String(fd.get('category') ?? '') as ArticleCategory;
  if (!ARTICLE_CATEGORIES.some((c) => c.slug === category)) return FAIL('Izaberite kategoriju.');
  const date = str(fd, 'date', 10);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return FAIL('Datum nije ispravan.');
  const media = str(fd, 'mediaUrl', 500);
  if (!media) return FAIL('Fotografija je obavezna.');

  // `sanitize` briše prelome redova, pa se tekst prvo deli na pasuse.
  const body = String(fd.get('body') ?? '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => sanitize(p, 8000))
    .filter(Boolean);

  const article: Article = {
    slug, category, date, title,
    excerpt: str(fd, 'excerpt', 400) ?? '',
    mediaUrl: resolveMediaUrl(media),
    mediaAlt: str(fd, 'mediaAlt', 240) ?? title,
    body,
  };

  const items = await readItems<Article>(sb, 'articles', ARTICLES);
  if (slug !== originalSlug && items.some((a) => a.slug === slug)) return FAIL('Slug već postoji.');
  const next = originalSlug
    ? items.map((a) => (a.slug === originalSlug ? article : a))
    : [article, ...items];

  if (!(await writeItems(sb, 'articles', 'Članci (U prostoru)', next))) return FAIL('Članak nije sačuvan.');
  return OK('Članak je sačuvan.');
}

export async function deleteArticle(slug: string): Promise<ActionResult> {
  const sb = await client();
  const items = await readItems<Article>(sb, 'articles', ARTICLES);
  const ok = await writeItems(sb, 'articles', 'Članci (U prostoru)', items.filter((a) => a.slug !== slug));
  return ok ? OK('Članak je obrisan.') : FAIL('Članak nije obrisan.');
}

export async function saveGallery(fd: FormData): Promise<ActionResult> {
  const sb = await client();
  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get('items') ?? '[]'));
  } catch {
    return FAIL('Neispravni podaci galerije.');
  }
  if (!Array.isArray(raw)) return FAIL('Neispravni podaci galerije.');

  const items = raw
    .map((r: Record<string, unknown>) => ({
      url: sanitize(String(r.url ?? ''), 500),
      alt: sanitize(String(r.alt ?? ''), 240),
      caption: sanitize(String(r.caption ?? ''), 240) || undefined,
    }))
    .filter((r) => r.url)
    .map((r) => ({ ...r, url: resolveMediaUrl(r.url), alt: r.alt || r.caption || 'HENG u prostoru' }));

  if (!(await writeItems(sb, 'gallery', 'Galerija (U prostoru)', items))) return FAIL('Galerija nije sačuvana.');
  return OK('Galerija je sačuvana.');
}

// ==================== PODEŠAVANJA ====================

export async function saveSettings(fd: FormData): Promise<ActionResult> {
  const sb = await client();

  const methods = fd.getAll('payment_methods').map(String)
    .filter((m) => m === 'pouzecem' || m === 'predracun');
  if (!methods.length) return FAIL('Izaberite bar jedan način plaćanja.');

  const { error } = await sb.from('site_settings').upsert({
    id: 1,
    brand_name: str(fd, 'brand_name', 60) ?? 'HENG',
    contact_email: str(fd, 'contact_email', 160),
    phone: str(fd, 'phone', 40),
    instagram_url: str(fd, 'instagram_url', 240),
    address: str(fd, 'address', 240),
    currency: str(fd, 'currency', 8) ?? 'RSD',
    delivery_cost_rsd: Math.max(0, num(fd, 'delivery_cost_rsd') ?? 0),
    free_delivery_threshold_rsd: num(fd, 'free_delivery_threshold_rsd'),
    payment_methods: methods,
    seo_title: str(fd, 'seo_title', 160),
    seo_description: str(fd, 'seo_description', 300),
    footer_note: str(fd, 'footer_note', 240),
    terms_text: str(fd, 'terms_text', 20000),
    privacy_text: str(fd, 'privacy_text', 20000),
    delivery_text: str(fd, 'delivery_text', 20000),
  });
  if (error) return FAIL('Podešavanja nisu sačuvana.');

  revalidateStore();
  revalidatePath('/admin/podesavanja');
  return OK('Podešavanja su sačuvana.');
}
