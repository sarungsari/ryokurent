import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  MessageCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ReservationRecord } from '../types/rental';
import { formatRupiah, OFFICIAL_WA_DISPLAY } from '../utils/whatsapp';
import { PICKUP_LOCATIONS } from '../data/mockData';
import { useFleet } from '../context/FleetContext';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({ isOpen, onClose }) => {
  const { fleet } = useFleet();
  const [bookingCode, setBookingCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationRecord | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setReservation(null);

    try {
      const response = await fetch(`/api/reservations/${encodeURIComponent(bookingCode.trim())}`);
      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.message || 'Kode booking tidak ditemukan di sistem kami.');
      }

      setReservation(resData.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal mencari data booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const motor = reservation ? fleet.find((m) => m.id === reservation.motorId) : null;
  const pickupLoc = reservation ? PICKUP_LOCATIONS.find((l) => l.id === reservation.pickupLocationId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e1714] border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Cek Status & Bukti Reservasi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLookup} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Masukkan Kode Booking Anda:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: BLT-260927-XXXX"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#09110e] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono tracking-wider text-white uppercase focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Mencari...' : 'Cari'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {reservation && (
          <div className="mt-5 p-4 bg-slate-900/70 border border-emerald-900/50 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-mono text-amber-400 font-bold">{reservation.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Tercatat di Sistem
              </span>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Penyewa:</span>
                <span className="font-medium text-white">{reservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unit Motor:</span>
                <span className="font-medium text-emerald-300">{motor?.name || reservation.motorId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jadwal:</span>
                <span className="font-medium text-white">
                  {reservation.startDate} ({reservation.startTime}) s/d {reservation.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Titik Antar:</span>
                <span className="font-medium text-white">{pickupLoc?.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-slate-200">Total Biaya:</span>
                <span className="text-amber-400">{formatRupiah(reservation.grandTotal)}</span>
              </div>
            </div>

            <a
              href={reservation.waMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Buka Chat WhatsApp Konfirmasi</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
