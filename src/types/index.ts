export type OrderStatus =
  | 'nova' | 'potvrdjena' | 'u_pripremi' | 'poslata' | 'zavrsena' | 'otkazana';
export type InquiryStatus = 'nov' | 'kontaktiran' | 'zavrsen';
export type PaymentMethod = 'pouzecem' | 'predracun';

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  finish_name: string;
  finish_code: string;
  finish_swatch: string | null;
  sku: string | null;
  price_rsd: number | null;
  sale_price_rsd: number | null;
  stock: number;
  dimensions: string | null;
  main_image: string | null;
  gallery: string[];
  is_active: boolean;
  sort_order: number;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  variant_id: string | null;
  url: string;
  kind: 'image' | 'video';
  poster_url: string | null;
  alt: string | null;
  is_cover: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  technical_info: string | null;
  installation_info: string | null;
  delivery_info: string | null;
  material: string | null;
  dimensions: string | null;
  sku: string | null;
  price_rsd: number | null;
  sale_price_rsd: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  price_on_request: boolean;
  stock: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  is_archived: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
}

export interface ProductFull extends Product {
  category: Category | null;
  variants: ProductVariant[];
  media: ProductMedia[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  finish_name: string | null;
  sku: string | null;
  unit_price_rsd: number | null;
  quantity: number;
  line_total_rsd: number | null;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  note: string | null;
  payment: PaymentMethod;
  subtotal_rsd: number;
  delivery_rsd: number;
  total_rsd: number;
  has_request_items: boolean;
  internal_note: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface ProjectInquiry {
  id: string;
  status: InquiryStatus;
  full_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  project_type: string | null;
  location: string | null;
  description: string;
  desired_products: string | null;
  deadline: string | null;
  attachment_url: string | null;
  consent: boolean;
  internal_note: string | null;
  created_at: string;
}

export interface HomepageSection {
  id: string;
  key: string;
  title: string | null;
  is_visible: boolean;
  sort_order: number;
  content: Record<string, unknown>;
}

export interface SiteSettings {
  brand_name: string;
  contact_email: string | null;
  phone: string | null;
  instagram_url: string | null;
  address: string | null;
  currency: string;
  delivery_cost_rsd: number;
  free_delivery_threshold_rsd: number | null;
  payment_methods: PaymentMethod[];
  seo_title: string | null;
  seo_description: string | null;
  footer_note: string | null;
  terms_text: string | null;
  privacy_text: string | null;
  delivery_text: string | null;
}

export interface CartLine {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  finishName: string | null;
  sku: string | null;
  image: string | null;
  unitPrice: number | null; // null => cena na upit
  quantity: number;
}
