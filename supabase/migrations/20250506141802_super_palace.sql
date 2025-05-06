/*
  # Update position constraint and add employee positions

  1. Changes
    - Update the valid_position constraint to include new position values
    - Remove old position values
  
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Update the position constraint
  ALTER TABLE work_entries DROP CONSTRAINT IF EXISTS valid_position;
  ALTER TABLE work_entries ADD CONSTRAINT valid_position 
    CHECK (position = ANY (ARRAY[
      'Statistisi Ahli Pertama',
      'Statistisi Ahli Muda',
      'Pelaksana',
      'Statistisi Pelaksana',
      'Kasubag'
    ]));
END $$;