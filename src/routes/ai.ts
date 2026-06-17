import { Router, Request, Response, NextFunction } from "express";
import {
  reviewSubmissionRequestSchema,
  generateTaskRequestSchema,
  scoreWorkerSkillsRequestSchema,
  disputeSummaryRequestSchema,
} from "../shared/index.js";
import { getSupabase } from "../lib/supabase.js";
import {
  reviewSubmissionWithAI,
  generateTaskWithAI,
  generateDisputeSummary,
  scoreWorkerSkills,
} from "../services/openai.js";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const secret = req.headers["x-ai-service-secret"];

  if (secret !== process.env.AI_SERVICE_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

export const aiRouter: Router = Router();
aiRouter.use(authMiddleware);

aiRouter.post("/review-submission", async (req, res) => {
  try {
    const body = reviewSubmissionRequestSchema.parse(req.body);
    const supabase = getSupabase();

    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", body.task_id)
      .single();

    if (taskError || !task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const { data: submission, error: subError } = await supabase
      .from("task_submissions")
      .select("*")
      .eq("id", body.submission_id)
      .single();

    if (subError || !submission) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }

    const criteria = Array.isArray(task.acceptance_criteria)
      ? (task.acceptance_criteria as string[])
      : [];

    const review = await reviewSubmissionWithAI({
      title: task.title,
      description: task.description,
      acceptanceCriteria: criteria,
      payoutAmount: Number(task.payout_amount),
      submissionText: submission.submission_text,
      submissionUrl: submission.submission_url,
      attachments: (submission.attachments as Record<string, unknown>[]) ?? [],
    });

    const { data: aiReview, error: insertError } = await supabase
      .from("ai_reviews")
      .insert({
        task_id: body.task_id,
        submission_id: body.submission_id,
        quality_score: review.quality_score,
        fraud_score: review.fraud_score,
        requirements_met: review.requirements_met,
        checklist: review.checklist,
        summary: review.summary,
        business_recommendation: review.business_recommendation,
        suggested_revision_request: review.suggested_revision_request,
        raw_ai_response: review,
      })
      .select()
      .single();

    if (insertError) {
      res.status(500).json({ error: insertError.message });
      return;
    }

    await supabase
      .from("tasks")
      .update({ status: "reviewed", updated_at: new Date().toISOString() })
      .eq("id", body.task_id);

    await supabase
      .from("task_submissions")
      .update({ status: "reviewed", updated_at: new Date().toISOString() })
      .eq("id", body.submission_id);

    await supabase.from("task_events").insert({
      task_id: body.task_id,
      actor_id: submission.worker_id,
      event_type: "submission_reviewed",
      metadata: {
        quality_score: review.quality_score,
        recommendation: review.business_recommendation,
      },
    });

    res.json({ review: aiReview, analysis: review });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Review failed";
    res.status(400).json({ error: message });
  }
});

aiRouter.post("/generate-task", async (req, res) => {
  try {
    const body = generateTaskRequestSchema.parse(req.body);
    const result = await generateTaskWithAI({
      roughIdea: body.rough_idea,
      categoryHint: body.category_hint,
      budgetHint: body.budget_hint,
    });
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    res.status(400).json({ error: message });
  }
});

aiRouter.post("/score-worker-skills", async (req, res) => {
  try {
    const body = scoreWorkerSkillsRequestSchema.parse(req.body);
    await scoreWorkerSkills({
      profileId: body.profile_id,
      category: body.category,
      qualityScore: body.quality_score,
    });
    res.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scoring failed";
    res.status(400).json({ error: message });
  }
});

aiRouter.post("/dispute-summary", async (req, res) => {
  try {
    const body = disputeSummaryRequestSchema.parse(req.body);
    const supabase = getSupabase();

    const { data: task } = await supabase
      .from("tasks")
      .select("title, description")
      .eq("id", body.task_id)
      .single();

    const { data: submission } = await supabase
      .from("task_submissions")
      .select("submission_text")
      .eq("id", body.submission_id)
      .single();

    const summary = await generateDisputeSummary({
      title: task?.title ?? "Unknown Task",
      description: task?.description ?? "",
      reason: body.reason,
      submissionText: submission?.submission_text ?? null,
    });

    await supabase
      .from("disputes")
      .update({
        ai_dispute_summary: summary,
        updated_at: new Date().toISOString(),
      })
      .eq("task_id", body.task_id)
      .eq("submission_id", body.submission_id);

    res.json({ summary });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Dispute summary failed";
    res.status(400).json({ error: message });
  }
});
