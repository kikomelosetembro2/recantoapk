import { useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { DonationModal } from './components/DonationModal';
import { DonationSection } from './components/DonationSection';
import { EbookModal } from './components/EbookModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HistoryAndTransparency } from './components/HistoryAndTransparency';
import { ProductionGallery } from './components/ProductionGallery';
import { VolunteerHub } from './components/VolunteerHub';

export default function App() {
  const [viewMode, setViewMode] = useState<'portal' | 'admin'>('portal');
  const [ebookOpen, setEbookOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [donateInitialTab, setDonateInitialTab] = useState<'pix' | 'monthly' | 'pickup'>('pix');

  const handleJumpToVolunteer = () => {
    const el = document.getElementById('vagas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openDonateModal = (tab: 'pix' | 'monthly' | 'pickup') => {
    setDonateInitialTab(tab);
    setDonateModalOpen(true);
  };

  if (viewMode === 'admin') {
    return <AdminDashboard onExitAdmin={() => setViewMode('portal')} />;
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      <Header
        onOpenAdmin={() => setViewMode('admin')}
        onJumpToVolunteer={handleJumpToVolunteer}
      />

      <main>
        <HeroSection
          onOpenEbook={() => setEbookOpen(true)}
          onJumpToVolunteer={handleJumpToVolunteer}
          onOpenDonate={() => openDonateModal('pix')}
        />
        <VolunteerHub />
        <DonationSection
          onOpenDonateModal={openDonateModal}
          onOpenAdmin={() => setViewMode('admin')}
        />
        <ProductionGallery />
        <HistoryAndTransparency onOpenEbook={() => setEbookOpen(true)} />
      </main>

      <Footer
        onOpenEbook={() => setEbookOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
      />

      <EbookModal isOpen={ebookOpen} onClose={() => setEbookOpen(false)} />

      <DonationModal
        isOpen={donateModalOpen}
        initialTab={donateInitialTab}
        onClose={() => setDonateModalOpen(false)}
      />
    </div>
  );
}
