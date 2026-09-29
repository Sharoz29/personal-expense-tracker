-- Add R2 audio storage columns to flashcards table
-- audio_url: Full public URL to the audio file in R2
-- audio_key: R2 object key for deletion

ALTER TABLE flashcards ADD COLUMN audio_url TEXT;
ALTER TABLE flashcards ADD COLUMN audio_key TEXT;
