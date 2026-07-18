/**
 * HENG — mapa asseta
 * Original (Instagram / studio export)  ->  organizovana putanja u /public.
 * Grupisanje je izvedeno iz naziva fajlova, vidljivih oznaka obrade
 * (CRNA MAT / ZLATNA / GRAFIT / SATEN ZLATNA), kotiranih fotografija
 * i vizuelne sličnosti profila.
 */
export interface AssetEntry {
  original: string;
  path: string;
  group:
    | 'lifestyle' | 'interiors' | 'product' | 'product-detail'
    | 'finish' | 'dimension' | 'video' | 'logo';
  alt: string;
  model?: 'model-01' | 'model-02' | 'model-03';
  finish?: 'crna-mat' | 'zlatna' | 'grafit' | 'saten-zlatna';
}

export const ASSET_MANIFEST: AssetEntry[] = [
  // ---------- Lifestyle / brend ----------
  {
    original: 'SnapInsta_to_626257819_18126052447554215_1914847134621345400_n.jpg',
    path: '/assets/heng/lifestyle/heng-cheers-kljucni-vizual.jpg',
    group: 'logo',
    alt: 'HENG wordmark preko fotografije bara sa obešenim čašama',
  },
  {
    original: 'SnapInsta_to_486056630_17872132080323943_7946251911507019582_n.jpg',
    path: '/assets/heng/lifestyle/zlatna-letva-sa-casama-hero.jpg',
    group: 'lifestyle',
    alt: 'Čaše obešene na zlatnoj HENG letvi ispod kuhinjskog elementa',
  },
  {
    original: 'SnapInsta_to_489016074_17873646567323943_8058702439091683174_n.jpg',
    path: '/assets/heng/lifestyle/case-nad-barom-heng.jpg',
    group: 'lifestyle',
    alt: 'Čaše za vino obešene na HENG nosaču iznad kućnog bara',
  },

  // ---------- Enterijeri / instalacije ----------
  {
    original: 'SnapInsta_to_712153131_17930308782323943_2780038746084691590_n.jpg',
    path: '/assets/heng/interiors/vinski-zid-sa-slikom.jpg',
    group: 'interiors',
    alt: 'Vinski zid sa zidnim nosačima za flaše sa obe strane uljane slike',
  },
  {
    original: 'SnapInsta_to_670872680_17922808602323943_5066011803406239163_n.jpg',
    path: '/assets/heng/interiors/kuhinja-vinska-nisa.jpg',
    group: 'interiors',
    alt: 'Osvetljena vinska niša sa zidnim nosačima za flaše u savremenoj kuhinji',
  },
  {
    original: 'SnapInsta_to_683840753_17924594421323943_5904407114546391874_n.jpg',
    path: '/assets/heng/interiors/mermerni-zid-flase-i-case.jpg',
    group: 'interiors',
    alt: 'Mermerna niša sa nosačima za flaše i letvom za čaše',
  },
  {
    original: 'SnapInsta_to_683662150_17924594400323943_2110849072613309482_n.jpg',
    path: '/assets/heng/interiors/mermerni-zid-sa-lusterom.jpg',
    group: 'interiors',
    alt: 'Bar u mermeru sa HENG sistemom i dizajnerskim lusterom',
  },
  {
    original: 'SnapInsta_to_504412802_17881327191323943_4741184949226385579_n.jpg',
    path: '/assets/heng/interiors/vitrina-sa-casama.jpg',
    group: 'interiors',
    alt: 'Zatamnjena vitrina sa policama i nosačima za čaše',
  },
  {
    original: 'SnapInsta_to_683020885_17924594412323943_3096512655838281495_n.jpg',
    path: '/assets/heng/interiors/mermer-detalj-flase-i-case.jpg',
    group: 'interiors',
    alt: 'Detalj mermernog zida sa nosačima za flaše i obešenim čašama',
  },

  // ---------- Model 01 — rebrasti profil ----------
  { original: 'model_1_5.jpg', path: '/assets/heng/products/model-01/model-01-dimenzije.jpg',
    group: 'dimension', model: 'model-01', alt: 'Model 01 — kotirana fotografija: 31,5 × 8,6 × 2 cm' },
  { original: 'model_1_3.jpg', path: '/assets/heng/products/model-01/model-01-crna-mat.jpg',
    group: 'finish', model: 'model-01', finish: 'crna-mat', alt: 'Model 01 u crnoj mat obradi' },
  { original: 'model_1_2.jpg', path: '/assets/heng/products/model-01/model-01-zlatna.jpg',
    group: 'finish', model: 'model-01', finish: 'zlatna', alt: 'Model 01 u zlatnoj obradi' },
  { original: 'model_1_1.jpg', path: '/assets/heng/products/model-01/model-01-saten-zlatna.jpg',
    group: 'finish', model: 'model-01', finish: 'saten-zlatna', alt: 'Model 01 u saten zlatnoj obradi' },
  { original: 'model_1_4.jpg', path: '/assets/heng/products/model-01/model-01-sve-obrade.jpg',
    group: 'product-detail', model: 'model-01', alt: 'Model 01 — sve dostupne završne obrade jedna uz drugu' },

  // ---------- Model 02 — profil sa uzdužnim prorezom ----------
  { original: 'model_2_1.jpg', path: '/assets/heng/products/model-02/model-02-dimenzije.jpg',
    group: 'dimension', model: 'model-02', alt: 'Model 02 — kotirana fotografija: 30 × 10 × 4 cm' },
  { original: 'model_2_2.jpg', path: '/assets/heng/products/model-02/model-02-crna-mat.jpg',
    group: 'finish', model: 'model-02', finish: 'crna-mat', alt: 'Model 02 u crnoj mat obradi' },
  { original: 'model_2_4.jpg', path: '/assets/heng/products/model-02/model-02-grafit.jpg',
    group: 'finish', model: 'model-02', finish: 'grafit', alt: 'Model 02 u grafit obradi' },
  { original: 'model_2_3.jpg', path: '/assets/heng/products/model-02/model-02-zlatna.jpg',
    group: 'finish', model: 'model-02', finish: 'zlatna', alt: 'Model 02 u zlatnoj obradi' },
  { original: 'model_2_5.jpg', path: '/assets/heng/products/model-02/model-02-saten-zlatna.jpg',
    group: 'finish', model: 'model-02', finish: 'saten-zlatna', alt: 'Model 02 u saten zlatnoj obradi' },
  { original: 'model_2_6.jpg', path: '/assets/heng/products/model-02/model-02-sve-obrade.jpg',
    group: 'product-detail', model: 'model-02', alt: 'Model 02 — sve dostupne završne obrade jedna uz drugu' },

  // ---------- Model 03 — pravougaoni okvir ----------
  { original: 'model_3_za_vina_5.jpg', path: '/assets/heng/products/model-03/model-03-dimenzije.jpg',
    group: 'dimension', model: 'model-03', alt: 'Model 03 — kotirana fotografija: 27 × 10 × 4 cm' },
  { original: 'model_3_za_vina_3.jpg', path: '/assets/heng/products/model-03/model-03-crna-mat.jpg',
    group: 'finish', model: 'model-03', finish: 'crna-mat', alt: 'Model 03 u crnoj mat obradi' },
  { original: 'model_3_za_vina_4.jpg', path: '/assets/heng/products/model-03/model-03-grafit.jpg',
    group: 'finish', model: 'model-03', finish: 'grafit', alt: 'Model 03 u grafit obradi' },
  { original: 'model_3_za_vina_6.jpg', path: '/assets/heng/products/model-03/model-03-zlatna.jpg',
    group: 'finish', model: 'model-03', finish: 'zlatna', alt: 'Model 03 u zlatnoj obradi' },
  { original: 'model_3_za_vina_2.jpg', path: '/assets/heng/products/model-03/model-03-saten-zlatna.jpg',
    group: 'finish', model: 'model-03', finish: 'saten-zlatna', alt: 'Model 03 u saten zlatnoj obradi' },
  { original: 'model_3_za_vina_1.jpg', path: '/assets/heng/products/model-03/model-03-sve-obrade.jpg',
    group: 'product-detail', model: 'model-03', alt: 'Model 03 — sve dostupne završne obrade jedna uz drugu' },
];

export const VIDEO_ASSETS: AssetEntry[] = [
  // Video materijal nije isporučen uz brief. Kada stigne, dodati ovde
  // (grupa: 'video', obavezno poster polje) — HeroMedia i ProductGallery
  // automatski prelaze na video kada postoji unos.
];

export const A = (path: string) => ASSET_MANIFEST.find((a) => a.path === path);
export const altFor = (path: string) => A(path)?.alt ?? '';
