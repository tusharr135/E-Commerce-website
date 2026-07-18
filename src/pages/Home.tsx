import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Search, Star, Percent, ShieldCheck, Truck, Award, 
  Leaf, Zap, Sparkles, Check, TrendingUp, Clock, Gift, Tag, ChevronLeft, ChevronRight, MessageSquare 
} from 'lucide-react';

export default function Home() {
  const { products, categories, loadProducts, loadCategories, setSearchQuery, setSelectedCategory, addToast } = useStore();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [activeOfferIdx, setActiveOfferIdx] = useState(0);

  useEffect(() => {
    loadProducts();
    loadCategories();
    window.scrollTo(0, 0);
  }, [loadProducts, loadCategories]);

  // Offers data list for slider banner
  const offers = [
    {
      id: 'offer-1',
      title: 'PULSE FESTIVAL: FLAT 10% OFF',
      desc: 'Buy any heirloom pulses and save an extra 10% instantly.',
      code: 'VILLAGE10',
      tag: 'Pulses Special',
      bgGradient: 'from-[#15803D] to-[#22C55E]',
      accentColor: 'text-[#F59E0B]',
      actionQuery: 'Pulses'
    },
    {
      id: 'offer-2',
      title: 'FREE EXPRESS DOORSTEP DELIVERY',
      desc: 'Get free, moisture-proof delivery above ₹499.',
      code: 'FREE499',
      tag: 'Zero Delivery Fee',
      bgGradient: 'from-[#15803D] to-[#22C55E]',
      accentColor: 'text-[#F59E0B]',
      actionQuery: ''
    },
    {
      id: 'offer-3',
      title: 'FRESH SUMMER HARVEST BATCH',
      desc: 'Natural unpolished grains direct from local cooperative farm silos.',
      code: 'HARVEST100',
      tag: 'Pure Organic',
      bgGradient: 'from-[#15803D] to-[#22C55E]',
      accentColor: 'text-[#F59E0B]',
      actionQuery: 'Grains'
    }
  ];

  // Auto scroll offers banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOfferIdx((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [offers.length]);

  // Popular searches handler
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setSelectedCategory('');
    addToast(`Searching for "${term}"`, 'success');
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  // Search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setSelectedCategory('');
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Quick category actions mapping to DB category or dynamic routing
  const quickCategories = [
    { name: 'Pulses & Rice', emoji: '🌾', label: 'Pulses & Rice', queryName: 'Pulses & Rice (कडधान्ये व तांदूळ)', image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGSIaGBgYGSAgHxofIR8aIh8fICAaHyghHSInICAeITIhJikrLi8uGiAzODMtNygtLisBCgoKDg0OGxAQGyslICUvLS03Ly0tLS0yKy0tLS0tLS0vLSstLS0tLy0tLTUvLS01LS0vLS0tLS0tLS0tLS0tLf/AABEJAJIBWQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEBgYGCgoH' },
    { name: 'Talele Gare', emoji: '🍘', label: 'Talele Gare', queryName: 'Talele Gare (तळलेले गरे)', image: 'https://images.unsplash.com/photo-1564844334614-b59e5a75249a?auto=format&fit=crop&q=80&w=200' },
    { name: 'Fruit Leathers', emoji: '🥭', label: 'Fruit Leathers', queryName: 'Fruit Leathers (पोळी)', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=200' },
    { name: 'Pickles', emoji: '🍯', label: 'Pickles', queryName: 'Pickles (लोणचे)', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=200' },
    { name: 'Home Products & Flours', emoji: '🌽', label: 'Home Products', queryName: 'Home Products & Flours (पीठ व इतर)', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
    { name: 'Dairy & Fresh Farms', emoji: '🥛', label: 'Dairy & Ghee', queryName: 'Dairy & Fresh Farms (ताजे दुग्धजन्य)', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200' }
  ];

  const handleCategoryClick = (catName: string, fallbackSlug: string) => {
    // Try to matches either DB category name or fallback Slug
    const actualCat = categories.find(c => c.name.toLowerCase().includes(catName.toLowerCase()) || c.name === fallbackSlug);
    if (actualCat) {
      setSelectedCategory(actualCat.name);
      setSearchQuery('');
      navigate(`/products?category=${encodeURIComponent(actualCat.name)}`);
    } else {
      setSelectedCategory(fallbackSlug);
      setSearchQuery('');
      navigate(`/products?category=${encodeURIComponent(fallbackSlug)}`);
    }
  };

  // Products filtering
  const activeProducts = products.filter(p => p.is_active);
  const featuredProducts = activeProducts.slice(0, 8);
  const bestSellers = activeProducts.filter(p => p.is_best_seller).slice(0, 4);
  const newArrivals = [...activeProducts].reverse().slice(0, 4);

  // High-trust verified social reviews
  const reviews = [
    {
      id: 1,
      name: 'Rohan Deshmukh',
      role: 'Homemaker, Pune',
      stars: 5,
      comment: 'The unpolished local red rice and Amba Poli tasted exactly like the stone-dried layers my grandmother used to pack for us. Pure nostalgia!',
      productRef: 'Heirloom Rice Varieties'
    },
    {
      id: 2,
      name: 'Kavitha Ramaswamy',
      role: 'Nutritionist, Bangalore',
      stars: 5,
      comment: 'Finally found authentic chemical-free unpolished pulses. Traditional slow stone-milled moong retaining perfect outer nutrient shells.',
      productRef: 'Organic Moong Grains'
    },
    {
      id: 3,
      name: 'Dr. Alok Sen',
      role: 'Ayurveda Specialist',
      stars: 5,
      comment: 'Their wood cold-pressed oils are incredibly pristine and aromatic. Highly recommend their sun-cured pickles formulated without any high toxic acids.',
      productRef: 'Kacchi Ghani Mustard Oil'
    }
  ];

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-16 flex flex-col gap-8 sm:gap-12 pb-12 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ================================= HERO SECTION ================================= */}
      <section 
        style={{ background: 'linear-gradient(180deg, #FFFFFF, #F0FDF4)' }} 
        className="py-8 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 relative overflow-hidden"
      >
        
        {/* Subtle background circles */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-emerald-50 opacity-40 blur-3xl -z-10" />
        <div className="absolute left-1/4 bottom-0 w-72 h-72 rounded-full bg-amber-50 opacity-30 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10">



          {/* ================================= HERO COLUMNS ================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* HERO LEFT SIDE */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-200/50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  🌿 100% Authentic Village Products
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight sm:leading-none tracking-tight text-[#111827]">
                Fresh Village Products <br />
                <span className="text-[#15803D]">
                  Delivered to Your Doorstep
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                Homemade foods, spices, grains, pulses, pickles, oils and traditional products 
                directly from trusted village producers. Rediscover authentic chemical-free nutrition.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-sans font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#shop-by-category"
                  className="px-6 py-3 bg-white hover:bg-[#F0FDF4] text-slate-700 hover:text-[#15803D] border border-gray-200 hover:border-[#15803D]/20 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
                >
                  View Categories
                </a>
              </div>
            </div>

            {/* HERO RIGHT SIDE - PROFESSIONAL COLLAGE ONLY */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex flex-col gap-6">
              
              {/* Compact Professional Collage */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-100 font-sans">
                
                <div className="space-y-2">
                <Link to="/product/prod-basmati-rice" className="block relative group overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50 cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=250" 
                    alt="Basmati Rice" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Basmati Rice</span>
                  </div>
                </Link>
                <Link to="/product/prod-kulith" className="block relative group overflow-hidden rounded-2xl aspect-square bg-slate-50 cursor-pointer">
                  <img 
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGSIaGBgYGSAgHxofIR8aIh8fICAaHyghHSInICAeITIhJikrLi8uGiAzODMtNygtLisBCgoKDg0OGxAQGyslICUvLS03Ly0tLS0yKy0tLS0tLS0vLSstLS0tLy0tLTUvLS01LS0vLS0tLS0tLS0tLS0tLf/AABEJAJIBWQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEBgYGCgoH" 
                    alt="Local Pulses" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Local Pulses</span>
                  </div>
                </Link>
              </div>

              <div className="space-y-2 pt-2">
                <Link to="/product/prod-kokum" className="block relative group overflow-hidden rounded-2xl aspect-square bg-slate-50 cursor-pointer">
                  <img 
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFhUXGBgaGRcYGBcYGBcYGhoYFxgaHRkYHSggGB4lGxcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy8lICUtLS0vLy0tLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIANkA6AMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIaE0uH" 
                    alt="Garcinia" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Garcinia</span>
                  </div>
                </Link>
                <Link to="/product/prod-amla-lonche" className="block relative group overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50 cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=250" 
                    alt="Gooseberry Pickle" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Gooseberry Pickle</span>
                  </div>
                </Link>
              </div>

              <div className="space-y-2">
                <Link to="/product/prod-pure-jaggery" className="block relative group overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50 cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=250" 
                    alt="Pure Jaggery" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Pure Jaggery</span>
                  </div>
                </Link>
                <Link to="/product/prod-kacchi-oil" className="block relative group overflow-hidden rounded-2xl aspect-square bg-slate-50 cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=250" 
                    alt="Kacchi Oils" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-2">
                    <span className="text-[10px] font-extrabold text-white">Kacchi Oils</span>
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

      {/* ================================= OFFERS SECTION ================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-md">
          
          {/* Animated Carousel Slide Frame */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOfferIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className={`bg-gradient-to-r ${offers[activeOfferIdx].bgGradient} p-6 sm:p-10 lg:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative`}
            >
              {/* Background decorative graphic */}
              <div className="absolute right-10 bottom-0 opacity-10 pointer-events-none">
                <Leaf className="h-44 w-44 rotate-12 text-white" />
              </div>

              <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                    {offers[activeOfferIdx].tag}
                  </span>
                  <span className="text-xs text-amber-300 font-bold flex items-center gap-0.5">
                    <Gift className="h-3 w-3.5" /> Special Direct Coupon
                  </span>
                </div>
                
                <h3 className="font-display font-black text-2xl sm:text-3xl leading-snug tracking-tight text-white">
                  {offers[activeOfferIdx].title}
                </h3>
                
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
                  {offers[activeOfferIdx].desc}
                </p>
              </div>

              {/* Action coupon column */}
              <div className="flex flex-col items-center gap-2 SM:items-end justify-center">
                <div className="bg-white/10 border border-white/25 border-dashed rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-200">CODE:</span>
                  <span className="font-mono text-base font-black text-amber-300 tracking-wide">
                    {offers[activeOfferIdx].code}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    if (offers[activeOfferIdx].actionQuery) {
                      handlePopularSearch(offers[activeOfferIdx].actionQuery);
                    } else {
                      navigate('/products');
                    }
                  }}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-[#111827] font-sans font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md mt-1 cursor-pointer border-none flex items-center gap-1.5"
                >
                  <span>Apply Offer</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Slider dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {offers.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveOfferIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 shadow ${
                  activeOfferIdx === i ? 'w-5 bg-white' : 'w-2 bg-white/40'
                }`}
                title={`Offer banner ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ================================= SHOP BY CATEGORY ================================= */}
      <section id="shop-by-category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 w-full pt-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Fresh Village Basins
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <span>Shop By Category</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
              6 Fresh Departments Sourced Above Fold
            </span>
          </h2>
        </div>

        {/* BigBasket / Blinkit Circle Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name, cat.queryName)}
              className="bg-white hover:bg-[#F0FDF4] border border-gray-200 hover:border-emerald-400/40 rounded-2xl p-3 flex flex-col items-center text-center justify-between gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer group hover:-translate-y-1"
            >
              <div className="relative h-16 w-16 sm:h-18 sm:w-18 rounded-full overflow-hidden border-2 border-[#DCFCE7] shadow-sm bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <span className="absolute text-lg sm:text-xl bottom-1 right-1 bg-white/90 p-0.5 rounded-full select-none shadow">
                  {cat.emoji}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-xs text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                  {cat.label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">Explore Range</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================= FEATURED PRODUCTS ================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
              <Zap className="h-3 w-3.5 text-amber-500 animate-pulse fill-amber-500" /> Farmers Special Selection
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Featured Village Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-sans font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <span>View All ({products.length} Items)</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Grid layout */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-slate-100 rounded-3xl h-64 border border-slate-150" />
            ))}
          </div>
        )}
      </section>

      {/* ================================= DEEP TRUST SECTION ================================= */}
      <section className="bg-slate-50 border-y border-slate-100 py-10 px-4 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="bg-emerald-50 p-2 text-emerald-800 rounded-xl shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Fast Courier Logistis</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Dispatched within 24-48 hours with direct transit trackings.</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="bg-emerald-50 p-2 text-emerald-800 rounded-xl shrink-0">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">100% Farm Fresh</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Absolute chemical-free grains irrigated by pure direct river soils.</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="bg-emerald-50 p-2 text-emerald-800 rounded-xl shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Secure Integrations</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Encrypted pay gateways on card, UPI, net bank or cash checkouts.</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
            <div className="bg-emerald-50 p-2 text-emerald-800 rounded-xl shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Heritage Assurances</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Certified traditional recipes milled slowly without burning nutrients.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================================= BEST SELLERS ================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500 animate-pulse" /> Top Organic Hits
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Best Selling Grains
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-sans font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Best Grains</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            activeProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ================================= NEW ARRIVALS ================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-teal-600 animate-spin-slow" /> Brand New Grains
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              New Arrivals Sourced Directly
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-sans font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse New Additions</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            activeProducts.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ================================= CUSTOMER REVIEWS ================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 w-full pt-4">
        <div className="flex flex-col gap-1 items-center text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <MessageSquare className="h-3 w-3" /> Community Feedback
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Loved By Families Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Read certified reflections from verified shoppers who prioritize ancient grain health and absolute kitchen purity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
          {reviews.map((r) => (
            <div 
              key={r.id} 
              className="bg-white hover:bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between gap-5 transition-all hover:shadow hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-1">
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 font-sans text-xs sm:text-[13px] leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="border-t border-slate-50 pt-4 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-slate-900 leading-tight">{r.name}</h5>
                  <span className="text-[10px] text-slate-450">{r.role}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-sans font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-150">
                  {r.productRef}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
