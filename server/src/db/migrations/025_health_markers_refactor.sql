-- Add marker_type to health_markers: 'numeric' or 'text'
ALTER TABLE health_markers ADD COLUMN marker_type TEXT NOT NULL DEFAULT 'numeric';

-- Add reference range columns to health_markers (moved from results)
ALTER TABLE health_markers ADD COLUMN min_reference REAL;

ALTER TABLE health_markers ADD COLUMN max_reference REAL;

-- Add normal_value for text markers (e.g., "Negative")
ALTER TABLE health_markers ADD COLUMN normal_value TEXT;

-- Add text_value column to health_report_results for text markers
ALTER TABLE health_report_results ADD COLUMN text_value TEXT;
