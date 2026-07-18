import { useEffect } from 'react';
import { Leaf, Award, Milestone, Sparkles, HeartPulse, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    { icon: <Leaf className="h-5 w-5" />, title: 'Direct Farmer Provenance', text: 'Every grain is harvested cleanly using organic river soil silt, ensuring completely chemical-free growth.' },
    { icon: <Award className="h-5 w-5" />, title: 'Heritage Chef Prep', text: 'Our traditional recipe mixes are compounded safely by elderly women cooks preserving grandma\'s spice secrets.' },
    { icon: <ShieldCheck className="h-5 w-5" />, title: 'No Chemical Fillers', text: 'We absolutely ban commercial artificial preservatives, synthetic acids, toxic coloring dyes, and chemical MSG.' },
    { icon: <HeartPulse className="h-5 w-5" />, title: 'Stone Milling Sattu', text: 'Slow, unheated grinding preserves active dietary fibers, complex proteins, and earthy organic flavors.' }
  ];

  const team = [
    { name: 'Janaki Ammal', role: 'Chief Heritage Recipe Curator', avatar: '👵' },
    { name: 'Srinivasan Raman', role: 'Head of Agro Farming Provenance', avatar: '👨‍🌾' },
    { name: 'Meera Deshmukh', role: 'Organic Processing In-charge', avatar: '👩‍🍳' }
  ];

  return (
    <div id="about-brand-page" className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans text-slate-805">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Section Header */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase block">
              Our Journey Story
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-emerald-950 tracking-tight leading-tight">
              Honoring India's Ancient <span className="text-emerald-700">Homemade Culinary Secrets</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Village Product was founded with a singular, clear vision: to rescue the authentic, nostalgic flavors of rural indian homes from the flood of bland, hyper-chemical industrial items sold in plastic warehouse stores.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We operate out of clean, airy farms nested along the nutrient-rich Cauvery river delta. By sourcing direct unpolished grain crops and cooperating with heritage grandmother chefs, we slow-bottle sun-kissed mango pickles under raw oils, preserving active digestive enzymes alongside childhood memories.
            </p>
          </div>

          <div className="relative flex justify-center">
            <div className="relative rounded-3xl overflow-hidden aspect-video sm:aspect-square w-full max-w-md shadow-lg border border-emerald-900/5">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600"
                alt="Traditional spice roasting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/20 to-transparent flex items-end p-5">
                <span className="text-white font-display font-semibold text-sm sm:text-base flex items-center gap-1.5 leading-none">
                  <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" /> Sunkissed Spice Roasting
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission and values section */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-10 mb-16">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <h2 className="font-display font-medium text-2xl text-emerald-950 tracking-tight">Our Mission & Principles</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">We respect country nutrition guidelines, promising high natural integrity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            {values.map((v, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl h-max w-max">
                  {v.icon}
                </span>
                <h4 className="font-bold text-slate-800 leading-snug">{v.title}</h4>
                <p className="text-xs text-slate-500 leading-normal">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Traditional Team section */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <h2 className="font-display font-medium text-2xl text-emerald-950 tracking-tight">The Hearts Behind</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Meet our rural curators bridging pure farm soils together with healthy dinners.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sans">
            {team.map((m, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-4"
              >
                <div className="h-16 w-16 bg-emerald-50 rounded-full border border-emerald-100/50 flex items-center justify-center text-3xl select-none">
                  {m.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">{m.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
