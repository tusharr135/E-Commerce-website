import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Plus, Edit, Trash2, Search, SlidersHorizontal, Image, X,
  Save, Eye, CheckCircle2, ChevronRight, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

export default function Products() {
  const { products, categories, saveProduct, deleteProduct, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal control states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0');
  const [salePrice, setSalePrice] = useState('');
  const [weight, setWeight] = useState('');
  const [stock, setStock] = useState('0');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setCategory(categories[0]?.name || 'Pulses & Rice (कडधान्ये व तांदूळ)');
    setPrice('100');
    setSalePrice('');
    setWeight('250g');
    setStock('50');
    setImage('https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=300');
    setImages(['https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=300']);
    setIngredients('Spices, rock salt, mustard seeds, cold-pressed oil');
    setUsageInstructions('Serve fresh with warm rotis or steamed idli.');
    setIsBestSeller(false);
    setShowFormModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setPrice(p.price.toString());
    setSalePrice(p.sale_price !== undefined ? p.sale_price.toString() : '');
    setWeight(p.weight);
    setStock(p.stock.toString());
    setImage(p.image);
    setImages(p.images && p.images.length > 0 ? [...p.images] : [p.image]);
    setIngredients(p.ingredients || '');
    setUsageInstructions('');
    setIsBestSeller(p.is_best_seller || false);
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !weight || !stock) {
      addToast('Name, Base Price, weight estimation and stock are mandatory parameters', 'error');
      return;
    }

    const cleanImages = images.filter(url => url && url.trim() !== '');
    const mainImg = cleanImages[0] || 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=300';

    const payload = {
      name,
      description,
      category,
      price: parseFloat(price),
      sale_price: salePrice ? parseFloat(salePrice) : undefined,
      weight,
      stock: parseInt(stock),
      image: mainImg,
      images: cleanImages,
      ingredients,
      is_best_seller: isBestSeller,
      is_active: true
    };

    if (editingProduct) {
      // Edit
      saveProduct({
        ...payload,
        id: editingProduct.id
      });
      addToast(`Product "${name}" saved successfully`, 'success');
    } else {
      // Add
      saveProduct(payload);
      addToast(`Product "${name}" created inside catalogs`, 'success');
    }
    setShowFormModal(false);
  };

  const handleDeleteClick = (id: string, prodName: string) => {
    if (confirm(`Do you absolutely wish to delete "${prodName}" from catalogs? This is irreversible.`)) {
      deleteProduct(id);
      addToast(`Deleted "${prodName}"`, 'info');
    }
  };

  // Filter products list
  const filteredList = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="admin-products-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-885 bg-slate-50/20">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
            Inventory Catalog Products
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Publish brand new village crops, adjust pricing, apply discounts, or update packaging visuals.
          </p>
        </div>
        
        <button
          id="add-new-product-trigger"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Publish Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative w-full sm:flex-1 text-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="admin-product-search"
            type="text"
            placeholder="Search products by title, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm"
          />
        </div>

        {/* Category Toggler */}
        <div className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            id="admin-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 text-xs text-slate-650"
          >
            <option value="all">All Category Classes</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Dynamic Products Grid Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 hover:bg-slate-50">
                <th className="py-3 px-4">Recipe details</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4">Net Price (Promo)</th>
                <th className="py-3 px-4">Stock Levels</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-slate-400 italic">
                    No products matched your specified query terms. Create a new one!
                  </td>
                </tr>
              ) : (
                filteredList.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40">
                    
                    {/* Img and Name info */}
                    <td className="py-3.5 px-4">
                      <div className="flex gap-3 items-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-11 w-11 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-850 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Package Weight: {p.weight}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>

                    {/* Pricing original/discounted */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {p.sale_price !== undefined ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-800">₹{p.sale_price}</span>
                          <span className="text-slate-450 line-through text-[10px]">₹{p.price}</span>
                        </div>
                      ) : (
                        <span className="text-slate-800">₹{p.price}</span>
                      )}
                    </td>

                    {/* Stock level indicators */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`font-mono font-bold ${p.stock < 15 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {p.stock} pkt
                        </span>
                        {p.stock < 15 && (
                          <span className="text-[8px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider w-max">
                            low stock alert
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Buttons edits/deletion */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-prod-${p.id}`}
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          id={`delete-prod-${p.id}`}
                          onClick={() => handleDeleteClick(p.id, p.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Unified Modal form */}
      <AnimatePresence>
        {showFormModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="fixed inset-0 bg-slate-900/60 z-30"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-12 max-h-[85vh] sm:w-full sm:max-w-2xl bg-white rounded-3xl p-6 sm:p-8 z-40 shadow-2xl overflow-y-auto font-sans"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-emerald-700" />
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Publish New Village Staples'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-5 text-xs sm:text-sm text-slate-700 font-sans">
                
                {/* Product Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-650">Recipe Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grandma Sun-Dried Green Mango Pickle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Categories & Weights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-650">Category Class</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 text-slate-650"
                    >
                      {categories.map((c, idx) => (
                        <option key={idx} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-650">Weight Metrics (g / kg)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500g, 1kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-650">Product Story & Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide short visual narrative describing grandmother's cooking methods for this product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Prices & Stocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-650">Price rate (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-650">Promo Sale rate (₹, Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. Leave blank if none"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-650">Stock Available (pkts)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                    />
                  </div>

                </div>

                {/* Visual Images Portfolio (Max 3 Images) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Product Images Portfolio</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Manage up to 3 image URLs. First image serves as the primary card visual.</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      {images.filter(x => !!x).length} / 3 Images
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((idx) => {
                      const imgUrl = images[idx] || '';
                      return (
                        <div key={idx} className="relative aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
                          {imgUrl ? (
                            <>
                              <img src={imgUrl} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...images];
                                  updated[idx] = '';
                                  setImages(updated);
                                }}
                                className="absolute top-1 right-1 bg-red-605 text-white p-1 rounded-full hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow border-none flex items-center justify-center"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 py-0.5 text-center text-[9px] text-white font-semibold">
                                {idx === 0 ? 'Primary' : `Image #${idx + 1}`}
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                              <Image className="h-5 w-5 mb-1 opacity-40 text-slate-500" />
                              <span className="text-[9px] font-medium uppercase tracking-wider">Empty</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Fields block */}
                  <div className="flex flex-col gap-2.5 mt-1">
                    {[0, 1, 2].map((idx) => {
                      const imgUrl = images[idx] || '';
                      const isRequired = idx === 0; // First is required
                      return (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <label className="font-bold text-slate-650 flex items-center gap-1">
                              <span>Image #{idx + 1} URL</span>
                              {isRequired && <span className="text-red-500">* (Primary Card Display)</span>}
                            </label>
                            {imgUrl && !isRequired && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...images];
                                  updated[idx] = '';
                                  setImages(updated);
                                }}
                                className="text-[10px] text-red-500 hover:underline border-none bg-transparent cursor-pointer p-0 font-medium"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="url"
                              required={isRequired}
                              placeholder={isRequired ? "Add primary product image link (required)" : `Add alternative image #${idx + 1} link (optional)`}
                              value={imgUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = [...images];
                                updated[idx] = val;
                                setImages(updated);
                              }}
                              className="w-full p-2.5 pr-20 border border-slate-200 rounded-xl focus:outline-none bg-white text-xs text-slate-800"
                            />
                            {/* Fast preset options to help testers */}
                            {!imgUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  const presets = [
                                    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
                                    'https://images.unsplash.com/photo-1547825407-2d060104b7f8?auto=format&fit=crop&q=80&w=600',
                                    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
                                    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
                                    'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=600'
                                  ];
                                  const selectIndex = (idx + Math.floor(Math.random() * 5)) % presets.length;
                                  const updated = [...images];
                                  updated[idx] = presets[selectIndex];
                                  setImages(updated);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold px-2 py-1 rounded-lg border-none cursor-pointer flex items-center gap-0.5"
                              >
                                <Sparkles className="h-2.5 w-2.5" /> Preset
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ingredients & Usage instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-650">Organic Ingredients (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Spices, Mustard seeds, Rock Salt, Cold-pressed Oils"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-650">Recommended Usage Instructions</label>
                    <input
                      type="text"
                      placeholder="Best with fresh hot curd rice"
                      value={usageInstructions}
                      onChange={(e) => setUsageInstructions(e.target.value)}
                      className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                    />
                  </div>

                </div>

                {/* Best Seller Checkbox */}
                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={() => setIsBestSeller(!isBestSeller)}
                    className="accent-emerald-600 h-4.5 w-4.5 rounded-lg cursor-pointer"
                  />
                  <span className="font-medium text-slate-750">Flag product into "Best-Selling Products" block on home banner</span>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 font-bold transition-all cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 border-none text-white rounded-xl font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>Save Changes</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
