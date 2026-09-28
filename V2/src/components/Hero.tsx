import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  Flame,
  Zap,
  Smile,
  Scale,
  Calculator
} from 'lucide-react';
import { PICKUP_LOCATIONS } from '../data/mockData';
import { formatRupiah } from '../utils/whatsapp';
import { useFleet } from '../context/FleetContext';

interface HeroProps {
  onQuickBook: (params: {
    motorId: string;
    pickupLocationId: string;
    startDate: string;
    endDate: string;
  }) => void;
  onOpenAiPlanner: () => void;
  onOpenComparison?: () => void;
  onOpenCalculator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onQuickBook, 
  onOpenAiPlanner,
  onOpenComparison,
  onOpenCalculator,
}) => {
  const { fleet } = useFleet();
  const [selectedMotorId, setSelectedMotorId] = useState(fleet[0]?.id || 'crf-150-l');
  const [selectedPickup, setSelectedPickup] = useState(PICKUP_LOCATIONS[0].id);

  // Default dates: today and tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  const activeMotor = fleet.find((m) => m.id === selectedMotorId) || fleet[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBook({
      motorId: selectedMotorId,
      pickupLocationId: selectedPickup,
      startDate,
      endDate,
    });
  };

  return (
    <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 overflow-hidden">
      {/* Background Banner with Cheerful Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
          alt="Gunung Panderman & Bromo Malang Jawa Timur"
          className="w-full h-full object-cover object-center scale-105 transform filter brightness-40 contrast-115"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-[#070d1e]/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d1e]/95 via-[#070d1e]/70 to-[#070d1e]/90"></div>
        {/* Playful Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 w-full">
        {/* Trust Pill & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-200 text-xs font-semibold mb-4 sm:mb-5 shadow-lg shadow-sky-950/50 backdrop-blur-sm">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              Sewa Motor Seru & Praktis
            </span>
            <span className="text-sky-600">•</span>
            <span className="text-cyan-300 hidden sm:inline">Malang & Kota Wisata Batu</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              HITS 🔥
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] font-['Outfit'] mb-3 sm:mb-4">
            Gas Liburan Seru di Malang & Batu Bareng{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300">
              RyokouRent!
            </span>{' '}
            🛵💨
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal px-2">
            Pilihan motor Honda kekinian, irit bensin, dan siap touring. Gratis antar ke Stasiun Malang & Garasi Dinoyo (Jl. Mt Haryono). Sudah include 2 helm keren & jas hujan!
          </p>

          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <button
              onClick={onOpenAiPlanner}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/50 backdrop-blur-sm transition-all shadow-md active:scale-95 group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Rute AI Planner</span>
              <ChevronRight className="w-3 h-3 text-amber-400" />
            </button>
            {onOpenComparison && (
              <button
                onClick={onOpenComparison}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold bg-sky-950/80 hover:bg-sky-900 text-sky-200 hover:text-white border border-sky-600/40 backdrop-blur-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bandingkan Motor</span>
              </button>
            )}
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-600/40 backdrop-blur-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kalkulator BBM</span>
              </button>
            )}
            <a
              href="#armada"
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-bold text-sky-200 hover:text-white bg-sky-950/70 hover:bg-sky-900/80 border border-sky-600/40 transition-all active:scale-95"
            >
              <span>Katalog Armada</span>
              <ChevronRight className="w-3 h-3 text-sky-400" />
            </a>
          </div>
        </div>

        {/* Interactive Quick Booking Widget - Optimized for Touch & Phones */}
        <div className="bg-[#0d1836]/90 backdrop-blur-xl border border-sky-500/35 rounded-3xl shadow-2xl shadow-sky-950/80 p-4 sm:p-6 max-w-4xl mx-auto relative">
          <div className="flex items-center justify-between border-b border-sky-800/40 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-extrabold text-white font-['Outfit'] uppercase tracking-wider">
                ⚡ Hitung Tarif & Booking Kilat
              </span>
            </div>
            <span className="text-[11px] text-cyan-300 font-semibold bg-sky-950/70 border border-sky-700/50 px-2 py-0.5 rounded-full hidden sm:inline-block">
              Unit Bersih & Servis Rutin AHASS
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Field 1: Motor Selection */}
            <div>
              <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span>Pilih Motor Favorit</span>
              </label>
              <div className="relative">
                <select
                  value={selectedMotorId}
                  onChange={(e) => setSelectedMotorId(e.target.value)}
                  className="w-full bg-[#080f24] border border-sky-800/60 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 appearance-none cursor-pointer"
                >
                  {fleet.map((motor) => (
                    <option key={motor.id} value={motor.id} className="bg-slate-900 text-white">
                      {motor.name} ({formatRupiah(motor.dailyPrice)}/hr)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-sky-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Field 2: Pickup Location */}
            <div>
              <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Titik Antar / Ambil</span>
              </label>
              <div className="relative">
                <select
                  value={selectedPickup}
                  onChange={(e) => setSelectedPickup(e.target.value)}
                  className="w-full bg-[#080f24] border border-sky-800/60 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 appearance-none cursor-pointer"
                >
                  {PICKUP_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                      {loc.name} {loc.extraFee === 0 ? '(Gratis)' : `(+${formatRupiah(loc.extraFee)})`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-sky-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            {/* Field 3: Dates */}
            <div>
              <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>Mulai - Selesai Sewa</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#080f24] border border-sky-800/60 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-sky-400"
                />
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#080f24] border border-sky-800/60 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Field 4: Submit Button */}
            <div className="flex flex-col justify-end pt-1 sm:pt-0">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/40 flex items-center justify-center gap-2 transition-all active:scale-95 border border-sky-300/40 cursor-pointer h-[42px]"
              >
                <span>Cari & Booking Unit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick specs preview for selected motor */}
          {activeMotor && (
            <div className="mt-3 pt-3 border-t border-sky-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-200">{activeMotor.name}</span>
                <span className="text-sky-700">•</span>
                <span className="text-amber-300 font-extrabold">{formatRupiah(activeMotor.dailyPrice)}/hari</span>
                <span className="text-sky-700 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">{activeMotor.fuelConsumption}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-cyan-300">
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  2 Helm SNI Bersih
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  2 Jas Hujan Siap Pakai
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Feature / Trust Pillars - Cheerful Teen Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-10 max-w-5xl mx-auto">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1630]/80 border border-sky-600/25 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">4.9 / 5.0 Rating</div>
              <div className="text-[10px] sm:text-[11px] text-sky-300/80">850+ Ulasan Seru</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1630]/80 border border-sky-600/25 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">Antar Kilat 15 Menit</div>
              <div className="text-[10px] sm:text-[11px] text-sky-300/80">Stasiun & Garasi Malang</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1630]/80 border border-sky-600/25 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-sky-400/15 border border-sky-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">Armada Muda 2024</div>
              <div className="text-[10px] sm:text-[11px] text-sky-300/80">Rutin Servis AHASS Resmi</div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1630]/80 border border-sky-600/25 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-indigo-400/15 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">Emergency 24 Jam</div>
              <div className="text-[10px] sm:text-[11px] text-sky-300/80">Garansi Tukar Unit Cepat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
