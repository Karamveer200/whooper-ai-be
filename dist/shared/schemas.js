import { z } from 'zod';
export const userRoleSchema = z.enum(['business', 'worker']);
export const taskStatusSchema = z.enum([
    'draft',
    'open',
    'funded',
    'accepted',
    'submitted',
    'reviewed',
    'released',
    'disputed',
    'cancelled',
]);
export const checklistItemSchema = z.object({
    criterion: z.string(),
    met: z.boolean(),
    evidence: z.string(),
});
export const aiReviewResponseSchema = z.object({
    quality_score: z.number().min(0).max(100),
    fraud_score: z.number().min(0).max(100),
    requirements_met: z.boolean(),
    checklist: z.array(checklistItemSchema),
    summary: z.string(),
    business_recommendation: z.enum([
        'approve',
        'request_revision',
        'reject',
        'dispute',
    ]),
    suggested_revision_request: z.string(),
    plagiarism_or_low_effort_signals: z.array(z.string()).optional(),
});
export const aiTaskBuilderResponseSchema = z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    acceptance_criteria: z.array(z.string()),
    suggested_payout_min: z.number(),
    suggested_payout_max: z.number(),
    required_skills: z.array(z.string()),
    difficulty_estimate: z.enum(['easy', 'medium', 'hard']),
});
export const syncProfileSchema = z.object({
    role: userRoleSchema.optional(),
    display_name: z.string().min(1).max(100).optional(),
    avatar_url: z.string().url().optional().nullable(),
    bio: z.string().max(500).optional().nullable(),
});
export const createTaskSchema = z.object({
    title: z.string().min(3).max(200),
    category: z.string().min(1),
    description: z.string().min(10),
    acceptance_criteria: z.array(z.string()).min(1),
    payout_amount: z.number().positive(),
    token_symbol: z.string().default('USDC'),
    chain: z.string().default('base'),
    deadline: z.string().datetime().optional().nullable(),
    required_skills: z.array(z.string()).default([]),
    status: z.enum(['draft', 'open']).default('open'),
});
export const fundTaskSchema = z.object({
    escrow_tx_hash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
});
export const submitTaskSchema = z.object({
    submission_text: z.string().min(10).optional(),
    submission_url: z.string().url().optional(),
    attachments: z.array(z.record(z.unknown())).default([]),
});
export const disputeSchema = z.object({
    reason: z.string().min(10).max(2000),
});
export const releasePaymentSchema = z.object({
    release_tx_hash: z.string().min(10),
});
export const taskBuilderRequestSchema = z.object({
    rough_idea: z.string().min(10).max(5000),
    category_hint: z.string().optional(),
    budget_hint: z.number().positive().optional(),
});
export const reviewSubmissionRequestSchema = z.object({
    task_id: z.string().uuid(),
    submission_id: z.string().uuid(),
});
export const generateTaskRequestSchema = z.object({
    rough_idea: z.string().min(10),
    category_hint: z.string().optional(),
    budget_hint: z.number().positive().optional(),
});
export const scoreWorkerSkillsRequestSchema = z.object({
    profile_id: z.string().uuid(),
    task_id: z.string().uuid(),
    category: z.string(),
    quality_score: z.number().min(0).max(100),
});
export const disputeSummaryRequestSchema = z.object({
    task_id: z.string().uuid(),
    submission_id: z.string().uuid(),
    reason: z.string().min(10),
});
