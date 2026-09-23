/**
 * Članci za stranu „U prostoru” — između bloga i galerije.
 * Privremeni tekstovi i fotografije; klijent šalje konačan sadržaj.
 * Novi članak = novi objekat u nizu (najnoviji ide na vrh).
 */

export const ARTICLE_CATEGORIES = [
  { slug: 'inspiracija', label: 'Inspiracija' },
  { slug: 'saveti', label: 'Saveti' },
  { slug: 'materijali', label: 'Materijali' },
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]['slug'];

export interface Article {
  slug: string;
  category: ArticleCategory;
  /** ISO datum objave. */
  date: string;
  title: string;
  excerpt: string;
  mediaUrl: string;
  mediaAlt: string;
  /** Pasusi; red koji počinje sa „## ” je podnaslov. */
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'kako-odabrati-rucke-za-kuhinju',
    category: 'saveti',
    date: '2026-09-12',
    title: 'Kako odabrati ručke za kuhinju?',
    excerpt: 'Vodič kroz materijale, boje i stilove za prostor koji odražava vaš karakter.',
    mediaUrl: '/assets/heng/lifestyle/rucke-od-prirodnog-kamena.jpg',
    mediaAlt: 'Okrugle ručke od prirodnog kamena na frontu kuhinjskog elementa',
    body: [
      'Ručka je deo kuhinje koji se dodiruje više puta dnevno, a ipak se najčešće bira poslednja. Mali detalj, ali menja način na koji se ceo front čita.',
      '## Krenite od materijala fronta',
      'Mat lakirani frontovi traže toplinu — kamen ili topli metal. Drvo podnosi i hladnije tonove, poput svetlog mermera.',
      '## Veličina i raspored',
      'Okrugla ručka od 30–40 mm dovoljna je za većinu vrata. Na fiokama je postavite centralno, a na vratima u gornju trećinu donjih elemenata.',
      '## Jedan detalj, jedan ton',
      'Ako kuhinja već ima kamenu radnu ploču, ručka u sličnom tonu povezuje front i ploču u jednu celinu.',
    ],
  },
  {
    slug: 'mali-prostor-velike-mogucnosti',
    category: 'inspiracija',
    date: '2026-09-05',
    title: 'Mali prostor, velike mogućnosti',
    excerpt: 'Kako pravilnim odabirom držača za vino i čaše možete unaprediti svoj enterijer.',
    mediaUrl: '/assets/heng/interiors/kuhinja-vinska-nisa.jpg',
    mediaAlt: 'Osvetljena vinska niša sa zidnim nosačima za flaše u savremenoj kuhinji',
    body: [
      'Za vinski kutak nije potrebna posebna prostorija. Dovoljna je niša, deo zida ili prostor ispod gornjih elemenata.',
      '## Zid umesto ormara',
      'Zidni nosači drže flaše vodoravno, a zauzimaju samo nekoliko centimetara dubine. Flaše postaju deo dekora.',
      '## Čaše na dohvat ruke',
      'Letva za čaše ispod gornjeg elementa oslobađa ceo jedan ormarić, a čaše ostaju čiste i uvek spremne.',
    ],
  },
  {
    slug: 'prirodni-kamen-jedinstven-u-svakom-detalju',
    category: 'materijali',
    date: '2026-08-20',
    title: 'Prirodni kamen: jedinstven u svakom detalju',
    excerpt: 'Upoznajte vrste kamena koje koristimo i saznajte zašto je svaki komad jedinstven.',
    mediaUrl: '/assets/heng/lifestyle/rucke-od-prirodnog-kamena-vertikalno.jpg',
    mediaAlt: 'Ručke od prirodnog kamena u različitim tonovima',
    body: [
      'Kamen se ne proizvodi — vadi se, seče i polira. Zato nijedna ručka nije ista.',
      '## Mermer',
      'Hladan na dodir, sa izraženim žilama. Najbolje se slaže sa svetlim i mat frontovima.',
      '## Travertin',
      'Topao ton i prirodne pore daju mu mekši, rustičniji karakter.',
      '## Održavanje',
      'Dovoljna je vlažna krpa. Izbegavajte kisela sredstva za čišćenje, jer mogu da ostave trag na površini.',
    ],
  },
  {
    slug: 'zidni-ili-ispod-elementa',
    category: 'saveti',
    date: '2026-08-15',
    title: 'Zidni ili ispod elementa?',
    excerpt: 'Uporedili smo oba tipa držača za čaše kako biste lakše doneli odluku.',
    mediaUrl: '/assets/heng/lifestyle/case-nad-barom-heng.jpg',
    mediaAlt: 'Čaše obešene na HENG letvi iznad barskog elementa',
    body: [
      'Oba rešenja drže čaše naopako, za stopu, ali se u prostoru ponašaju različito.',
      '## Ispod elementa',
      'Nevidljiva montaža, čaše vise ispod gornjeg ormarića. Idealno za kuhinje i barove.',
      '## Na zidu',
      'Kada nema gornjih elemenata, zidna letva postaje dekorativni detalj i centar pažnje.',
    ],
  },
  {
    slug: 'moderan-stan-u-beogradu',
    category: 'inspiracija',
    date: '2026-08-01',
    title: 'Moderan stan u Beogradu',
    excerpt: 'Pogledajte kako su HENG držači i kamene ručke uklopljeni u savremen enterijer urbanog stana.',
    mediaUrl: '/assets/heng/interiors/mermerni-zid-flase-i-case.jpg',
    mediaAlt: 'Mermerna niša sa nosačima za flaše i letvom za čaše',
    body: [
      'Mermerni zid u dnevnom boravku dobio je novu ulogu — postao je vinski zid.',
      'Nosači za flaše i letva za čaše postavljeni su u istoj osi, tako da ceo sklop izgleda kao jedan element.',
    ],
  },
  {
    slug: 'eloksirani-aluminijum',
    category: 'materijali',
    date: '2026-07-18',
    title: 'Zašto eloksirani aluminijum?',
    excerpt: 'Obrada koja postaje deo samog materijala — bez sloja koji se ljušti.',
    mediaUrl: '/assets/heng/lifestyle/zlatna-letva-sa-casama-hero.jpg',
    mediaAlt: 'Čaše obešene na zlatnoj HENG letvi ispod kuhinjskog elementa',
    body: [
      'Eloksiranje je elektrohemijski postupak koji menja samu površinu aluminijuma, pa boja nije nanesena preko materijala.',
      'Rezultat je površina otporna na ogrebotine, vlagu i vreme, koja ne gubi ton ni posle godina upotrebe.',
    ],
  },
];

export const categoryLabel = (slug: ArticleCategory) =>
  ARTICLE_CATEGORIES.find((c) => c.slug === slug)!.label;

export const formatArticleDate = (iso: string) =>
  new Date(iso).toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'short', year: 'numeric' });
