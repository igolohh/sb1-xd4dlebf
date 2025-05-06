import React from 'react';
import EntryList from '../components/EntryList';
import SearchAndFilter from '../components/SearchAndFilter';
import MonthlyStats from '../components/MonthlyStats';
import { useApp } from '../contexts/AppContext';

interface ApproverViewProps {
  currentView: string;
}

const ApproverView: React.FC<ApproverViewProps> = ({ currentView }) => {
  const { entries, searchTerm, filterDepartment } = useApp();
  
  // Filter entries based on search and employee name for monthly view
  const filteredEntries = entries
    .filter(entry => {
      // For monthly view, only show approved entries
      if (currentView === 'monthly') {
        return entry.status === 'disetujui';
      }
      return true;
    })
    .filter(entry => {
      // Filter by department
      if (filterDepartment !== 'semua') {
        return entry.department === filterDepartment;
      }
      return true;
    })
    .filter(entry => {
      // Filter by search keywords (includes employee name)
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.pegawai.toLowerCase().includes(searchLower) ||
        entry.judul.toLowerCase().includes(searchLower) ||
        entry.deskripsi.toLowerCase().includes(searchLower)
      );
    });

  // Calculate statistics
  const totalEntries = entries.length;
  const pendingEntries = entries.filter(entry => entry.status === 'tertunda').length;
  const approvedEntries = entries.filter(entry => entry.status === 'disetujui').length;
  const rejectedEntries = entries.filter(entry => entry.status === 'ditolak').length;

  if (currentView === 'dashboard') {
    return (
      <div className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Entri</p>
            <p className="text-2xl font-bold">{totalEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Menunggu Persetujuan</p>
            <p className="text-2xl font-bold">{pendingEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Disetujui</p>
            <p className="text-2xl font-bold">{approvedEntries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-gray-500 text-sm">Ditolak</p>
            <p className="text-2xl font-bold">{rejectedEntries}</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold">Statistik Pekerjaan Pegawai</h2>
            <SearchAndFilter isApprover showMonthFilter />
          </div>
          <MonthlyStats entries={filteredEntries} />
        </section>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {currentView === 'monthly' ? 'Pekerjaan Disetujui Bulan Ini' : 'Persetujuan Pekerjaan'}
        </h2>
        <SearchAndFilter isApprover showMonthFilter={currentView === 'monthly'} />
      </div>
      <EntryList entries={filteredEntries} isApprover />
    </section>
  );
};

export default ApproverView;