import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-500 text-sm">
          <p>© {currentYear} PEKA - Penilaian Kinerja Harian</p>
          <p className="mt-1 text-gray-400">Sistem Pengelolaan Kinerja Harian untuk Pegawai</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;