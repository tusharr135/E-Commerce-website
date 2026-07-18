import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Minus, Plus, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Inventory() {
  const { products, saveProduct, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStockUpdate = (id: string, currentStock: number, diff: number) => {
    const finalStock = Math.max(0, currentStock + diff);
    // Find item
    const originalPro = products.find(p => p.id === id);
    if (originalPro) {
      saveProduct({ ...originalPro, id: originalPro.id, stock: finalStock });
      addToast(`Stock for "${originalPro.name}" changed to: ${finalStock}`, 'success');
    }
  };

  const filteredList = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="admin-inventory-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
          Stock and Inventory levels
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Perform unheated milling packaging reconciliation, increase bag capacities, and adjust limits.
        </p>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center text-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="admin-inventory-search"
            type="text"
            placeholder="Search products by ingredients brand name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Items List table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-slate-605">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="py-3 px-4">Recipe details</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4">Stock metrics</th>
                <th className="py-3 px-4">Reorder Status</th>
                <th className="py-3 px-4 text-center">Adjust Stocks (Pkts)</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p) => {
                const isUnderStock = p.stock < 15;
                return (
                  <tr key={p.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/45">
                    
                    {/* Img & Title */}
                    <td className="py-3.5 px-4 pr-1">
                      <div className="flex gap-3 items-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">NET WEIGHT: {p.weight}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-slate-105 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Stock numbers */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={isUnderStock ? 'text-rose-650' : 'text-slate-805'}>
                        {p.stock} pkts
                      </span>
                    </td>

                    {/* Reorder Warnings */}
                    <td className="py-3.5 px-4">
                      {isUnderStock ? (
                        <span className="text-[9px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded font-extrabold uppercase tracking-widest flex items-center gap-1 w-max border border-rose-100">
                          <AlertTriangle className="h-3 w-3 animate-bounce" /> Low Stock Warning
                        </span>
                      ) : (
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-extrabold uppercase tracking-widest flex items-center gap-1 w-max">
                          <CheckCircle2 className="h-3 w-3" /> Healthy Stock
                        </span>
                      )}
                    </td>

                    {/* Micro count selectors */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-50 rounded-xl px-1.5 py-1 w-max mx-auto">
                        <button
                          id={`dec-stock-${p.id}`}
                          onClick={() => handleStockUpdate(p.id, p.stock, -5)}
                          className="p-1 rounded bg-white hover:bg-slate-150 text-slate-500 border border-slate-150 transition-colors cursor-pointer text-[10px] font-bold"
                          title="Reduce stock by 5"
                        >
                          -5
                        </button>
                        <button
                          id={`dec-one-stock-${p.id}`}
                          onClick={() => handleStockUpdate(p.id, p.stock, -1)}
                          className="p-1 rounded bg-white hover:bg-slate-150 text-slate-500 border border-slate-150 transition-colors cursor-pointer text-[10px] font-bold px-2"
                        >
                          -1
                        </button>
                        <span className="font-mono font-black text-xs text-slate-800 w-10 text-center select-none">
                          {p.stock}
                        </span>
                        <button
                          id={`inc-one-stock-${p.id}`}
                          onClick={() => handleStockUpdate(p.id, p.stock, 1)}
                          className="p-1 rounded bg-white hover:bg-slate-150 text-slate-500 border border-slate-150 transition-colors cursor-pointer text-[10px] font-bold px-2"
                        >
                          +1
                        </button>
                        <button
                          id={`inc-stock-${p.id}`}
                          onClick={() => handleStockUpdate(p.id, p.stock, 5)}
                          className="p-1 rounded bg-white hover:bg-slate-150 text-slate-500 border border-slate-150 transition-colors cursor-pointer text-[10px] font-bold"
                          title="Increase stock by 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
