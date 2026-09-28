import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  MessageCircle, 
  Copy, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Clock
} from 'lucide-react';
import { MotorItem, PickupLocation, ReservationFormData, ReservationRecord } from '../types/rental';
import { PICKUP_LOCATIONS, ADD_ON_OPTIONS } from '../data/mockData';
import { useFleet } from '../context/FleetContext';
import { formatRupiah, OFFICIAL_WA_DISPLAY } from '../utils/whatsapp';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMotorId?: string;
  preselectedPickupId?: string;
  preselectedStartDate?: string;
  preselectedEndDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedMotorId,
  preselectedPickupId,
  preselectedStartDate,
  preselectedEndDate,
}) => {
  const { fleet } = useFleet();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [motorId, setMotorId] = useState<string>(preselectedMotorId || 'vario-160');
  const [startDate, setStartDate] = useState<string>(preselectedStartDate || tomorrow);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endDate, setEndDate] = useState<string>(preselectedEndDate || dayAfter);
  const [endTime, setEndTime] = useState<string>('08:00');
  
  const [pickupLocationId, setPickupLocationId] = useState<string>(preselectedPickupId || 'loc-garasi-malang');
  const [pickupAddressDetail, setPickupAddressDetail] = useState<string>('');
  const [returnLocationId, setReturnLocationId] = useState<string>(preselectedPickupId || 'loc-garasi-malang');
  const [returnAddressDetail, setReturnAddressDetail] = useState<string>('');

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [identityType, setIdentityType] = useState<'KTP' | 'SIM A' | 'Paspor' | 'KTM'>('KTP');
  const [identityNumber, setIdentityNumber] = useState<string>('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [helmetCount, setHelmetCount] = useState<number>(2);
  const [raincoatCount, setRaincoatCount] = useState<number>(2);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<ReservationRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedMotorId) setMotorId(preselectedMotorId);
    if (preselectedPickupId) {
      setPickupLocationId(preselectedPickupId);
      setReturnLocationId(preselectedPickupId);
    }
    if (preselectedStartDate) setStartDate(preselectedStartDate);
    if (preselectedEndDate) setEndDate(preselectedEndDate);
  }, [preselectedMotorId, preselectedPickupId, preselectedStartDate, preselectedEndDate]);

  if (!isOpen) return null;

  const currentMotor = fleet.find((m) => m.id === motorId) || fleet[0];
  const pickupLoc = PICKUP_LOCATIONS.find((l) => l.id === pickupLocationId);
  const returnLoc = PICKUP_LOCATIONS.find((l) => l.id === returnLocationId);

  // Calculate duration
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  const diffHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  const durationDays = Math.max(1, Math.ceil(diffHours / 24));

  // Calculate pricing breakdown
  const motorPriceTotal = currentMotor.dailyPrice * durationDays;
  const pickupFee = (pickupLoc?.extraFee || 0) + (returnLoc?.extraFee || 0);
  let addOnsTotal = 0;
  selectedAddOns.forEach((addonId) => {
    const item = ADD_ON_OPTIONS.find((a) => a.id === addonId);
    if (item && !item.isFree) {
      addOnsTotal += item.pricePerDay * durationDays;
    }
  });
  const grandTotal = motorPriceTotal + pickupFee + addOnsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Harap isi Nama Lengkap dan Nomor WhatsApp Anda.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Harap menyetujui syarat & ketentuan rental sebelum melanjutkan.');
      return;
    }

    setIsSubmitting(true);

    const payload: ReservationFormData = {
      motorId,
      startDate,
      startTime,
      endDate,
      endTime,
      pickupLocationId,
      pickupAddressDetail,
      returnLocationId,
      returnAddressDetail,
      customerName,
      customerPhone,
      customerEmail,
      identityType,
      identityNumber,
      selectedAddOns,
      customerNotes,
      helmetCount,
      raincoatCount,
    };

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Gagal memproses reservasi.');
      }

      setConfirmedReservation(result.data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBookingId = () => {
    if (confirmedReservation?.id) {
      navigator.clipboard.writeText(confirmedReservation.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0d1613] border border-emerald-800/60 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#09110e] border-b border-emerald-900/60 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                {confirmedReservation ? 'Reservasi Berhasil Dibuat!' : 'Formulir Reservasi Online Motor'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {confirmedReservation
                  ? 'Konfirmasi instan ke admin WhatsApp untuk verifikasi unit'
                  : 'Tarif transparan tanpa biaya tersembunyi • Konfirmasi via WhatsApp'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {confirmedReservation ? (
          /* SUCCESS SCREEN */
          <div className="p-4 sm:p-8 space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                Tiket Reservasi Terbit!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Data booking Anda telah tercatat di sistem RyokouRent Malang & Batu. Langkah terakhir: silakan kirimkan format pemesanan ini ke WhatsApp admin untuk kunci jadwal serah terima.
              </p>
            </div>

            {/* Booking Code Box */}
            <div className="bg-[#09110e] border border-emerald-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl mx-auto">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">KODE BOOKING ANDA:</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 tracking-wider">
                  {confirmedReservation.id}
                </span>
              </div>
              <button
                onClick={handleCopyBookingId}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            {/* Summary Ticket Details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs text-slate-300 max-w-xl mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Unit Motor:</span>
                <span className="font-bold text-white">{currentMotor.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Jadwal Sewa:</span>
                <span className="font-medium text-white">
                  {confirmedReservation.startDate} ({confirmedReservation.startTime}) s/d {confirmedReservation.endDate} ({confirmedReservation.endTime})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Durasi:</span>
                <span className="font-bold text-emerald-400">{confirmedReservation.durationDays} Hari</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Titik Antar:</span>
                <span className="font-medium text-white">{pickupLoc?.name}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-slate-200">Total Estimasi:</span>
                <span className="text-amber-400">{formatRupiah(confirmedReservation.grandTotal)}</span>
              </div>
            </div>

            {/* Big WhatsApp CTA Button */}
            <div className="max-w-xl mx-auto pt-2 space-y-3">
              <a
                href={confirmedReservation.waMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-950 flex items-center justify-center gap-2.5 transition-all active:scale-95 text-center cursor-pointer border border-emerald-400/40"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Kirim Format Reservasi ke WhatsApp Sekarang</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-center text-slate-400">
                Admin bersiaga di WhatsApp: <strong className="text-emerald-400">{OFFICIAL_WA_DISPLAY}</strong> (Respon rata-rata 3-5 menit)
              </p>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    setConfirmedReservation(null);
                    onClose();
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Selesai & Tutup Jendela
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Motor Selection & Schedule */}
            <div className="bg-[#09110e] border border-emerald-900/40 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                1. Pilih Motor & Jadwal Sewa
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Motor Select */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Armada Motor:
                  </label>
                  <select
                    value={motorId}
                    onChange={(e) => setMotorId(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {fleet.map((motor) => {
                      const isAvail = motor.rentalStatus ? motor.rentalStatus === 'available' : motor.isAvailable;
                      return (
                        <option key={motor.id} value={motor.id}>
                          {motor.name} - {formatRupiah(motor.dailyPrice)}/hari ({isAvail ? '🟢 Tersedia' : '🔴 Habis'})
                        </option>
                      );
                    })}
                  </select>
                  {currentMotor && (currentMotor.rentalStatus ? currentMotor.rentalStatus !== 'available' : !currentMotor.isAvailable) && (
                    <div className="mt-1.5 p-2 rounded-lg bg-rose-950/60 border border-rose-800/80 text-[11px] text-rose-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Status unit saat ini: <strong>Habis / Sedang Disewa</strong>. Anda tetap dapat melanjutkan reservasi untuk tanggal mendatang, dan admin kami akan mencocokkan jadwal.</span>
                    </div>
                  )}
                </div>

                {/* Start Date & Time */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Tanggal Mulai:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Jam Ambil:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300">Durasi Sewa:</span>
                  <span className="font-bold text-amber-400 text-sm">{durationDays} Hari (24 Jam)</span>
                </div>

                {/* End Date & Time */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Tanggal Selesai:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Jam Kembali:
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 p-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hitungan sewa per 24 jam fleksibel</span>
                </div>
              </div>
            </div>

            {/* STEP 2: Delivery & Return Locations */}
            <div className="bg-[#09110e] border border-emerald-900/40 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                2. Lokasi Serah Terima Motor
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pickup */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Titik Antar (Mulai):
                  </label>
                  <select
                    value={pickupLocationId}
                    onChange={(e) => setPickupLocationId(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {PICKUP_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.extraFee > 0 ? `(+${formatRupiah(loc.extraFee)})` : '(Gratis)'}
                      </option>
                    ))}
                  </select>
                  {pickupLoc?.mapUrl && (
                    <a
                      href={pickupLoc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-1.5 font-medium underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Lihat Lokasi Garasi Sewa Motor Ryokou di Google Maps</span>
                    </a>
                  )}
                  <input
                    type="text"
                    placeholder="Detail tempat (misal: Pintu Timur Stasiun Kotabaru / Kamar Hotel / Lobby Villa)..."
                    value={pickupAddressDetail}
                    onChange={(e) => setPickupAddressDetail(e.target.value)}
                    className="mt-2 w-full bg-[#0d1613] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Return */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Titik Pengembalian:
                  </label>
                  <select
                    value={returnLocationId}
                    onChange={(e) => setReturnLocationId(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {PICKUP_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.extraFee > 0 ? `(+${formatRupiah(loc.extraFee)})` : '(Gratis)'}
                      </option>
                    ))}
                  </select>
                  {returnLoc?.mapUrl && (
                    <a
                      href={returnLoc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-1.5 font-medium underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Lihat Lokasi Garasi Sewa Motor Ryokou di Google Maps</span>
                    </a>
                  )}
                  <input
                    type="text"
                    placeholder="Detail tempat pengembalian (misal: Stasiun Kotabaru / Garasi Dinoyo Jl. Mt Haryono)..."
                    value={returnAddressDetail}
                    onChange={(e) => setReturnAddressDetail(e.target.value)}
                    className="mt-2 w-full bg-[#0d1613] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: Equipment & Addons */}
            <div className="bg-[#09110e] border border-emerald-900/40 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                3. Fasilitas & Aksesori Tambahan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Helm SNI Bersih</span>
                    <span className="text-[10px] text-emerald-400">Gratis (Termasuk Standar)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHelmetCount(Math.max(1, helmetCount - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{helmetCount}</span>
                    <button
                      type="button"
                      onClick={() => setHelmetCount(Math.min(2, helmetCount + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Jas Hujan Tebal</span>
                    <span className="text-[10px] text-emerald-400">Gratis (Termasuk di Bagasi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRaincoatCount(Math.max(1, raincoatCount - 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{raincoatCount}</span>
                    <button
                      type="button"
                      onClick={() => setRaincoatCount(Math.min(2, raincoatCount + 1))}
                      className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Paid / Optional Accessories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {ADD_ON_OPTIONS.filter((a) => !a.isFree).map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon.id)}
                          className="rounded text-emerald-600 focus:ring-0 focus:outline-none"
                        />
                        <div>
                          <span className="font-medium block">{addon.name}</span>
                          <span className="text-[10px] text-slate-400">{addon.description}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 shrink-0 ml-2">
                        +{formatRupiah(addon.pricePerDay)}/hr
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Renter Information */}
            <div className="bg-[#09110e] border border-emerald-900/40 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                4. Data Diri Penyewa
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Nama Lengkap (Sesuai KTP): *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Wicaksono"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Nomor WhatsApp Aktif: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Email (Opsional):
                  </label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Dokumen Jaminan Utama:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['KTP', 'SIM A', 'Paspor', 'KTM'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setIdentityType(type)}
                        className={`py-1.5 text-center text-xs rounded-lg border font-medium ${
                          identityType === type
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-[#0d1613] border-slate-700 text-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Catatan / Permintaan Khusus:
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Tolong siapkan helm ukuran L, kami tiba di Stasiun Malang Kotabaru naik KA Gajayana gerbong 3."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-[#0d1613] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-600/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/50">
                <span className="text-slate-300">
                  {currentMotor.name} ({durationDays} Hari x {formatRupiah(currentMotor.dailyPrice)}):
                </span>
                <span className="font-semibold text-white">{formatRupiah(motorPriceTotal)}</span>
              </div>

              {pickupFee > 0 && (
                <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/50">
                  <span className="text-slate-300">Biaya Antar / Ambil Khusus:</span>
                  <span className="font-semibold text-white">+{formatRupiah(pickupFee)}</span>
                </div>
              )}

              {addOnsTotal > 0 && (
                <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-900/50">
                  <span className="text-slate-300">Aksesori Tambahan:</span>
                  <span className="font-semibold text-white">+{formatRupiah(addOnsTotal)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm sm:text-base pt-1 font-bold">
                <span className="text-emerald-300">Total Biaya Rental:</span>
                <span className="text-amber-400 font-extrabold text-lg sm:text-xl">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-0"
              />
              <span>
                Saya menyetujui syarat sewa (menunjukkan e-KTP asli, memiliki SIM C yang masih berlaku, dan tidak memindahtangankan unit motor kepada pihak lain).
              </span>
            </label>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer border border-emerald-400/40"
              >
                {isSubmitting ? (
                  <span>Memproses Reservasi...</span>
                ) : (
                  <>
                    <span>Konfirmasi & Lanjut ke WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
