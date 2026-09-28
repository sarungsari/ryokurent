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
  FileText,
  Printer,
  ShieldCheck,
  QrCode,
  Sparkles,
  Phone,
  Check
} from 'lucide-react';
import { ReservationRecord } from '../types/rental';
import { formatRupiah, OFFICIAL_WA_DISPLAY, OFFICIAL_GARAGE_LOCATION, OFFICIAL_GARAGE_MAPS_URL } from '../utils/whatsapp';
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
  const [showVoucherPrint, setShowVoucherPrint] = useState(false);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setReservation(null);
    setShowVoucherPrint(false);

    try {
      const response = await fetch(`/api/reservations/${encodeURIComponent(bookingCode.trim())}`);
      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.message || 'Kode booking tidak ditemukan di sistem kami.');
      }

      setReservation(resData.data);
    } catch (err: any) {
      setError(err?.message || 'Gagal mencari data booking. Pastikan kode booking tepat.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const motor = reservation ? fleet.find((m) => m.id === reservation.motorId) : null;
  const pickupLoc = reservation ? PICKUP_LOCATIONS.find((l) => l.id === reservation.pickupLocationId) : null;
  const returnLoc = reservation ? PICKUP_LOCATIONS.find((l) => l.id === reservation.returnLocationId) : null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Terkonfirmasi (Siap Jalan)', bg: 'bg-emerald-950 text-emerald-300 border-emerald-500/40' };
      case 'active':
        return { label: 'Unit Sedang Disewa', bg: 'bg-blue-950 text-blue-300 border-blue-500/40' };
      case 'completed':
        return { label: 'Sewa Selesai', bg: 'bg-slate-800 text-slate-300 border-slate-600' };
      case 'cancelled':
        return { label: 'Dibatalkan', bg: 'bg-rose-950 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Menunggu Verifikasi WhatsApp', bg: 'bg-amber-950 text-amber-300 border-amber-500/40' };
    }
  };

  const statusBadge = getStatusBadge(reservation?.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0c1630] border border-sky-700/50 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-5 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-950 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-['Outfit']">
                Cek Status & E-Voucher Reservasi
              </h3>
              <p className="text-xs text-sky-200/70">
                Lacak status unit atau cetak tiket digital RyokouRent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white flex items-center justify-center transition-colors border border-sky-800/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input form */}
        <form onSubmit={handleLookup} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-sky-300 mb-1.5">
              Masukkan Kode Booking Reservasi Anda:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: RYK-260927-ABCD"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#070d1e] border border-sky-700/60 rounded-2xl px-3.5 py-2.5 text-xs font-mono tracking-wider text-white uppercase focus:outline-none focus:border-sky-400 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-sky-900/40"
              >
                {isLoading ? 'Mencari...' : 'Cek Status'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Reservation Found */}
        {reservation && (
          <div className="mt-5 space-y-4">
            {/* Status Summary Card */}
            <div className="p-4 bg-[#070d1e] border border-sky-800/60 rounded-2xl space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-sky-900/60">
                <div>
                  <span className="text-[10px] text-slate-400 block">KODE TIKET:</span>
                  <span className="font-mono text-amber-300 font-extrabold text-sm">{reservation.id}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${statusBadge.bg}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {statusBadge.label}
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Nama Penyewa:</span>
                  <span className="font-bold text-white">{reservation.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Unit Sepeda Motor:</span>
                  <span className="font-bold text-sky-300">{motor?.name || reservation.motorId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Durasi Sewa:</span>
                  <span className="font-semibold text-white">
                    {reservation.durationDays} Hari ({reservation.startDate} pk {reservation.startTime} s/d {reservation.endDate} pk {reservation.endTime})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Titik Serah Terima:</span>
                  <span className="font-medium text-white">{pickupLoc?.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sky-900/60 text-sm font-bold">
                  <span className="text-white">Total Tagihan:</span>
                  <span className="text-amber-300 font-black font-['Outfit'] text-base">
                    {formatRupiah(reservation.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowVoucherPrint(!showVoucherPrint)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-700/60 text-sky-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>{showVoucherPrint ? 'Sembunyikan E-Voucher' : 'Lihat & Cetak E-Voucher'}</span>
                </button>
                <a
                  href={reservation.waMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hubungi CS WhatsApp</span>
                </a>
              </div>
            </div>

            {/* E-Voucher Digital Card (Print Ready) */}
            {showVoucherPrint && (
              <div className="p-4 sm:p-5 bg-white text-slate-900 rounded-2xl shadow-xl space-y-3 text-xs border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-300">
                  <div>
                    <div className="text-xs font-black uppercase text-sky-700 tracking-wider">
                      RyokouRent Malang & Kota Batu
                    </div>
                    <div className="text-lg font-black text-slate-900 font-['Outfit']">
                      E-VOUCHER SEWA KENDARAAN
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                      {reservation.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block">Penyewa:</span>
                    <strong className="text-slate-900">{reservation.customerName}</strong>
                    <div className="text-slate-600">{reservation.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Armada:</span>
                    <strong className="text-sky-700">{motor?.name}</strong>
                    <div className="text-slate-600">{motor?.engineCc}cc • {motor?.categoryLabel}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Waktu Mulai:</span>
                    <strong className="text-slate-900">{reservation.startDate} ({reservation.startTime} WIB)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Waktu Pengembalian:</span>
                    <strong className="text-slate-900">{reservation.endDate} ({reservation.endTime} WIB)</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Lokasi Serah Terima:</span>
                    <strong className="text-slate-900">{pickupLoc?.name}</strong>
                  </div>
                </div>

                {/* Free Inclusions Checklist */}
                <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100 text-[11px]">
                  <span className="font-bold text-sky-900 block mb-1">Kelengkapan Standar Siap Diterima:</span>
                  <div className="grid grid-cols-2 gap-1 text-slate-700">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2 Helm SNI Bersih</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2 Jas Hujan Setelan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Phone Holder GPS Stang</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bantuan Darurat 24 Jam</span>
                    </div>
                  </div>
                </div>

                {/* Print button */}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 italic">
                    Tunjukkan e-voucher ini beserta e-KTP asli saat serah terima unit.
                  </span>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-1.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Tiket</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
