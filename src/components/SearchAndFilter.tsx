import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DEPARTMENTS } from '../contexts/AppContext';
import { employeeNameMap } from '../utils/employeeUtils';

interface SearchAndFilterProps {
  isApprover?: boolean;
  showMonthFilter?: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ 
  isApprover = false,
  showMonthFilter = false,
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
    currentMonth,
    setCurrentMonth,
  } = useApp();

  const selectClasses = "px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 text-sm transition-shadow hover:border-gray-300";
  const inputClasses = "w-full sm:w-72 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm transition-shadow hover:border-gray-300";

  // Get sorted list of employees
  const employees = Object.entries(employeeNameMap)
    .map(([username, name]) => ({ username, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={isApprover ? "Cari berdasarkan judul..." : "Cari pekerjaan..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClasses}
        />
      </div>

      {isApprover && (
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className={selectClasses}
        >
          <option value="semua">Semua Departemen</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      )}

      {isApprover && (
        <select
          onChange={(e) => {
            const selectedEmployee = e.target.value;
            setSearchTerm(selectedEmployee === 'semua' ? '' : selectedEmployee);
          }}
          value={searchTerm || 'semua'}
          className={selectClasses}
        >
          <option value="semua">Semua Pegawai</option>
          {employees.map(({ username, name }) => (
            <option key={username} value={username}>
              {name}
            </option>
          ))}
        </select>
      )}

      {showMonthFilter && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className={inputClasses}
          />
        </div>
      )}
      
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className={selectClasses}
      >
        <option value="semua">Semua Status</option>
        <option value="tertunda">Menunggu Persetujuan</option>
        <option value="disetujui">Disetujui</option>
        <option value="ditolak">Ditolak</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;