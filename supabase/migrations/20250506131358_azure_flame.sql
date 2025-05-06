/*
  # Update delete policy for work entries
  
  1. Changes
    - Update delete policy to allow deletion of both pending and rejected entries
  
  2. Security
    - Modify RLS policy for delete operations
*/

DROP POLICY IF EXISTS "Allow delete access to all users" ON work_entries;

CREATE POLICY "Allow delete for pending and rejected entries"
ON work_entries
FOR DELETE
TO authenticated
USING (
  status IN ('tertunda', 'ditolak')
);