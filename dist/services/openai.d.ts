import type { AIReviewResponse, AITaskBuilderResponse } from "../shared/index.js";
export declare const reviewSubmissionWithAI: (params: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    payoutAmount: number;
    submissionText: string | null;
    submissionUrl: string | null;
    attachments: Record<string, unknown>[];
}) => Promise<AIReviewResponse>;
export declare const generateTaskWithAI: (params: {
    roughIdea: string;
    categoryHint?: string;
    budgetHint?: number;
}) => Promise<AITaskBuilderResponse>;
export declare const generateDisputeSummary: (params: {
    title: string;
    description: string;
    reason: string;
    submissionText: string | null;
}) => Promise<string>;
export declare const scoreWorkerSkills: (params: {
    profileId: string;
    category: string;
    qualityScore: number;
}) => Promise<void>;
