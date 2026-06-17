-- =============================================================================
-- Migration: allow multiple submissions per task (submission thread / revisions)
--
-- Run this in the Supabase SQL Editor (or psql) against your EXISTING database.
-- Safe to run more than once (idempotent).
--
-- Before: task_submissions had UNIQUE(task_id) — only one row per task.
-- After:  workers can submit revisions; each submit creates a new row.
-- =============================================================================

BEGIN;

-- Remove the one-submission-per-task constraint
ALTER TABLE task_submissions
  DROP CONSTRAINT IF EXISTS task_submissions_task_id_key;

-- Speed up thread queries: list submissions for a task in chronological order
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_created
  ON task_submissions (task_id, created_at ASC);

COMMIT;
