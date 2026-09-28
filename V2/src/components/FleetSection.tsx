import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  Check, 
  SlidersHorizontal,
  Flame,
  Sparkles,
  ChevronRight,
  Settings,
  Zap,
  Scale,
  Calculator,
  Clock,
  Tag
} from 'lucide-react';
import { MotorItem, MotorCategory } from '../types/rental';
import { useFleet } from '../context/FleetContext';
import { formatRupiah } from '../utils/whatsapp';

interface FleetSectionProps {
  onSelectMotor: (motor: MotorItem) => void;
  onBookMotor: (motor: MotorItem) => void;
  onOpenOperator?: () => void;
  onOpenComparison?: (motorId?: string) => void;
  onOpenCalculator?: () => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ 
  onSelectMotor, 
  onBookMotor, 
  onOpenOperator,
  onOpenComparison,
  onOpenCalculator,
}) => {
  const { fleet } = useFleet();
  const [selectedCategory, setSelectedCategory] = useState<MotorCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'cc'>('recommended');

  const checkAvailability = (motors: MotorItem[]) => {
    return motors.some((m) => (m.rentalStatus ? m.rentalStatus === 'available' : m.isAvailable));
  };

  const categories: { id: MotorCategory; label: string; isAvailable: boolean }[] = [
    { 
      id: 'all', 
      label: '🔥 Semua Jenis Unit', 
      isAvailable: checkAvailability(fleet) 
    },
    { 
      id: 'matic', 
      label: '🛵 Matic (Vario & BeAT)', 
      isAvailable: checkAvailability(fleet.filter((m) => m.category === 'matic')) 
    },
    { 
      id: 'street', 
      label: '⚡ BeAT Street Series', 
      isAvailable: checkAvailability(fleet.filter((m) => m.category === 'street')) 
    },
    { 
      id: 'classic', 
      label: '✨ Retro (Scoopy)', 
      isAvailable: checkAvailability(fleet.filter((m) => m.category === 'classic')) 
    },
    { 
      id: 'trail', 
      label: '⛰️ Trail (CRF 150 L)', 
      isAvailable: checkAvailability(fleet.filter((m) => m.category === 'trail')) 
    },
  ];

  const filteredMotors = useMemo(() => {
    return fleet.filter((motor) => {
      const matchCategory = selectedCategory === 'all' || motor.category === selectedCategory;
      const matchSearch =
        motor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motor.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motor.engineCc.toString().includes(searchQuery);
      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.dailyPrice - b.dailyPrice;
      if (sortBy === 'price-desc') return b.dailyPrice - a.dailyPrice;
      if (sortBy === 'cc') return b.engineCc - a.engineCc;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });
  }, [fleet, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="armada" className="py-12 sm:py-20 bg-[#070d1e] relative overflow-hidden">
      {/* Decorative ambient cheerful blue gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-300 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Armada Terawat • Spesial Liburan Remaja</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
              Katalog Motor Paling Hits 🛵✨
            </h2>
            <p className="text-sky-200/70 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Pilihan jenis unit matic irit, street kekinian, retro estetik, hingga trail CRF 150 L buat rute seru Bromo & Batu. Semuanya siap gas!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="text-xs text-sky-200 bg-[#0c1630] border border-sky-800/60 px-3 py-2 rounded-2xl shadow-sm flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Armada Tersedia
              </span>
            </div>
            {onOpenComparison && (
              <button
                onClick={() => onOpenComparison()}
                className="text-xs px-3 py-2 rounded-2xl bg-sky-950/90 hover:bg-sky-900 text-sky-200 hover:text-white border border-sky-700/60 font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
                title="Bandingkan Spesifikasi Motor Bersebelahan"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bandingkan Motor</span>
              </button>
            )}
            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="text-xs px-3 py-2 rounded-2xl bg-sky-950/90 hover:bg-sky-900 text-emerald-300 hover:text-white border border-emerald-700/50 font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
                title="Hitung Estimasi BBM & Penghematan"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kalkulator BBM</span>
              </button>
            )}
            {onOpenOperator && (
              <button
                onClick={onOpenOperator}
                className="text-xs px-3 py-2 rounded-2xl bg-sky-950/90 hover:bg-sky-900 text-sky-200 hover:text-white border border-sky-700/60 font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer"
                title="Buka Menu Khusus Operator untuk Atur Harga & Ketersediaan Unit"
              >
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Atur Harga & Stok</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-[#0c1630] border border-sky-700/35 p-3 sm:p-4 rounded-3xl mb-6 sm:mb-8 space-y-3 shadow-xl shadow-sky-950/50">
          {/* Category Tabs - Representing Jenis Unit with Tersedia/Habis indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none no-bounce">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/40 font-black border border-sky-200/50'
                    : 'bg-[#080f24] text-slate-300 hover:text-white hover:bg-sky-950/80 border border-sky-900/40 font-medium'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    cat.isAvailable
                      ? selectedCategory === cat.id
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-300/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  {cat.isAvailable ? 'Tersedia' : 'Habis'}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-sky-900/40">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari motor (misal: BeAT, Scoopy, CRF, 160)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080f24] border border-sky-900/60 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
              <Search className="w-3.5 h-3.5 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-[11px] text-sky-300/80 flex items-center gap-1 font-semibold">
                <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#080f24] border border-sky-900/60 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="recommended">Paling Direkomendasikan</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="cc">Kapasitas Mesin (CC)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        {filteredMotors.length === 0 ? (
          <div className="text-center py-16 bg-[#0c1630]/60 rounded-3xl border border-dashed border-sky-800/60">
            <p className="text-sky-200 text-sm">Tidak ada motor yang cocok dengan pencarian "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-sky-400 hover:underline font-bold"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMotors.map((motor) => {
              const isUnitAvailable = motor.rentalStatus ? motor.rentalStatus === 'available' : motor.isAvailable;
              return (
                <div
                  key={motor.id}
                  className="group bg-[#0c1630] border border-sky-700/30 hover:border-sky-400/60 rounded-3xl overflow-hidden shadow-xl shadow-sky-950/40 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={motor.image}
                      alt={motor.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1630] via-transparent to-black/30"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-sky-300 border border-sky-400/40">
                        {motor.categoryLabel}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {motor.isPopular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 flex items-center gap-1 shadow-sm">
                            <Flame className="w-3 h-3 fill-slate-950" />
                            FAVORIT
                          </span>
                        )}
                        {isUnitAvailable ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Tersedia
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/50 flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                            Habis
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Year Tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-black text-white bg-sky-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-sky-500/30">
                        Tahun {motor.year}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white font-['Outfit'] group-hover:text-sky-300 transition-colors">
                        {motor.name}
                      </h3>
                      <p className="text-xs text-sky-200/70 line-clamp-2 mt-1 leading-relaxed">
                        {motor.description}
                      </p>
                    </div>

                    {/* Specs Quick Pills */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-sky-900/40 text-[11px] text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-sky-400" />
                        <span>{motor.engineCc} cc ({motor.transmission})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-300" />
                        <span>{motor.fuelConsumption}</span>
                      </div>
                    </div>

                    {/* Badges checklist */}
                    <div className="flex flex-wrap gap-1.5">
                      {motor.badges.slice(0, 2).map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-sky-950/80 text-sky-300 border border-sky-700/40 font-medium"
                        >
                          ✓ {badge}
                        </span>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-sky-900/40">
                      <div>
                        <span className="text-[10px] text-sky-300/80 block uppercase font-bold">Tarif Sewa</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black text-amber-300">
                            {formatRupiah(motor.dailyPrice)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">/hari</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onOpenComparison && (
                          <button
                            onClick={() => onOpenComparison(motor.id)}
                            className="p-2.5 rounded-2xl text-sky-200 hover:text-cyan-300 bg-[#080f24] hover:bg-sky-900/70 border border-sky-800/60 transition-all cursor-pointer active:scale-90"
                            title="Bandingkan Motor Ini dengan Unit Lain"
                            aria-label="Bandingkan Motor"
                          >
                            <Scale className="w-4 h-4 text-cyan-400" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectMotor(motor)}
                          className="p-2.5 rounded-2xl text-sky-200 hover:text-white bg-[#080f24] hover:bg-sky-900/70 border border-sky-800/60 transition-all cursor-pointer active:scale-90"
                          title="Lihat Detail & Spesifikasi Lengkap"
                          aria-label="Detail Motor"
                        >
                          <Eye className="w-4 h-4 text-sky-400" />
                        </button>

                        {isUnitAvailable ? (
                          <button
                            onClick={() => onBookMotor(motor)}
                            className="px-3.5 py-2.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/35 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-sky-300/30"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Sewa!</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onBookMotor(motor)}
                            className="px-3 py-2.5 rounded-2xl text-[11px] font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                            title="Unit saat ini sedang disewa / habis. Klik untuk cek ketersediaan tanggal berikutnya"
                          >
                            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Habis</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
