import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { Star, ShoppingCart, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const hasSale = product.sale_price !== undefined;

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
  const primaryImg = product.image || defaultPlaceholder;
  const rawList = product.images && product.images.length >= 3 ? product.images : [
    primaryImg,
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600'
  ];
  
  // Filter unique valid images for beautiful side previews
  const uniqueImages = Array.from(new Set(rawList.filter(Boolean))).slice(0, 3);
  const displayImg = activeImg || primaryImg;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25, cubicBezier: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-500/30 overflow-hidden group shadow-sm hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 shrink-0">
        <Link id={`product-img-${product.id}`} to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={displayImg}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </Link>

        {/* Image Previews bar on Card hover (Amazon/Zara premium feel) */}
        {uniqueImages.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/70 p-1.5 rounded-xl backdrop-blur-sm shadow border border-white/10">
            {uniqueImages.map((imgUrl, idx) => {
              const isActive = displayImg === imgUrl;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setActiveImg(imgUrl)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImg(imgUrl);
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    isActive 
                      ? 'border-emerald-400 scale-110 ring-2 ring-emerald-400/20' 
                      : 'border-white/20 hover:border-white/70'
                  }`}
                  aria-label={`Preview image ${idx + 1}`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_best_seller && (
            <span className="bg-emerald-700 text-white font-sans text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              ★ Best Seller
            </span>
          )}
          {hasSale && (
            <span className="bg-amber-500 text-slate-950 font-sans text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-0.5">
              <Percent className="h-2.5 w-2.5" /> Sale
            </span>
          )}
        </div>

        {/* Quick Weight Badge (offset on hover when previews show) */}
        <div className="absolute bottom-3 right-3 bg-emerald-950/85 hover:bg-emerald-950 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm shadow border border-white/5 z-10">
          {product.weight}
        </div>
      </div>

      {/* Information Panel */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div className="mb-3">
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block mb-1">
            {product.category}
          </span>
          {/* Title Link */}
          <Link
            id={`product-title-${product.id}`}
            to={`/product/${product.id}`}
            className="block text-slate-800 hover:text-emerald-700 font-display font-bold text-sm sm:text-base leading-tight tracking-tight min-h-[40px] line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Micro Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span>{product.rating}</span>
            </span>
            <span className="text-[11px] text-slate-400">({product.reviews_count} reviews)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
          <div>
            {hasSale ? (
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 line-through leading-none">
                  ₹{product.price}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-800 leading-tight">
                  ₹{product.sale_price}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-extrabold text-slate-800 leading-none">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Interactive Button */}
          {product.stock > 0 ? (
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="px-3.5 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 text-xs font-extrabold shrink-0 cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 select-none border border-red-200/50 rounded-lg shrink-0">
              Sold Out
            </span>
          )}
        </div>

      </div>
    </motion.div>
  );
}
