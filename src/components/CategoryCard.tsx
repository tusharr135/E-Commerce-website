import { Link } from 'react-router-dom';
import { Category } from '../types';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryCardProps {
  category: Category;
  key?: string | number;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      id={`cat-card-${category.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative h-64 rounded-2xl overflow-hidden group shadow-md border border-emerald-950/5 flex flex-col justify-end p-5"
    >
      {/* Background Image Stage */}
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Heavy Mud Dark Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

      {/* Info Container */}
      <div className="relative z-10 text-white flex flex-col gap-2">
        <span className="bg-emerald-500 text-white font-sans text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full w-max text-center self-start">
          {category.product_count} Products
        </span>
        
        <div>
          <h3 className="font-display font-bold text-lg leading-tight tracking-tight text-white mb-1">
            {category.name}
          </h3>
          <p className="text-xs text-emerald-100/80 leading-relaxed block line-clamp-2">
            {category.description}
          </p>
        </div>

        <Link
          id={`cat-explore-${category.slug}`}
          to={`/products?category=${encodeURIComponent(category.name)}`}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors mt-1 w-max self-start bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm cursor-pointer"
        >
          <span>Explore Range</span>
          <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </motion.div>
  );
}
