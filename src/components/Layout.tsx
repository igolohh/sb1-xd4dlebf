import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useApp } from '../contexts/AppContext';
import { getLastView, saveLastView } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  CalendarDays, 
  Menu, 
  X, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import Router from './Router';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  hasSubmenu?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick, hasSubmenu }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-all rounded-lg ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-medium' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <span className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
      {icon}
    </span>
    <span className="font-medium flex-1">{label}</span>
    {hasSubmenu && (
      <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
    )}
  </button>
);

const FAQ_ITEMS = [
  {
    question: "Bagaimana cara menambah entri pekerjaan?",
    answer: "Isi formulir entri pekerjaan baru dengan judul, deskripsi, dan tanggal pekerjaan, kemudian klik tombol 'Simpan Entri Pekerjaan'."
  },
  {
    question: "Bagaimana status persetujuan?",
    answer: "Ada 3 status: Menunggu Persetujuan (kuning), Disetujui (hijau), dan Ditolak (merah). Kepala Satker akan meninjau dan memutuskan status entri."
  },
  {
    question: "Bisakah menghapus entri?",
    answer: "Ya, entri dapat dihapus jika statusnya masih 'Menunggu Persetujuan' atau 'Ditolak'. Entri yang sudah disetujui tidak dapat dihapus."
  }
];

const Layout: React.FC = () => {
  const { userRole } = useApp();
  const [currentView, setCurrentView] = useState(() => getLastView());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  // Handle menu click with view persistence
  const handleMenuClick = (view: string) => {
    setCurrentView(view);
    saveLastView(view);
    setShowFAQ(false);
    setIsSidebarOpen(false);
  };

  // Close sidebar when clicking outside on both mobile and desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (sidebar && 
          !sidebar.contains(event.target as Node) && 
          toggleButton && 
          !toggleButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex relative">
        {/* Floating Sidebar Toggle Button */}
        <button
          id="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-20 left-4 z-50 bg-white text-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-200"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Floating Sidebar */}
        <div
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-40 w-[280px] transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            transition-transform duration-200 ease-in-out`}
        >
          <div className="h-full ml-4 mt-4 mb-4 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === 'pegawai' ? 'Panel Pegawai' : 'Panel Kepala Satker'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {userRole === 'pegawai'
                  ? 'Entri dan lihat pekerjaan harian'
                  : 'Tinjau dan setujui pekerjaan'}
              </p>
            </div>
            
            <nav className="p-4 space-y-1">
              {userRole === 'pegawai' ? (
                <>
                  <SidebarItem
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    label="Dashboard"
                    isActive={currentView === 'dashboard'}
                    onClick={() => handleMenuClick('dashboard')}
                  />
                  <SidebarItem
                    icon={<ClipboardCheck className="h-5 w-5" />}
                    label="Entri Pekerjaan"
                    isActive={currentView === 'history'}
                    onClick={() => handleMenuClick('history')}
                  />
                  <SidebarItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Pekerjaan Bulan Ini"
                    isActive={currentView === 'monthly'}
                    onClick={() => handleMenuClick('monthly')}
                  />
                </>
              ) : (
                <>
                  <SidebarItem
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    label="Dashboard"
                    isActive={currentView === 'dashboard'}
                    onClick={() => handleMenuClick('dashboard')}
                  />
                  <SidebarItem
                    icon={<ClipboardCheck className="h-5 w-5" />}
                    label="Persetujuan"
                    isActive={currentView === 'approval'}
                    onClick={() => handleMenuClick('approval')}
                  />
                  <SidebarItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Pekerjaan Bulan Ini"
                    isActive={currentView === 'monthly'}
                    onClick={() => handleMenuClick('monthly')}
                  />
                </>
              )}
              
              {/* FAQ Menu Item */}
              <SidebarItem
                icon={<HelpCircle className="h-5 w-5" />}
                label="FAQ"
                isActive={showFAQ}
                onClick={() => {
                  setShowFAQ(!showFAQ);
                  if (!showFAQ) {
                    setCurrentView('');
                  }
                  setIsSidebarOpen(false);
                }}
              />
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {showFAQ ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Pertanyaan yang Sering Diajukan</h2>
                <div className="space-y-6">
                  {FAQ_ITEMS.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Router currentView={currentView} />
            )}
          </div>
        </main>
      </div>
      
      <Footer />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;