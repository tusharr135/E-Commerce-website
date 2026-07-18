import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Edit, Trash2, Tag, X, Save, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../../types';

export default function Categories() {
  const { categories, products, saveCategory, deleteCategory, addToast } = useStore();
  
  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Inputs
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setImage(c.image);
    setDescription(c.description || '');
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      addToast('Name and image URL are mandatory criteria', 'error');
      return;
    }

    if (editingCategory) {
      // Edit
      saveCategory({ id: editingCategory.id, name, image, description, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      addToast(`Category "${name}" updated successfully`, 'success');
    } else {
      // Add
      saveCategory({ name, image, description, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      addToast(`Category "${name}" created inside taxonomy`, 'success');
    }
    setShowModal(false);
  };

  const handleDeleteClick = (id: string, catName: string) => {
    const attachedProducts = products.filter(p => p.category === catName);
    if (attachedProducts.length > 0) {
      addToast(`Cannot delete category "${catName}" because it is currently linked to ${attachedProducts.length} active products! Reassign those products first.`, 'error');
      return;
    }
    if (confirm(`Do you absolutely wish to delete taxonomy "${catName}"? This is irreversible.`)) {
      deleteCategory(id);
      addToast(`Deleted "${catName}"`, 'info');
    }
  };

  return (
    <div id="admin-categories-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
            Menu Store Categories
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Group your homemade recipes into structured, easy-to-browse category lines.
          </p>
        </div>
        
        <button
          id="add-category-btn-trigger"
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 border-none text-white rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const count = products.filter(p => p.category === c.name).length;
          return (
            <div
              key={c.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 pr-1">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0 font-sans text-xs sm:text-sm">
                  <h4 className="font-bold text-slate-800 truncate">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-extrabold tracking-widest">{count} Products Cataloged</p>
                  {c.description && <p className="text-[10px] text-slate-450 line-clamp-1 mt-1 font-medium">{c.description}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1 text-slate-450 shrink-0">
                <button
                  id={`edit-cat-${c.id}`}
                  onClick={() => openEditModal(c)}
                  className="p-1.5 hover:text-emerald-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                  title="Edit Category Name/Image"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  id={`delete-cat-${c.id}`}
                  onClick={() => handleDeleteClick(c.id, c.name)}
                  className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer animate-shake"
                  title="Remove Category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Overlay Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-900/60 z-30"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-32 sm:w-full sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 z-40 shadow-2xl font-sans"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-1.5">
                  <Tag className="h-5 w-5 text-emerald-700" />
                  {editingCategory ? `Edit "${editingCategory.name}"` : 'Create Custom Category Class'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-5 text-xs sm:text-sm text-slate-750 font-sans">
                
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-650">Category Label Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grandma Sun Pickles"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-650">Category Summary Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Aged sundried jars cooked directly in oil"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Banner Image URL link */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-650">Visual Illustration URL link</label>
                  <input
                    type="url"
                    required
                    placeholder="Provide image coordinates from Unsplash"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="p-3 border border-slate-200 rounded-xl focus:outline-none bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 font-bold transition-all cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-950 border-none text-white rounded-xl font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>Save taxonomy</span>
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
