import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';
import { RENTAL_REQUIREMENTS } from '../data/mockData';

export const RequirementsSection: React.FC = () => {
  return (
    <section id="syarat" className="py-16 sm:py-24 bg-[#09110e] relative overflow-hidden border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Transparan & Bebas Ribet</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Syarat & Tata Cara Sewa Motor
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Kami mengutamakan kemudahan wisatawan luar kota. Proses serah terima unit hanya memakan waktu 5-10 menit langsung di stasiun atau hotel Anda.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {RENTAL_REQUIREMENTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0e1714] border border-emerald-900/40 p-5 rounded-2xl relative shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500/40 font-mono block mb-2">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white mb-2 font-['Outfit']">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terverifikasi Cepat</span>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0d1c16] to-slate-900 border border-emerald-600/40 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              JAMINAN KENYAMANAN WISATAWAN
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Bebas Biaya Antar-Jemput di Seluruh Stasiun Kereta Malang
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Tiba di Stasiun Malang Kotabaru atau Kota Lama pagi buta maupun larut malam? Tim kurir RyokouRent siap mengantarkan armada tepat waktu di drop zone tanpa antre.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-center">
              <span className="text-emerald-400 font-bold text-sm block">100% Bersih & Steril</span>
              <span className="text-[10px] text-slate-400">Helm disinfeksi berkala</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-center">
              <span className="text-amber-400 font-bold text-sm block">Bantuan 24/7</span>
              <span className="text-[10px] text-slate-400">Emergency roadside</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
