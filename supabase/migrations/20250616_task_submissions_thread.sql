-- Allow multiple submissions per task (thread / revisions)
ALTER TABLE task_submissions
  DROP CONSTRAINT IF EXISTS task_submissions_task_id_key;

CREATE INDEX IF NOT EXISTS idx_task_submissions_task_created
  ON task_submissions (task_id, created_at ASC);
