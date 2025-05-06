import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Calendar, Clock, User } from 'lucide-react';
import { WorkEntry, useApp } from '../contexts/AppContext';
import { formatDateTime, formatStatusBadge } from '../utils/dateUtils';
import { getEmployeeName } from '../utils/employeeUtils';

interface EntryModalProps {
  entry: WorkEntry;
  isApprover: boolean;
  onClose: () => void;
}

const EntryModal: React.FC<EntryModalProps> = ({ entry, isApprover, onClose }) => {
  const { approveEntry } = useApp();
  const [komentar, setKomentar] = useState(entry.komentar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const statusBadge = formatStatusBadge(entry.status);
  const employeeName = getEmployeeName(entry.pegawai + '@bps.go.id');
  
  const handleApproval = (approved: boolean) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      approveEntry(entry.id, approved, komentar);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Detail Pekerjaan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
              <span className={`${statusBadge.bgColor} ${statusBadge.color} text-sm px-3 py-1 rounded-full flex items-center`}>
                {entry.status === 'disetujui' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : entry.status === 'ditolak' ? (
                  <XCircle className="h-4 w-4 mr-1" />
                ) : null}
                {statusBadge.text}
              </span>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{entry.tanggal}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDateTime(entry.waktuSubmit)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{employeeName}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{entry.judul}</h3>
            <p className="text-gray-700 whitespace-pre-line">{entry.deskripsi}</p>
          </div>
          
          {entry.status !== 'tertunda' && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-2">
                {entry.status === 'disetujui' ? 'Catatan Persetujuan:' : 'Alasan Penolakan:'}
              </h4>
              <p className="text-gray-700">{entry.komentar || 'Tidak ada catatan.'}</p>
              {entry.tanggalPersetujuan && (
                <p className="text-sm text-gray-500 mt-2">
                  Ditinjau pada: {entry.tanggalPersetujuan}
                </p>
              )}
            </div>
          )}
          
          {isApprover && entry.status === 'tertunda' && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Tinjau Entri Ini:</h4>
              <div className="mb-4">
                <label htmlFor="komentar" className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan/Komentar (opsional):
                </label>
                <textarea
                  id="komentar"
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tambahkan catatan atau komentar di sini..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleApproval(false)}
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <XCircle className="h-5 w-5 mr-1" />
                  Tolak
                </button>
                <button
                  onClick={() => handleApproval(true)}
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 mr-1" />
                  Setujui
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryModal;