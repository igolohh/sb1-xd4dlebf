import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Calendar, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { WorkEntry } from '../contexts/AppContext';
import { formatDateTime, formatStatusBadge } from '../utils/dateUtils';
import { getEmployeeName } from '../utils/employeeUtils';
import EntryModal from './EntryModal';

interface EntryListProps {
  entries: WorkEntry[];
  isApprover?: boolean;
}

const EntryList: React.FC<EntryListProps> = ({ entries, isApprover = false }) => {
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [modalEntry, setModalEntry] = useState<WorkEntry | null>(null);
  const { deleteEntry } = useApp();

  const toggleExpand = (id: string) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  const openModal = (entry: WorkEntry) => {
    setModalEntry(entry);
  };

  const closeModal = () => {
    setModalEntry(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus entri ini?')) {
      deleteEntry(id);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.waktuSubmit).getTime() - new Date(a.waktuSubmit).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Belum ada entri pekerjaan.</p>
        {!isApprover && (
          <p className="text-gray-400 mt-1">Mulai dengan menambahkan pekerjaan baru.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => {
        const isExpanded = expandedEntryId === entry.id;
        const statusBadge = formatStatusBadge(entry.status);
        const canDelete = !isApprover && (entry.status === 'tertunda' || entry.status === 'ditolak');
        const employeeName = getEmployeeName(entry.pegawai + '@bps.go.id');
        
        return (
          <div 
            key={entry.id} 
            className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-200 hover:shadow-md"
          >
            <div className="p-4 cursor-pointer" onClick={() => toggleExpand(entry.id)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-gray-900">{entry.judul}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {entry.tanggal}
                    </div>
                    {isApprover && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {employeeName}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDateTime(entry.waktuSubmit)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <span className={`${statusBadge.bgColor} ${statusBadge.color} text-xs px-2.5 py-0.5 rounded-full`}>
                    {statusBadge.text}
                  </span>
                  <button 
                    className="ml-2 p-1 text-gray-500 hover:text-gray-800"
                    aria-label={isExpanded ? 'Ciutkan' : 'Perluas'}
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan:</h4>
                  <p className="text-gray-600 whitespace-pre-line">{entry.deskripsi}</p>
                </div>
                
                {entry.status !== 'tertunda' && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      {entry.status === 'disetujui' ? 'Catatan Persetujuan:' : 'Alasan Penolakan:'}
                    </h4>
                    <p className="text-gray-600">{entry.komentar || 'Tidak ada catatan.'}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openModal(entry)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    {isApprover && entry.status === 'tertunda' 
                      ? 'Tinjau & Setujui' 
                      : 'Lihat Detail'}
                  </button>
                  
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {modalEntry && (
        <EntryModal 
          entry={modalEntry}
          isApprover={isApprover}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EntryList;