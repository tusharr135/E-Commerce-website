import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, ArrowUp, ArrowDown, Eye, EyeOff, RefreshCw, Layers, Layout, Info } from 'lucide-react';

export default function LayoutOrchestrator() {
  const { designConfig, updateDesignConfig, updateHomeSection, swapHomeSectionOrder, resetDesignConfig, addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'product'>('sections');

  const handleToggleSection = (sectionId: any, currentVisible: boolean) => {
    updateHomeSection(sectionId, { visible: !currentVisible });
  };

  const handleEditTitle = (sectionId: any, value: string) => {
    updateHomeSection(sectionId, { title: value });
  };

  const handleEditSubtitle = (sectionId: any, value: string) => {
    updateHomeSection(sectionId, { subtitle: value });
  };

  const handleToggleProductProp = (prop: keyof typeof designConfig.productConfig) => {
    const freshConfig = { ...designConfig.productConfig, [prop]: !designConfig.productConfig[prop] };
    updateDesignConfig({ productConfig: freshConfig });
  };

  return (
    <>
      {/* Floating Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark opaque overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sliding Control Board panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-slate-900 text-slate-100 z-50 shadow-3xl border-l border-white/10 flex flex-col font-sans overflow-hidden"
            >
              {/* Header block */}
              <div className="p-6 border-b border-white/5 bg-slate-950 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-xl">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-base leading-tight text-white">Visual Store Orchestrator</h3>
                      <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Control Center Hub</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <b>No coding required!</b> Arrange homepage grids, change global headers, rewrite text copy, and toggle widgets with instant live previews. Saved automatically!
                  </p>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="flex bg-slate-950/60 p-1 border-b border-white/5 shrink-0">
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'sections' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layout className="h-3.5 w-3.5" /> Home Core Order
                </button>
                <button
                  onClick={() => setActiveTab('product')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'product' ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" /> Pd Details
                </button>
              </div>

              {/* Content Panel canvas */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                

                {activeTab === 'sections' && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                        Rearrange Homepage Modules
                      </label>
                      <span className="text-[10px] bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full font-semibold">
                        {designConfig.homeSections.length} sections
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      {designConfig.homeSections
                        .slice() // copy to avoid mutate order reference
                        .sort((a, b) => a.order - b.order)
                        .map((sec, currIndex, sortedArray) => {
                          // Find original indexes in original array to pass to swap
                          const origIdx1 = designConfig.homeSections.findIndex(s => s.id === sec.id);

                          return (
                            <div
                              key={sec.id}
                              className={`p-4 rounded-2xl border flex flex-col gap-3 transition-colors ${
                                sec.visible
                                  ? 'bg-slate-850 border-white/5 hover:border-slate-700'
                                  : 'bg-slate-900 border-dashed border-white/5 opacity-55'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-0.5">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-850 rounded font-mono text-amber-500">
                                      #{sec.order + 1}
                                    </span>
                                    {sec.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 block max-w-[200px] truncate leading-normal">
                                    ID: "{sec.id}"
                                  </p>
                                </div>

                                {/* Up / Down / Eye action triggers */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleToggleSection(sec.id, sec.visible)}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      sec.visible 
                                        ? 'bg-slate-850 border-white/10 text-emerald-400 hover:text-emerald-300' 
                                        : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'
                                    }`}
                                    title={sec.visible ? "Hide Section" : "Show Section"}
                                  >
                                    {sec.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                  </button>
                                  
                                  <button
                                    disabled={currIndex === 0}
                                    onClick={() => {
                                      // find targeted key to swap
                                      const prevSec = sortedArray[currIndex - 1];
                                      const origIdx2 = designConfig.homeSections.findIndex(s => s.id === prevSec.id);
                                      swapHomeSectionOrder(origIdx1, origIdx2);
                                      addToast(`Moved ${sec.name} up!`, 'info');
                                    }}
                                    className="p-1.5 bg-slate-850 border border-white/10 rounded-lg hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white"
                                    title="Move Section Up"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    disabled={currIndex === sortedArray.length - 1}
                                    onClick={() => {
                                      const nextSec = sortedArray[currIndex + 1];
                                      const origIdx2 = designConfig.homeSections.findIndex(s => s.id === nextSec.id);
                                      swapHomeSectionOrder(origIdx1, origIdx2);
                                      addToast(`Moved ${sec.name} down!`, 'info');
                                    }}
                                    className="p-1.5 bg-slate-850 border border-white/10 rounded-lg hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white"
                                    title="Move Section Down"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Live Title and Subtitle inputs to satisfy "modular & configurable" without break */}
                              {sec.visible && (
                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/5 font-sans">
                                  <div>
                                    <span className="text-[9px] text-slate-500 font-bold block mb-1">SECTION DISPLAY TITLE</span>
                                    <input
                                      type="text"
                                      value={sec.title}
                                      onChange={(e) => handleEditTitle(sec.id, e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-500 font-bold block mb-1">SECTION DESCRIPTION</span>
                                    <textarea
                                      rows={2}
                                      value={sec.subtitle}
                                      onChange={(e) => handleEditSubtitle(sec.id, e.target.value)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors resize-none leading-normal"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {activeTab === 'product' && (
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Product Details View Layout
                    </label>

                    <div className="flex flex-col gap-3.5 bg-slate-850 p-5 rounded-2xl border border-white/5">
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Image Gallery Thumbnails</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Display sub-images carousels list</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('showGalleryThumbnails')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.showGalleryThumbnails ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.showGalleryThumbnails ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Trust & Guarantees Box</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Organic sealing & return policies</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('showTrustIndicators')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.showTrustIndicators ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.showTrustIndicators ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Therapeutic Health Benefits</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Nutritional ingredients breakdown</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('showTherapeuticBenefits')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.showTherapeuticBenefits ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.showTherapeuticBenefits ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Customer Reviews Summary</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Display rating stars & totals widget</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('showReviewsSummary')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.showReviewsSummary ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.showReviewsSummary ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Magnifying Picture Zoom</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Interactive cursor zoom capability</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('allowZoom')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.allowZoom ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.allowZoom ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3.5 border-t border-white/5">
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">Sticky Mobile Add-to-Cart</p>
                          <p className="text-[10px] text-slate-400 leading-normal">Fix dynamic action bar at screen bottom</p>
                        </div>
                        <button
                          onClick={() => handleToggleProductProp('stickyMobileCTA')}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            designConfig.productConfig.stickyMobileCTA ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform ${
                            designConfig.productConfig.stickyMobileCTA ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Drawer footer control block */}
              <div className="p-6 bg-slate-950 border-t border-white/5 shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetDesignConfig();
                    setIsOpen(false);
                  }}
                  className="flex-1 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border border-slate-800 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Reset Default
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    addToast('All custom layout configurations saved successfully!', 'success');
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating trigger button to open the orchestrator panel */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Visual Store Orchestrator"
          className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl rounded-2xl p-3 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 border border-amber-400/30"
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Customize</span>
        </button>
      )}
    </>
  );
}
