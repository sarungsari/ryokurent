import React from 'react';
import { Star, MessageSquare, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimoni" className="py-16 sm:py-24 bg-[#0b120f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Pengalaman Nyata Pelanggan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Apa Kata Mereka yang Sudah Menyewa?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Lebih dari 850+ wisatawan telah mempercayakan perjalanan liburan dan petualangan di Malang & Batu bersama RyokouRent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#0e1714] border border-emerald-900/40 p-5 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-3">
                {/* Rating & Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {t.tag}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Unit */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{t.origin}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Sewa: {t.motorRented}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
