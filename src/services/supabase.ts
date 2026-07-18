// Supabase Integration Ready Service Layer with High-Fidelity Local Simulation Fallback
import { Product, Category, Order, Review, Customer, UserProfile, StoreSettings, OrderStatus, PaymentStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Initial pre-seeded products to make the store look stunning and ready to show to a paying client
const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-pulses-rice',
    name: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    slug: 'pulses-rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    description: 'Traditional native grains, unpolished rice varieties, high-protein pulses and beans (कडधान्ये व गावठी तांदूळ).',
    product_count: 16
  },
  {
    id: 'cat-talele-gare',
    name: 'Talele Gare (तळलेले गरे)',
    slug: 'talele-gare',
    image: 'https://images.unsplash.com/photo-1564844534614-b59e5a75249a?auto=format&fit=crop&q=80&w=600',
    description: 'Crispy, golden-fried mature jackfruit chips (तळलेले गरे), prepared cleanly in wood-pressed oils.',
    product_count: 1
  },
  {
    id: 'cat-polis',
    name: 'Fruit Leathers (पोळी)',
    slug: 'polis',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
    description: 'Delectable, traditional sun-brewed sweet fruit leather sheets (आंबा, फणस, जांभूळ व आवळा पोळी).',
    product_count: 4
  },
  {
    id: 'cat-pickles',
    name: 'Pickles (लोणचे)',
    slug: 'pickles',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=600',
    description: 'Immunity-packed local sour pickles prepared with wood-pressed oil or oil-free sun fermentation (लोणचे).',
    product_count: 5
  },
  {
    id: 'cat-home-products',
    name: 'Home Products & Flours (पीठ व इतर)',
    slug: 'home-products-flours',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    description: 'Aromatic homemade turmeric, mineral-rich local flours, unique spiced powders, and traditional kokum (पीठ व इतर).',
    product_count: 4
  },
  {
    id: 'cat-dairy-farms',
    name: 'Dairy & Fresh Farms (ताजे दुग्धजन्य)',
    slug: 'dairy-fresh-farms',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    description: 'Pure, grass-fed A2 cow milk, traditional hand-churned yellow ghee, and fresh village buttermilk.',
    product_count: 2
  }
];

const PRODUCT_IMAGES_MAPPING: Record<string, string[]> = {
  'prod-kulith': [
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGSIaGBgYGSAgHxofIR8aIh8fICAaHyghHSInICAeITIhJikrLi8uGiAzODMtNygtLisBCgoKDg0OGxAQGyslICUvLS03Ly0tLS0yKy0tLS0tLS0vLSstLS0tLy0tLTUvLS01LS0vLS0tLS0tLS0tLS0tLf/AABEJAJIBWQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEBgYGCgoH',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-usaliche-kulith': [
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-red-rice': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-white-rice': [
    'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-black-rice': [
    'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-small-chawali': [
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-medium-chawali': [
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-big-chawali': [
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-green-chawali': [
    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-white-chawali': [
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-green-moong': [
    'https://images.unsplash.com/photo-1585998080582-5447a285025e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-black-moong': [
    'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585998080582-5447a285025e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-varane': [
    'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1547825407-2d060104b7f8?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-kadve': [
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1547825407-2d060104b7f8?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-matki': [
    'https://images.unsplash.com/photo-1547825407-2d060104b7f8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-udid': [
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585998080582-5447a285025e?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-talele-gare': [
    'https://images.unsplash.com/photo-1564844534614-b59e5a75249a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-amba-poli': [
    'https://images.unsplash.com/photo-1595124231631-f7626920f04c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-fanas-poli': [
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1564844534614-b59e5a75249a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595124231631-f7626920f04c?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-jambhul-poli': [
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1618411640018-84405fe6b541?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595124231631-f7626920f04c?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-amla-poli': [
    'https://images.unsplash.com/photo-1618411640018-84405fe6b541?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-amba-lonche': [
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-mirchi-lonche': [
    'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-limbu-lonche': [
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-amla-lonche': [
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-ambe-halad': [
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-halad': [
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-kulith-pith': [
    'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1511216345712-67c577a79e60?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-methkut': [
    'https://images.unsplash.com/photo-1511216345712-67c577a79e60?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-kokum': [
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFhUXGBgaGRcYGBcYGBcYGhoYFxgaHRkYHSggGB4lGxcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy8lICUtLS0vLy0tLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIANkA6AMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIaE0uH',
    'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-a2-milk': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600'
  ],
  'prod-desi-ghee': [
    'https://images.unsplash.com/photo-1589733901241-5e391270fe0a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600'
  ]
};

const SEED_PRODUCTS_RAW: Product[] = [
  // Pulses & Rice
  {
    id: 'prod-kulith',
    name: 'Kulith / Horse Gram (कुळीथ)',
    description: 'Premium selected whole horse gram beans from local village farms. Highly nutritious, low in fat, and extremely rich in plant proteins and iron.',
    price: 120,
    stock: 50,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGSIaGBgYGSAgHxofIR8aIh8fICAaHyghHSInICAeITIhJikrLi8uGiAzODMtNygtLisBCgoKDg0OGxAQGyslICUvLS03Ly0tLS0yKy0tLS0tLS0vLSstLS0tLy0tLTUvLS01LS0vLS0tLS0tLS0tLS0tLf/AABEJAJIBWQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEBgYGCgoH',
    is_active: true,
    rating: 4.8,
    reviews_count: 12,
    is_best_seller: false,
    ingredients: '100% Whole Horse Gram',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-usaliche-kulith',
    name: 'Usaliche Kulith (उसळीचे कुळीथ)',
    description: 'Special split and machine-sorted horse gram selection ideal for making hot, comforting local Usal with robust village spices.',
    price: 130,
    stock: 40,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 15,
    is_best_seller: true,
    ingredients: 'Sorted Horse Gram',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-red-rice',
    name: 'Red Rice (लाल तांदूळ)',
    description: 'Heirloom unpolished red rice variety. Retains its nutritious bran layer, providing rich dietary fibers, vitamins, and a delicious nutty flavor.',
    price: 140,
    stock: 60,
    weight: '1kg',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 22,
    is_best_seller: false,
    ingredients: 'Unpolished Red Rice',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-white-rice',
    name: 'White Rice (पांढरे तांदूळ)',
    description: 'Thoroughly hand-cleaned unpolished premium white rice grown using natural village compost. Extremely light and easy to digest.',
    price: 95,
    stock: 80,
    weight: '1kg',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.6,
    reviews_count: 14,
    is_best_seller: false,
    ingredients: 'Unpolished White Rice',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-black-rice',
    name: 'Black Rice (काळे तांदूळ)',
    description: 'Highly prized organic black rice, traditionally packed with powerful antioxidants (anthocyanins), essential vitamins, and a nutty aromatic texture.',
    price: 240,
    stock: 30,
    weight: '1kg',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 18,
    is_best_seller: true,
    ingredients: 'Antioxidant-Rich Black Rice',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-small-chawali',
    name: 'Small Cowpea / Chawali (लहान चवळी)',
    description: 'Delicious small-sized Cowpeas (Black-Eyed Peas) sourced directly from village farmers. Soft, rich in proteins, and ideal for quick stews.',
    price: 85,
    stock: 45,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.5,
    reviews_count: 8,
    is_best_seller: false,
    ingredients: 'Small Cowpea Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-medium-chawali',
    name: 'Medium Cowpea / Chawali (मध्यम चवळी)',
    description: 'Standard medium-sized Cowpea beans, highly versatile and extremely nourishing. Essential staple for local sprouted bean curries.',
    price: 90,
    stock: 55,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1545114197-2decb6e03fee?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.6,
    reviews_count: 11,
    is_best_seller: false,
    ingredients: 'Medium Cowpea Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-big-chawali',
    name: 'Big Cowpea / Chawali (मोठी चवळी)',
    description: 'Highly plump, large black-eyed cowpeas. Yields a rich and delightfully satisfying creamy texture when slow-cooked.',
    price: 95,
    stock: 40,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 9,
    is_best_seller: false,
    ingredients: 'Big Cowpea Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-green-chawali',
    name: 'Green Cowpea / Chawali (हिरवी चवळी)',
    description: 'Rare, extremely sweet and green-colored cowpea variety. Loaded with natural proteins and vitamins.',
    price: 100,
    stock: 35,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.8,
    reviews_count: 7,
    is_best_seller: false,
    ingredients: 'Green Cowpea Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-white-chawali',
    name: 'White Cowpea / Chawali (पांढरी चवळी)',
    description: 'Premium whole white cowpeas, thoroughly hand-sorted for uniform size. Clean tasting and highly nutritious.',
    price: 90,
    stock: 50,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.5,
    reviews_count: 6,
    is_best_seller: false,
    ingredients: 'White Cowpeas',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-green-moong',
    name: 'Green Moong (हिरवे मूग)',
    description: 'Freshly sourced premium Green Moong from certified native farms. Hand-selected whole green beans are rich in dietary protein, dietary fiber, vitamins, and vital trace minerals. Pure, chemical-free and ideal for sprouted salads, wholesome traditional moong dal, and nutritious Indian diets.',
    price: 140,
    sale_price: 110,
    stock: 70,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1585998080582-5447a285025e?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1585998080582-5447a285025e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.8,
    reviews_count: 25,
    is_best_seller: true,
    ingredients: '100% Whole Organic Green Moong Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-black-moong',
    name: 'Black Moong (काळे मूग)',
    description: 'Traditional and rare black-colored variety of moong beans. Highly rich in fiber, iron, and minerals with an earthy aroma.',
    price: 125,
    stock: 30,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1605263445851-1773ec8f7129?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 14,
    is_best_seller: false,
    ingredients: 'Whole Black Moong',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-varane',
    name: 'Varane / Field Beans (वरणे)',
    description: 'Rustic double-beans / field beans representing authentic Konkan village food. Imparts premium thickness to cooked stews.',
    price: 105,
    stock: 40,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.6,
    reviews_count: 8,
    is_best_seller: false,
    ingredients: 'Dry Varane Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-kadve',
    name: 'Kadve Vaal / Bitter Beans (कडवे)',
    description: 'Specially harvested bitter field beans (Kadve Vaal). Sourced for preparing traditional, deeply satisfying sprouted Valachi Usal.',
    price: 120,
    stock: 35,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 19,
    is_best_seller: true,
    ingredients: 'Sun-Dried Kadve Vaal',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-matki',
    name: 'Matki / Moth Beans (मटकी)',
    description: 'Extensely nutritious dry whole matki (moth beans). Sourced from dry soil farms, yielding an wonderful taste and flavor.',
    price: 115,
    stock: 75,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1547825407-2d060104b7f8?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.8,
    reviews_count: 21,
    is_best_seller: true,
    ingredients: 'Organic Whole Moth Beans',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-udid',
    name: 'Udid / Black Gram (उडीद)',
    description: 'Whole unpolished black gram beans retaining essential fiber. High sticky-strength, delivering perfect batter consistency.',
    price: 110,
    stock: 60,
    weight: '500g',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 13,
    is_best_seller: false,
    ingredients: 'Whole Black Gram',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-talele-gare',
    name: 'Talele Gare / Fried Jackfruit Chips (तळलेले गरे)',
    description: 'Crispy, golden-fried mature jackfruit chips (तळलेले गरे), prepared cleanly in wood-pressed oils. Delectable coastal sweet & salt crunch with absolute home warmth.',
    price: 180,
    stock: 45,
    weight: '250g',
    category: 'Talele Gare (तळलेले गरे)',
    image: 'https://images.unsplash.com/photo-1564844534614-b59e5a75249a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1564844534614-b59e5a75249a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 42,
    is_best_seller: true,
    ingredients: 'Aged Jackfruit Plumps, Wood-pressed Oil, Sea Salt',
    shelf_life: '2 Months'
  },
  {
    id: 'prod-amba-poli',
    name: 'Amba Poli / Mango Leather (आंबा पोळी)',
    description: 'Pure sun-dried layers of Alphonso mango pulp pressed into rich, sweet golden sheets. Naturally sweet and chewy treat without any additives.',
    price: 150,
    stock: 50,
    weight: '250g',
    category: 'Fruit Leathers (पोळी)',
    image: 'https://images.unsplash.com/photo-1595124231631-f7626920f04c?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 36,
    is_best_seller: true,
    ingredients: 'Pure Alphonso Mango Pulp, Trace Sugar',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-fanas-poli',
    name: 'Fanas Poli / Jackfruit Leather (फणस पोळी)',
    description: 'Classic sun-dried jackfruit leather prepared from honey-ripe jackfruits. Strong and exotic sweet tropical flavor in every layered slice.',
    price: 170,
    stock: 35,
    weight: '250g',
    category: 'Fruit Leathers (पोळी)',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.8,
    reviews_count: 24,
    is_best_seller: false,
    ingredients: 'Ripe Jackfruit Pulp',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-jambhul-poli',
    name: 'Jambhul Poli / Jamun Leather (जांभूळ पोळी)',
    description: 'Medicinal and tangy sun-dried black plum (Jamun) sheets. Natural iron and digestion support in a delicious low-sugar fruit sheet.',
    price: 180,
    stock: 25,
    weight: '200g',
    category: 'Fruit Leathers (पोळी)',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 14,
    is_best_seller: false,
    ingredients: 'Sourced Jamun Pulp, Roasted Cumin, Black Salt',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-amla-poli',
    name: 'Amla Poli / Gooseberry Sheet (आवळा पोळी)',
    description: 'Fragrant sweet, sour, and spiced gooseberry sheets. Powerhouse of Vitamin-C, digestion-boosting ginger juice and jaggery.',
    price: 160,
    stock: 30,
    weight: '200g',
    category: 'Fruit Leathers (पोळी)',
    image: 'https://images.unsplash.com/photo-1618411640018-84405fe6b541?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.6,
    reviews_count: 18,
    is_best_seller: false,
    ingredients: 'Amla Pulp, Ginger Essence, Black Salt, Jaggery',
    shelf_life: '8 Months'
  },
  {
    id: 'prod-amba-lonche',
    name: 'Amba Lonche / Mango Pickle (आंबा लोणचे)',
    description: 'Sour, juicy raw mangoes diced and sun-cured, steeped under cold-pressed mustard oil with red chillies and fenugreek.',
    price: 160,
    stock: 65,
    weight: '250g',
    category: 'Pickles (लोणचे)',
    image: 'https://images.unsplash.com/photo-1633959544715-dd0b46ebae85?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 31,
    is_best_seller: true,
    ingredients: 'Sour Green Mangoes, Cold-Pressed Oil, Yellow Mustard, Fenugreek, Turmeric, Salt',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-mirchi-lonche',
    name: 'Mirchi Lonche / Chilli Pickle (मिरची लोणचे)',
    description: 'Fiery green chillies slit and salted, pickled cleanly with fresh lime extract, mustard flour, and traditional spices.',
    price: 140,
    stock: 45,
    weight: '250g',
    category: 'Pickles (लोणचे)',
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.6,
    reviews_count: 12,
    is_best_seller: false,
    ingredients: 'Spicy Local Chillies, Yellow Mustard, Lime juice, Spices, Salt',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-limbu-lonche',
    name: 'Limbu Lonche / Lemon Pickle (लिंबू लोणचे)',
    description: 'Legacy oil-free recipe. Lemons are pickled in earthen jars under direct sunlight with real jaggery, cumin and carom seeds.',
    price: 150,
    stock: 50,
    weight: '250g',
    category: 'Pickles (लोणचे)',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.8,
    reviews_count: 22,
    is_best_seller: false,
    ingredients: 'Limes, Sea Salt, Lemon Juice, Carom Seeds, Cumin, Roasted Spices',
    shelf_life: '18 Months'
  },
  {
    id: 'prod-amla-lonche',
    name: 'Amla Lonche / Gooseberry Pickle (आवळा लोणचे)',
    description: 'Tangy and vitamin-dense fresh whole gooseberries pickled in pure cold-pressed oil with red chillies, mustard, and fennel.',
    price: 170,
    stock: 40,
    weight: '250g',
    category: 'Pickles (लोणचे)',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.7,
    reviews_count: 15,
    is_best_seller: false,
    ingredients: 'Whole Amla Crops, Cold-pressed Oils, Chilli Powder, Fennel Seeds, Turmeric, Salt',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-ambe-halad',
    name: 'Ambe Halad Lonche / Mango Ginger Pickle (आंबे हळद लोणचे)',
    description: 'Extremely healthy, medicinal mango-ginger root juliennes pickled with fresh lime juice, sea salt, and split mustard seeds.',
    price: 180,
    stock: 30,
    weight: '250g',
    category: 'Pickles (लोणचे)',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 28,
    is_best_seller: true,
    ingredients: 'Fresh Mango Ginger Juliennes, Mustard Seeds, Lemon Extract, Spices, Salt',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-halad',
    name: 'Halad / Turmeric Powder (हळद)',
    description: 'Bright golden and highly aromatic pure local turmeric powder. Handcrafted from locally harvested curcuma roots with zero artificial color.',
    price: 130,
    stock: 60,
    weight: '250g',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 34,
    is_best_seller: true,
    ingredients: 'Aromatic Dried Turmeric Rhizomes',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-kulith-pith',
    name: 'Kulith Pith / Horse Gram Flour (कुळीथ पीठ)',
    description: 'Traditional slow-roasted, stone-ground horse gram flour. Perfect for preparing warm, nutritional Konkani Kulith Pithi (iron-dense comfort soup).',
    price: 140,
    stock: 45,
    weight: '500g',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.8,
    reviews_count: 22,
    is_best_seller: false,
    ingredients: 'Roasted Premium Horse Gram (Kulith)',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-methkut',
    name: 'Methkut / Spiced Lentil Powder (मेथाकूट)',
    description: 'Earthy, slow-roasted blend of lentils and grains, infused with fenugreek seeds, dry ginger, and pure asafoetida. An absolute comfort food mixed with hot rice and clarified butter.',
    price: 110,
    stock: 50,
    weight: '200g',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'https://images.unsplash.com/photo-1511216345712-67c577a79e60?auto=format&fit=crop&q=80&w=600',
    is_active: true,
    rating: 4.9,
    reviews_count: 29,
    is_best_seller: true,
    ingredients: 'Split Bengal Gram, Black Gram, Roasted Wheat, Rice, Fenugreek Seeds, Cardamom, Dry Ginger, Hing, Turmeric, Cumin, Pepper',
    shelf_life: '6 Months'
  },
  {
    id: 'prod-kokum',
    name: 'Kokum / Garcinia (कोकम)',
    description: 'Premium sun-dried, moist blackish-red Kokum skins, preserved with marine sea salt. Ideal for brewing Sol Kadhi or adding a distinct, sour element to Konkani curries.',
    price: 120,
    stock: 55,
    weight: '200g',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFhUXGBgaGRcYGBcYGBcYGhoYFxgaHRkYHSggGB4lGxcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy8lICUtLS0vLy0tLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIANkA6AMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIaE0uH',
    is_active: true,
    rating: 4.8,
    reviews_count: 40,
    is_best_seller: false,
    ingredients: 'Semi-Dried Garcinia Indica Rinds, Sea Salt',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-a2-milk',
    name: 'A2 Desi Cow Milk (ताजे ए२ गायीचे दूध)',
    description: 'Fresh, nutrient-dense glass bottle/pack organic A2 Desi Cow Milk. Directly supplied from free-grazing village cow shelters daily. Naturally creamy profile.',
    price: 90,
    stock: 120,
    weight: '1 Liter',
    category: 'Dairy & Fresh Farms (ताजे दुग्धजन्य)',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 58,
    is_best_seller: true,
    ingredients: '100% Pure Organic Raw A2 Desi Cow Milk',
    shelf_life: '2 Days (Refrigerate well)'
  },
  {
    id: 'prod-desi-ghee',
    name: 'Hand-Churned Desi Cow Ghee (शुद्ध साजूक गायीचे तूप)',
    description: 'Premium hand-churned Desi Cow Ghee made from A2 curd using the sacred vedic Bilona method. Beautifully grainy texture with highly therapeutic digestibilities.',
    price: 650,
    stock: 35,
    weight: '500ml',
    category: 'Dairy & Fresh Farms (ताजे दुग्धजन्य)',
    image: 'https://images.unsplash.com/photo-1589733901241-5e391270fe0a?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1589733901241-5e391270fe0a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 5.0,
    reviews_count: 84,
    is_best_seller: true,
    ingredients: 'Clarified A2 Cow Butter-fat',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-basmati-rice',
    name: 'Basmati Rice (बासमती तांदूळ)',
    description: 'Aromatic, aged premium long-grain Basmati rice, harvested and hand-sorted from traditional riverbed farms. Perfectly fluffy, non-sticky, and highly flavorful.',
    price: 180,
    stock: 60,
    weight: '1kg',
    category: 'Pulses & Rice (कडधान्ये व तांदूळ)',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 35,
    is_best_seller: true,
    ingredients: 'Aged basmati rice grains',
    shelf_life: '12 Months'
  },
  {
    id: 'prod-pure-jaggery',
    name: 'Pure Jaggery (सेंद्रिय गूळ)',
    description: '100% organic sugarcane jaggery block clarified naturally without any chemical clarifying agents or artificial bleaching. Beautiful golden hue and loaded with iron.',
    price: 95,
    stock: 45,
    weight: '500g',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.8,
    reviews_count: 24,
    is_best_seller: true,
    ingredients: 'Naturally clarified raw sugarcane juice',
    shelf_life: '9 Months'
  },
  {
    id: 'prod-kacchi-oil',
    name: 'Kacchi Oils (शुद्ध घाण्याचे तेल)',
    description: 'Cold-pressed traditional wood-churned groundnut oil. Extracted slowly under low temperature to retain all natural minerals, high-density lipids, and delicious nutty aroma.',
    price: 270,
    stock: 35,
    weight: '1 Liter',
    category: 'Home Products & Flours (पीठ व इतर)',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
    ],
    is_active: true,
    rating: 4.9,
    reviews_count: 42,
    is_best_seller: true,
    ingredients: '100% Wood-pressed unrefined groundnuts',
    shelf_life: '12 Months'
  }
];

const SEED_PRODUCTS: Product[] = SEED_PRODUCTS_RAW.map(p => {
  const mappedList = PRODUCT_IMAGES_MAPPING[p.id] || p.images;
  if (mappedList && mappedList.length >= 3) {
    return {
      ...p,
      image: mappedList[0],
      images: mappedList
    };
  } else {
    const cleanPrimary = p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
    return {
      ...p,
      image: cleanPrimary,
      images: [
        cleanPrimary,
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
      ]
    };
  }
});

const SEED_REVIEWS: Review[] = [];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-admin',
    full_name: 'Admin Moderator',
    email: 'admin@villageproduct.com',
    phone: '+91 8956140868',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
    orders_count: 0,
    total_spend: 0
  }
];

const SEED_ORDERS: Order[] = [];

const SEED_SETTINGS: StoreSettings = {
  store_name: 'Village Product (गावठी उत्पादन)',
  tagline: 'Premium Authentic Hand-Made Local Staples & Delicacies',
  logo: '🌾',
  contact_number: '+91 8956140868',
  whatsapp_number: '+91 8956140868',
  email: 'villageproduct480@gmail.com',
  address: 'Goval, Khalchi Wadi, Rajapur, Ratnagiri, Maharashtra, 416702',
  razorpay_key_id: 'rzp_test_VillagePro987Xy',
  upi_id: '8956140868@okaxis',
  qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=8956140868@okaxis%26pn=Gavthi%20Utpadan%26am=0%26cu=INR',
  instagram_url: 'https://instagram.com/villageproduct.authentic',
  facebook_url: 'https://facebook.com/villageproduct.authentic',
  is_store_closed: false,
  tax_percent: 0,
  shipping_cost: 20,
  delivery_0_5_cost: 20,
  delivery_5_10_cost: 40,
  delivery_10_15_cost: 60,
  delivery_15_20_cost: 100,
  free_delivery_threshold: 599,
  max_delivery_distance: 20,
  store_latitude: 16.6618,
  store_longitude: 73.5186
};

// LocalStorage simulation controllers
const getStored = <T>(key: string, seed: T): T => {
  // Use village_v9 suffix specifically for orders, customers, and reviews to start fresh (0 values)
  // while keeping products, categories and settings under village_v7 suffix to preserve user changes!
  const isDemoToClear = key === 'orders' || key === 'customers' || key === 'reviews';
  const prefix = isDemoToClear ? 'village_v9' : 'village_v7';
  
  const data = localStorage.getItem(`${prefix}_${key}`);
  if (!data) {
    localStorage.setItem(`${prefix}_${key}`, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data) as T;
};

const setStored = <T>(key: string, value: T): void => {
  const isDemoToClear = key === 'orders' || key === 'customers' || key === 'reviews';
  const prefix = isDemoToClear ? 'village_v9' : 'village_v7';
  localStorage.setItem(`${prefix}_${key}`, JSON.stringify(value));
};

// Exposed API services matching Supabase interface
export const SupabaseService = {
  // Products Management
  getProducts: async (): Promise<Product[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      // Auto-seed if Supabase products table is empty
      if (!data || data.length === 0) {
        console.log('[Supabase] Products table empty — seeding...');
        const toInsert = SEED_PRODUCTS.map(p => ({
          ...p,
          images: p.images || [p.image],
          created_at: new Date().toISOString()
        }));
        const { error: insertError } = await supabase.from('products').insert(toInsert);
        if (insertError) {
          console.error('[Supabase] Seed insert FAILED:', insertError.message, insertError.details, insertError.hint);
          // Fall back to localStorage seed
          return SEED_PRODUCTS;
        }
        console.log('[Supabase] Seeded', toInsert.length, 'products ✅');
        const { data: seeded } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        return ((seeded || []) as Product[]).map(p => ({ ...p, images: (p.images as unknown as string[])?.length > 0 ? p.images : [p.image] }));
      }

      return (data as Product[]).map(p => ({ ...p, images: (p.images as unknown as string[])?.length > 0 ? p.images : [p.image] }));
    }
    let products = getStored<Product[]>('products', SEED_PRODUCTS);
    
    // Auto-sync products with SEED_PRODUCTS to backfill new products (like milk) and updated images
    let updatedNeeded = false;
    const merged = [...products];
    for (const seed of SEED_PRODUCTS) {
      const idx = merged.findIndex(p => p.id === seed.id);
      if (idx === -1) {
        merged.push(seed);
        updatedNeeded = true;
      } else {
        const existingVal = merged[idx];
        const seedImages = seed.images || [seed.image];
        const existingImages = existingVal.images || [existingVal.image];
        
        // Dynamic image synchronizer: Automatically update product image if it has changed in SEED_PRODUCTS
        if (existingVal.image !== seed.image || JSON.stringify(existingImages) !== JSON.stringify(seedImages)) {
          merged[idx] = {
            ...existingVal,
            image: seed.image,
            images: seedImages
          };
          updatedNeeded = true;
        }

        // Ensure green moong gets its premium attributes updated if stale
        if (seed.id === 'prod-green-moong' && (existingVal.price !== seed.price)) {
          merged[idx] = {
            ...merged[idx],
            description: seed.description,
            price: seed.price,
            sale_price: seed.sale_price,
            ingredients: seed.ingredients
          };
          updatedNeeded = true;
        }
      }
    }
    
    if (updatedNeeded) {
      setStored('products', merged);
      products = merged;
    }

    return products.map(p => ({
      ...p,
      images: p.images && p.images.length > 0 ? p.images : [p.image]
    }));
  },
  
  createProduct: async (product: Omit<Product, 'id' | 'rating' | 'reviews_count'>): Promise<Product> => {
    if (isSupabaseConfigured) {
      const newProduct = { ...product, id: `prod-${Date.now()}`, rating: 5.0, reviews_count: 0 };
      const { data, error } = await supabase.from('products').insert(newProduct).select().single();
      if (error) throw error;
      return data as Product;
    }
    const products = getStored<Product[]>('products', SEED_PRODUCTS);
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviews_count: 0,
      is_best_seller: false,
      images: product.images && product.images.length > 0 ? product.images : [product.image]
    };
    products.unshift(newProduct);
    setStored('products', products);
    // Update category count
    await SupabaseService.incrementCategoryCount(product.category);
    return newProduct;
  },

  updateProduct: async (id: string, updated: Partial<Product>): Promise<Product> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').update(updated).eq('id', id).select().single();
      if (error) throw error;
      return data as Product;
    }
    const products = getStored<Product[]>('products', SEED_PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    const oldCategory = products[idx].category;
    const newProduct = { 
      ...products[idx], 
      ...updated,
      images: updated.images !== undefined ? updated.images : (products[idx].images || [products[idx].image])
    };
    products[idx] = newProduct;
    setStored('products', products);
    
    // adjust category counts if changed
    if (updated.category && updated.category !== oldCategory) {
      await SupabaseService.decrementCategoryCount(oldCategory);
      await SupabaseService.incrementCategoryCount(updated.category);
    }
    return newProduct;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const products = getStored<Product[]>('products', SEED_PRODUCTS);
    const item = products.find(p => p.id === id);
    if (!item) return false;
    const filtered = products.filter(p => p.id !== id);
    setStored('products', filtered);
    await SupabaseService.decrementCategoryCount(item.category);
    return true;
  },

  // Categories Management
  getCategories: async (): Promise<Category[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      if (!data || data.length === 0) {
        await supabase.from('categories').insert(SEED_CATEGORIES);
        const { data: seeded } = await supabase.from('categories').select('*').order('name');
        return (seeded || []) as Category[];
      }
      return data as Category[];
    }
    let categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    
    // Auto-sync categories with SEED_CATEGORIES
    let updatedNeeded = false;
    const merged = [...categories];
    for (const seed of SEED_CATEGORIES) {
      const idx = merged.findIndex(c => c.id === seed.id);
      if (idx === -1) {
        merged.push(seed);
        updatedNeeded = true;
      } else {
        const current = merged[idx];
        if (current.image !== seed.image || current.name !== seed.name || current.description !== seed.description) {
          merged[idx] = { ...current, name: seed.name, image: seed.image, description: seed.description };
          updatedNeeded = true;
        }
      }
    }
    if (updatedNeeded) {
      setStored('categories', merged);
      categories = merged;
    }
    return categories;
  },

  createCategory: async (cat: Omit<Category, 'id' | 'product_count'>): Promise<Category> => {
    const categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    const newCat: Category = {
      ...cat,
      id: `cat-${cat.slug}-${Date.now()}`,
      product_count: 0
    };
    categories.push(newCat);
    setStored('categories', categories);
    return newCat;
  },

  updateCategory: async (id: string, updated: Partial<Category>): Promise<Category> => {
    const categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    const newCat = { ...categories[idx], ...updated };
    categories[idx] = newCat;
    setStored('categories', categories);
    return newCat;
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    const categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    const filtered = categories.filter(c => c.id !== id);
    setStored('categories', filtered);
    return true;
  },

  incrementCategoryCount: async (catName: string): Promise<void> => {
    const categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (cat) {
      cat.product_count += 1;
      setStored('categories', categories);
    }
  },

  decrementCategoryCount: async (catName: string): Promise<void> => {
    const categories = getStored<Category[]>('categories', SEED_CATEGORIES);
    const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (cat && cat.product_count > 0) {
      cat.product_count -= 1;
      setStored('categories', categories);
    }
  },

  // Orders Management
  getOrders: async (): Promise<Order[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Order[];
    }
    return getStored<Order[]>('orders', SEED_ORDERS);
  },

  getUserOrders: async (email: string): Promise<Order[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('orders').select('*').eq('user_email', email.toLowerCase()).order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Order[];
    }
    const orders = getStored<Order[]>('orders', SEED_ORDERS);
    return orders.filter(o => o.user_email.toLowerCase() === email.toLowerCase());
  },

  createOrder: async (order: Omit<Order, 'id' | 'created_at' | 'tracking_updates'>): Promise<Order> => {
    const tracking_updates = [
      { status: 'pending' as OrderStatus, timestamp: new Date().toISOString(), note: 'Order placed, awaiting processing' }
    ];

    if (isSupabaseConfigured) {
      // Get current count for ID
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const id = `ord-${1000 + (count || 0) + 1}`;
      const newOrder: Order = {
        ...order,
        id,
        created_at: new Date().toISOString(),
        tracking_updates
      };
      const { error } = await supabase.from('orders').insert(newOrder);
      if (error) throw error;

      // Update customer spend and count in Supabase
      const { data: customers } = await supabase.from('customers').select('*').eq('email', order.user_email.toLowerCase());
      if (customers && customers.length > 0) {
        const cust = customers[0];
        await supabase.from('customers').update({
          orders_count: (cust.orders_count || 0) + 1,
          total_spend: (cust.total_spend || 0) + order.total_amount
        }).eq('id', cust.id);
      }

      // Deduct stock in Supabase
      for (const item of order.items) {
        const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
        if (prod) {
          await supabase.from('products').update({ stock: Math.max(0, (prod.stock || 0) - item.quantity) }).eq('id', item.product_id);
        }
      }

      return newOrder;
    }

    const orders = getStored<Order[]>('orders', SEED_ORDERS);
    const id = `ord-${1000 + orders.length + 1}`;
    const newOrder: Order = {
      ...order,
      id,
      created_at: new Date().toISOString(),
      tracking_updates
    };
    orders.unshift(newOrder);
    setStored('orders', orders);

    // Update customer spend and count
    const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
    const customer = customers.find(c => c.email.toLowerCase() === order.user_email.toLowerCase());
    if (customer) {
      customer.orders_count += 1;
      customer.total_spend += order.total_amount;
      setStored('customers', customers);
    }

    // Deduct stocks
    const products = getStored<Product[]>('products', SEED_PRODUCTS);
    order.items.forEach(item => {
      const p = products.find(prod => prod.id === item.product_id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    setStored('products', products);

    return newOrder;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus, note?: string): Promise<Order> => {
    if (isSupabaseConfigured) {
      const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (error || !order) throw new Error('Order not found');
      const updateNote = note || `Status updated to ${status}`;
      const tracking = [...(order.tracking_updates || []), { status, timestamp: new Date().toISOString(), note: updateNote }];
      const payment_status = status === 'delivered' ? 'paid' : order.payment_status;
      const { data: updated, error: updErr } = await supabase.from('orders').update({ status, payment_status, tracking_updates: tracking }).eq('id', orderId).select().single();
      if (updErr) throw updErr;
      return updated as Order;
    }
    const orders = getStored<Order[]>('orders', SEED_ORDERS);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    const order = orders[idx];
    order.status = status;
    if (status === 'delivered') {
      order.payment_status = 'paid';
    }
    const updateNote = note || `Status updated to ${status}`;
    order.tracking_updates = order.tracking_updates || [];
    order.tracking_updates.push({
      status,
      timestamp: new Date().toISOString(),
      note: updateNote
    });
    orders[idx] = order;
    setStored('orders', orders);
    return order;
  },

  deleteOrder: async (orderId: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;

      // Adjust customer spend and count
      if (order) {
        const { data: customers } = await supabase.from('customers').select('*').eq('email', order.user_email?.toLowerCase());
        if (customers && customers.length > 0) {
          const cust = customers[0];
          await supabase.from('customers').update({
            orders_count: Math.max(0, (cust.orders_count || 0) - 1),
            total_spend: Math.max(0, (cust.total_spend || 0) - (order.total_amount || 0))
          }).eq('id', cust.id);
        }
      }
      return true;
    }
    const orders = getStored<Order[]>('orders', SEED_ORDERS);
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;
    const filtered = orders.filter(o => o.id !== orderId);
    setStored('orders', filtered);

    // Adjust customer spend and count
    const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
    const customer = customers.find(c => c.email.toLowerCase() === order.user_email.toLowerCase());
    if (customer) {
      customer.orders_count = Math.max(0, customer.orders_count - 1);
      customer.total_spend = Math.max(0, customer.total_spend - order.total_amount);
      setStored('customers', customers);
    }
    return true;
  },

  clearAllOrders: async (): Promise<boolean> => {
    if (isSupabaseConfigured) {
      await supabase.from('orders').delete().neq('id', '');
      // Reset all customer spend and counts
      await supabase.from('customers').update({ orders_count: 0, total_spend: 0 }).neq('id', '');
      return true;
    }
    setStored('orders', []);
    
    // Reset all customer spend and counts since orders are deleted
    const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
    const resetCustomers = customers.map(c => ({
      ...c,
      orders_count: 0,
      total_spend: 0
    }));
    setStored('customers', resetCustomers);
    return true;
  },

  // Customers Management
  getCustomers: async (): Promise<Customer[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        // Seed admin customer
        try { await supabase.from('customers').insert(SEED_CUSTOMERS); } catch (_) { /* ignore duplicate */ }
        const { data: seeded } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        return (seeded || []) as Customer[];
      }
      return data as Customer[];
    }
    return getStored<Customer[]>('customers', SEED_CUSTOMERS);
  },

  // Reviews Management
  getReviews: async (): Promise<Review[]> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Review[];
    }
    return getStored<Review[]>('reviews', SEED_REVIEWS);
  },

  addReview: async (productId: string, productName: string, userName: string, rating: number, comment: string): Promise<Review> => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      product_name: productName,
      user_name: userName || 'Anonymous Guest',
      rating,
      comment,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reviews').insert(newReview);
      if (error) throw error;
      return newReview;
    }
    const reviews = getStored<Review[]>('reviews', SEED_REVIEWS);
    reviews.unshift(newReview);
    setStored('reviews', reviews);
    return newReview;
  },

  approveReview: async (id: string): Promise<Review> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
      if (error) throw error;
      const { data: review } = await supabase.from('reviews').select('*').eq('id', id).single();
      if (!review) throw new Error('Review not found');

      // Recalculate product rating in Supabase
      const { data: allReviews } = await supabase.from('reviews').select('*').eq('product_id', review.product_id).eq('status', 'approved');
      if (allReviews && allReviews.length > 0) {
        const sum = allReviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
        const avgRating = Number((sum / allReviews.length).toFixed(1));
        await supabase.from('products').update({ rating: avgRating, reviews_count: allReviews.length }).eq('id', review.product_id);
      }
      return review as Review;
    }
    const reviews = getStored<Review[]>('reviews', SEED_REVIEWS);
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'approved';
    setStored('reviews', reviews);

    // Recalculate product rating
    const products = getStored<Product[]>('products', SEED_PRODUCTS);
    const pIdx = products.findIndex(p => p.id === reviews[idx].product_id);
    if (pIdx !== -1) {
      const prodRes = reviews.filter(r => r.product_id === products[pIdx].id && r.status === 'approved');
      const sum = prodRes.reduce((acc, r) => acc + r.rating, 0);
      products[pIdx].rating = sum > 0 ? Number((sum / prodRes.length).toFixed(1)) : 5.0;
      products[pIdx].reviews_count = prodRes.length;
      setStored('products', products);
    }

    return reviews[idx];
  },

  rejectReview: async (id: string): Promise<Review> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
      if (error) throw error;
      const { data: review } = await supabase.from('reviews').select('*').eq('id', id).single();
      if (!review) throw new Error('Review not found');
      return review as Review;
    }
    const reviews = getStored<Review[]>('reviews', SEED_REVIEWS);
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Review not found');
    reviews[idx].status = 'rejected';
    setStored('reviews', reviews);
    return reviews[idx];
  },

  deleteReview: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const reviews = getStored<Review[]>('reviews', SEED_REVIEWS);
    const filtered = reviews.filter(r => r.id !== id);
    setStored('reviews', filtered);
    return true;
  },

  // Settings
  getStoreSettings: async (): Promise<StoreSettings> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (error || !data) {
        return SEED_SETTINGS;
      }
      // Map individual DB columns to StoreSettings type
      const row = data as Record<string, unknown>;
      return {
        store_name: (row.store_name as string) || SEED_SETTINGS.store_name,
        tagline: (row.tagline as string) || SEED_SETTINGS.tagline,
        logo: (row.logo as string) || SEED_SETTINGS.logo,
        contact_number: (row.contact_number as string) || SEED_SETTINGS.contact_number,
        whatsapp_number: (row.whatsapp_number as string) || SEED_SETTINGS.whatsapp_number,
        email: (row.email as string) || SEED_SETTINGS.email,
        address: (row.address as string) || SEED_SETTINGS.address,
        razorpay_key_id: (row.razorpay_key_id as string) || SEED_SETTINGS.razorpay_key_id,
        upi_id: (row.upi_id as string) || SEED_SETTINGS.upi_id,
        qr_code_url: (row.qr_code_url as string) || SEED_SETTINGS.qr_code_url,
        instagram_url: (row.instagram_url as string) || SEED_SETTINGS.instagram_url,
        facebook_url: (row.facebook_url as string) || SEED_SETTINGS.facebook_url,
        is_store_closed: Boolean(row.is_store_closed),
        tax_percent: Number(row.tax_percent) || 0,
        shipping_cost: Number(row.shipping_cost) || SEED_SETTINGS.shipping_cost,
        delivery_0_5_cost: Number(row.delivery_0_5_cost) || SEED_SETTINGS.delivery_0_5_cost,
        delivery_5_10_cost: Number(row.delivery_5_10_cost) || SEED_SETTINGS.delivery_5_10_cost,
        delivery_10_15_cost: Number(row.delivery_10_15_cost) || SEED_SETTINGS.delivery_10_15_cost,
        delivery_15_20_cost: Number(row.delivery_15_20_cost) || SEED_SETTINGS.delivery_15_20_cost,
        free_delivery_threshold: Number(row.free_delivery_threshold) || SEED_SETTINGS.free_delivery_threshold,
        max_delivery_distance: Number(row.max_delivery_distance) || SEED_SETTINGS.max_delivery_distance,
        store_latitude: Number(row.store_latitude) || SEED_SETTINGS.store_latitude,
        store_longitude: Number(row.store_longitude) || SEED_SETTINGS.store_longitude,
      };
    }
    return getStored<StoreSettings>('settings', SEED_SETTINGS);
  },

  updateStoreSettings: async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
    if (isSupabaseConfigured) {
      // Read current settings from DB
      const { data: existing } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      const row = (existing || {}) as Record<string, unknown>;
      const current: StoreSettings = {
        store_name: (row.store_name as string) || SEED_SETTINGS.store_name,
        tagline: (row.tagline as string) || SEED_SETTINGS.tagline,
        logo: (row.logo as string) || SEED_SETTINGS.logo,
        contact_number: (row.contact_number as string) || SEED_SETTINGS.contact_number,
        whatsapp_number: (row.whatsapp_number as string) || SEED_SETTINGS.whatsapp_number,
        email: (row.email as string) || SEED_SETTINGS.email,
        address: (row.address as string) || SEED_SETTINGS.address,
        razorpay_key_id: (row.razorpay_key_id as string) || SEED_SETTINGS.razorpay_key_id,
        upi_id: (row.upi_id as string) || SEED_SETTINGS.upi_id,
        qr_code_url: (row.qr_code_url as string) || SEED_SETTINGS.qr_code_url,
        instagram_url: (row.instagram_url as string) || SEED_SETTINGS.instagram_url,
        facebook_url: (row.facebook_url as string) || SEED_SETTINGS.facebook_url,
        is_store_closed: Boolean(row.is_store_closed),
        tax_percent: Number(row.tax_percent) || 0,
        shipping_cost: Number(row.shipping_cost) || SEED_SETTINGS.shipping_cost,
        delivery_0_5_cost: Number(row.delivery_0_5_cost) || SEED_SETTINGS.delivery_0_5_cost,
        delivery_5_10_cost: Number(row.delivery_5_10_cost) || SEED_SETTINGS.delivery_5_10_cost,
        delivery_10_15_cost: Number(row.delivery_10_15_cost) || SEED_SETTINGS.delivery_10_15_cost,
        delivery_15_20_cost: Number(row.delivery_15_20_cost) || SEED_SETTINGS.delivery_15_20_cost,
        free_delivery_threshold: Number(row.free_delivery_threshold) || SEED_SETTINGS.free_delivery_threshold,
        max_delivery_distance: Number(row.max_delivery_distance) || SEED_SETTINGS.max_delivery_distance,
        store_latitude: Number(row.store_latitude) || SEED_SETTINGS.store_latitude,
        store_longitude: Number(row.store_longitude) || SEED_SETTINGS.store_longitude,
      };
      const merged = { ...current, ...settings };
      // Update individual columns
      await supabase.from('store_settings').update({
        store_name: merged.store_name,
        tagline: merged.tagline,
        logo: merged.logo,
        contact_number: merged.contact_number,
        whatsapp_number: merged.whatsapp_number,
        email: merged.email,
        address: merged.address,
        razorpay_key_id: merged.razorpay_key_id,
        upi_id: merged.upi_id,
        qr_code_url: merged.qr_code_url,
        instagram_url: merged.instagram_url,
        facebook_url: merged.facebook_url,
        is_store_closed: merged.is_store_closed,
        tax_percent: merged.tax_percent,
        shipping_cost: merged.shipping_cost,
        delivery_0_5_cost: merged.delivery_0_5_cost,
        delivery_5_10_cost: merged.delivery_5_10_cost,
        delivery_10_15_cost: merged.delivery_10_15_cost,
        delivery_15_20_cost: merged.delivery_15_20_cost,
        free_delivery_threshold: merged.free_delivery_threshold,
        max_delivery_distance: merged.max_delivery_distance,
        store_latitude: merged.store_latitude,
        store_longitude: merged.store_longitude,
      }).eq('id', 1);
      return merged;
    }
    const old = getStored<StoreSettings>('settings', SEED_SETTINGS);
    const news = { ...old, ...settings };
    setStored('settings', news);
    return news;
  },

  // Auth Management
  getCurrentUser: (): UserProfile | null => {
    const stored = localStorage.getItem('village_current_user');
    return stored ? JSON.parse(stored) : null;
  },

  signIn: async (email: string, passwordHash: string): Promise<UserProfile> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: passwordHash,
      });
      if (error) throw new Error(error.message);

      const userId = data.user.id;
      const userEmail = data.user.email || '';

      // Try to read profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile is MISSING (trigger never fired), auto-create it now
      if (profileError || !profile) {
        console.warn('[Supabase] Profile missing for user', userId, '— auto-creating...');
        const meta = data.user.user_metadata || {};
        const { error: createErr } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: meta.full_name || userEmail.split('@')[0],
          email: userEmail,
          phone: meta.phone || '',
          role: meta.role || 'customer',
          saved_addresses: [],
        });

        // Retry without email column if it doesn't exist
        if (createErr) {
          console.warn('[Supabase] Auto-create profile with email failed, retrying:', createErr.message);
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: meta.full_name || userEmail.split('@')[0],
            phone: meta.phone || '',
            role: meta.role || 'customer',
            saved_addresses: [],
          });
        }

        // Re-fetch the freshly created profile
        const { data: freshProfile, error: freshErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (freshErr || !freshProfile) throw new Error('Profile auto-creation failed. Please contact support.');

        const userProfile: UserProfile = {
          id: userId,
          full_name: freshProfile.full_name || '',
          email: userEmail,
          phone: freshProfile.phone || '',
          role: freshProfile.role || 'customer',
          saved_addresses: freshProfile.saved_addresses || [],
        };

        // Ensure customers row
        const { data: existingCust } = await supabase.from('customers').select('id').eq('email', userEmail.toLowerCase()).limit(1);
        if (!existingCust || existingCust.length === 0) {
          try {
            await supabase.from('customers').insert({
              id: userId,
              full_name: freshProfile.full_name || '',
              email: userEmail.toLowerCase(),
              phone: freshProfile.phone || '',
              role: freshProfile.role || 'customer',
              orders_count: 0,
              total_spend: 0,
              created_at: new Date().toISOString()
            });
          } catch (_) { /* ignore */ }
        }

        localStorage.setItem('village_current_user', JSON.stringify(userProfile));
        return userProfile;
      }

      // Profile exists — normal flow
      const userProfile: UserProfile = {
        id: userId,
        full_name: profile.full_name || '',
        email: userEmail,
        phone: profile.phone || '',
        role: profile.role || 'customer',
        saved_addresses: profile.saved_addresses || [],
      };

      // Ensure a customers row exists for this user
      const { data: existingCust } = await supabase.from('customers').select('id').eq('email', userEmail.toLowerCase()).limit(1);
      if (!existingCust || existingCust.length === 0) {
        try {
          await supabase.from('customers').insert({
            id: userId,
            full_name: profile.full_name || '',
            email: userEmail.toLowerCase(),
            phone: profile.phone || '',
            role: profile.role || 'customer',
            orders_count: 0,
            total_spend: 0,
            created_at: new Date().toISOString()
          });
        } catch (_) { /* ignore duplicate */ }
      }

      localStorage.setItem('village_current_user', JSON.stringify(userProfile));
      return userProfile;
    }

    // --- localStorage mock fallback ---
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === 'admin@villageproduct.com') {
      if (passwordHash !== 'village@135') throw new Error('Incorrect password for Administrator.');
      const profile: UserProfile = {
        id: 'cust-admin', full_name: 'Admin Moderator',
        email: 'admin@villageproduct.com', phone: '+91 8956140868',
        role: 'admin', saved_addresses: []
      };
      localStorage.setItem('village_current_user', JSON.stringify(profile));
      return profile;
    }
    const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
    const found = customers.find(c => c.email.toLowerCase() === lowerEmail);
    if (!found) throw new Error('No account found under this email. Please register first.');
    const registeredPwd = localStorage.getItem(`village_pwd_${lowerEmail}`);
    if (registeredPwd && passwordHash !== registeredPwd) throw new Error('Incorrect password. Please try again.');
    const profile: UserProfile = {
      id: found.id, full_name: found.full_name, email: found.email,
      phone: found.phone, role: found.role, saved_addresses: []
    };
    localStorage.setItem('village_current_user', JSON.stringify(profile));
    return profile;
  },

  signUp: async (fullName: string, email: string, phone: string, passwordHash: string): Promise<UserProfile> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: passwordHash,
        options: {
          data: { full_name: fullName, phone, role: 'customer' }
        }
      });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Sign up failed. Please try again.');

      const userId = data.user.id;

      // Explicitly upsert profile with ALL fields including email
      // This is the primary write — we don't rely on the trigger alone
      const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: fullName,
        email: email.toLowerCase(),
        phone,
        role: 'customer',
        saved_addresses: [],
      });

      // If upsert failed (e.g. email column missing), try without email
      if (upsertErr) {
        console.warn('[Supabase] Profile upsert with email failed, retrying without email column:', upsertErr.message);
        const { error: retryErr } = await supabase.from('profiles').upsert({
          id: userId,
          full_name: fullName,
          phone,
          role: 'customer',
          saved_addresses: [],
        });
        if (retryErr) {
          console.error('[Supabase] Profile upsert FAILED completely:', retryErr.message);
          throw new Error('Could not save profile to database: ' + retryErr.message);
        }
      }

      // Also insert into customers table so orders/reviews can find this user
      try {
        await supabase.from('customers').insert({
          id: userId,
          full_name: fullName,
          email: email.toLowerCase(),
          phone,
          role: 'customer',
          orders_count: 0,
          total_spend: 0,
          created_at: new Date().toISOString()
        });
      } catch (_) { /* ignore if already exists */ }

      const userProfile: UserProfile = {
        id: userId, full_name: fullName,
        email: email.toLowerCase(), phone, role: 'customer', saved_addresses: []
      };
      return userProfile;
    }

    // --- localStorage mock fallback ---
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === 'admin@villageproduct.com') throw new Error('This email address is reserved.');
    const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
    if (customers.some(c => c.email.toLowerCase() === lowerEmail)) throw new Error('An account with this email already exists.');
    const newId = `cust-${Date.now()}`;
    customers.push({ id: newId, full_name: fullName, email: lowerEmail, phone, role: 'customer', created_at: new Date().toISOString(), orders_count: 0, total_spend: 0 });
    setStored('customers', customers);
    localStorage.setItem(`village_pwd_${lowerEmail}`, passwordHash);
    const profile: UserProfile = { id: newId, full_name: fullName, email: lowerEmail, phone, role: 'customer', saved_addresses: [] };
    localStorage.setItem('village_current_user', JSON.stringify(profile));
    return profile;
  },

  signOut: async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('village_current_user');
  },

  updateProfile: async (id: string, updated: { full_name: string; phone: string; saved_addresses?: UserProfile['saved_addresses'] }): Promise<UserProfile> => {
    const user = SupabaseService.getCurrentUser();
    if (!user || user.id !== id) throw new Error('Unauthenticated');

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('profiles').update({
        full_name: updated.full_name,
        phone: updated.phone,
        saved_addresses: updated.saved_addresses ?? user.saved_addresses,
      }).eq('id', id);
      if (error) throw error;
    }

    const updatedUser: UserProfile = {
      ...user,
      full_name: updated.full_name,
      phone: updated.phone,
      saved_addresses: updated.saved_addresses !== undefined ? updated.saved_addresses : user.saved_addresses
    };
    localStorage.setItem('village_current_user', JSON.stringify(updatedUser));

    if (!isSupabaseConfigured) {
      const customers = getStored<Customer[]>('customers', SEED_CUSTOMERS);
      const idx = customers.findIndex(c => c.id === id);
      if (idx !== -1) { customers[idx].full_name = updated.full_name; customers[idx].phone = updated.phone; setStored('customers', customers); }
    }

    return updatedUser;
  }
};
