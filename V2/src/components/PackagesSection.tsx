import React from 'react';
import { Compass, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ADVENTURE_PACKAGES } from '../data/mockData';

interface PackagesSectionProps {
  onOpenBooking: () => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="paket" className="py-16 sm:py-24 bg-[#0b120f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Inspirasi Rute Wisata Yogyakarta</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Paket Eksplorasi Motor Terfavorit
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Pilihan rute petualangan terbaik yang dirancang khusus untuk kenyamanan dan sensasi berkendara tak terlupakan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ADVENTURE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#0e1714] border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={pkg.bannerImg}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1714] via-transparent to-black/30"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black">
                      {pkg.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-emerald-300 transition-colors">
                      {pkg.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                      Rekomendasi Motor: {pkg.recommendedMotor}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Destinasi Unggulan:
                    </span>
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Inclusions */}
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Fasilitas Termasuk:
                    </span>
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Mulai dari</span>
                    <span className="text-base font-extrabold text-amber-400">{pkg.priceStart}</span>
                    <span className="text-[10px] text-slate-400">/hari</span>
                  </div>

                  <button
                    onClick={onOpenBooking}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Pilih Paket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
