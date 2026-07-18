export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  stock: number;
  weight: string;
  category: string;
  image: string;
  images?: string[];
  is_active: boolean;
  rating: number;
  reviews_count: number;
  is_best_seller: boolean;
  ingredients?: string;
  shelf_life?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  product_count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: 'Razorpay' | 'UPI_QR' | 'COD';
  shipping_address: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  created_at: string;
  tracking_updates?: { status: OrderStatus; timestamp: string; note: string }[];
  delivery_distance?: number;
  delivery_charge?: number;
  free_delivery_applied?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  created_at: string;
  total_spend: number;
  orders_count: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  saved_addresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  }>;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  logo: string;
  contact_number: string;
  whatsapp_number: string;
  email: string;
  address: string;
  razorpay_key_id: string;
  upi_id: string;
  qr_code_url: string;
  instagram_url: string;
  facebook_url: string;
  is_store_closed: boolean;
  tax_percent: number;
  shipping_cost: number;
  delivery_0_5_cost: number;
  delivery_5_10_cost: number;
  delivery_10_15_cost: number;
  delivery_15_20_cost: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  store_latitude: number;
  store_longitude: number;
}

export interface HomeSectionConfig {
  id: 'hero' | 'categories' | 'promotional' | 'bestSellers' | 'whyChooseUs' | 'testimonials' | 'contactCta';
  name: string;
  title: string;
  subtitle: string;
  visible: boolean;
  order: number;
}

export interface ProductDetailsPageConfig {
  showGalleryThumbnails: boolean;
  showTrustIndicators: boolean;
  showTherapeuticBenefits: boolean;
  showReviewsSummary: boolean;
  allowZoom: boolean;
  stickyMobileCTA: boolean;
}

export interface DesignConfig {
  theme: 'emerald' | 'amber' | 'rose' | 'indigo' | 'lime';
  homeSections: HomeSectionConfig[];
  productConfig: ProductDetailsPageConfig;
}

