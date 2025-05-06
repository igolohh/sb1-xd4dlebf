/*
  # Update position constraint

  1. Changes
    - Update the valid_position constraint to include the correct position values
    
  2. Security
    - No changes to security policies
*/

DO $$ 
BEGIN
  ALTER TABLE work_entries DROP CONSTRAINT IF EXISTS valid_position;
  
  ALTER TABLE work_entries ADD CONSTRAINT valid_position 
    CHECK (position = ANY (ARRAY[
      'Statistisi Ahli Pertama',
      'Statistisi Ahli Muda',
      'Pelaksana',
      'Statistisi Pelaksana',
      'Kasubag'
    ]::text[]));
END $$;