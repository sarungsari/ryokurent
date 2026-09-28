export type MotorCategory = 'all' | 'matic' | 'street' | 'trail' | 'classic' | 'maxi';

export interface MotorItem {
  id: string;
  name: string;
  brand: 'Honda' | 'Yamaha' | 'Kawasaki' | 'Vespa' | string;
  category: 'matic' | 'street' | 'trail' | 'classic' | 'maxi';
  categoryLabel: string;
  year: number;
  engineCc: number;
  transmission: 'Automatic' | 'Manual' | 'CVT' | string;
  fuelTank: string;
  fuelConsumption: string;
  dailyPrice: number;
  weeklyPrice: number;
  image: string;
  badges: string[];
  isAvailable: boolean;
  rentalStatus?: 'available' | 'rented' | 'maintenance';
  isPopular?: boolean;
  isPromo?: boolean;
  description: string;
  suitableFor: string[];
  specs: {
    power: string;
    brakes: string;
    storage: string;
    startSystem: string;
  };
}

export interface PickupLocation {
  id: string;
  name: string;
  zone: 'Kota Malang' | 'Kota Wisata Batu' | 'Stasiun' | 'Bandara' | 'Gunung Bromo';
  extraFee: number;
  description: string;
  mapUrl?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  pricePerDay: number;
  isFree?: boolean;
  description: string;
  icon: string;
}

export interface ReservationFormData {
  motorId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  pickupLocationId: string;
  pickupAddressDetail: string;
  returnLocationId: string;
  returnAddressDetail: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  identityType: 'KTP' | 'SIM A' | 'Paspor' | 'KTM';
  identityNumber: string;
  selectedAddOns: string[];
  customerNotes?: string;
  helmetCount: number;
  raincoatCount: number;
}

export interface ReservationRecord extends ReservationFormData {
  id: string;
  createdAt: string;
  durationDays: number;
  baseMotorTotal: number;
  addOnsTotal: number;
  pickupFeeTotal: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  waMessageUrl: string;
}

export interface AIRecommendationRequest {
  destination: string;
  passengers: number;
  ridingStyle: 'santai' | 'touring' | 'petualang' | 'hemat';
  experienceLevel: 'pemula' | 'menengah' | 'mahir';
  notes?: string;
}

export interface AIRecommendationResponse {
  recommendedMotorId: string;
  motorName: string;
  confidenceScore: number;
  reason: string;
  routeHighlights: string[];
  terrainAlerts: string[];
  pitstops: string[];
  safetyTips: string[];
  estimatedFuelCost: string;
  thinkingAnalysis?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  origin: string;
  motorRented: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  tag: string;
}
