import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Check, Trash2, ShieldAlert, Star, ShieldX, Image, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Reviews() {
  const { reviews, approveReview, deleteReview, products, addToast } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApprove = (id: string, author: string) => {
    approveReview(id);
    addToast(`Approved feedback from: ${author}`, 'success');
  };

  const handleDelete = (id: string, author: string) => {
    if (confirm(`Do you absolutely wish to discard feedback from "${author}"?`)) {
      deleteReview(id);
      addToast(`Feedback discarded from: ${author}`, 'info');
    }
  };

  return (
    <div id="admin-reviews-page" className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans text-slate-805 bg-slate-50/20">
      
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-2xl text-emerald-950 tracking-tight">
          Buyer Feedback Moderation
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Review comments submitted by verified families, approve to display on storefront pages, or discard spam.
        </p>
      </div>

      {/* Reviews Table wrapper */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs sm:text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-slate-605">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="py-3 px-4">Product details</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Review Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-slate-400 italic">
                    There are no reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => {
                  const matchedP = products.find(p => p.id === r.product_id);
                  const pImg = matchedP ? matchedP.image : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=100';
                  const isApproved = r.status === 'approved';

                  return (
                    <tr key={r.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-55/10">
                      
                      {/* Product */}
                      <td className="py-3.5 px-4 pr-2">
                        <div className="flex gap-2.5 items-center">
                          <img
                            src={pImg}
                            alt={r.product_name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0 pr-1">
                            <Link to={`/product/${r.product_id}`} className="font-bold text-slate-800 hover:text-emerald-800 truncate block">
                              {r.product_name}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-semibold font-mono block">ID: {r.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Review Author */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{r.user_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '02 June'}</p>
                      </td>

                      {/* Rating Stars and Comment content */}
                      <td className="py-3.5 px-4 pr-3 max-w-sm">
                        <div className="flex gap-0.5 text-amber-505 mb-1.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-600 leading-normal font-medium break-words italic">
                          "{r.comment}"
                        </p>
                      </td>

                      {/* Status approved or pending */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-850'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {isApproved ? 'Live On Site' : 'Needs Approval'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isApproved && (
                            <button
                              id={`approve-rev-${r.id}`}
                              onClick={() => handleApprove(r.id, r.user_name)}
                              className="p-1.5 text-emerald-850 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Approve Comment"
                            >
                              <Check className="h-4.5 w-4.5" />
                            </button>
                          )}
                          <button
                            id={`reject-rev-${r.id}`}
                            onClick={() => handleDelete(r.id, r.user_name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Discard Comment"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
