import { MotorItem, PickupLocation, ReservationFormData } from '../types/rental';

export const OFFICIAL_WA_NUMBER = '6285227366130';
export const OFFICIAL_WA_DISPLAY = '+62 852-2736-6130';
export const OFFICIAL_COMPANY_NAME = 'RyokouRent';
export const OFFICIAL_GARAGE_NAME = 'Sewa Motor Ryokou Malang';
export const OFFICIAL_GARAGE_LOCATION = 'Jl. Mt Haryono XXI, Dinoyo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144 (Sewa Motor Ryokou Malang)';
export const OFFICIAL_GARAGE_MAPS_URL = 'https://www.google.com/maps/place/Sewa+Motor+Ryokou+Malang/@-7.9365273,112.6085936,17z/data=!3m1!4b1!4m6!3m5!1s0x2e788328b2c88daf:0x8d9c145244188579!8m2!3d-7.9365273!4d112.6085936!16s%2Fg%2F11vs8qg8tr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateBookingId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `RYK-${dateStr}-${randomStr}`;
}

export function buildWhatsAppReservationLink(params: {
  bookingId: string;
  motor: MotorItem;
  pickupLoc?: PickupLocation;
  returnLoc?: PickupLocation;
  formData: ReservationFormData;
  durationDays: number;
  totalAmount: number;
}): string {
  const { bookingId, motor, pickupLoc, returnLoc, formData, durationDays, totalAmount } = params;

  const lines = [
    `*FORMULIR RESERVASI - ${OFFICIAL_COMPANY_NAME.toUpperCase()} MALANG & BATU*`,
    `----------------------------------------`,
    ` Halo Admin, saya ingin konfirmasi pemesanan sewa motor:`,
    ``,
    `*KODE BOOKING:* \`${bookingId}\``,
    `*NAMA PENYEWA:* ${formData.customerName}`,
    `*NO. WHATSAPP:* ${formData.customerPhone}`,
    `*IDENTITAS:* ${formData.identityType} (${formData.identityNumber || 'Akan diserahkan saat serah terima'})`,
    ``,
    `*DETAIL MOTOR:*`,
    `• Unit: *${motor.name}* (${motor.engineCc}cc / ${motor.year})`,
    `• Kategori: ${motor.categoryLabel}`,
    `• Durasi: *${durationDays} Hari* (${formatRupiah(motor.dailyPrice)}/hari)`,
    ``,
    `*JADWAL SEWA:*`,
    `• Mulai: ${formData.startDate} pk ${formData.startTime} WIB`,
    `• Selesai: ${formData.endDate} pk ${formData.endTime} WIB`,
    ``,
    `*LOKASI ANTAR & AMBIL:*`,
    `• Titik Antar: ${pickupLoc?.name || formData.pickupLocationId} ${formData.pickupAddressDetail ? `(${formData.pickupAddressDetail})` : ''}`,
    `• Titik Kembali: ${returnLoc?.name || formData.returnLocationId} ${formData.returnAddressDetail ? `(${formData.returnAddressDetail})` : ''}`,
    ``,
    `*PERLENGKAPAN GRATIS:*`,
    `• ${formData.helmetCount || 2} Helm SNI (Steril & Bersih)`,
    `• ${formData.raincoatCount || 2} Jas Hujan Tebal`,
    `• 1 Phone Holder 360° terpasang`,
    ``,
    formData.selectedAddOns && formData.selectedAddOns.length > 0
      ? `*TAMBAHAN AKSESORIS:* ${formData.selectedAddOns.join(', ')}\n`
      : '',
    formData.customerNotes ? `*CATATAN KHUSUS:* "${formData.customerNotes}"\n` : '',
    `----------------------------------------`,
    `*TOTAL ESTIMASI BIAYA:* *${formatRupiah(totalAmount)}*`,
    `----------------------------------------`,
    `Mohon info ketersediaan unit dan jadwal serah terima di Malang / Batu ya. Terima kasih!`,
  ].filter(Boolean);

  const rawMessage = lines.join('\n');
  return `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(rawMessage)}`;
}

export function buildQuickInquiryLink(motorName: string): string {
  const message = `Halo Admin ${OFFICIAL_COMPANY_NAME}, saya tertarik untuk sewa unit *${motorName}* di Malang & Batu. Apakah unit tersebut tersedia untuk jadwal sewa dalam waktu dekat? Mohon info tarif dan persyaratannya. Terima kasih!`;
  return `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralHelpLink(topic: string = 'Konsultasi Sewa'): string {
  const message = `Halo ${OFFICIAL_COMPANY_NAME} Malang & Batu, saya ingin konsultasi mengenai: *${topic}*. Mohon dibantu informasi selengkapnya. Terima kasih.`;
  return `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildAIPlanWhatsAppLink(motorName: string, destination: string, summary: string): string {
  const message = `Halo Admin ${OFFICIAL_COMPANY_NAME},\n\nSaya telah menggunakan fitur Asisten Rute AI di website Anda untuk tujuan: *${destination}* (Malang & Batu).\n\nRekomendasi motor: *${motorName}*\nRingkasan Rencana:\n${summary}\n\nApakah unit *${motorName}* siap untuk reservasi? Terima kasih!`;
  return `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
