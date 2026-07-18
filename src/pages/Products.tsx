import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2, Tag, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loadProducts, loadCategories, isProductsLoading } = useStore();

  // local filter states synchronized with search parameters
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-low, price-high
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize data
  useEffect(() => {
    loadProducts();
    loadCategories();
    window.scrollTo(0, 0);
  }, [loadProducts, loadCategories]);

  // Read initial query category
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Sync category param with URL if selected
  const handleCategorySelect = (catName: string) => {
    const freshCat = selectedCategory === catName ? '' : catName;
    setSelectedCategory(freshCat);
    if (freshCat) {
      setSearchParams({ category: freshCat });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('');
    setMaxPrice(500);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter and sort items locally
  const filteredProducts = products
    .filter((p) => p.is_active)
    .filter((p) => {
      // Search
      const matchesSearch =
        p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(localSearch.toLowerCase());
      
      // Category
      const matchesCategory = selectedCategory ? p.category.toLowerCase() === selectedCategory.toLowerCase() : true;
      
      // Price
      const activePrice = p.sale_price !== undefined ? p.sale_price : p.price;
      const matchesPrice = activePrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const aPrice = a.sale_price !== undefined ? a.sale_price : a.price;
      const bPrice = b.sale_price !== undefined ? b.sale_price : b.price;

      if (sortBy === 'price-low') return aPrice - bPrice;
      if (sortBy === 'price-high') return bPrice - aPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default / popularity (combines best sellers with more ratings count)
      return b.reviews_count - a.reviews_count;
    });

  return (
    <div id="products-catalog-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title panel */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-emerald-950 tracking-tight">
            Our Village Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse authentic handmade grocery batches. Prepared fresh and sent straight to your family's kitchen.
          </p>
        </div>

        {/* Toolbar panel */}
        <div id="product-actions-toolbar" className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
          {/* Search container */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="search-input-box"
              type="text"
              placeholder="Search pulses, organic rice, fruit leathers, pickles..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl text-xs sm:text-sm"
            />
            {localSearch && (
              <button
                id="search-clear-btn"
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Sorting controls */}
            <div className="relative flex-1 sm:flex-none flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 gap-1.5 min-w-[150px]">
              <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                id="sorting-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none w-full cursor-pointer font-sans"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Reviews Rating</option>
              </select>
            </div>

            {/* Mobile filters toggler */}
            <button
              id="mobile-filters-trigger"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Content layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* A. Desktop filters sidebar panel */}
          <aside id="desktop-filters-sidebar" className="hidden lg:flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-max sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" /> Filter Store
              </h3>
              {(selectedCategory || localSearch || maxPrice < 500) && (
                <button
                  id="reset-filter-desktop"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} /> Reset
                </button>
              )}
            </div>

            {/* Categories section */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Categories</h4>
              <div className="flex flex-col gap-1.5">
                {categories.map((c) => (
                  <button
                    id={`filter-cat-${c.slug}`}
                    key={c.id}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`flex items-center justify-between text-left p-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                        : 'bg-transparent border-slate-100/50 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3 text-slate-400" /> {c.name}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">
                      {c.product_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Filter section */}
            <div className="border-t border-slate-50 pt-4">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                <span>Maximum Price</span>
                <span className="text-emerald-800 font-mono font-bold font-sans text-xs">₹{maxPrice}</span>
              </div>
              <input
                id="range-slider-desktop"
                type="range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-100 h-1.5 rounded-xl cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹50</span>
                <span>₹500</span>
              </div>
            </div>
          </aside>

          {/* B. Products Catalog Grid section */}
          <section id="products-catalog-section" className="lg:col-span-3">
            
            {/* Loading skeletons state */}
            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-4 animate-pulse">
                    <div className="aspect-square bg-slate-100 rounded-xl" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mt-2" />
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                        <div className="h-5 bg-slate-100 rounded w-1/4" />
                        <div className="h-8 bg-slate-100 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              /* Product lists grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty Search / Filters State layout */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                <div className="p-4 bg-amber-50 rounded-full h-16 w-16 flex items-center justify-center text-amber-500">
                  <Search className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-emerald-950">
                    No authentic items found
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm">
                    No results match your selected filters. Try broadening your keywords or resetting filters.
                  </p>
                </div>
                <button
                  id="empty-reset-btn"
                  onClick={handleResetFilters}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </section>

        </div>
      </div>

      {/* C. Mobile Filter Drawer Overlay dialog */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[85vh] overflow-y-auto flex flex-col font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-display font-bold text-sm text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h3>
                <button
                  id="mobile-close-filters"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategorySelect(c.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedCategory.toLowerCase() === c.name.toLowerCase()
                          ? 'bg-emerald-800 border-emerald-800 text-white'
                          : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Filter */}
              <div className="mb-6 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                  <span>Maximum Price</span>
                  <span className="text-emerald-800 font-mono font-bold font-sans">₹{maxPrice}</span>
                </div>
                <input
                  id="range-slider-mobile"
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 bg-slate-100 h-1.5 rounded-xl"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>₹50</span>
                  <span>₹500</span>
                </div>
              </div>

              {/* Reset/Apply Panel */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  id="mobile-filters-reset-btn"
                  onClick={() => {
                    handleResetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-3 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl"
                >
                  Reset All
                </button>
                <button
                  id="mobile-filters-apply-btn"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-emerald-850 text-white text-xs font-bold rounded-xl"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
