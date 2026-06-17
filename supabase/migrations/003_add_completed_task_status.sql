-- Allow tasks to move from released -> completed after on-chain payout
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks ADD CONSTRAINT tasks_status_check
  CHECK (status IN (
    'draft',
    'open',
    'funded',
    'accepted',
    'submitted',
    'reviewed',
    'released',
    'completed',
    'disputed',
    'cancelled'
  ));
