import { z } from 'zod';
export declare const userRoleSchema: z.ZodEnum<["business", "worker"]>;
export declare const taskStatusSchema: z.ZodEnum<["draft", "open", "funded", "accepted", "submitted", "reviewed", "released", "disputed", "cancelled"]>;
export declare const checklistItemSchema: z.ZodObject<{
    criterion: z.ZodString;
    met: z.ZodBoolean;
    evidence: z.ZodString;
}, "strip", z.ZodTypeAny, {
    criterion: string;
    met: boolean;
    evidence: string;
}, {
    criterion: string;
    met: boolean;
    evidence: string;
}>;
export declare const aiReviewResponseSchema: z.ZodObject<{
    quality_score: z.ZodNumber;
    fraud_score: z.ZodNumber;
    requirements_met: z.ZodBoolean;
    checklist: z.ZodArray<z.ZodObject<{
        criterion: z.ZodString;
        met: z.ZodBoolean;
        evidence: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        criterion: string;
        met: boolean;
        evidence: string;
    }, {
        criterion: string;
        met: boolean;
        evidence: string;
    }>, "many">;
    summary: z.ZodString;
    business_recommendation: z.ZodEnum<["approve", "request_revision", "reject", "dispute"]>;
    suggested_revision_request: z.ZodString;
    plagiarism_or_low_effort_signals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    quality_score: number;
    fraud_score: number;
    requirements_met: boolean;
    checklist: {
        criterion: string;
        met: boolean;
        evidence: string;
    }[];
    summary: string;
    business_recommendation: "approve" | "request_revision" | "reject" | "dispute";
    suggested_revision_request: string;
    plagiarism_or_low_effort_signals?: string[] | undefined;
}, {
    quality_score: number;
    fraud_score: number;
    requirements_met: boolean;
    checklist: {
        criterion: string;
        met: boolean;
        evidence: string;
    }[];
    summary: string;
    business_recommendation: "approve" | "request_revision" | "reject" | "dispute";
    suggested_revision_request: string;
    plagiarism_or_low_effort_signals?: string[] | undefined;
}>;
export declare const aiTaskBuilderResponseSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    acceptance_criteria: z.ZodArray<z.ZodString, "many">;
    suggested_payout_min: z.ZodNumber;
    suggested_payout_max: z.ZodNumber;
    required_skills: z.ZodArray<z.ZodString, "many">;
    difficulty_estimate: z.ZodEnum<["easy", "medium", "hard"]>;
}, "strip", z.ZodTypeAny, {
    title: string;
    category: string;
    description: string;
    acceptance_criteria: string[];
    suggested_payout_min: number;
    suggested_payout_max: number;
    required_skills: string[];
    difficulty_estimate: "easy" | "medium" | "hard";
}, {
    title: string;
    category: string;
    description: string;
    acceptance_criteria: string[];
    suggested_payout_min: number;
    suggested_payout_max: number;
    required_skills: string[];
    difficulty_estimate: "easy" | "medium" | "hard";
}>;
export declare const syncProfileSchema: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["business", "worker"]>>;
    display_name: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    role?: "business" | "worker" | undefined;
    display_name?: string | undefined;
    avatar_url?: string | null | undefined;
    bio?: string | null | undefined;
}, {
    role?: "business" | "worker" | undefined;
    display_name?: string | undefined;
    avatar_url?: string | null | undefined;
    bio?: string | null | undefined;
}>;
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    acceptance_criteria: z.ZodArray<z.ZodString, "many">;
    payout_amount: z.ZodNumber;
    token_symbol: z.ZodDefault<z.ZodString>;
    chain: z.ZodDefault<z.ZodString>;
    deadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    required_skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    status: z.ZodDefault<z.ZodEnum<["draft", "open"]>>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "open";
    title: string;
    category: string;
    description: string;
    acceptance_criteria: string[];
    required_skills: string[];
    payout_amount: number;
    token_symbol: string;
    chain: string;
    deadline?: string | null | undefined;
}, {
    title: string;
    category: string;
    description: string;
    acceptance_criteria: string[];
    payout_amount: number;
    deadline?: string | null | undefined;
    status?: "draft" | "open" | undefined;
    required_skills?: string[] | undefined;
    token_symbol?: string | undefined;
    chain?: string | undefined;
}>;
export declare const fundTaskSchema: z.ZodObject<{
    escrow_tx_hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    escrow_tx_hash: string;
}, {
    escrow_tx_hash: string;
}>;
export declare const submitTaskSchema: z.ZodObject<{
    submission_text: z.ZodOptional<z.ZodString>;
    submission_url: z.ZodOptional<z.ZodString>;
    attachments: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>;
}, "strip", z.ZodTypeAny, {
    attachments: Record<string, unknown>[];
    submission_text?: string | undefined;
    submission_url?: string | undefined;
}, {
    submission_text?: string | undefined;
    submission_url?: string | undefined;
    attachments?: Record<string, unknown>[] | undefined;
}>;
export declare const disputeSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const releasePaymentSchema: z.ZodObject<{
    release_tx_hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    release_tx_hash: string;
}, {
    release_tx_hash: string;
}>;
export declare const taskBuilderRequestSchema: z.ZodObject<{
    rough_idea: z.ZodString;
    category_hint: z.ZodOptional<z.ZodString>;
    budget_hint: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    rough_idea: string;
    category_hint?: string | undefined;
    budget_hint?: number | undefined;
}, {
    rough_idea: string;
    category_hint?: string | undefined;
    budget_hint?: number | undefined;
}>;
export declare const reviewSubmissionRequestSchema: z.ZodObject<{
    task_id: z.ZodString;
    submission_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    task_id: string;
    submission_id: string;
}, {
    task_id: string;
    submission_id: string;
}>;
export declare const generateTaskRequestSchema: z.ZodObject<{
    rough_idea: z.ZodString;
    category_hint: z.ZodOptional<z.ZodString>;
    budget_hint: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    rough_idea: string;
    category_hint?: string | undefined;
    budget_hint?: number | undefined;
}, {
    rough_idea: string;
    category_hint?: string | undefined;
    budget_hint?: number | undefined;
}>;
export declare const scoreWorkerSkillsRequestSchema: z.ZodObject<{
    profile_id: z.ZodString;
    task_id: z.ZodString;
    category: z.ZodString;
    quality_score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quality_score: number;
    category: string;
    task_id: string;
    profile_id: string;
}, {
    quality_score: number;
    category: string;
    task_id: string;
    profile_id: string;
}>;
export declare const disputeSummaryRequestSchema: z.ZodObject<{
    task_id: z.ZodString;
    submission_id: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    task_id: string;
    submission_id: string;
}, {
    reason: string;
    task_id: string;
    submission_id: string;
}>;
export type SyncProfileInput = z.infer<typeof syncProfileSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type FundTaskInput = z.infer<typeof fundTaskSchema>;
export type SubmitTaskInput = z.infer<typeof submitTaskSchema>;
export type DisputeInput = z.infer<typeof disputeSchema>;
export type ReleasePaymentInput = z.infer<typeof releasePaymentSchema>;
export type TaskBuilderRequestInput = z.infer<typeof taskBuilderRequestSchema>;
