import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from './AuthContext';

export interface WorkEntry {
  id: string;
  tanggal: string;
  pegawai: string;
  judul: string;
  deskripsi: string;
  status: 'tertunda' | 'disetujui' | 'ditolak';
  komentar?: string;
  tanggalPersetujuan?: string;
  waktuSubmit: string;
  department: string;
  position: string;
}

interface AppContextType {
  entries: WorkEntry[];
  userRole: 'pegawai' | 'kepalaSatker';
  addEntry: (entry: Omit<WorkEntry, 'id' | 'status' | 'waktuSubmit'>) => Promise<void>;
  approveEntry: (id: string, approved: boolean, komentar?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterDepartment: string;
  setFilterDepartment: (department: string) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
}

export const DEPARTMENTS = [
  'IPDS',
  'Sosial',
  'Produksi',
  'Distribusi',
  'Neraca',
  'Sub Bagian Umum'
] as const;

export const POSITIONS = [
  'Statistisi Ahli Pertama',
  'Statistisi Ahli Muda',
  'Pelaksana',
  'Statistisi Pelaksana',
  'Kasubag'
] as const;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterDepartment, setFilterDepartment] = useState('semua');
  const [currentMonth, setCurrentMonth] = useState(formatDate(new Date()).substring(0, 7));

  const userRole = user?.email === 'christo.erie@bps.go.id' ? 'kepalaSatker' : 'pegawai';

  const fetchEntries = async () => {
    try {
      let query = supabase
        .from('work_entries')
        .select('*')
        .order('waktu_submit', { ascending: false });

      if (currentMonth) {
        const startDate = `${currentMonth}-01`;
        const [year, month] = currentMonth.split('-').map(Number);
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${currentMonth}-${String(lastDay).padStart(2, '0')}`;
        
        query = query
          .gte('tanggal', startDate)
          .lte('tanggal', endDate);
      }

      if (filterDepartment !== 'semua') {
        query = query.eq('department', filterDepartment);
      }

      if (userRole === 'pegawai' && user?.email) {
        const username = user.email.split('@')[0];
        query = query.eq('pegawai', username);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching entries:', error);
        return;
      }

      const transformedEntries = data.map(entry => ({
        id: entry.id,
        tanggal: entry.tanggal,
        pegawai: entry.pegawai,
        judul: entry.judul,
        deskripsi: entry.deskripsi,
        status: entry.status,
        komentar: entry.komentar,
        tanggalPersetujuan: entry.tanggal_persetujuan,
        waktuSubmit: entry.waktu_submit,
        department: entry.department,
        position: entry.position,
      }));

      setEntries(transformedEntries);
    } catch (error) {
      console.error('Error in fetchEntries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('work_entries_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'work_entries' 
        }, 
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentMonth, filterDepartment, user?.email]);

  const addEntry = async (entry: Omit<WorkEntry, 'id' | 'status' | 'waktuSubmit'>) => {
    const { data, error } = await supabase.from('work_entries').insert([{
      pegawai: entry.pegawai,
      judul: entry.judul,
      deskripsi: entry.deskripsi,
      tanggal: entry.tanggal,
      department: entry.department,
      position: entry.position,
    }]).select();

    if (error) {
      console.error('Error adding entry:', error);
      throw error;
    }

    // Immediately update local state
    if (data) {
      setEntries(prevEntries => [data[0], ...prevEntries]);
    }
  };

  const approveEntry = async (id: string, approved: boolean, komentar?: string) => {
    const updateData = {
      status: approved ? 'disetujui' : 'ditolak',
      komentar: komentar,
      tanggal_persetujuan: formatDate(new Date()),
    };

    const { data, error } = await supabase
      .from('work_entries')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating entry:', error);
      throw error;
    }

    // Immediately update local state
    if (data) {
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id
            ? {
                ...entry,
                status: updateData.status,
                komentar: updateData.komentar,
                tanggalPersetujuan: updateData.tanggal_persetujuan,
              }
            : entry
        )
      );
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('work_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }

    // Immediately update local state
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        entries,
        userRole,
        addEntry,
        approveEntry,
        deleteEntry,
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        filterDepartment,
        setFilterDepartment,
        currentMonth,
        setCurrentMonth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};