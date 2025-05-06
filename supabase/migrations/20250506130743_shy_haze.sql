/*
  # Add department and position fields

  1. Changes
    - Add department and position fields to work_entries table
    - Add check constraints for valid values
    - Update existing RLS policies

  2. New Fields
    - department: Department of the employee
    - position: Position/role of the employee
*/

-- Add new columns with check constraints
ALTER TABLE work_entries 
ADD COLUMN department text NOT NULL DEFAULT 'IPDS',
ADD COLUMN position text NOT NULL DEFAULT 'Staff',
ADD CONSTRAINT valid_department CHECK (
  department IN ('IPDS', 'Sosial', 'Produksi', 'Distribusi', 'Neraca', 'Sub Bagian Umum', 'BPS Kabupaten Buru')
),
ADD CONSTRAINT valid_position CHECK (
  position IN ('Kepala', 'Kasubag', 'KF', 'Staff')
);