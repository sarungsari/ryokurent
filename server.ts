import express, { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { FLEET_DATA, PICKUP_LOCATIONS, ADD_ON_OPTIONS } from './src/data/mockData.ts';
import { generateBookingId, buildWhatsAppReservationLink } from './src/utils/whatsapp.ts';
import { ReservationRecord, ReservationFormData, AIRecommendationResponse, MotorItem } from './src/types/rental.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Increase limit to 25mb for operator photo uploads (base64)
app.use(express.json({ limit: '25mb' }));

// In-memory store for active reservations
const reservationsStore: Map<string, ReservationRecord> = new Map();

// In-memory mutable store for fleet
let fleetStore: MotorItem[] = [...FLEET_DATA];

// API: Get Fleet Data
app.get('/api/fleet', (_req: Request, res: Response) => {
  res.json({ success: true, data: fleetStore });
});

// API: Add New Motor Unit (Operator)
app.post('/api/fleet', (req: Request, res: Response) => {
  try {
    const motor = req.body as Partial<MotorItem>;
    if (!motor.name || !motor.dailyPrice) {
      return res.status(400).json({ success: false, message: 'Nama motor dan harga harian wajib diisi.' });
    }
    const cleanId = motor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
    const id = motor.id || cleanId;
    const newMotor: MotorItem = {
      id,
      name: motor.name,
      brand: motor.brand || 'Honda',
      category: motor.category || 'matic',
      categoryLabel: motor.categoryLabel || 'Matic Lincah',
      year: Number(motor.year) || 2024,
      engineCc: Number(motor.engineCc) || 110,
      transmission: motor.transmission || 'Automatic',
      fuelTank: motor.fuelTank || '4.2 Liter',
      fuelConsumption: motor.fuelConsumption || '55 km/L',
      dailyPrice: Number(motor.dailyPrice),
      weeklyPrice: Number(motor.weeklyPrice || Number(motor.dailyPrice) * 6),
      image: motor.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
      badges: Array.isArray(motor.badges) && motor.badges.length > 0 ? motor.badges : ['Unit Baru', 'Siap Pakai'],
      isAvailable: motor.isAvailable !== false,
      rentalStatus: motor.rentalStatus || 'available',
      isPopular: !!motor.isPopular,
      isPromo: !!motor.isPromo,
      description: motor.description || 'Armada prima RyokouRent Malang & Kota Wisata Batu.',
      suitableFor: Array.isArray(motor.suitableFor) && motor.suitableFor.length > 0 ? motor.suitableFor : ['Keliling Kota Malang & Wisata Batu'],
      specs: motor.specs || {
        power: 'Standar Pabrikan',
        brakes: 'Combi Brake System (CBS)',
        storage: 'Bagasi Helm & Jas Hujan',
        startSystem: 'Electric Starter',
      },
    };
    fleetStore.unshift(newMotor);
    return res.status(201).json({ success: true, data: newMotor, message: 'Unit motor berhasil ditambahkan!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Gagal menambahkan unit motor.' });
  }
});

// API: Update Motor Unit (Operator)
app.put('/api/fleet/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = fleetStore.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Unit motor tidak ditemukan.' });
  }
  fleetStore[index] = {
    ...fleetStore[index],
    ...req.body,
    id,
    dailyPrice: req.body.dailyPrice !== undefined ? Number(req.body.dailyPrice) : fleetStore[index].dailyPrice,
    weeklyPrice: req.body.weeklyPrice !== undefined ? Number(req.body.weeklyPrice) : fleetStore[index].weeklyPrice,
  };
  return res.json({ success: true, data: fleetStore[index], message: 'Data motor berhasil diperbarui!' });
});

// API: Delete Motor Unit (Operator)
app.delete('/api/fleet/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = fleetStore.length;
  fleetStore = fleetStore.filter((m) => m.id !== id);
  if (fleetStore.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Unit motor tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Unit motor berhasil dihapus dari sistem.' });
});

// API: Get Pickup Locations & Add-ons
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    success: true,
    pickupLocations: PICKUP_LOCATIONS,
    addOns: ADD_ON_OPTIONS,
  });
});

// API: Create Reservation
app.post('/api/reservations', (req: Request, res: Response) => {
  try {
    const formData = req.body as ReservationFormData;
    if (!formData.motorId || !formData.customerName || !formData.customerPhone || !formData.startDate || !formData.endDate) {
      return res.status(400).json({ success: false, message: 'Harap lengkapi semua kolom wajib reservasi.' });
    }

    const motor = fleetStore.find((m) => m.id === formData.motorId) || FLEET_DATA.find((m) => m.id === formData.motorId);
    if (!motor) {
      return res.status(404).json({ success: false, message: 'Motor yang dipilih tidak ditemukan.' });
    }

    const pickupLoc = PICKUP_LOCATIONS.find((l) => l.id === formData.pickupLocationId);
    const returnLoc = PICKUP_LOCATIONS.find((l) => l.id === formData.returnLocationId);

    // Calculate duration in days (minimum 1 day)
    const start = new Date(`${formData.startDate}T${formData.startTime || '08:00'}`);
    const end = new Date(`${formData.endDate}T${formData.endTime || '08:00'}`);
    const diffMs = end.getTime() - start.getTime();
    const durationDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const baseMotorTotal = motor.dailyPrice * durationDays;

    let addOnsTotal = 0;
    if (formData.selectedAddOns && formData.selectedAddOns.length > 0) {
      formData.selectedAddOns.forEach((addonId) => {
        const item = ADD_ON_OPTIONS.find((a) => a.id === addonId);
        if (item && !item.isFree) {
          addOnsTotal += item.pricePerDay * durationDays;
        }
      });
    }

    const pickupFeeTotal = (pickupLoc?.extraFee || 0) + (returnLoc?.extraFee || 0);
    const grandTotal = baseMotorTotal + addOnsTotal + pickupFeeTotal;

    const bookingId = generateBookingId();
    const waMessageUrl = buildWhatsAppReservationLink({
      bookingId,
      motor,
      pickupLoc,
      returnLoc,
      formData,
      durationDays,
      totalAmount: grandTotal,
    });

    const record: ReservationRecord = {
      ...formData,
      id: bookingId,
      createdAt: new Date().toISOString(),
      durationDays,
      baseMotorTotal,
      addOnsTotal,
      pickupFeeTotal,
      grandTotal,
      status: 'pending',
      waMessageUrl,
    };

    reservationsStore.set(bookingId, record);

    return res.status(201).json({
      success: true,
      message: 'Reservasi berhasil dibuat! Silakan lanjutkan ke WhatsApp untuk verifikasi.',
      data: record,
    });
  } catch (error: any) {
    console.error('Reservation error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Gagal memproses reservasi.' });
  }
});

// API: Get All Reservations (Operator)
app.get('/api/reservations', (_req: Request, res: Response) => {
  const list = Array.from(reservationsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return res.json({ success: true, data: list });
});

// API: Lookup Reservation by ID
app.get('/api/reservations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = reservationsStore.get(id?.toUpperCase());
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Kode booking tidak ditemukan.' });
  }
  return res.json({ success: true, data: booking });
});

// API: Update Reservation Status (Operator)
app.patch('/api/reservations/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = reservationsStore.get(id?.toUpperCase());
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Kode booking tidak ditemukan.' });
  }
  booking.status = status;
  reservationsStore.set(id.toUpperCase(), booking);
  return res.json({ success: true, data: booking, message: 'Status reservasi berhasil diperbarui.' });
});

// API: AI Trip & Motorcycle Advisor (High Thinking Mode with gemini-3.1-pro-preview)
app.post('/api/ai/trip-planner', async (req: Request, res: Response) => {
  const { destination, passengers = 1, ridingStyle = 'santai', experienceLevel = 'menengah', notes = '' } = req.body;

  const fleetSummary = fleetStore.map(
    (m) => `- ID: ${m.id}, Nama: ${m.name}, CC: ${m.engineCc}cc, Kategori: ${m.categoryLabel}, Harga: Rp ${m.dailyPrice.toLocaleString('id-ID')}/hari, Cocok: ${m.suitableFor.join(', ')}`
  ).join('\n');

  const prompt = `Analisis rencana perjalanan motor di Malang Raya dan Kota Wisata Batu (serta kawasan Gunung Bromo / Pujon / Cangar) berikut:
Tujuan / Rute Wisata: ${destination || 'Kota Wisata Batu, Paralayang, dan Pemandian Cangar'}
Jumlah Penumpang: ${passengers} orang
Gaya Berkendara: ${ridingStyle}
Tingkat Pengalaman: ${experienceLevel}
Catatan Tambahan: ${notes || 'Tidak ada'}

Daftar Armada RyokouRent Malang & Batu yang Tersedia:
${fleetSummary}

Tugas Anda:
Pilih SATU motor paling optimal dari daftar ID motor di atas.
Berikan pertimbangan mendalam mengenai kontur medan (misalnya tanjakan curam Payung Batu, turunan ekstrem Klemuk, jalan berliku Cangar, lautan pasir Bromo, atau lalu lintas perkotaan Kayutangan Malang), faktor keselamatan (rem CBS/ABS, engine brake, transmisi), pitstop terbaik, estimasi bahan bakar, dan tips keamanan berkendara di iklim pegunungan Malang & Batu.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    // As required: gemini-3.1-pro-preview with thinkingLevel: ThinkingLevel.HIGH and no maxOutputTokens
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `Anda adalah Chief Adventure & Fleet Specialist dari RyokouRent Malang & Kota Wisata Batu (ahli rute tanjakan pegunungan Batu, Cangar, Pujon, Klemuk, dan Bromo via Tumpang).
Berikan analisis mendalam berbasis penalaran tinggi untuk memberikan rekomendasi motor dan strategi rute teraman.
Format respon Anda HARUS berupa JSON valid dengan skema berikut:
{
  "recommendedMotorId": "ID_DARI_ARMADA_DIATAS",
  "motorName": "Nama Lengkap Motor",
  "confidenceScore": 95,
  "reason": "Penjelasan mengapa motor ini paling cocok untuk rute dan kondisi penumpang tersebut",
  "routeHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "terrainAlerts": ["Peringatan medan 1", "Peringatan tanjakan/turunan 2"],
  "pitstops": ["Rekomendasi warung kopi/istirahat 1", "Spot foto 2"],
  "safetyTips": ["Tips keselamatan 1", "Tips keselamatan 2"],
  "estimatedFuelCost": "Rp 25.000 - Rp 35.000 (Pertalite)",
  "thinkingAnalysis": "Ringkasan pertimbangan mendalam tentang daya tanjak, kenyamanan suspensi, dan kestabilan pengereman"
}`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedMotorId: { type: Type.STRING },
            motorName: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            routeHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            terrainAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pitstops: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safetyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            estimatedFuelCost: { type: Type.STRING },
            thinkingAnalysis: { type: Type.STRING },
          },
          required: [
            'recommendedMotorId',
            'motorName',
            'confidenceScore',
            'reason',
            'routeHighlights',
            'terrainAlerts',
            'pitstops',
            'safetyTips',
            'estimatedFuelCost',
          ],
        },
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from Gemini');
    }

    const parsedData: AIRecommendationResponse = JSON.parse(textOutput);
    return res.json({ success: true, data: parsedData, isAiPowered: true });
  } catch (err: any) {
    console.warn('Gemini 3.1 Pro high-thinking invocation fallback:', err?.message || err);

    // Fallback logic tailored to destination in Malang & Batu
    const destLower = (destination || '').toLowerCase();
    let fallbackId = 'vario-160';
    let fallbackName = 'Honda Vario 160 eSP+ CBS';
    let fallbackReason = 'Mesin 160cc eSP+ sangat bertenaga untuk akselerasi tanjakan Kota Batu dan lincah bermanuver di dalam kota Malang.';

    if (destLower.includes('offroad') || destLower.includes('bromo') || destLower.includes('pasir') || destLower.includes('cangar') || destLower.includes('brakseng')) {
      fallbackId = 'crf-150l';
      fallbackName = 'Honda CRF 150 L Extreme';
      fallbackReason = 'Jalur lautan pasir Bromo, medan bergelombang, dan tanjakan perkebunan Brakseng membutuhkan suspensi Upside Down dan ban dual-purpose agar stabil dan aman.';
    } else if (destLower.includes('street') || destLower.includes('sporty') || destLower.includes('lincah')) {
      fallbackId = 'beat-street-2025';
      fallbackName = 'Honda All New BeAT Street 2025';
      fallbackReason = 'Generasi terbaru dengan velg 12 inci berban gambot dan stang naked ergonomis, sangat lincah bermanuver di jalanan kota Malang dan tanjakan santai Batu.';
    } else if (destLower.includes('kayutangan') || destLower.includes('cafe') || destLower.includes('foto') || destLower.includes('heritage')) {
      fallbackId = 'scoopy-2024';
      fallbackName = 'Honda Scoopy 2024 Smart Key';
      fallbackReason = 'Gaya retro modern yang sangat ikonik untuk hunting foto di Kayutangan Heritage Malang dan cafe-cafe hits Kota Batu, hemat bensin hingga 59 km/liter.';
    } else if (passengers > 1 || destLower.includes('tanjakan') || destLower.includes('pujon')) {
      fallbackId = 'vario-160';
      fallbackName = 'Honda Vario 160 eSP+ CBS';
      fallbackReason = 'Mesin 160cc 4-katup eSP+ sangat bertenaga untuk akselerasi tanjakan Kota Batu saat berboncengan 2 orang.';
    }

    const fallbackResponse: AIRecommendationResponse = {
      recommendedMotorId: fallbackId,
      motorName: fallbackName,
      confidenceScore: 95,
      reason: fallbackReason,
      routeHighlights: [
        'Eksplorasi panorama Kota Wisata Batu, Paralayang, dan Coban Rondo',
        'Singgah di Cafe Sawah Pujon atau Pos Ketan Legenda 1967 Batu',
        'Spot foto cagar budaya Kayutangan Heritage & suasana sejuk pegunungan',
      ],
      terrainAlerts: [
        'Tanjakan curam Payung Batu: Gunakan tarikan gas stabil dan jaga jarak aman',
        'Kewaspadaan turunan panjang Cangar / Klemuk: Manfaatkan engine brake dan jangan hanya menahan satu tuas rem terus-menerus',
      ],
      pitstops: [
        'Pos Ketan Legenda 1967 (Ketan durian khas Alun-Alun Batu)',
        'Cafe Sawah Pujon Kidul (Nuansa persawahan asri dan udara sejuk)',
        'Warung Wareg Batu (Gurami bakar & sambal terasi khas Malang)',
      ],
      safetyTips: [
        'Gunakan selalu 2 helm SNI yang telah kami sediakan',
        'Gunakan sarung tangan karena udara Batu dan Bromo dapat mencapai suhu 14°C',
        'Simpan jas hujan anti-rembes di bagasi motor karena cuaca pegunungan sering berkabut/gerimis',
      ],
      estimatedFuelCost: 'Rp 25.000 - Rp 35.000 (Pertalite)',
      thinkingAnalysis:
        'Penalaran armada mempertimbangkan rasio bobot tenaga terhadap sudut elevasi perbukitan Malang - Batu serta kestabilan pengereman saat menghadapi turunan panjang.',
    };

    return res.json({ success: true, data: fallbackResponse, isAiPowered: false, fallbackNote: 'Curated Expert System Fallback Active' });
  }
});

// Setup dev server or static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer();
