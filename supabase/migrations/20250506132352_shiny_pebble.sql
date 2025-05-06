/*
  # Update departments and add sample data

  1. Changes
    - Remove 'BPS Kabupaten Buru' from valid departments
    - Update constraint to reflect new department list
    - Add sample work entries for employees

  2. Sample Data
    - Creates entries for multiple employees across departments
    - Includes various statuses (tertunda, disetujui, ditolak)
    - Spans different dates within the current month
*/

-- Update the department constraint
DO $$ 
BEGIN
  ALTER TABLE work_entries DROP CONSTRAINT IF EXISTS valid_department;
  ALTER TABLE work_entries ADD CONSTRAINT valid_department 
    CHECK (department = ANY (ARRAY['IPDS', 'Sosial', 'Produksi', 'Distribusi', 'Neraca', 'Sub Bagian Umum']));
END $$;

-- Insert sample work entries
INSERT INTO work_entries (pegawai, judul, deskripsi, tanggal, department, position, status, waktu_submit)
VALUES
  -- IPDS Department
  ('john.doe', 'Pengolahan Data Sensus', 'Melakukan pengolahan data hasil sensus penduduk', '2024-03-01', 'IPDS', 'Staff', 'disetujui', NOW() - INTERVAL '10 days'),
  ('jane.smith', 'Pemeliharaan Server', 'Melakukan maintenance rutin server kantor', '2024-03-02', 'IPDS', 'Staff', 'tertunda', NOW() - INTERVAL '9 days'),
  
  -- Sosial Department
  ('alice.wong', 'Survei Sosial Ekonomi', 'Melaksanakan survei kondisi sosial ekonomi masyarakat', '2024-03-03', 'Sosial', 'KF', 'disetujui', NOW() - INTERVAL '8 days'),
  ('bob.wilson', 'Analisis Data Kemiskinan', 'Menganalisis data kemiskinan daerah', '2024-03-04', 'Sosial', 'Staff', 'ditolak', NOW() - INTERVAL '7 days'),
  
  -- Produksi Department
  ('carol.brown', 'Survei Produksi Padi', 'Melakukan survei produksi padi di daerah pertanian', '2024-03-05', 'Produksi', 'KF', 'disetujui', NOW() - INTERVAL '6 days'),
  ('david.lee', 'Analisis Hasil Pertanian', 'Menganalisis hasil produksi pertanian', '2024-03-06', 'Produksi', 'Staff', 'tertunda', NOW() - INTERVAL '5 days'),
  
  -- Distribusi Department
  ('emma.davis', 'Survei Harga Konsumen', 'Melakukan survei harga konsumen di pasar tradisional', '2024-03-07', 'Distribusi', 'KF', 'disetujui', NOW() - INTERVAL '4 days'),
  ('frank.miller', 'Analisis Inflasi', 'Menganalisis data inflasi bulanan', '2024-03-08', 'Distribusi', 'Staff', 'tertunda', NOW() - INTERVAL '3 days'),
  
  -- Neraca Department
  ('grace.chen', 'Penyusunan PDRB', 'Menyusun data PDRB triwulanan', '2024-03-09', 'Neraca', 'KF', 'disetujui', NOW() - INTERVAL '2 days'),
  ('henry.zhang', 'Analisis Neraca', 'Menganalisis neraca perdagangan', '2024-03-10', 'Neraca', 'Staff', 'tertunda', NOW() - INTERVAL '1 day'),
  
  -- Sub Bagian Umum
  ('ivy.taylor', 'Pengelolaan Arsip', 'Melakukan pengelolaan arsip kantor', '2024-03-11', 'Sub Bagian Umum', 'Staff', 'disetujui', NOW()),
  ('jack.thomas', 'Inventarisasi Aset', 'Melakukan inventarisasi aset kantor', '2024-03-12', 'Sub Bagian Umum', 'Staff', 'tertunda', NOW());