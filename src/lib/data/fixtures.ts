import type {
  Category, HomepageSection, ProductFull, ProductMedia, ProductVariant, SiteSettings,
} from '@/types';

/**
 * Seed sadržaj. Isti izvor koristi i `npm run seed` (upis u Supabase) i
 * read-only demo režim kada baza još nije povezana.
 * Svaka vrednost je predviđena da bude izmenjiva iz admin panela.
 */

export const FINISHES = [
  { code: 'crna-mat', name: 'Crna mat', swatch: '#1C1416' },
  { code: 'grafit', name: 'Grafit', swatch: '#8C8477' },
  { code: 'zlatna', name: 'Zlatna', swatch: '#C79A4A' },
  { code: 'saten-zlatna', name: 'Saten zlatna', swatch: '#D8B45E' },
] as const;

export type FinishCode = (typeof FINISHES)[number]['code'];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-case',
    slug: 'nosaci-za-vinske-case',
    title: 'Nosači za vinske čaše',
    description:
      'Zidni i podpultni profili koji čaše drže za stopu — vidljivo, uredno i bez dodatnog pribora.',
    cover_image: '/assets/heng/products/model-01/model-01-sve-obrade.jpg',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'cat-flase',
    slug: 'nosaci-za-vinske-flase',
    title: 'Nosači za vinske flaše',
    description:
      'Pojedinačni zidni nosači koji flašu drže u blagom nagibu i pretvaraju je u element kompozicije.',
    cover_image: '/assets/heng/products/model-03/model-03-sve-obrade.jpg',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'cat-zidni',
    slug: 'zidni-sistemi',
    title: 'Zidni sistemi',
    description:
      'Kombinacije nosača u nizu — vinski zid, niša ili bar postavljeni kao jedinstvena celina.',
    cover_image: '/assets/heng/interiors/mermerni-zid-flase-i-case.jpg',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'cat-projekti',
    slug: 'projekti-po-meri',
    title: 'Projekti po meri',
    description:
      'Postavke razvijene uz arhitektu ili izvođača, prilagođene dimenzijama i obradi konkretnog prostora.',
    cover_image: '/assets/heng/interiors/vinski-zid-sa-slikom.jpg',
    sort_order: 4,
    is_published: true,
  },
];

const MATERIAL = 'Eloksirana legura aluminijuma';

function variant(
  productId: string, model: string, code: FinishCode, dims: string, order: number,
): ProductVariant {
  const f = FINISHES.find((x) => x.code === code)!;
  return {
    id: `${productId}-${code}`,
    product_id: productId,
    finish_name: f.name,
    finish_code: f.code,
    finish_swatch: f.swatch,
    sku: `${model.toUpperCase()}-${code.toUpperCase()}`,
    price_rsd: null,
    sale_price_rsd: null,
    stock: 0,
    dimensions: dims,
    main_image: `/assets/heng/products/${model}/${model}-${code}.jpg`,
    gallery: [
      `/assets/heng/products/${model}/${model}-${code}.jpg`,
      `/assets/heng/products/${model}/${model}-sve-obrade.jpg`,
      `/assets/heng/products/${model}/${model}-dimenzije.jpg`,
    ],
    is_active: true,
    sort_order: order,
  };
}

function media(
  productId: string, model: string, codes: FinishCode[], alts: string[],
): ProductMedia[] {
  const base: ProductMedia[] = codes.map((code, i) => ({
    id: `${productId}-m-${code}`,
    product_id: productId,
    variant_id: `${productId}-${code}`,
    url: `/assets/heng/products/${model}/${model}-${code}.jpg`,
    kind: 'image',
    poster_url: null,
    alt: alts[i],
    is_cover: i === 0,
    sort_order: i,
  }));
  base.push(
    {
      id: `${productId}-m-obrade`, product_id: productId, variant_id: null,
      url: `/assets/heng/products/${model}/${model}-sve-obrade.jpg`,
      kind: 'image', poster_url: null,
      alt: `${alts[0].split(' u ')[0]} — sve dostupne završne obrade`,
      is_cover: false, sort_order: codes.length,
    },
    {
      id: `${productId}-m-dim`, product_id: productId, variant_id: null,
      url: `/assets/heng/products/${model}/${model}-dimenzije.jpg`,
      kind: 'image', poster_url: null,
      alt: `${alts[0].split(' u ')[0]} — kotirana fotografija sa dimenzijama`,
      is_cover: false, sort_order: codes.length + 1,
    },
  );
  return base;
}

const M1_FINISHES: FinishCode[] = ['crna-mat', 'zlatna', 'saten-zlatna'];
const M2_FINISHES: FinishCode[] = ['crna-mat', 'grafit', 'zlatna', 'saten-zlatna'];
const M3_FINISHES: FinishCode[] = ['crna-mat', 'grafit', 'zlatna', 'saten-zlatna'];

export const PRODUCTS: ProductFull[] = [
  {
    id: 'prd-model-01',
    slug: 'model-01',
    name: 'Model 01',
    category_id: 'cat-case',
    short_description:
      'Rebrasti aluminijumski profil sa uzdužnim prorezom — čaše se ubacuju stopom i vise slobodno ispod police ili elementa.',
    description:
      'Model 01 je izveden kao pun profil sa finim uzdužnim rebrima koja svetlo prelamaju u tanke linije. ' +
      'Prorez po sredini prima stopu čaše, tako da niz čaša ostaje poravnat bez ikakvog vidljivog pribora. ' +
      'Profil se montira ispod police, gornjeg elementa kuhinje ili direktno na zid, i podjednako dobro ' +
      'funkcioniše u kućnom baru i u ugostiteljskom prostoru.',
    technical_info:
      'Materijal: eloksirana legura aluminijuma.\nDimenzije: 31,5 × 8,6 × 2 cm.\n' +
      'Dostupne obrade: crna mat, zlatna, saten zlatna.\nMontaža: dva otvora za pričvršćivanje na profilu.',
    installation_info:
      'Profil se pričvršćuje kroz dva postojeća otvora. Preporučuje se montaža u nosivu podlogu ili ' +
      'odgovarajući tiplovani spoj, uz proveru da ispod profila ostane dovoljno visine za čašu.',
    delivery_info:
      'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
    material: MATERIAL,
    dimensions: '31,5 × 8,6 × 2 cm',
    sku: 'MODEL-01',
    price_rsd: null,
    sale_price_rsd: null,
    sale_starts_at: null,
    sale_ends_at: null,
    price_on_request: true,
    stock: 0,
    tags: ['čaše', 'profil', 'podpultna montaža'],
    is_featured: true,
    is_published: true,
    is_archived: false,
    sort_order: 1,
    seo_title: 'Model 01 — nosač za vinske čaše | HENG',
    seo_description:
      'Rebrasti aluminijumski profil za vinske čaše, 31,5 × 8,6 × 2 cm. Obrade: crna mat, zlatna, saten zlatna.',
    og_image: '/assets/heng/products/model-01/model-01-sve-obrade.jpg',
    category: CATEGORIES[0],
    variants: M1_FINISHES.map((c, i) => variant('prd-model-01', 'model-01', c, '31,5 × 8,6 × 2 cm', i)),
    media: media('prd-model-01', 'model-01', M1_FINISHES, [
      'Model 01 u crnoj mat obradi', 'Model 01 u zlatnoj obradi', 'Model 01 u saten zlatnoj obradi',
    ]),
  },
  {
    id: 'prd-model-02',
    slug: 'model-02',
    name: 'Model 02',
    category_id: 'cat-case',
    short_description:
      'Ugaoni nosač sa dugim zaobljenim prorezom — čaše ulaze bočno i ostaju vidljive celom dužinom stope.',
    description:
      'Model 02 je sečen iz punog aluminijumskog lima i savijen u ugaoni oslonac. ' +
      'Dugačak prorez sa zaobljenim krajem prima stopu čaše i drži je bez pritiska na staklo. ' +
      'Zbog većeg razmaka od zida, model prima i čaše sa širom kupom i može se montirati u nizu ' +
      'kao kontinuirana linija ili pojedinačno, kao samostalan detalj.',
    technical_info:
      'Materijal: eloksirana legura aluminijuma.\nDimenzije: 30 × 10 × 4 cm.\n' +
      'Dostupne obrade: crna mat, grafit, zlatna, saten zlatna.\nMontaža: dva otvora na leđnoj strani nosača.',
    installation_info:
      'Nosač se montira kroz dva otvora na vertikalnoj strani. Pri montaži u nizu preporučuje se ' +
      'obeležavanje zajedničke ose kako bi prorezi ostali poravnati.',
    delivery_info:
      'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
    material: MATERIAL,
    dimensions: '30 × 10 × 4 cm',
    sku: 'MODEL-02',
    price_rsd: null,
    sale_price_rsd: null,
    sale_starts_at: null,
    sale_ends_at: null,
    price_on_request: true,
    stock: 0,
    tags: ['čaše', 'ugaoni nosač', 'zidna montaža'],
    is_featured: true,
    is_published: true,
    is_archived: false,
    sort_order: 2,
    seo_title: 'Model 02 — ugaoni nosač za vinske čaše | HENG',
    seo_description:
      'Aluminijumski ugaoni nosač za vinske čaše, 30 × 10 × 4 cm. Obrade: crna mat, grafit, zlatna, saten zlatna.',
    og_image: '/assets/heng/products/model-02/model-02-sve-obrade.jpg',
    category: CATEGORIES[0],
    variants: M2_FINISHES.map((c, i) => variant('prd-model-02', 'model-02', c, '30 × 10 × 4 cm', i)),
    media: media('prd-model-02', 'model-02', M2_FINISHES, [
      'Model 02 u crnoj mat obradi', 'Model 02 u grafit obradi',
      'Model 02 u zlatnoj obradi', 'Model 02 u saten zlatnoj obradi',
    ]),
  },
  {
    id: 'prd-model-03',
    slug: 'model-03',
    name: 'Model 03',
    category_id: 'cat-flase',
    short_description:
      'Pravougaoni okvir za flašu — vino stoji u blagom nagibu, etiketa ostaje okrenuta ka prostoru.',
    description:
      'Model 03 je zidni nosač za flašu izveden kao zatvoren pravougaoni okvir sa leđnim osloncem. ' +
      'Flaša prolazi kroz okvir i naslanja se pod uglom, tako da etiketa ostaje čitljiva iz prostorije. ' +
      'Postavljen u niz ili u ritmičnu mrežu, model gradi vinski zid koji se čita kao arhitektonski ' +
      'detalj, a ne kao polica.',
    technical_info:
      'Materijal: eloksirana legura aluminijuma.\nDimenzije: 27 × 10 × 4 cm.\n' +
      'Dostupne obrade: crna mat, grafit, zlatna, saten zlatna.\nMontaža: dva otvora na leđnoj strani nosača.',
    installation_info:
      'Nosač se pričvršćuje kroz dva otvora na leđnoj ploči. Za vinske zidove preporučuje se ' +
      'prethodno raspoređivanje na crtežu, kako bi vertikalni i horizontalni razmaci ostali dosledni.',
    delivery_info:
      'Isporuka na teritoriji Srbije. Rok i trošak isporuke potvrđuju se pri obradi porudžbine.',
    material: MATERIAL,
    dimensions: '27 × 10 × 4 cm',
    sku: 'MODEL-03',
    price_rsd: null,
    sale_price_rsd: null,
    sale_starts_at: null,
    sale_ends_at: null,
    price_on_request: true,
    stock: 0,
    tags: ['flaše', 'vinski zid', 'zidna montaža'],
    is_featured: true,
    is_published: true,
    is_archived: false,
    sort_order: 3,
    seo_title: 'Model 03 — zidni nosač za vinske flaše | HENG',
    seo_description:
      'Aluminijumski zidni nosač za flašu vina, 27 × 10 × 4 cm. Obrade: crna mat, grafit, zlatna, saten zlatna.',
    og_image: '/assets/heng/products/model-03/model-03-sve-obrade.jpg',
    category: CATEGORIES[1],
    variants: M3_FINISHES.map((c, i) => variant('prd-model-03', 'model-03', c, '27 × 10 × 4 cm', i)),
    media: media('prd-model-03', 'model-03', M3_FINISHES, [
      'Model 03 u crnoj mat obradi', 'Model 03 u grafit obradi',
      'Model 03 u zlatnoj obradi', 'Model 03 u saten zlatnoj obradi',
    ]),
  },
];

export const GALLERY = [
  { url: '/assets/heng/interiors/mermerni-zid-sa-lusterom.jpg', caption: 'Bar u mermeru — nosači u nizu ispod osvetljene police', alt: 'Bar u mermeru sa HENG sistemom i dizajnerskim lusterom' },
  { url: '/assets/heng/interiors/kuhinja-vinska-nisa.jpg', caption: 'Vinska niša integrisana u kuhinjski element', alt: 'Osvetljena vinska niša sa zidnim nosačima za flaše u savremenoj kuhinji' },
  { url: '/assets/heng/interiors/vinski-zid-sa-slikom.jpg', caption: 'Simetrična postavka oko umetničkog rada', alt: 'Vinski zid sa zidnim nosačima za flaše sa obe strane uljane slike' },
  { url: '/assets/heng/interiors/mermer-detalj-flase-i-case.jpg', caption: 'Detalj — flaše i čaše u istoj ravni', alt: 'Detalj mermernog zida sa nosačima za flaše i obešenim čašama' },
  { url: '/assets/heng/interiors/vitrina-sa-casama.jpg', caption: 'Vitrina sa nosačima za čaše ispod police', alt: 'Zatamnjena vitrina sa policama i nosačima za čaše' },
  { url: '/assets/heng/interiors/mermerni-zid-flase-i-case.jpg', caption: 'Vinski kutak kao produžetak zida', alt: 'Mermerna niša sa nosačima za flaše i letvom za čaše' },
  { url: '/assets/heng/lifestyle/case-nad-barom-heng.jpg', caption: 'Čaše obešene iznad radne ploče', alt: 'Čaše za vino obešene na HENG nosaču iznad kućnog bara' },
];

export const HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'hs-announcement', key: 'announcement', title: 'Najava', is_visible: true, sort_order: 0,
    content: { text: 'Dizajn za vino. Detalj za prostor.', href: '/kolekcija', linkLabel: 'Kolekcija' },
  },
  {
    id: 'hs-hero', key: 'hero', title: 'Hero', is_visible: true, sort_order: 1,
    content: {
      eyebrow: 'DIZAJNIRANO ZA SAVREMENE ENTERIJERE',
      heading: 'Vino zaslužuje svoje mesto.',
      body: 'Aluminijumski nosači za vino i čaše koji spajaju funkciju, preciznost i savremenu estetiku.',
      primaryLabel: 'Pogledaj kolekciju', primaryHref: '/kolekcija',
      secondaryLabel: 'Zatraži ponudu', secondaryHref: '/projekti',
      mediaUrl: '/assets/heng/interiors/mermerni-zid-sa-lusterom.jpg',
      mediaAlt: 'Bar u mermeru sa HENG sistemom i dizajnerskim lusterom',
      videoUrl: null, videoPoster: null,
    },
  },
  {
    id: 'hs-statement', key: 'statement', title: 'Izjava brenda', is_visible: true, sort_order: 2,
    content: {
      heading: 'Detalji koji prostoru daju karakter.',
      body: 'HENG nastaje na granici između arhitekture i pribora. Umesto police koja zauzima prostor, ' +
        'ostaje linija koja ga definiše — dovoljno tiha da se uklopi, dovoljno precizna da se primeti.',
      note: 'Dizajn koji ne zauzima prostor — već ga oblikuje.',
      mediaUrl: '/assets/heng/products/model-02/model-02-saten-zlatna.jpg',
      mediaAlt: 'Model 02 u saten zlatnoj obradi',
    },
  },
  {
    id: 'hs-featured', key: 'featured', title: 'Izdvojeno iz kolekcije', is_visible: true, sort_order: 3,
    content: {
      eyebrow: 'KOLEKCIJA',
      heading: 'Tri modela, jedna logika.',
      body: 'Svaki model rešava jedan zadatak u prostoru — čašu, flašu ili ceo zid.',
      productSlugs: ['model-01', 'model-02', 'model-03'],
    },
  },
  {
    id: 'hs-finishes', key: 'finishes', title: 'Završne obrade', is_visible: true, sort_order: 4,
    content: {
      eyebrow: 'ZAVRŠNE OBRADE',
      heading: 'Četiri obrade, jedan materijal.',
      body: 'Ista geometrija menja karakter zajedno sa obradom. Izaberite uzorak da vidite profil.',
      productSlug: 'model-03',
    },
  },
  {
    id: 'hs-material', key: 'material', title: 'Materijal i preciznost', is_visible: true, sort_order: 5,
    content: {
      eyebrow: 'MATERIJAL',
      heading: 'Oblikovano da traje.',
      body: 'HENG sistemi izrađeni su od eloksirane legure aluminijuma, sa završnim obradama koje se ' +
        'uklapaju u savremene kuhinje, vinske kutke i enterijere po meri.',
      points: [
        { title: 'Eloksirana legura aluminijuma', text: 'Obrada se izvodi na samom materijalu, bez sloja koji se ljušti.' },
        { title: 'Preciznost u svakom detalju', text: 'Prorezi, radijusi i otvori za montažu izvedeni su u istoj toleranciji na svakom komadu.' },
        { title: 'Skrivena montaža', text: 'Vidljiv ostaje samo profil — pričvršćenje se povlači u pozadinu.' },
      ],
      mediaUrl: '/assets/heng/products/model-01/model-01-sve-obrade.jpg',
      mediaAlt: 'Model 01 — sve dostupne završne obrade jedna uz drugu',
    },
  },
  {
    id: 'hs-gallery', key: 'gallery', title: 'Inspiracija iz enterijera', is_visible: true, sort_order: 6,
    content: { eyebrow: 'ENTERIJERI', heading: 'Postavljeno u prostor.', items: GALLERY.slice(0, 6) },
  },
  {
    id: 'hs-dimensions', key: 'dimensions', title: 'Dimenzije', is_visible: true, sort_order: 7,
    content: {
      eyebrow: 'DIMENZIJE',
      heading: 'Preciznost u svakom detalju.',
      body: 'Mere su date u centimetrima, prema kotiranim fotografijama proizvoda.',
    },
  },
  {
    id: 'hs-projects', key: 'projects', title: 'Projekti i saradnja', is_visible: true, sort_order: 8,
    content: {
      eyebrow: 'PROJEKTI',
      heading: 'Za enterijere koji zahtevaju više.',
      body: 'Radimo sa arhitektama, dizajnerima i izvođačima na prilagođenim postavkama za privatne i ' +
        'komercijalne prostore.',
      audience: ['Arhitekte', 'Dizajneri enterijera', 'Proizvođači nameštaja', 'Restorani', 'Hoteli', 'Vinski barovi', 'Vinarije', 'Enterijeri po meri'],
      ctaLabel: 'Pošalji projektni upit', ctaHref: '/projekti',
      mediaUrl: '/assets/heng/interiors/vinski-zid-sa-slikom.jpg',
      mediaAlt: 'Vinski zid sa zidnim nosačima za flaše sa obe strane uljane slike',
    },
  },
  {
    id: 'hs-instagram', key: 'instagram', title: 'Instagram', is_visible: true, sort_order: 9,
    content: {
      eyebrow: 'INSTAGRAM',
      heading: 'Pratite @heng.srb',
      ctaLabel: 'Pratite @heng.srb',
      href: 'https://www.instagram.com/heng.srb/',
      items: [
        '/assets/heng/lifestyle/heng-cheers-kljucni-vizual.jpg',
        '/assets/heng/interiors/mermer-detalj-flase-i-case.jpg',
        '/assets/heng/products/model-03/model-03-sve-obrade.jpg',
        '/assets/heng/interiors/vitrina-sa-casama.jpg',
      ],
    },
  },
  {
    id: 'hs-final', key: 'final_cta', title: 'Završni poziv', is_visible: true, sort_order: 10,
    content: {
      heading: 'Početak dobrog prostora je u detaljima.',
      body: 'Pogledajte kolekciju ili nam opišite prostor — predlog postavke pripremamo prema vašim merama.',
      primaryLabel: 'Istraži kolekciju', primaryHref: '/kolekcija',
      secondaryLabel: 'Kontaktiraj nas', secondaryHref: '/kontakt',
    },
  },
];

export const SITE_SETTINGS: SiteSettings = {
  brand_name: 'HENG',
  contact_email: 'info@heng.rs',
  phone: null,
  instagram_url: 'https://www.instagram.com/heng.srb/',
  address: 'Srbija',
  currency: 'RSD',
  delivery_cost_rsd: 0,
  free_delivery_threshold_rsd: null,
  payment_methods: ['pouzecem', 'predracun'],
  seo_title: 'HENG — nosači za vino i čaše',
  seo_description:
    'Aluminijumski nosači za vinske flaše i čaše. Arhitektonski detalj za kuhinje, barove i enterijere po meri.',
  footer_note: 'Dizajn za vino. Detalj za prostor.',
  terms_text: null,
  privacy_text: null,
  delivery_text: null,
};
