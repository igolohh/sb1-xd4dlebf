import React from 'react';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import SearchAndFilter from '../components/SearchAndFilter';
import MonthlyStats from '../components/MonthlyStats';
import { useApp } from '../contexts/AppContext';

interface EmployeeViewProps {
  currentView: string;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ currentView }) => {
  const { entries, searchTerm, filterStatus } = useApp();
  
  // Filter entries based on search, status, and approval
  const filteredEntries = entries
    .filter(entry => {
      // For monthly view, only show approved entries
      if (currentView === 'monthly') {
        return entry.status === 'disetujui';
      }
      
      // Filter by status
      if (filterStatus !== 'semua') {
        return entry.status === filterStatus;
      }
      return true;
    })
    .filter(entry => {
      // Filter by search keywords
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.judul.toLowerCase().includes(searchLower) ||
        entry.deskripsi.toLowerCase().includes(searchLower)
      );
    });

  // Calculate statistics for the dashboard
  const totalEntries = entries.length;
  const approvedEntries = entries.filter(entry => entry.status === 'disetujui').length;
  const pendingEntries = entries.filter(entry => entry.status === 'tertunda').length;
  const rejectedEntries = entries.filter(entry => entry.status === 'ditolak').length;

  if (currentView === 'monthly') {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">Pekerjaan Disetujui Bulan Ini</h2>
          <SearchAndFilter showMonthFilter />
        </div>
        <EntryList entries={filteredEntries} />
      </section>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Entri</p>
            <p className="text-2xl font-bold">{totalEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Disetujui</p>
            <p className="text-2xl font-bold">{approvedEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Menunggu</p>
            <p className="text-2xl font-bold">{pendingEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Ditolak</p>
            <p className="text-2xl font-bold">{rejectedEntries}</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">Statistik Pekerjaan Anda</h2>
            <SearchAndFilter showMonthFilter />
          </div>
          <MonthlyStats entries={filteredEntries} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Entri Pekerjaan Baru</h2>
        <EntryForm />
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold">Entri Pekerjaan</h2>
          <SearchAndFilter />
        </div>
        <EntryList entries={filteredEntries} />
      </section>
    </div>
  );
};

export default EmployeeView;