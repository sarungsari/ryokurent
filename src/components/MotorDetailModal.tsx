import React from 'react';
import { 
  X, 
  Check, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  MessageCircle, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { MotorItem } from '../types/rental';
import { formatRupiah, buildQuickInquiryLink } from '../utils/whatsapp';

interface MotorDetailModalProps {
  motor: MotorItem | null;
  onClose: () => void;
  onBookNow: (motor: MotorItem) => void;
}

export const MotorDetailModal: React.FC<MotorDetailModalProps> = ({ motor, onClose, onBookNow }) => {
  if (!motor) return null;

  const waInquiryUrl = buildQuickInquiryLink(motor.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0e1714] border border-emerald-800/50 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={motor.image}
            alt={motor.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1714] via-[#0e1714]/30 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {motor.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700">
                  Tahun {motor.year}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {motor.name}
              </h3>
            </div>

            <div className="bg-[#0b120f]/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-right backdrop-blur-md">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Tarif Sewa Harian</span>
              <span className="text-lg font-extrabold text-amber-400">{formatRupiah(motor.dailyPrice)}</span>
              <span className="text-[10px] text-slate-400"> / 24 Jam</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Deskripsi & Karakteristik Unit
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {motor.description}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/50 p-3 rounded-xl border border-emerald-900/30">
            <div className="p-2 bg-[#09110e] rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Kapasitas Mesin</span>
              <span className="text-xs font-bold text-white">{motor.engineCc} cc</span>
            </div>
            <div className="p-2 bg-[#09110e] rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Konsumsi BBM</span>
              <span className="text-xs font-bold text-emerald-400">{motor.fuelConsumption}</span>
            </div>
            <div className="p-2 bg-[#09110e] rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Kapasitas Tangki</span>
              <span className="text-xs font-bold text-white">{motor.fuelTank}</span>
            </div>
            <div className="p-2 bg-[#09110e] rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Transmisi</span>
              <span className="text-xs font-bold text-amber-400">{motor.transmission}</span>
            </div>
          </div>

          {/* Detailed Engineering Specs */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              Spesifikasi Lengkap
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Tenaga Maksimum</span>
                <span className="font-medium text-white">{motor.specs.power}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Sistem Pengereman</span>
                <span className="font-medium text-white">{motor.specs.brakes}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Kapasitas Bagasi</span>
                <span className="font-medium text-white">{motor.specs.storage}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Sistem Kontak & Keamanan</span>
                <span className="font-medium text-white">{motor.specs.startSystem}</span>
              </div>
            </div>
          </div>

          {/* Suitable For Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sangat Direkomendasikan Untuk Rute:
            </h4>
            <div className="flex flex-wrap gap-2">
              {motor.suitableFor.map((item, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/30 text-emerald-300 text-xs"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Amenities Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-700/30">
            <h5 className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Fasilitas Sewa Sudah Termasuk Gratis:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">✓ 2 Helm SNI steril & wangi</span>
              <span className="flex items-center gap-1.5">✓ 2 Jas hujan setelan / ponco tebal</span>
              <span className="flex items-center gap-1.5">✓ 1 Phone holder stang 360°</span>
              <span className="flex items-center gap-1.5">✓ Antar jemput Stasiun Tugu & Lempuyangan</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-6 bg-[#0a120f] border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={waInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600/40 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Tanya via WhatsApp</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onBookNow(motor);
            }}
            className="w-full sm:w-auto flex-1 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Pesan Motor Ini Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
