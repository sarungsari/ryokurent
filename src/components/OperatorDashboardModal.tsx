import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bike,
  Sparkles,
  Phone,
  Search,
  ExternalLink,
  Shield,
  RotateCcw,
  Camera,
  Layers,
  Calendar,
  DollarSign,
  Fuel,
  Settings,
  MessageCircle,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';
import { MotorItem, MotorCategory, ReservationRecord } from '../types/rental';
import { OFFICIAL_GARAGE_MAPS_URL, OFFICIAL_GARAGE_NAME } from '../utils/whatsapp';

interface OperatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset high-quality Honda motorcycle photos ready to pick
const PRESET_MOTOR_PHOTOS = [
  {
    name: 'Honda CRF 150 L Extreme',
    category: 'Trail Adventure',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda Vario 160 eSP+',
    category: 'Matic Premium',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda Vario 125 Sporty',
    category: 'Matic Handal',
    url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda Scoopy 2024 Retro',
    category: 'Retro Classic',
    url: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda All New BeAT Street 2025',
    category: 'Street Naked',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda BeAT Deluxe 2024',
    category: 'Matic Lincah',
    url: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda BeAT CBS Series',
    category: 'Matic Ekonomis',
    url: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Honda Urban Matte Black',
    category: 'Matic Modern',
    url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=900&q=80',
  },
];

export const OperatorDashboardModal: React.FC<OperatorDashboardModalProps> = ({ isOpen, onClose }) => {
  const { fleet, addMotor, updateMotor, deleteMotor, resetToDefault, refreshFleet } = useFleet();

  const [activeTab, setActiveTab] = useState<'fleet' | 'gallery' | 'reservations' | 'settings'>('fleet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form states for Add/Edit Motor
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMotor, setEditingMotor] = useState<MotorItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Honda');
  const [formCategory, setFormCategory] = useState<'matic' | 'street' | 'trail' | 'classic' | 'maxi'>('matic');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Matic Lincah');
  const [formYear, setFormYear] = useState<number>(2024);
  const [formCc, setFormCc] = useState<number>(110);
  const [formTransmission, setFormTransmission] = useState('Automatic');
  const [formFuelTank, setFormFuelTank] = useState('4.2 Liter');
  const [formFuelConsumption, setFormFuelConsumption] = useState('60 km/L');
  const [formDailyPrice, setFormDailyPrice] = useState<number>(80000);
  const [formWeeklyPrice, setFormWeeklyPrice] = useState<number>(480000);
  const [formImage, setFormImage] = useState('');
  const [formBadges, setFormBadges] = useState('Unit Baru, Irit BBM');
  const [formDescription, setFormDescription] = useState('');
  const [formSuitableFor, setFormSuitableFor] = useState('Keliling Kota Malang & Wisata Batu');
  const [formStatus, setFormStatus] = useState<'available' | 'rented' | 'maintenance'>('available');

  // Photo Uploader state
  const [targetMotorForPhoto, setTargetMotorForPhoto] = useState<string>('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reservations state
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch reservations when tab opens
  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReservations(json.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load reservations:', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReservations();
      if (fleet.length > 0 && !targetMotorForPhoto) {
        setTargetMotorForPhoto(fleet[0].id);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Open Form for Adding New Motor
  const handleOpenAddForm = () => {
    setEditingMotor(null);
    setFormName('');
    setFormBrand('Honda');
    setFormCategory('matic');
    setFormCategoryLabel('Matic Lincah');
    setFormYear(2024);
    setFormCc(110);
    setFormTransmission('Automatic');
    setFormFuelTank('4.2 Liter');
    setFormFuelConsumption('60.6 km/L');
    setFormDailyPrice(80000);
    setFormWeeklyPrice(480000);
    setFormImage('https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=900&q=80');
    setFormBadges('Unit Baru, Irit BBM, Siap Pakai');
    setFormDescription('Armada prima Honda keluaran terbaru dengan perawatan rutin AHASS, siap keliling Malang dan Batu.');
    setFormSuitableFor('Wisata Kota Malang, Kuliner Suhat, Trip Kota Batu');
    setFormStatus('available');
    setIsFormOpen(true);
  };

  // Open Form for Editing Existing Motor
  const handleOpenEditForm = (motor: MotorItem) => {
    setEditingMotor(motor);
    setFormName(motor.name);
    setFormBrand(motor.brand || 'Honda');
    setFormCategory(motor.category);
    setFormCategoryLabel(motor.categoryLabel);
    setFormYear(motor.year);
    setFormCc(motor.engineCc);
    setFormTransmission(motor.transmission);
    setFormFuelTank(motor.fuelTank);
    setFormFuelConsumption(motor.fuelConsumption);
    setFormDailyPrice(motor.dailyPrice);
    setFormWeeklyPrice(motor.weeklyPrice);
    setFormImage(motor.image);
    setFormBadges(motor.badges.join(', '));
    setFormDescription(motor.description);
    setFormSuitableFor(motor.suitableFor.join(', '));
    setFormStatus(motor.rentalStatus || (motor.isAvailable ? 'available' : 'rented'));
    setIsFormOpen(true);
  };

  // Submit Add / Edit Form
  const handleSaveMotor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama motor wajib diisi.');
      return;
    }

    const payload: Partial<MotorItem> = {
      name: formName.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      categoryLabel: formCategoryLabel.trim() || 'Matic Populer',
      year: Number(formYear) || 2024,
      engineCc: Number(formCc) || 110,
      transmission: formTransmission,
      fuelTank: formFuelTank,
      fuelConsumption: formFuelConsumption,
      dailyPrice: Number(formDailyPrice),
      weeklyPrice: Number(formWeeklyPrice) || Number(formDailyPrice) * 6,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
      badges: formBadges.split(',').map((b) => b.trim()).filter(Boolean),
      description: formDescription.trim(),
      suitableFor: formSuitableFor.split(',').map((s) => s.trim()).filter(Boolean),
      rentalStatus: formStatus,
      isAvailable: formStatus === 'available',
    };

    if (editingMotor) {
      const res = await updateMotor(editingMotor.id, payload);
      showToast(res.message);
    } else {
      const res = await addMotor(payload);
      showToast(res.message);
    }
    setIsFormOpen(false);
  };

  // Delete Motor with Confirmation
  const handleDeleteMotor = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus unit "${name}" dari armada?`)) {
      const res = await deleteMotor(id);
      showToast(res.message);
    }
  };

  // Quick Status Toggle on Card
  const handleQuickStatusChange = async (motor: MotorItem, newStatus: 'available' | 'rented' | 'maintenance') => {
    const res = await updateMotor(motor.id, {
      rentalStatus: newStatus,
      isAvailable: newStatus === 'available',
    });
    showToast(`${motor.name} diubah menjadi: ${newStatus.toUpperCase()}`);
  };

  // Handle Local File Selection (Upload image from computer / mobile phone)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Apply photo to target motor
  const handleApplyPhotoToTargetMotor = async (imgUrl: string) => {
    if (!targetMotorForPhoto) {
      alert('Pilih unit motor target terlebih dahulu.');
      return;
    }
    const target = fleet.find((m) => m.id === targetMotorForPhoto);
    const res = await updateMotor(targetMotorForPhoto, { image: imgUrl });
    showToast(`Foto berhasil diterapkan pada unit "${target?.name || targetMotorForPhoto}"!`);
    setUploadedPreview(null);
    setCustomPhotoUrl('');
  };

  // Update Reservation Status
  const handleUpdateReservationStatus = async (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status booking #${id} diubah ke ${newStatus}`);
        fetchReservations();
      }
    } catch (err) {
      showToast('Gagal mengubah status reservasi.');
    }
  };

  // Calculate Summary Stats
  const totalUnits = fleet.length;
  const availableUnits = fleet.filter((m) => m.rentalStatus === 'available' || (m.rentalStatus === undefined && m.isAvailable)).length;
  const rentedUnits = fleet.filter((m) => m.rentalStatus === 'rented' || (m.rentalStatus === undefined && !m.isAvailable)).length;
  const maintenanceUnits = fleet.filter((m) => m.rentalStatus === 'maintenance').length;

  // Filtered fleet list for Tab 1
  const displayedFleet = fleet.filter((motor) => {
    const matchCategory = selectedCategory === 'all' || motor.category === selectedCategory;
    const motorStatus = motor.rentalStatus || (motor.isAvailable ? 'available' : 'rented');
    const matchStatus = statusFilter === 'all' || motorStatus === statusFilter;
    const matchSearch =
      motor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motor.year.toString().includes(searchQuery);
    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[70] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-medium flex items-center gap-2 border border-emerald-400 animate-slideDown">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dashboard Window */}
      <div className="bg-[#101a15] border border-emerald-500/30 w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-emerald-500/20 bg-[#0d1611] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Panel Operator RyokouRent</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Garasi Malang (Tlogomas) & Batu • Kelola 9 Unit Armada, Upload Foto & Cek Booking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                refreshFleet();
                fetchReservations();
                showToast('Data berhasil disinkronkan!');
              }}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-300 text-slate-400 transition-colors border border-slate-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#0a120e] border-b border-slate-800/80 text-xs">
          <div className="bg-[#121f18] p-3 rounded-xl border border-emerald-900/50">
            <span className="text-slate-400 block font-medium">Total Armada</span>
            <span className="text-xl font-bold text-white">{totalUnits} Unit</span>
          </div>
          <div className="bg-[#121f18] p-3 rounded-xl border border-emerald-900/50">
            <span className="text-emerald-400 block font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Siap / Ready
            </span>
            <span className="text-xl font-bold text-emerald-300">{availableUnits} Unit</span>
          </div>
          <div className="bg-[#121f18] p-3 rounded-xl border border-amber-900/50">
            <span className="text-amber-400 block font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Sedang Disewa
            </span>
            <span className="text-xl font-bold text-amber-300">{rentedUnits} Unit</span>
          </div>
          <div className="bg-[#121f18] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Servis / AHASS
            </span>
            <span className="text-xl font-bold text-slate-300">{maintenanceUnits} Unit</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-[#121f18] p-3 rounded-xl border border-sky-900/50">
            <span className="text-sky-400 block font-medium">Booking Masuk</span>
            <span className="text-xl font-bold text-sky-300">{reservations.length} Tiket</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0e1712] px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'fleet'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            Manajemen Armada ({fleet.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'gallery'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Unggah Foto & Galeri
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'reservations'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Daftar Booking Pelanggan ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Garasi & Pengaturan
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0c1410]">
          
          {/* TAB 1: FLEET MANAGEMENT */}
          {activeTab === 'fleet' && (
            <div className="space-y-6">
              {/* Controls & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121e17] p-4 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama motor, CC, atau tahun..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-900/90 border border-slate-700/80 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="matic">Matic (Vario & BeAT)</option>
                    <option value="street">BeAT Street</option>
                    <option value="classic">Retro (Scoopy)</option>
                    <option value="trail">Trail (CRF 150 L)</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900/90 border border-slate-700/80 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Semua Status</option>
                    <option value="available">Tersedia (Ready)</option>
                    <option value="rented">Sedang Disewa</option>
                    <option value="maintenance">Perawatan / Servis</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddForm}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Unit Motor
                </button>
              </div>

              {/* Motor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedFleet.map((motor) => {
                  const currentStatus = motor.rentalStatus || (motor.isAvailable ? 'available' : 'rented');
                  return (
                    <div
                      key={motor.id}
                      className="bg-[#132019] border border-slate-800/90 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-lg flex flex-col"
                    >
                      {/* Motor Image & Quick Image Button */}
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
                        <img
                          src={motor.image}
                          alt={motor.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                            {motor.year} • {motor.engineCc}cc
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-slate-300 backdrop-blur-sm">
                            {motor.categoryLabel}
                          </span>
                        </div>

                        {/* Quick Change Photo Button */}
                        <button
                          onClick={() => {
                            setTargetMotorForPhoto(motor.id);
                            setActiveTab('gallery');
                          }}
                          className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Ganti Foto
                        </button>
                      </div>

                      {/* Motor Info Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-white leading-snug">{motor.name}</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{motor.description}</p>
                        </div>

                        {/* Specs & Pricing */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Tarif Sewa Harian:</span>
                            <span className="font-bold text-emerald-400 text-sm">
                              Rp {motor.dailyPrice.toLocaleString('id-ID')}
                              <span className="text-[11px] text-slate-400 font-normal"> /hari</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Konsumsi BBM & Tangki:</span>
                            <span className="text-slate-300">{motor.fuelConsumption} • {motor.fuelTank}</span>
                          </div>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Status Unit Saat Ini:</span>
                          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                            <button
                              onClick={() => handleQuickStatusChange(motor, 'available')}
                              className={`py-1.5 px-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 ${
                                currentStatus === 'available'
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              Ready
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(motor, 'rented')}
                              className={`py-1.5 px-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 ${
                                currentStatus === 'rented'
                                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              Disewa
                            </button>
                            <button
                              onClick={() => handleQuickStatusChange(motor, 'maintenance')}
                              className={`py-1.5 px-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 ${
                                currentStatus === 'maintenance'
                                  ? 'bg-rose-700 text-white shadow-md shadow-rose-800/30'
                                  : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              Servis
                            </button>
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => handleOpenEditForm(motor)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                            Edit Rincian
                          </button>
                          <button
                            onClick={() => handleDeleteMotor(motor.id, motor.name)}
                            title="Hapus Unit"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors border border-slate-700/60"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {displayedFleet.length === 0 && (
                <div className="text-center py-16 bg-[#121e17] rounded-2xl border border-slate-800">
                  <Bike className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">Tidak ada motor yang cocok dengan filter pencarian.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setStatusFilter('all');
                    }}
                    className="mt-3 text-xs text-emerald-400 hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD & PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Upload Zone Section */}
              <div className="bg-[#121f18] p-6 rounded-2xl border border-emerald-500/30">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  Unggah Foto Motor dari Laptop / HP
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Foto yang diunggah akan langsung diperbarui di halaman katalog depan, formulir reservasi, dan pop-up rincian motor.
                </p>

                {/* Target Motor Dropdown */}
                <div className="max-w-md mb-5">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Pilih Unit Motor yang Ingin Diganti Fotonya:
                  </label>
                  <select
                    value={targetMotorForPhoto}
                    onChange={(e) => setTargetMotorForPhoto(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {fleet.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.year}) - Rp {m.dailyPrice.toLocaleString('id-ID')}/hari
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* File Selector Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-slate-900/60 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-emerald-950/20 group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-white">Klik untuk Pilih Foto dari File</p>
                    <p className="text-xs text-slate-400 mt-1">Mendukung format JPG, PNG, atau WebP (Maks. 10MB)</p>
                  </div>

                  {/* Or Custom URL Input */}
                  <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Atau Masukkan URL Gambar Web:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={customPhotoUrl}
                        onChange={(e) => {
                          setCustomPhotoUrl(e.target.value);
                          setUploadedPreview(e.target.value);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Preview & Confirmation */}
                    {uploadedPreview && (
                      <div className="space-y-3 pt-2 border-t border-slate-800">
                        <span className="text-xs font-semibold text-emerald-400 block">Preview Foto yang Dipilih:</span>
                        <div className="h-44 w-full rounded-xl overflow-hidden border border-emerald-500/40 relative">
                          <img
                            src={uploadedPreview}
                            alt="Preview upload"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => handleApplyPhotoToTargetMotor(uploadedPreview)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Terapkan Foto ke Unit Terpilih
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preset Gallery Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    Koleksi Foto Preset Studio Honda Siap Pakai
                  </h3>
                  <span className="text-xs text-slate-400">Pilih gambar resolusi tinggi tanpa perlu memotret manual</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PRESET_MOTOR_PHOTOS.map((preset, idx) => (
                    <div
                      key={idx}
                      className="bg-[#121f18] border border-slate-800 rounded-xl overflow-hidden group hover:border-emerald-500 transition-all flex flex-col"
                    >
                      <div className="h-32 w-full bg-slate-900 relative overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-slate-300">
                          {preset.category}
                        </span>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <span className="text-xs font-bold text-white block mb-2">{preset.name}</span>
                        <button
                          onClick={() => handleApplyPhotoToTargetMotor(preset.url)}
                          className="w-full py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold transition-colors border border-emerald-700/40"
                        >
                          Gunakan Foto Ini
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESERVATIONS LIST */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#121f18] p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Daftar Tiket Reservasi Masuk</h3>
                  <p className="text-xs text-slate-400">
                    Memantau pesanan yang masuk secara real-time dari website RyokouRent.
                  </p>
                </div>
                <button
                  onClick={fetchReservations}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingReservations ? 'animate-spin' : ''}`} />
                  Muat Ulang
                </button>
              </div>

              {reservations.length === 0 ? (
                <div className="text-center py-16 bg-[#121e17] rounded-2xl border border-slate-800">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">Belum ada data reservasi masuk.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Saat calon penyewa mengisi formulir booking di website, tiket otomatis tercatat di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((booking) => {
                    const motor = fleet.find((m) => m.id === booking.motorId);
                    return (
                      <div
                        key={booking.id}
                        className="bg-[#132019] border border-slate-800 p-4 rounded-xl hover:border-emerald-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                              {booking.id}
                            </span>
                            <span className="font-bold text-white text-sm">{booking.customerName}</span>
                            <span className="text-xs text-slate-400">• {booking.customerPhone}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Bike className="w-3.5 h-3.5" />
                              {motor?.name || booking.motorId}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {booking.startDate} s/d {booking.endDate} ({booking.durationDays} hari)
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-white">
                              Total: Rp {booking.grandTotal.toLocaleString('id-ID')}
                            </span>
                          </div>

                          {booking.customerNotes && (
                            <p className="text-[11px] text-slate-400 italic">
                              Catatan: &ldquo;{booking.customerNotes}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleUpdateReservationStatus(
                                booking.id,
                                e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled'
                              )
                            }
                            className={`text-xs font-bold py-1.5 px-3 rounded-lg border focus:outline-none ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600'
                                : booking.status === 'completed'
                                ? 'bg-sky-900/60 text-sky-300 border-sky-600'
                                : booking.status === 'cancelled'
                                ? 'bg-rose-900/60 text-rose-300 border-rose-600'
                                : 'bg-amber-900/60 text-amber-300 border-amber-600'
                            }`}
                          >
                            <option value="pending">⏳ Menunggu Konfirmasi</option>
                            <option value="confirmed">✅ Dikonfirmasi / DP OK</option>
                            <option value="completed">🎉 Selesai Sewa</option>
                            <option value="cancelled">❌ Dibatalkan</option>
                          </select>

                          {/* WhatsApp Chat Button with Pre-filled Confirmation */}
                          <a
                            href={`https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                              `Halo Kak ${booking.customerName}, kami dari Operator RyokouRent Malang & Batu terkait tiket booking #${booking.id} untuk motor ${motor?.name || 'pilihan Anda'}. Apakah ada yang bisa kami bantu konfirmasikan?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Chat WA
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GARAGE & SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-[#121f18] p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Informasi Titik Garasi Resmi
                </h3>
                
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 block">{OFFICIAL_GARAGE_NAME}</span>
                  <p className="text-xs text-slate-300">
                    Tlogomas, Kec. Lowokwaru, Kota Malang, Jawa Timur 65144 (Jalur Strategis Malang - Kota Wisata Batu via Dinoyo)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Koordinat GPS: -7.9365273, 112.6085936
                  </p>
                  <a
                    href={OFFICIAL_GARAGE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
                  >
                    Buka Titik Garasi di Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Reset Default Fleet Option */}
              <div className="bg-[#121f18] p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-amber-400" />
                  Reset Armada ke Bawaan (9 Unit Honda)
                </h3>
                <p className="text-xs text-slate-400">
                  Gunakan tombol ini jika Anda ingin mengembalikan daftar armada ke konfigurasi awal 9 unit Honda (CRF 150 L, Vario 160, Vario 125, Scoopy 2024, BeAT Street 2025, BeAT Street 2024, BeAT Deluxe 2024, BeAT CBS 2022, BeAT Deluxe 2021).
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset daftar armada ke konfigurasi standar 9 unit Honda?')) {
                      resetToDefault();
                      showToast('Armada berhasil direset ke standar 9 Honda!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 text-xs font-semibold border border-amber-600/40 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset ke 9 Unit Standar Honda
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0d1611] flex items-center justify-between text-xs text-slate-400">
          <span>RyokouRent Operator Hub • Kota Malang & Kota Wisata Batu</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Tutup Panel
          </button>
        </div>
      </div>

      {/* SUB-MODAL: Form Add / Edit Motor Unit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111c16] border border-emerald-500/40 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1712] flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-emerald-400" />
                {editingMotor ? `Edit Unit: ${editingMotor.name}` : 'Tambah Unit Motor Baru ke Armada'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveMotor} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Nama Motor *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Honda Vario 160 eSP+"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Merek</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Honda"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as 'matic' | 'street' | 'trail' | 'classic' | 'maxi')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="matic">Matic</option>
                    <option value="street">Street</option>
                    <option value="trail">Trail & Adventure</option>
                    <option value="classic">Retro & Classic</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Label Kategori</label>
                  <input
                    type="text"
                    value={formCategoryLabel}
                    onChange={(e) => setFormCategoryLabel(e.target.value)}
                    placeholder="Matic Lincah / Trail Adventure"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tahun Perakitan</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Kapasitas Mesin (CC)</label>
                  <input
                    type="number"
                    value={formCc}
                    onChange={(e) => setFormCc(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tarif Harian (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formDailyPrice}
                    onChange={(e) => setFormDailyPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tarif Mingguan (Rp)</label>
                  <input
                    type="number"
                    value={formWeeklyPrice}
                    onChange={(e) => setFormWeeklyPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Konsumsi BBM & Tangki</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formFuelConsumption}
                      onChange={(e) => setFormFuelConsumption(e.target.value)}
                      placeholder="60 km/L"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={formFuelTank}
                      onChange={(e) => setFormFuelTank(e.target.value)}
                      placeholder="4.2 Liter"
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Status Ketersediaan</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="available">Tersedia (Ready Digunakan)</option>
                    <option value="rented">Sedang Disewa Customer</option>
                    <option value="maintenance">Dalam Servis / Perawatan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">URL Foto Motor</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Badges (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formBadges}
                  onChange={(e) => setFormBadges(e.target.value)}
                  placeholder="Favorit Wisatawan, Tenaga Tanjakan, Smart Key"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Cocok Untuk Rute (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formSuitableFor}
                  onChange={(e) => setFormSuitableFor(e.target.value)}
                  placeholder="Wisata Kota Batu & Pujon, Keliling Kuliner Malang, Bromo via Tumpang"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Unit Motor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
