import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Fuel, 
  Gauge, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight,
  Plus,
  Trash2,
  Zap
} from 'lucide-react';
import { MotorItem } from '../types/rental';
import { useFleet } from '../context/FleetContext';
import { formatRupiah } from '../utils/whatsapp';

interface MotorComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForBooking: (motor: MotorItem) => void;
  initialMotorId?: string;
}

export const MotorComparisonModal: React.FC<MotorComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectForBooking,
  initialMotorId,
}) => {
  const { fleet } = useFleet();

  // Pick up to 3 motors to compare
  const [selectedMotorIds, setSelectedMotorIds] = useState<string[]>(() => {
    if (initialMotorId && fleet.some((m) => m.id === initialMotorId)) {
      const others = fleet.filter((m) => m.id !== initialMotorId).slice(0, 1).map((m) => m.id);
      return [initialMotorId, ...others];
    }
    return fleet.slice(0, 2).map((m) => m.id);
  });

  if (!isOpen) return null;

  const selectedMotors = selectedMotorIds
    .map((id) => fleet.find((m) => m.id === id))
    .filter((m): m is MotorItem => !!m);

  const availableToAdd = fleet.filter((m) => !selectedMotorIds.includes(m.id));

  const handleAddMotor = (id: string) => {
    if (selectedMotorIds.length < 3 && !selectedMotorIds.includes(id)) {
      setSelectedMotorIds([...selectedMotorIds, id]);
    }
  };

  const handleRemoveMotor = (id: string) => {
    if (selectedMotorIds.length > 1) {
      setSelectedMotorIds(selectedMotorIds.filter((mId) => mId !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#0c1630] border border-sky-700/50 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-4 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-950 border border-sky-500/40 flex items-center justify-center text-amber-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Fitur Komparasi Cerdas</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                Bandingkan Spesifikasi & Karakter Motor
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

        {/* Unit Selector Bar if fewer than 3 */}
        {selectedMotorIds.length < 3 && availableToAdd.length > 0 && (
          <div className="mt-4 p-3 bg-sky-950/60 border border-sky-800/40 rounded-2xl flex flex-wrap items-center gap-2 text-xs">
            <span className="text-sky-300 font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-amber-300" /> Tambah motor untuk dibandingkan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableToAdd.slice(0, 5).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleAddMotor(m.id)}
                  className="px-2.5 py-1 rounded-xl bg-[#070d1e] hover:bg-sky-900/60 border border-sky-700/50 text-slate-200 hover:text-white transition-all cursor-pointer font-medium"
                >
                  + {m.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table / Grid */}
        <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-sky-800/50">
                <th className="p-3 w-40 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Parameter
                </th>
                {selectedMotors.map((m) => (
                  <th key={m.id} className="p-3 align-top min-w-[200px]">
                    <div className="relative group bg-[#070d1e] p-3 rounded-2xl border border-sky-800/60 shadow-md">
                      {selectedMotors.length > 1 && (
                        <button
                          onClick={() => handleRemoveMotor(m.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-900/90 text-rose-300 hover:bg-rose-700 rounded-full flex items-center justify-center border border-rose-500/50 transition-colors shadow-sm cursor-pointer"
                          title="Hapus dari komparasi"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-28 object-cover rounded-xl mb-2.5"
                      />
                      <div className="flex items-center gap-1 mb-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-500/30">
                          {m.categoryLabel}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          (m.rentalStatus ? m.rentalStatus === 'available' : m.isAvailable)
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                            : 'bg-rose-950 text-rose-300 border-rose-500/40'
                        }`}>
                          {(m.rentalStatus ? m.rentalStatus === 'available' : m.isAvailable) ? '● Tersedia' : '● Habis'}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-tight">
                        {m.name}
                      </h4>
                      <div className="mt-1.5 flex items-baseline gap-1">
                        <span className="text-base font-black text-amber-300 font-['Outfit']">
                          {formatRupiah(m.dailyPrice)}
                        </span>
                        <span className="text-[11px] text-slate-400">/hari</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectForBooking(m);
                        }}
                        className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-sky-900/40 transition-all cursor-pointer"
                      >
                        <span>Pesan Unit Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-sky-900/30">
              {/* Tarif Mingguan */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Tarif Mingguan (7 Hari)</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 font-bold text-cyan-300">
                    {formatRupiah(m.weeklyPrice)} <span className="text-[10px] text-slate-400">(Hemat 1 hari!)</span>
                  </td>
                ))}
              </tr>

              {/* Kapasitas Mesin */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Kapasitas Mesin</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3">
                    <span className="font-extrabold text-white text-sm">{m.engineCc} cc</span> ({m.transmission})
                  </td>
                ))}
              </tr>

              {/* Konsumsi BBM & Tangki */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Efisiensi & Tangki</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-emerald-400 font-bold">
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5" />
                      <span>{m.fuelConsumption}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-normal">Kapasitas: {m.fuelTank}</span>
                  </td>
                ))}
              </tr>

              {/* Karakteristik Tanjakan & Medan */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Performa Medan & Tanjakan</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-slate-200">
                    {m.category === 'trail' && (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                        <Zap className="w-3.5 h-3.5" /> Raja Medan Berat & Lautan Pasir Bromo
                      </span>
                    )}
                    {m.engineCc >= 160 && (
                      <span className="inline-flex items-center gap-1 text-sky-300 font-bold">
                        <Zap className="w-3.5 h-3.5" /> Sangat Bertenaga Tanjakan Boncengan Batu
                      </span>
                    )}
                    {m.engineCc < 160 && m.category !== 'trail' && (
                      <span className="inline-flex items-center gap-1 text-teal-300 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> Lincah Perkotaan & Tanjakan Standar
                      </span>
                    )}
                    <div className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                      {m.suitableFor.join(' • ')}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Sistem Pengereman & Keamanan */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Sistem Pengereman</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-slate-200">
                    <div className="flex items-center gap-1 text-sky-200 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{m.specs.brakes}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Kapasitas Bagasi & Penyimpanan */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Kapasitas Bagasi</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-slate-300">
                    {m.specs.storage}
                  </td>
                ))}
              </tr>

              {/* Sistem Kunci & Starter */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Fitur Kontak / Kunci</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-slate-300">
                    {m.specs.startSystem}
                  </td>
                ))}
              </tr>

              {/* Fasilitas Standar */}
              <tr className="hover:bg-sky-950/20">
                <td className="p-3 font-semibold text-slate-300">Termasuk Gratis</td>
                {selectedMotors.map((m) => (
                  <td key={m.id} className="p-3 text-emerald-300 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>2 Helm SNI Higienis</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>2 Jas Hujan Tebal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone Holder GPS Stang</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Gratis Antar Stasiun</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-sky-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            💡 <strong className="text-slate-300">Tips RyokouRent:</strong> Untuk rute boncengan ke pegunungan Batu & Cangar, disarankan memilih minimal <strong className="text-amber-300">125cc atau 160cc</strong>.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-200 hover:text-white transition-colors cursor-pointer"
          >
            Tutup Komparasi
          </button>
        </div>
      </div>
    </div>
  );
};
