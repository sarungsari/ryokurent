import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  MapPin, 
  Fuel, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Car,
  Compass
} from 'lucide-react';
import { MotorItem } from '../types/rental';
import { useFleet } from '../context/FleetContext';
import { formatRupiah } from '../utils/whatsapp';

interface SavingsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookMotor: (motor: MotorItem) => void;
}

interface TourRoute {
  id: string;
  name: string;
  distanceKm: number;
  description: string;
  tag: string;
  suggestedMotorId: string;
}

const POPULAR_ROUTES: TourRoute[] = [
  {
    id: 'route-malang-city',
    name: 'Eksplor Malang Heritage & Kafe Hits',
    distanceKm: 25,
    description: 'Stasiun Kotabaru • Kayutangan Heritage • Toko Oen • Suhat Kuliner • Alun-Alun Tugu',
    tag: 'Dalam Kota',
    suggestedMotorId: 'scoopy-2024',
  },
  {
    id: 'route-batu-highland',
    name: 'Wisata Alam & Theme Park Kota Batu',
    distanceKm: 65,
    description: 'Malang • Jatim Park 1-3 • Museum Angkut • Alun-Alun Batu • Paralayang Gunung Banyak',
    tag: 'Tanjakan & Sejuk',
    suggestedMotorId: 'vario-160',
  },
  {
    id: 'route-pujon-cangar',
    name: 'Pujon Kidul & Pemandian Cangar',
    distanceKm: 85,
    description: 'Batu • San Terra De Laponte • Cafe Sawah Pujon • Jalur Berliku Cangar & Air Panas Alami',
    tag: 'Panorama Perbukitan',
    suggestedMotorId: 'vario-160',
  },
  {
    id: 'route-bromo-sunrise',
    name: 'Ekspedisi Sunrise & Pasir Bromo via Tumpang',
    distanceKm: 120,
    description: 'Stasiun Malang • Tumpang • Gubugklakah • Lautan Pasir Berbisik • Kawah Bromo Penanjakan',
    tag: 'Petualangan Ekstrem',
    suggestedMotorId: 'crf-150l',
  },
];

export const SavingsCalculatorModal: React.FC<SavingsCalculatorModalProps> = ({
  isOpen,
  onClose,
  onBookMotor,
}) => {
  const { fleet } = useFleet();

  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-batu-highland');
  const [selectedMotorId, setSelectedMotorId] = useState<string>('vario-160');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [fuelType, setFuelType] = useState<'pertalite' | 'pertamax'>('pertalite');

  if (!isOpen) return null;

  const currentRoute = POPULAR_ROUTES.find((r) => r.id === selectedRouteId) || POPULAR_ROUTES[0];
  const currentMotor = fleet.find((m) => m.id === selectedMotorId) || fleet[0];

  // Fuel price per liter
  const fuelPricePerLiter = fuelType === 'pertalite' ? 10000 : 12800;

  // Extract average km/L from fuelConsumption string e.g. "46.9 km/L" -> 46.9
  const parsedKmPerL = parseFloat(currentMotor.fuelConsumption) || 50;

  // Total estimated distance in km
  const totalKm = currentRoute.distanceKm * durationDays;

  // Liters needed
  const litersNeeded = Math.ceil(totalKm / parsedKmPerL);
  const totalFuelCost = litersNeeded * fuelPricePerLiter;

  // Rental cost with RyokouRent
  const totalRentalCost = currentMotor.dailyPrice * durationDays;
  const grandTotalRyokou = totalRentalCost + totalFuelCost;

  // Estimated Cost with Online Taxi (Gocar/Grab) or Car Rental + Driver in Malang-Batu
  // Average taxi/car rental cost for full day touring is ~Rp 450.000 - Rp 650.000 / day
  const dailyCarOrTaxiRate = currentRoute.id === 'route-bromo-sunrise' ? 750000 : 450000;
  const totalCarCost = dailyCarOrTaxiRate * durationDays;

  // Money Saved
  const savings = Math.max(0, totalCarCost - grandTotalRyokou);
  const percentageSaved = Math.round((savings / totalCarCost) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0c1630] border border-sky-700/50 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-4 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Kalkulator Tarif & Estimasi BBM</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                Hitung Biaya & Penghematan Liburan Anda
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white flex items-center justify-center transition-colors border border-sky-800/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Controls Column */}
          <div className="space-y-4">
            {/* Step 1: Choose Route */}
            <div>
              <label className="block text-xs font-bold text-sky-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                1. Pilih Rencana Rute Wisata:
              </label>
              <div className="space-y-1.5">
                {POPULAR_ROUTES.map((route) => {
                  const isSelected = route.id === selectedRouteId;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => {
                        setSelectedRouteId(route.id);
                        if (route.suggestedMotorId) {
                          setSelectedMotorId(route.suggestedMotorId);
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-950 border-sky-400 text-white shadow-md'
                          : 'bg-[#070d1e] border-sky-900/60 text-slate-300 hover:border-sky-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{route.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900/70 text-sky-200 border border-sky-700/40">
                          {route.tag} • ±{route.distanceKm} km/hari
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {route.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Motor */}
            <div>
              <label className="block text-xs font-bold text-sky-300 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                2. Pilih Armada Motor:
              </label>
              <select
                value={selectedMotorId}
                onChange={(e) => setSelectedMotorId(e.target.value)}
                className="w-full bg-[#070d1e] border border-sky-700/60 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              >
                {fleet.map((m) => {
                  const isAvail = m.rentalStatus ? m.rentalStatus === 'available' : m.isAvailable;
                  return (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.engineCc}cc) - {formatRupiah(m.dailyPrice)}/hari [{isAvail ? '🟢 Tersedia' : '🔴 Habis'}]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Step 3: Duration & Fuel Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-sky-300 mb-1">
                  Durasi Sewa:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 5, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDurationDays(days)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        durationDays === days
                          ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm'
                          : 'bg-[#070d1e] border-sky-900 text-slate-300 hover:border-sky-700'
                      }`}
                    >
                      {days}h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-300 mb-1">
                  Jenis Bensin:
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setFuelType('pertalite')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      fuelType === 'pertalite'
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                        : 'bg-[#070d1e] border-sky-900 text-slate-300 hover:border-sky-700'
                    }`}
                  >
                    Pertalite
                  </button>
                  <button
                    type="button"
                    onClick={() => setFuelType('pertamax')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      fuelType === 'pertamax'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                        : 'bg-[#070d1e] border-sky-900 text-slate-300 hover:border-sky-700'
                    }`}
                  >
                    Pertamax
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Comparison Card */}
          <div className="bg-[#070d1e] border border-sky-700/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-900/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Kalkulasi ({durationDays} Hari)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                  Hemat {percentageSaved}%
                </span>
              </div>

              {/* Specs Breakdown */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Unit Motor:</span>
                  <span className="font-bold text-white">{currentMotor.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Sewa ({durationDays} Hari @ {formatRupiah(currentMotor.dailyPrice)}):</span>
                  <span className="font-semibold text-white">{formatRupiah(totalRentalCost)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Est. Jarak Tempuh ({durationDays} hari):</span>
                  <span className="font-semibold text-sky-300">± {totalKm} km</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-300" />
                    Est. Konsumsi BBM (~{litersNeeded} Liter):
                  </span>
                  <span className="font-semibold text-amber-300">{formatRupiah(totalFuelCost)}</span>
                </div>
                <div className="pt-2 border-t border-sky-900/60 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Total RyokouRent (Sewa + BBM):</span>
                  <span className="text-emerald-400 text-base font-black font-['Outfit']">
                    {formatRupiah(grandTotalRyokou)}
                  </span>
                </div>
              </div>

              {/* Comparison vs Taxi / Car */}
              <div className="mt-4 p-3 bg-sky-950/70 border border-sky-800/60 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Car className="w-3.5 h-3.5 text-rose-400" />
                    Jika Pakai Mobil / Taksi Online:
                  </span>
                  <span className="line-through text-slate-400">{formatRupiah(totalCarCost)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-sky-900/60">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-xs">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span>Uang Yang Anda Hemat:</span>
                  </div>
                  <span className="text-base font-black text-amber-300 font-['Outfit']">
                    {formatRupiah(savings)}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Penghematan ini bisa Anda alokasikan untuk kuliner khas Malang, tiket wahana Jatim Park, atau tiket Bromo!</span>
              </div>
            </div>

            {/* CTA Book */}
            <div className="mt-5 pt-3 border-t border-sky-900/60">
              <button
                onClick={() => {
                  onClose();
                  onBookMotor(currentMotor);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98"
              >
                <span>Sewa {currentMotor.name} Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
