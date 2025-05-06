import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils/dateUtils';
import { getEmployeeName, getEmployeeDepartment, getEmployeePosition } from '../utils/employeeUtils';
import { useAuth } from '../contexts/AuthContext';

const EntryForm: React.FC = () => {
  const { addEntry } = useApp();
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] || '';
  const userDepartment = user?.email ? getEmployeeDepartment(user.email) : 'IPDS';
  const userPosition = user?.email ? getEmployeePosition(user.email) : 'Staff';
  
  const [formData, setFormData] = useState({
    pegawai: username,
    judul: '',
    deskripsi: '',
    tanggal: formatDate(new Date()),
    department: userDepartment,
    position: userPosition,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pegawai || !formData.judul || !formData.deskripsi) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addEntry(formData);
      
      setFormData({
        ...formData,
        judul: '',
        deskripsi: '',
        tanggal: formatDate(new Date()),
      });
      
      setSuccessMessage('Entri berhasil ditambahkan!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-pulse">
          {successMessage}
        </div>
      )}
      
      <div>
        <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={formData.tanggal}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">
          Judul Pekerjaan
        </label>
        <input
          type="text"
          id="judul"
          name="judul"
          value={formData.judul}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Pekerjaan
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Hidden fields for fixed values */}
      <input type="hidden" name="pegawai" value={formData.pegawai} />
      <input type="hidden" name="department" value={formData.department} />
      <input type="hidden" name="position" value={formData.position} />
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Mengirim...' : 'Simpan Entri Pekerjaan'}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;