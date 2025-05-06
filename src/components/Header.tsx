import React, { useState } from 'react';
import { LogOut, Menu, X, Key } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getEmployeeName } from '../utils/employeeUtils';
import ChangePasswordModal from './ChangePasswordModal';

const Header: React.FC = () => {
  const { userRole } = useApp();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const employeeName = user?.email ? getEmployeeName(user.email) : '';

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-white">
                <h1 className="text-xl font-bold">PEKA</h1>
                <p className="text-sm text-gray-400">Penilaian Kinerja Harian</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-200">{employeeName}</span>
                <span className="text-xs text-gray-400">
                  {userRole === 'kepalaSatker' ? 'Kepala Satker' : 'Pegawai'}
                </span>
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Key className="h-4 w-4 mr-2" />
                Ganti Password
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800 space-y-4">
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-200">{employeeName}</div>
                <div className="text-xs text-gray-400">
                  {userRole === 'kepalaSatker' ? 'Kepala Satker' : 'Pegawai'}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800"
              >
                <Key className="h-4 w-4 mr-2" />
                Ganti Password
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Header;