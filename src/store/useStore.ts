import { create } from 'zustand';
import { Product, Category, CartItem, Order, Review, Customer, UserProfile, StoreSettings, OrderStatus, DesignConfig, HomeSectionConfig, ProductDetailsPageConfig } from '../types';
import { SupabaseService } from '../services/supabase';
import { getDistanceForPincode, calculateDelivery } from '../utils/delivery';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const defaultHomeSections: HomeSectionConfig[] = [
  { id: 'hero', name: 'Hero Banner Slider', title: 'Pure Homemade Village Products', subtitle: 'Rediscover authentic childhood nostalgia.', visible: true, order: 0 },
  { id: 'categories', name: 'Categories Navigation', title: 'Explore Village Categories', subtitle: 'Every category delivers unique rural nutrients sourced directly from local crop basins.', visible: true, order: 1 },
  { id: 'promotional', name: 'Promotional Rice Banner', title: 'Get Unpolished Heirloom Red, White & Black Rice Varieties!', subtitle: 'Our native village rice varieties retrieve natural nutrition without heavy polishing.', visible: true, order: 2 },
  { id: 'bestSellers', name: 'Best Selected Grains', title: 'E-Store Best Sellers', subtitle: 'Top picked items by families across India.', visible: true, order: 3 },
  { id: 'whyChooseUs', name: 'Editorial Value Grid', title: 'Why Our Village Method Elevates Everyday Health', subtitle: 'Industrial products sit inside warehouses for years under carbon gas layers.', visible: true, order: 4 },
  { id: 'testimonials', name: 'Verified Customer Reviews', title: 'Loved By Families Across India', subtitle: 'Real reviews direct from local buyers.', visible: true, order: 5 },
  { id: 'contactCta', name: 'Instant Kitchen Helpline CTA', title: 'Need Help? Connect with Village Kitchen directly!', subtitle: 'If you have queries regarding custom batch preparation, party orders, bulk store supplies.', visible: true, order: 6 }
];

const defaultProductConfig: ProductDetailsPageConfig = {
  showGalleryThumbnails: true,
  showTrustIndicators: true,
  showTherapeuticBenefits: true,
  showReviewsSummary: true,
  allowZoom: true,
  stickyMobileCTA: true,
};

const defaultDesignConfig: DesignConfig = {
  theme: 'emerald',
  homeSections: defaultHomeSections,
  productConfig: defaultProductConfig
};

function loadSavedDesignConfig(): DesignConfig {
  try {
    const saved = localStorage.getItem('village_design_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.theme && parsed.homeSections && parsed.productConfig) {
        return parsed;
      }
    }
  } catch (e) {}
  return defaultDesignConfig;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppStore {
  // Products & Categories
  products: Product[];
  categories: Category[];
  isProductsLoading: boolean;
  loadProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Auth
  user: UserProfile | null;
  loadUser: () => Promise<void>;
  login: (email: string, passwordHash: string) => Promise<UserProfile>;
  register: (fullName: string, email: string, phone: string, passwordHash: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (fullName: string, phone: string, savedAddresses?: UserProfile['saved_addresses']) => Promise<void>;

  // Orders
  orders: Order[];
  isOrdersLoading: boolean;
  loadOrders: () => Promise<void>;
  placeNewOrder: (paymentMethod: 'Razorpay' | 'UPI_QR' | 'COD', address: Order['shipping_address']) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;

  // Admin Manage lists
  customers: Customer[];
  reviews: Review[];
  settings: StoreSettings | null;
  loadAdminLists: () => Promise<void>;
  toggleProductStatus: (id: string, active: boolean) => Promise<void>;
  saveProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews_count'> & { id?: string }) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (category: Omit<Category, 'id' | 'product_count'> & { id?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  loadSettings: () => Promise<void>;
  updateSettings: (updated: Partial<StoreSettings>) => Promise<void>;

  // Shopper filtering preferences
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;

  // Global Toasts system
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Custom Live Design & Layout Customizations
  designConfig: DesignConfig;
  updateDesignConfig: (config: Partial<DesignConfig>) => void;
  updateHomeSection: (id: string, updated: Partial<HomeSectionConfig>) => void;
  swapHomeSectionOrder: (index1: number, index2: number) => void;
  resetDesignConfig: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Products & Categories
  products: [],
  categories: [],
  isProductsLoading: false,
  loadProducts: async () => {
    set({ isProductsLoading: true });
    try {
      const products = await SupabaseService.getProducts();
      set({ products, isProductsLoading: false });
    } catch (e) {
      set({ isProductsLoading: false });
    }
  },
  loadCategories: async () => {
    try {
      const categories = await SupabaseService.getCategories();
      set({ categories });
    } catch (e) {}
  },

  // Cart
  cart: [],
  addToCart: (product, quantity = 1) => {
    const { cart, addToast } = get();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    
    // Check stock
    if (product.stock <= 0) {
      addToast('Sorry, this authentic village item is temporarily out of stock!', 'error');
      return;
    }

    const currentQtyInCart = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    if (currentQtyInCart + quantity > product.stock) {
      addToast(`Only ${product.stock} items are remaining in stock!`, 'error');
      return;
    }
    
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }
    set({ cart: newCart });
    addToast(`${product.name} successfully added to your cart!`, 'success');
  },
  removeFromCart: (productId) => {
    const { cart, addToast } = get();
    const item = cart.find(i => i.product.id === productId);
    const newCart = cart.filter(idx => idx.product.id !== productId);
    set({ cart: newCart });
    if (item) {
      addToast(`Removed ${item.product.name} from cart`, 'info');
    }
  },
  updateCartQuantity: (productId, quantity) => {
    const { cart } = get();
    const newCart = cart.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(item.product.stock, Math.max(1, quantity)) };
      }
      return item;
    });
    set({ cart: newCart });
  },
  clearCart: () => {
    set({ cart: [] });
  },

  // Auth
  user: null,
  loadUser: async () => {
    if (isSupabaseConfigured) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        let resolvedProfile = profile;

        // Auto-create profile if missing (trigger didn't fire)
        if (profileErr || !profile) {
          const meta = session.user.user_metadata || {};
          const userEmail = session.user.email || '';
          const { error: createErr } = await supabase.from('profiles').upsert({
            id: session.user.id,
            full_name: meta.full_name || userEmail.split('@')[0],
            email: userEmail,
            phone: meta.phone || '',
            role: meta.role || 'customer',
            saved_addresses: [],
          });
          // Retry without email column if needed
          if (createErr) {
            await supabase.from('profiles').upsert({
              id: session.user.id,
              full_name: meta.full_name || userEmail.split('@')[0],
              phone: meta.phone || '',
              role: meta.role || 'customer',
              saved_addresses: [],
            });
          }
          const { data: fresh } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          resolvedProfile = fresh;
        }

        if (resolvedProfile) {
          const userEmail = session.user.email || '';
          const userProfile: UserProfile = {
            id: session.user.id,
            full_name: resolvedProfile.full_name || '',
            email: userEmail,
            phone: resolvedProfile.phone || '',
            role: resolvedProfile.role || 'customer',
            saved_addresses: resolvedProfile.saved_addresses || [],
          };
          // Ensure customers row exists
          const { data: existingCust } = await supabase.from('customers').select('id').eq('email', userEmail.toLowerCase()).limit(1);
          if (!existingCust || existingCust.length === 0) {
            try {
              await supabase.from('customers').insert({
                id: session.user.id,
                full_name: resolvedProfile.full_name || '',
                email: userEmail.toLowerCase(),
                phone: resolvedProfile.phone || '',
                role: resolvedProfile.role || 'customer',
                orders_count: 0,
                total_spend: 0,
                created_at: new Date().toISOString()
              });
            } catch (_) { /* ignore */ }
          }
          localStorage.setItem('village_current_user', JSON.stringify(userProfile));
          set({ user: userProfile });
          return;
        }
      }
      set({ user: null });
      return;
    }
    // localStorage fallback
    const user = SupabaseService.getCurrentUser();
    set({ user });
  },
  login: async (email, passwordHash) => {
    const profile = await SupabaseService.signIn(email, passwordHash);
    set({ user: profile });
    // Reset any user orders
    get().loadOrders();
    get().addToast(`Welcome back, ${profile.full_name}!`, 'success');
    return profile;
  },
  register: async (fullName, email, phone, passwordHash) => {
    const profile = await SupabaseService.signUp(fullName, email, phone, passwordHash);
    get().addToast(`Account created successfully! Please sign in using your credentials.`, 'success');
    return profile;
  },
  logout: async () => {
    await SupabaseService.signOut();
    set({ user: null, cart: [], orders: [] });
    get().addToast('Signed out successfully. Hope to see you soon!', 'info');
  },
  updateProfile: async (fullName, phone, savedAddresses) => {
    const { user } = get();
    if (!user) return;
    const updated = await SupabaseService.updateProfile(user.id, { full_name: fullName, phone, saved_addresses: savedAddresses });
    set({ user: updated });
    get().addToast('Profile updated successfully!', 'success');
  },

  // Orders
  orders: [],
  isOrdersLoading: false,
  loadOrders: async () => {
    const { user } = get();
    set({ isOrdersLoading: true });
    try {
      if (user) {
        if (user.role === 'admin') {
          const orders = await SupabaseService.getOrders();
          set({ orders, isOrdersLoading: false });
        } else {
          const orders = await SupabaseService.getUserOrders(user.email);
          set({ orders, isOrdersLoading: false });
        }
      } else {
        set({ orders: [], isOrdersLoading: false });
      }
    } catch (e) {
      set({ isOrdersLoading: false });
    }
  },
  placeNewOrder: async (paymentMethod, address) => {
    const { cart, user, clearCart, addToast, settings } = get();
    if (cart.length === 0) throw new Error('Cart is empty');
    
    // Calculate total amount
    const totalAmount = cart.reduce((sums, item) => {
      const itemPrice = item.product.sale_price !== undefined ? item.product.sale_price : item.product.price;
      return sums + (itemPrice * item.quantity);
    }, 0);

    const email = user ? user.email : 'guest@villageproduct.com';
    const name = user ? user.full_name : address.fullName;

    const orderItems = cart.map(item => ({
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      quantity: item.quantity,
      price: item.product.sale_price !== undefined ? item.product.sale_price : item.product.price
    }));

    // Dynamic distance and delivery tiers computation at order creation
    const distanceVal = getDistanceForPincode(address.pincode);
    const storeSettings = settings || {
      delivery_0_5_cost: 20,
      delivery_5_10_cost: 40,
      delivery_10_15_cost: 60,
      delivery_15_20_cost: 100,
      free_delivery_threshold: 599,
      max_delivery_distance: 20,
      store_latitude: 16.6618,
      store_longitude: 73.5186
    };
    
    const deliveryInfo = calculateDelivery({
      distance: distanceVal,
      subtotal: totalAmount,
      settings: storeSettings
    });

    const finalDeliveryCharge = deliveryInfo.available ? deliveryInfo.charge : 0;

    const result = await SupabaseService.createOrder({
      user_id: user ? user.id : 'guest',
      user_name: name,
      user_email: email,
      items: orderItems,
      total_amount: totalAmount + finalDeliveryCharge,
      status: 'pending',
      payment_status: paymentMethod === 'Razorpay' ? 'paid' : 'pending',
      payment_method: paymentMethod,
      shipping_address: address,
      delivery_distance: distanceVal,
      delivery_charge: finalDeliveryCharge,
      free_delivery_applied: deliveryInfo.freeDeliveryApplied
    });

    clearCart();
    // reload products list as stocks decreased
    await get().loadProducts();
    await get().loadOrders();
    addToast('Your authentic village order has been received successfully!', 'success');
    return result;
  },
  updateOrderStatus: async (orderId, status, note) => {
    await SupabaseService.updateOrderStatus(orderId, status, note);
    await get().loadOrders();
    get().addToast(`Order ${orderId} updated to ${status}`, 'success');
  },
  deleteOrder: async (orderId) => {
    await SupabaseService.deleteOrder(orderId);
    await get().loadOrders();
    get().addToast(`Order ${orderId} successfully deleted`, 'info');
  },
  clearAllOrders: async () => {
    await SupabaseService.clearAllOrders();
    await get().loadOrders();
    get().addToast(`All temporary orders cleared cleanly`, 'success');
  },

  // Admin Lists
  customers: [],
  reviews: [],
  settings: null,
  loadSettings: async () => {
    try {
      const settings = await SupabaseService.getStoreSettings();
      set({ settings });
    } catch (e) {
      console.error('[loadSettings] failed:', e);
    }
  },
  updateSettings: async (updated) => {
    const settings = await SupabaseService.updateStoreSettings(updated);
    set({ settings });
    get().addToast('Settings updated successfully!', 'success');
  },
  loadAdminLists: async () => {
    try {
      const customers = await SupabaseService.getCustomers();
      const reviews = await SupabaseService.getReviews();
      set({ customers, reviews });
    } catch(e){}
  },
  toggleProductStatus: async (id, active) => {
    await SupabaseService.updateProduct(id, { is_active: active });
    await get().loadProducts();
    get().addToast(`Product status updated`, 'success');
  },
  saveProduct: async (product) => {
    if (product.id) {
      await SupabaseService.updateProduct(product.id, product);
    } else {
      await SupabaseService.createProduct(product);
    }
    await get().loadProducts();
    get().addToast('Product saved successfully', 'success');
  },
  deleteProduct: async (id) => {
    await SupabaseService.deleteProduct(id);
    await get().loadProducts();
    get().addToast('Product deleted from village inventory', 'info');
  },
  saveCategory: async (category) => {
    if (category.id) {
      await SupabaseService.updateCategory(category.id, category);
    } else {
      await SupabaseService.createCategory(category);
    }
    await get().loadCategories();
    get().addToast('Category saved successfully', 'success');
  },
  deleteCategory: async (id) => {
    await SupabaseService.deleteCategory(id);
    await get().loadCategories();
    get().addToast('Category deleted successfully', 'info');
  },
  approveReview: async (id) => {
    await SupabaseService.approveReview(id);
    await get().loadAdminLists();
    await get().loadProducts();  // ratings changed
    get().addToast('Review approved successfully and published live', 'success');
  },
  rejectReview: async (id) => {
    await SupabaseService.rejectReview(id);
    await get().loadAdminLists();
    get().addToast('Review rejected successfully', 'info');
  },
  deleteReview: async (id) => {
    await SupabaseService.deleteReview(id);
    await get().loadAdminLists();
    get().addToast('Review deleted permanently', 'info');
  },

  // Filtering Prefs
  searchQuery: '',
  selectedCategory: '',
  priceRange: [0, 500],
  sortBy: 'popularity',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortBy: (sort) => set({ sortBy: sort }),

  // Toasts
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set(state => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },

  // Custom Live Design & Layout Customizations State Implementation
  designConfig: loadSavedDesignConfig(),
  updateDesignConfig: (config) => {
    const current = get().designConfig;
    const newConfig = {
      ...current,
      ...config,
      productConfig: {
        ...current.productConfig,
        ...(config.productConfig || {})
      }
    };
    set({ designConfig: newConfig });
    localStorage.setItem('village_design_config', JSON.stringify(newConfig));
  },
  updateHomeSection: (id, updated) => {
    const config = get().designConfig;
    const newSections = config.homeSections.map(sec => 
      sec.id === id ? { ...sec, ...updated } : sec
    );
    get().updateDesignConfig({ homeSections: newSections });
  },
  swapHomeSectionOrder: (index1, index2) => {
    const config = get().designConfig;
    const newSections = [...config.homeSections];
    if (index1 >= 0 && index1 < newSections.length && index2 >= 0 && index2 < newSections.length) {
      const temp = newSections[index1];
      newSections[index1] = newSections[index2];
      newSections[index2] = temp;
      
      const updatedSections = newSections.map((sec, idx) => ({
        ...sec,
        order: idx
      }));
      
      get().updateDesignConfig({ homeSections: updatedSections });
    }
  },
  resetDesignConfig: () => {
    localStorage.removeItem('village_design_config');
    set({ designConfig: defaultDesignConfig });
    get().addToast('Reset platform theme and layout configurations!', 'info');
  }
}));
