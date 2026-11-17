import { useState } from 'react';
import { AdminDashboard, AdminTab } from './components/AdminDashboard';
import { DonationModal } from './components/DonationModal';
import { DonationSection } from './components/DonationSection';
import { EbookModal } from './components/EbookModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HistoryAndTransparency } from './components/HistoryAndTransparency';
import { NewsSection } from './components/NewsSection';
import { ProductionGallery } from './components/ProductionGallery';
import { OfflineIndicator } from './components/PWAInstallButton';
import { VolunteerHub } from './components/VolunteerHub';

export default function App() {
  const [viewMode, setViewMode] = useState<'portal' | 'admin'>('portal');
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('overview');
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

  const openAdmin = (tab: AdminTab = 'overview') => {
    setAdminInitialTab(tab);
    setViewMode('admin');
  };

  if (viewMode === 'admin') {
    return (
      <>
        <AdminDashboard
          initialTab={adminInitialTab}
          onExitAdmin={() => setViewMode('portal')}
        />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#052E16]">
      <Header
        onOpenAdmin={() => openAdmin('overview')}
        onJumpToVolunteer={handleJumpToVolunteer}
      />

      <main>
        <HeroSection
          onOpenEbook={() => setEbookOpen(true)}
          onJumpToVolunteer={handleJumpToVolunteer}
          onOpenDonate={() => openDonateModal('pix')}
        />
        <NewsSection
          onOpenAdminNews={() => openAdmin('news')}
          onOpenDonate={() => openDonateModal('pix')}
        />
        <VolunteerHub />
        <DonationSection
          onOpenDonateModal={openDonateModal}
          onOpenAdmin={() => openAdmin('overview')}
        />
        <ProductionGallery />
        <HistoryAndTransparency onOpenEbook={() => setEbookOpen(true)} />
      </main>

      <Footer
        onOpenEbook={() => setEbookOpen(true)}
        onOpenAdmin={() => openAdmin('overview')}
      />

      <EbookModal isOpen={ebookOpen} onClose={() => setEbookOpen(false)} />

      <DonationModal
        isOpen={donateModalOpen}
        initialTab={donateInitialTab}
        onClose={() => setDonateModalOpen(false)}
      />

      <OfflineIndicator />
    </div>
  );
}
