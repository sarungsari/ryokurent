import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MotorItem } from '../types/rental';
import { FLEET_DATA } from '../data/mockData';

interface FleetContextType {
  fleet: MotorItem[];
  isLoading: boolean;
  addMotor: (motor: Partial<MotorItem>) => Promise<{ success: boolean; message: string; data?: MotorItem }>;
  updateMotor: (id: string, updates: Partial<MotorItem>) => Promise<{ success: boolean; message: string; data?: MotorItem }>;
  deleteMotor: (id: string) => Promise<{ success: boolean; message: string }>;
  uploadMotorImage: (id: string, imageUrlOrBase64: string) => Promise<{ success: boolean; message: string }>;
  refreshFleet: () => Promise<void>;
  resetToDefault: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

const STORAGE_KEY = 'ryokourent_fleet_data_v1';

export const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fleet, setFleet] = useState<MotorItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read cached fleet:', e);
    }
    return FLEET_DATA;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync with backend on mount
  const refreshFleet = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/fleet');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFleet(json.data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
          } catch (e) {
            // local storage limit might be exceeded if base64 images are large
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch fleet from server, using local data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFleet();
  }, []);

  // Save to local storage whenever fleet changes
  const saveFleetLocal = (newFleet: MotorItem[]) => {
    setFleet(newFleet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFleet));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  };

  const addMotor = async (motor: Partial<MotorItem>) => {
    try {
      const res = await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motor),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const updated = [json.data, ...fleet.filter((m) => m.id !== json.data.id)];
        saveFleetLocal(updated);
        return { success: true, message: json.message || 'Motor berhasil ditambahkan!', data: json.data };
      }
      return { success: false, message: json.message || 'Gagal menambahkan motor ke server.' };
    } catch (err: any) {
      // Fallback local
      const id = motor.name ? motor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4) : `motor-${Date.now()}`;
      const newMotor: MotorItem = {
        id,
        name: motor.name || 'Unit Honda Baru',
        brand: motor.brand || 'Honda',
        category: motor.category || 'matic',
        categoryLabel: motor.categoryLabel || 'Matic Lincah',
        year: Number(motor.year) || 2024,
        engineCc: Number(motor.engineCc) || 110,
        transmission: motor.transmission || 'Automatic',
        fuelTank: motor.fuelTank || '4.2 Liter',
        fuelConsumption: motor.fuelConsumption || '55 km/L',
        dailyPrice: Number(motor.dailyPrice) || 80000,
        weeklyPrice: Number(motor.weeklyPrice) || (Number(motor.dailyPrice) || 80000) * 6,
        image: motor.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
        badges: motor.badges || ['Unit Baru'],
        isAvailable: motor.isAvailable !== false,
        rentalStatus: motor.rentalStatus || 'available',
        isPopular: !!motor.isPopular,
        description: motor.description || 'Armada prima RyokouRent.',
        suitableFor: motor.suitableFor || ['Keliling Kota Malang & Wisata Batu'],
        specs: motor.specs || {
          power: 'Standar Pabrikan',
          brakes: 'Combi Brake System (CBS)',
          storage: 'Bagasi Helm & Jas Hujan',
          startSystem: 'Electric Starter',
        },
      };
      const updated = [newMotor, ...fleet];
      saveFleetLocal(updated);
      return { success: true, message: 'Motor ditambahkan secara lokal.', data: newMotor };
    }
  };

  const updateMotor = async (id: string, updates: Partial<MotorItem>) => {
    try {
      const res = await fetch(`/api/fleet/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const updated = fleet.map((m) => (m.id === id ? json.data : m));
        saveFleetLocal(updated);
        return { success: true, message: json.message || 'Data motor diperbarui!', data: json.data };
      }
      return { success: false, message: json.message || 'Gagal memperbarui data motor.' };
    } catch (err) {
      // Local fallback
      const updated = fleet.map((m) => (m.id === id ? { ...m, ...updates } : m));
      saveFleetLocal(updated);
      return { success: true, message: 'Data motor diperbarui di cache lokal.' };
    }
  };

  const deleteMotor = async (id: string) => {
    try {
      const res = await fetch(`/api/fleet/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        const updated = fleet.filter((m) => m.id !== id);
        saveFleetLocal(updated);
        return { success: true, message: json.message || 'Motor dihapus dari armada.' };
      }
      return { success: false, message: json.message || 'Gagal menghapus motor.' };
    } catch (err) {
      const updated = fleet.filter((m) => m.id !== id);
      saveFleetLocal(updated);
      return { success: true, message: 'Motor dihapus dari cache lokal.' };
    }
  };

  const uploadMotorImage = async (id: string, imageUrlOrBase64: string) => {
    return updateMotor(id, { image: imageUrlOrBase64 });
  };

  const resetToDefault = () => {
    saveFleetLocal(FLEET_DATA);
  };

  return (
    <FleetContext.Provider
      value={{
        fleet,
        isLoading,
        addMotor,
        updateMotor,
        deleteMotor,
        uploadMotorImage,
        refreshFleet,
        resetToDefault,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
