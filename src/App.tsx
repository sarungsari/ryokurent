import React, { useState } from 'react';
import { FleetProvider } from './context/FleetContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetSection } from './components/FleetSection';
import { MotorDetailModal } from './components/MotorDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { OperatorDashboardModal } from './components/OperatorDashboardModal';
import { AiPlannerSection } from './components/AiPlannerSection';
import { PackagesSection } from './components/PackagesSection';
import { RequirementsSection } from './components/RequirementsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomBar } from './components/MobileBottomBar';
import { MotorItem } from './types/rental';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [lookupModalOpen, setLookupModalOpen] = useState(false);
  const [operatorModalOpen, setOperatorModalOpen] = useState(false);
  const [detailMotor, setDetailMotor] = useState<MotorItem | null>(null);

  const [bookingPreset, setBookingPreset] = useState<{
    motorId?: string;
    pickupId?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const handleOpenBooking = (preset?: {
    motorId?: string;
    pickupId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (preset) {
      setBookingPreset(preset);
    }
    setBookingModalOpen(true);
  };

  const handleBookFromCard = (motor: MotorItem) => {
    setBookingPreset((prev) => ({ ...prev, motorId: motor.id }));
    setBookingModalOpen(true);
  };

  const handleOpenAiPlanner = () => {
    const el = document.getElementById('ai-planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <FleetProvider>
      <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white pb-18 md:pb-0">
        {/* Navigation */}
        <Navbar
          onOpenBooking={() => handleOpenBooking()}
          onOpenLookup={() => setLookupModalOpen(true)}
          onOpenAiPlanner={handleOpenAiPlanner}
          onOpenOperator={() => setOperatorModalOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero with quick booking calculator */}
          <Hero
            onQuickBook={(params) =>
              handleOpenBooking({
                motorId: params.motorId,
                pickupId: params.pickupLocationId,
                startDate: params.startDate,
                endDate: params.endDate,
              })
            }
            onOpenAiPlanner={handleOpenAiPlanner}
          />

          {/* Fleet Gallery & Catalog */}
          <FleetSection
            onSelectMotor={(motor) => setDetailMotor(motor)}
            onBookMotor={handleBookFromCard}
            onOpenOperator={() => setOperatorModalOpen(true)}
          />

          {/* AI Route Planner with Gemini 3.1 Pro High Thinking Mode */}
          <AiPlannerSection onBookMotor={handleBookFromCard} />

          {/* Curated Tour Packages */}
          <PackagesSection onOpenBooking={() => handleOpenBooking()} />

          {/* Requirements & Process */}
          <RequirementsSection />

          {/* Testimonials */}
          <TestimonialsSection />

          {/* FAQ */}
          <FaqSection />
        </main>

        {/* Footer */}
        <Footer
          onOpenBooking={() => handleOpenBooking()}
          onOpenLookup={() => setLookupModalOpen(true)}
          onOpenOperator={() => setOperatorModalOpen(true)}
        />

        {/* Floating WhatsApp Quick Chat (positioned above mobile bottom bar) */}
        <FloatingWhatsApp />

        {/* Mobile Bottom Thumb Navigation Bar */}
        <MobileBottomBar
          onOpenBooking={() => handleOpenBooking()}
          onOpenLookup={() => setLookupModalOpen(true)}
          onOpenOperator={() => setOperatorModalOpen(true)}
        />

        {/* Motor Detail Modal */}
        <MotorDetailModal
          motor={detailMotor}
          onClose={() => setDetailMotor(null)}
          onBookNow={(motor) => {
            setDetailMotor(null);
            handleBookFromCard(motor);
          }}
        />

        {/* Online Reservation Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedMotorId={bookingPreset.motorId}
          preselectedPickupId={bookingPreset.pickupId}
          preselectedStartDate={bookingPreset.startDate}
          preselectedEndDate={bookingPreset.endDate}
        />

        {/* Booking Lookup & Tracking Modal */}
        <BookingLookupModal
          isOpen={lookupModalOpen}
          onClose={() => setLookupModalOpen(false)}
        />

        {/* Operator Dashboard Command Center Modal */}
        <OperatorDashboardModal
          isOpen={operatorModalOpen}
          onClose={() => setOperatorModalOpen(false)}
        />
      </div>
    </FleetProvider>
  );
}
