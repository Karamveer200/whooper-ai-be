export type UserRole = 'business' | 'worker'

export type TaskStatus =
  | 'draft'
  | 'open'
  | 'funded'
  | 'accepted'
  | 'submitted'
  | 'reviewed'
  | 'released'
  | 'completed'
  | 'disputed'
  | 'cancelled'

export type SubmissionStatus =
  | 'submitted'
  | 'reviewed'
  | 'revision_requested'
  | 'approved'
  | 'rejected'
  | 'disputed'

export type PaymentStatus =
  | 'pending_escrow'
  | 'escrowed'
  | 'release_pending'
  | 'released'
  | 'failed'
  | 'refunded'

export type DisputeStatus =
  | 'open'
  | 'resolved_for_business'
  | 'resolved_for_worker'
  | 'cancelled'

export type BusinessRecommendation =
  | 'approve'
  | 'request_revision'
  | 'reject'
  | 'dispute'

export interface Profile {
  id: string
  privy_user_id: string
  wallet_address: string
  role: UserRole
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  trust_score: number
  total_earned: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  business_id: string
  title: string
  category: string
  description: string
  acceptance_criteria: string[]
  payout_amount: number
  token_symbol: string
  chain: string
  status: TaskStatus
  required_skills: string[]
  deadline: string | null
  escrow_tx_hash: string | null
  assigned_worker_id: string | null
  created_at: string
  updated_at: string
  business?: Profile
  assigned_worker?: Profile
}

export interface TaskSubmission {
  id: string
  task_id: string
  worker_id: string
  submission_text: string | null
  submission_url: string | null
  attachments: Record<string, unknown>[]
  status: SubmissionStatus
  created_at: string
  updated_at: string
  worker?: Profile
}

export interface ChecklistItem {
  criterion: string
  met: boolean
  evidence: string
}

export interface AIReview {
  id: string
  task_id: string
  submission_id: string
  quality_score: number
  fraud_score: number
  requirements_met: boolean
  checklist: ChecklistItem[]
  summary: string | null
  business_recommendation: BusinessRecommendation | null
  suggested_revision_request: string | null
  raw_ai_response: Record<string, unknown> | null
  created_at: string
}

export interface Payment {
  id: string
  task_id: string
  business_id: string
  worker_id: string | null
  amount: number
  token_symbol: string
  chain: string
  escrow_tx_hash: string | null
  release_tx_hash: string | null
  status: PaymentStatus
  created_at: string
  updated_at: string
}

export interface SkillScore {
  id: string
  profile_id: string
  skill: string
  score: number
  completed_tasks_count: number
  updated_at: string
}

export interface TaskEvent {
  id: string
  task_id: string
  actor_id: string | null
  event_type: string
  metadata: Record<string, unknown>
  created_at: string
  actor?: Profile
  task?: Task
}

export interface Dispute {
  id: string
  task_id: string
  submission_id: string
  opened_by: string
  reason: string | null
  ai_dispute_summary: string | null
  status: DisputeStatus
  created_at: string
  updated_at: string
}

export interface AIReviewResponse {
  quality_score: number
  fraud_score: number
  requirements_met: boolean
  checklist: ChecklistItem[]
  summary: string
  business_recommendation: BusinessRecommendation
  suggested_revision_request: string
  plagiarism_or_low_effort_signals?: string[]
}

export interface AITaskBuilderResponse {
  title: string
  category: string
  description: string
  acceptance_criteria: string[]
  suggested_payout_min: number
  suggested_payout_max: number
  required_skills: string[]
  difficulty_estimate: 'easy' | 'medium' | 'hard'
}

export interface MarketplaceFilters {
  category?: string
  minPayout?: number
  maxPayout?: number
  skill?: string
  verificationLevel?: 'all' | 'verified' | 'top'
  sortBy?: 'newest' | 'payout' | 'deadline'
}

export interface LiveFeedItem {
  id: string
  event_type: string
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}
