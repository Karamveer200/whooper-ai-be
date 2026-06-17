-- TaskForge AI Database Schema
-- Run in Supabase SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_user_id TEXT UNIQUE NOT NULL,
  wallet_address TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('business', 'worker')),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  trust_score NUMERIC DEFAULT 50,
  total_earned NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  acceptance_criteria JSONB NOT NULL DEFAULT '[]',
  payout_amount NUMERIC NOT NULL,
  token_symbol TEXT DEFAULT 'USDC',
  chain TEXT DEFAULT 'base',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','open','funded','accepted','submitted','reviewed','released','disputed','cancelled')),
  required_skills TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ,
  escrow_tx_hash TEXT,
  assigned_worker_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_business_id ON tasks(business_id);
CREATE INDEX idx_tasks_assigned_worker_id ON tasks(assigned_worker_id);
CREATE INDEX idx_tasks_category ON tasks(category);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Task Submissions
CREATE TABLE IF NOT EXISTS task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES profiles(id),
  submission_text TEXT,
  submission_url TEXT,
  attachments JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','reviewed','revision_requested','approved','rejected','disputed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id)
);

CREATE TRIGGER task_submissions_updated_at
  BEFORE UPDATE ON task_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AI Reviews
CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
  quality_score NUMERIC NOT NULL,
  fraud_score NUMERIC NOT NULL,
  requirements_met BOOLEAN DEFAULT FALSE,
  checklist JSONB DEFAULT '[]',
  summary TEXT,
  business_recommendation TEXT,
  suggested_revision_request TEXT,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES profiles(id),
  worker_id UUID REFERENCES profiles(id),
  amount NUMERIC NOT NULL,
  token_symbol TEXT DEFAULT 'USDC',
  chain TEXT DEFAULT 'base',
  escrow_tx_hash TEXT,
  release_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending_escrow'
    CHECK (status IN ('pending_escrow','escrowed','release_pending','released','failed','refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Skill Scores
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  score NUMERIC DEFAULT 50,
  completed_tasks_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, skill)
);

-- Task Events
CREATE TABLE IF NOT EXISTS task_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_events_created_at ON task_events(created_at DESC);
CREATE INDEX idx_task_events_event_type ON task_events(event_type);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  ai_dispute_summary TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','resolved_for_business','resolved_for_worker','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper: get profile id from privy user id (used in RLS via JWT custom claim or request header)
-- For RLS we use a session variable set by the API layer
CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('request.jwt.claim.profile_id', TRUE), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enable Realtime for task_events
ALTER PUBLICATION supabase_realtime ADD TABLE task_events;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (
    privy_user_id = COALESCE(
      current_setting('request.headers', true)::json->>'x-privy-user-id',
      ''
    )
    OR id = current_profile_id()
  );

-- Tasks policies
CREATE POLICY "Readable marketplace tasks"
  ON tasks FOR SELECT
  USING (
    status IN ('open','funded','accepted','submitted','reviewed','released','disputed')
    OR business_id = current_profile_id()
    OR assigned_worker_id = current_profile_id()
  );

CREATE POLICY "Business can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (business_id = current_profile_id());

CREATE POLICY "Business can update own tasks"
  ON tasks FOR UPDATE
  USING (business_id = current_profile_id());

CREATE POLICY "Assigned worker can update task"
  ON tasks FOR UPDATE
  USING (assigned_worker_id = current_profile_id());

-- Submissions policies
CREATE POLICY "Worker can read own submissions"
  ON task_submissions FOR SELECT
  USING (
    worker_id = current_profile_id()
    OR EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_submissions.task_id
      AND t.business_id = current_profile_id()
    )
  );

CREATE POLICY "Worker can insert submission for assigned task"
  ON task_submissions FOR INSERT
  WITH CHECK (
    worker_id = current_profile_id()
    AND EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
      AND t.assigned_worker_id = current_profile_id()
      AND t.status IN ('accepted', 'submitted')
    )
  );

CREATE POLICY "Worker can update own submission"
  ON task_submissions FOR UPDATE
  USING (worker_id = current_profile_id());

-- AI Reviews policies
CREATE POLICY "Business reads reviews for their tasks"
  ON ai_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = ai_reviews.task_id
      AND t.business_id = current_profile_id()
    )
    OR EXISTS (
      SELECT 1 FROM task_submissions s
      WHERE s.id = ai_reviews.submission_id
      AND s.worker_id = current_profile_id()
    )
  );

-- Payments policies
CREATE POLICY "Business reads own payments"
  ON payments FOR SELECT
  USING (
    business_id = current_profile_id()
    OR worker_id = current_profile_id()
  );

-- Skill scores policies
CREATE POLICY "Skill scores are public"
  ON skill_scores FOR SELECT
  USING (true);

-- Task events policies
CREATE POLICY "Relevant parties read task events"
  ON task_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_events.task_id
      AND (
        t.business_id = current_profile_id()
        OR t.assigned_worker_id = current_profile_id()
        OR t.status IN ('open','funded','accepted','submitted','reviewed','released')
      )
    )
  );

-- Disputes policies
CREATE POLICY "Parties can read disputes"
  ON disputes FOR SELECT
  USING (
    opened_by = current_profile_id()
    OR EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = disputes.task_id
      AND (t.business_id = current_profile_id() OR t.assigned_worker_id = current_profile_id())
    )
  );

CREATE POLICY "Parties can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (
    opened_by = current_profile_id()
    AND EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_id
      AND (t.business_id = current_profile_id() OR t.assigned_worker_id = current_profile_id())
    )
  );

-- Service role bypasses RLS automatically when using service role key
