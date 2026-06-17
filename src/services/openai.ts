import OpenAI from "openai";
import type {
  AIReviewResponse,
  AITaskBuilderResponse,
} from "../shared/index.js";
import {
  aiReviewResponseSchema,
  aiTaskBuilderResponseSchema,
} from "../shared/index.js";
import { getSupabase } from "../lib/supabase.js";

const getOpenAI = (): OpenAI | null => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-your")) return null;
  return new OpenAI({ apiKey });
};

export const reviewSubmissionWithAI = async (params: {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  payoutAmount: number;
  submissionText: string | null;
  submissionUrl: string | null;
  attachments: Record<string, unknown>[];
}): Promise<AIReviewResponse> => {
  const openai = getOpenAI();

  const prompt = `You are Whopper AI, an expert reviewer for a crypto task marketplace.
Compare the worker submission against the task requirements and return strict JSON.

Task Title: ${params.title}
Task Description: ${params.description}
Acceptance Criteria: ${JSON.stringify(params.acceptanceCriteria)}
Payout Level: $${params.payoutAmount} USDC

Worker Submission Text: ${params.submissionText ?? "N/A"}
Worker Submission URL: ${params.submissionUrl ?? "N/A"}
Attachments Metadata: ${JSON.stringify(params.attachments)}

Return JSON with:
- quality_score (0-100)
- fraud_score (0-100, higher = more suspicious)
- requirements_met (boolean)
- checklist (array of {criterion, met, evidence})
- summary (string)
- business_recommendation (approve | request_revision | reject | dispute)
- suggested_revision_request (string, empty if approve)
- plagiarism_or_low_effort_signals (optional string array)`;

  if (!openai) {
    throw new Error("OpenAI not configured");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a task submission reviewer. Respond only with valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = aiReviewResponseSchema.parse(JSON.parse(content));
  return parsed;
};

export const generateTaskWithAI = async (params: {
  roughIdea: string;
  categoryHint?: string;
  budgetHint?: number;
}): Promise<AITaskBuilderResponse> => {
  const openai = getOpenAI();

  const prompt = `Generate a polished task posting for a crypto task marketplace.

Rough Idea: ${params.roughIdea}
Category Hint: ${params.categoryHint ?? "auto-detect"}
Budget Hint: ${params.budgetHint ? `$${params.budgetHint}` : "suggest range"}

Return JSON with:
- title
- category
- description (detailed, professional)
- acceptance_criteria (array of specific strings)
- suggested_payout_min
- suggested_payout_max
- required_skills (array)
- difficulty_estimate (easy | medium | hard)`;

  if (!openai) {
    return mockTaskBuilderResponse(params);
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a task marketplace expert. Respond only with valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  return aiTaskBuilderResponseSchema.parse(JSON.parse(content));
};

export const generateDisputeSummary = async (params: {
  title: string;
  description: string;
  reason: string;
  submissionText: string | null;
}): Promise<string> => {
  const openai = getOpenAI();

  if (!openai) {
    return `Dispute Summary: Business reported "${params.reason}". Submission review indicates partial completion. Recommend 48-hour mediation period for worker to address concerns regarding "${params.title}".`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Summarize this task dispute neutrally in 2-3 sentences for mediation.",
      },
      {
        role: "user",
        content: `Task: ${params.title}\nDescription: ${params.description}\nDispute Reason: ${params.reason}\nSubmission: ${params.submissionText ?? "N/A"}`,
      },
    ],
    temperature: 0.3,
  });

  return (
    completion.choices[0]?.message?.content ??
    "Unable to generate dispute summary."
  );
};

export const scoreWorkerSkills = async (params: {
  profileId: string;
  category: string;
  qualityScore: number;
}): Promise<void> => {
  const supabase = getSupabase();
  const skill = params.category;

  const { data: existing } = await supabase
    .from("skill_scores")
    .select("*")
    .eq("profile_id", params.profileId)
    .eq("skill", skill)
    .single();

  if (existing) {
    const newScore = Math.min(
      100,
      Number(existing.score) * 0.7 + params.qualityScore * 0.3,
    );
    await supabase
      .from("skill_scores")
      .update({
        score: newScore,
        completed_tasks_count: existing.completed_tasks_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("skill_scores").insert({
      profile_id: params.profileId,
      skill,
      score: params.qualityScore,
      completed_tasks_count: 1,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("trust_score, total_earned")
    .eq("id", params.profileId)
    .single();

  if (profile) {
    const trustBoost =
      params.qualityScore >= 90 ? 2 : params.qualityScore >= 70 ? 1 : -1;
    await supabase
      .from("profiles")
      .update({
        trust_score: Math.min(
          100,
          Math.max(0, Number(profile.trust_score) + trustBoost),
        ),
      })
      .eq("id", params.profileId);
  }
};

const mockTaskBuilderResponse = (params: {
  roughIdea: string;
  categoryHint?: string;
}): AITaskBuilderResponse => ({
  title: `Professional Task: ${params.roughIdea.slice(0, 50)}`,
  category: params.categoryHint ?? "Development",
  description: `We need an expert to help with: ${params.roughIdea}. This task requires attention to detail, clear communication, and timely delivery.`,
  acceptance_criteria: [
    "Deliverable meets all specified requirements",
    "Code/content is production-ready",
    "Documentation provided where applicable",
    "Revisions included if needed within scope",
  ],
  suggested_payout_min: 200,
  suggested_payout_max: 800,
  required_skills: ["Communication", "Quality Assurance"],
  difficulty_estimate: "medium",
});
