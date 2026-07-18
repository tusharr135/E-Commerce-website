import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div id="toast-root" className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-start gap-3 backdrop-blur-md border ${
              t.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-100 text-emerald-900 shadow-emerald-900/5'
                : t.type === 'error'
                ? 'bg-red-50/95 border-red-100 text-red-900 shadow-red-900/5'
                : 'bg-indigo-50/95 border-indigo-100 text-indigo-900 shadow-indigo-900/5'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-indigo-600" />}
            </div>
            
            <div className="flex-1 text-sm font-medium pr-1">
              {t.message}
            </div>

            <button
              id={`close-${t.id}`}
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
