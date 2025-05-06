/*
  # Create work entries table

  1. New Tables
    - `work_entries`
      - `id` (uuid, primary key)
      - `pegawai` (text)
      - `judul` (text)
      - `deskripsi` (text)
      - `tanggal` (date)
      - `status` (text)
      - `komentar` (text, nullable)
      - `tanggal_persetujuan` (date, nullable)
      - `waktu_submit` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `work_entries` table
    - Add policies for read and write access
*/

-- Create work_entries table
CREATE TABLE IF NOT EXISTS work_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pegawai text NOT NULL,
  judul text NOT NULL,
  deskripsi text NOT NULL,
  tanggal date NOT NULL,
  status text NOT NULL DEFAULT 'tertunda',
  komentar text,
  tanggal_persetujuan date,
  waktu_submit timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE work_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
  ON work_entries
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow insert access to all users"
  ON work_entries
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Allow update access to all users"
  ON work_entries
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete access to all users"
  ON work_entries
  FOR DELETE
  TO authenticated, anon
  USING (status = 'tertunda');