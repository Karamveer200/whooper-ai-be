import { createClient } from "npm:@supabase/supabase-js@2";
import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  getAddress,
  http,
  type Hash,
} from "npm:viem@2";
import { mnemonicToAccount } from "npm:viem@2/accounts";
import { base } from "npm:viem@2/chains";

const USDC_DECIMALS = 6;
const DEFAULT_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ReleasedTaskRow = {
  id: string;
  payout_amount: number;
  token_symbol: string;
  chain: string;
  assigned_worker_id: string | null;
  business_id: string;
  payments: {
    id: string;
    amount: number;
    release_tx_hash: string | null;
    status: string;
  }[];
  worker: {
    id: string;
    wallet_address: string;
  } | null;
};

type ProcessResult = {
  task_id: string;
  status: "completed" | "skipped" | "failed";
  tx_hash?: string;
  error?: string;
};

const parseUsdcAmount = (amount: number | string): bigint => {
  const normalized = String(amount).trim();
  const [whole, fraction = ""] = normalized.split(".");
  const paddedFraction = fraction
    .padEnd(USDC_DECIMALS, "0")
    .slice(0, USDC_DECIMALS);
  return BigInt(`${whole}${paddedFraction}`);
};

const getRequiredEnv = (key: string): string => {
  const value = Deno.env.get(key)?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const normalizeMnemonic = (mnemonic: string): string =>
  mnemonic.trim().replace(/\s+/g, " ");

const getEscrowAccount = () => {
  const mnemonic = normalizeMnemonic(getRequiredEnv("ESCROW_WALLET_MNEMONIC"));
  const wordCount = mnemonic.split(" ").length;

  if (wordCount !== 12 && wordCount !== 24) {
    throw new Error(
      "ESCROW_WALLET_MNEMONIC must be a 12 or 24 word seed phrase",
    );
  }

  const accountIndex = Number(
    Deno.env.get("ESCROW_WALLET_ACCOUNT_INDEX") ?? "0",
  );

  return mnemonicToAccount(mnemonic, { accountIndex });
};

const transferUsdc = async ({
  toAddress,
  amount,
  chain,
  tokenSymbol,
}: {
  toAddress: string;
  amount: number;
  chain: string;
  tokenSymbol: string;
}): Promise<Hash> => {
  if (chain !== "base") {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  if (tokenSymbol !== "USDC") {
    throw new Error(`Unsupported token: ${tokenSymbol}`);
  }

  const rpcUrl =
    Deno.env.get("BASE_RPC_URL")?.trim() || "https://mainnet.base.org";
  const usdcAddress = getAddress(
    Deno.env.get("USDC_CONTRACT_ADDRESS")?.trim() || DEFAULT_USDC_ADDRESS,
  );

  const account = getEscrowAccount();

  const publicClient = createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(rpcUrl),
  });

  const recipient = getAddress(toAddress);
  const value = parseUsdcAmount(amount);

  const hash = await walletClient.writeContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "transfer",
    args: [recipient, value],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    throw new Error(`Transfer transaction failed: ${hash}`);
  }

  return hash;
};

const processReleasedTask = async (
  task: ReleasedTaskRow,
): Promise<ProcessResult> => {
  const payment = task.payments[0];

  if (!payment) {
    return {
      task_id: task.id,
      status: "skipped",
      error: "No payment record found",
    };
  }

  if (payment.release_tx_hash) {
    return {
      task_id: task.id,
      status: "skipped",
      error: "Already paid on-chain",
    };
  }

  if (!task.assigned_worker_id || !task.worker?.wallet_address) {
    return {
      task_id: task.id,
      status: "skipped",
      error: "Task has no assigned worker wallet",
    };
  }

  const { data: claimedPayment, error: claimError } = await supabase
    .from("payments")
    .update({ status: "release_pending" })
    .eq("id", payment.id)
    .eq("status", "released")
    .is("release_tx_hash", null)
    .select("id")
    .maybeSingle();

  if (claimError) {
    return { task_id: task.id, status: "failed", error: claimError.message };
  }

  if (!claimedPayment) {
    return {
      task_id: task.id,
      status: "skipped",
      error: "Payment already being processed",
    };
  }

  try {
    const txHash = await transferUsdc({
      toAddress: task.worker.wallet_address,
      amount: Number(payment.amount ?? task.payout_amount),
      chain: task.chain,
      tokenSymbol: task.token_symbol,
    });

    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        status: "released",
        release_tx_hash: txHash,
      })
      .eq("id", payment.id);

    if (paymentUpdateError) {
      throw new Error(`Payment update failed: ${paymentUpdateError.message}`);
    }

    const { error: taskUpdateError } = await supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", task.id)
      .eq("status", "released");

    if (taskUpdateError) {
      throw new Error(`Task update failed: ${taskUpdateError.message}`);
    }

    await supabase.from("task_events").insert({
      task_id: task.id,
      actor_id: null,
      event_type: "payment_completed",
      metadata: {
        amount: Number(payment.amount ?? task.payout_amount),
        worker_id: task.assigned_worker_id,
        release_tx_hash: txHash,
        worker_wallet: task.worker.wallet_address,
      },
    });

    return { task_id: task.id, status: "completed", tx_hash: txHash };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown transfer error";

    await supabase
      .from("payments")
      .update({ status: "released" })
      .eq("id", payment.id)
      .eq("status", "release_pending");

    return { task_id: task.id, status: "failed", error: message };
  }
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      const body = { error: "Method not allowed" };
      return new Response(JSON.stringify(body), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const { data: tasks, error: queryError } = await supabase
      .from("tasks")
      .select(
        `
        id,
        payout_amount,
        token_symbol,
        chain,
        assigned_worker_id,
        business_id,
        payments!inner (
          id,
          amount,
          release_tx_hash,
          status
        ),
        worker:profiles!tasks_assigned_worker_id_fkey (
          id,
          wallet_address
        )
      `,
      )
      .eq("status", "released")
      .is("payments.release_tx_hash", null)
      .eq("payments.status", "released");

    if (queryError) {
      const errorBody = { success: false, error: queryError.message };
      console.log(
        "[Process Released Payments] 500 response:",
        JSON.stringify(errorBody),
      );
      return new Response(JSON.stringify(errorBody), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const results: ProcessResult[] = [];

    for (const task of (tasks ?? []) as ReleasedTaskRow[]) {
      try {
        results.push(await processReleasedTask(task));
      } catch (innerError) {
        console.error("Failed processing task:", task.id, innerError);
        results.push({
          task_id: task.id,
          status: "failed",
          error:
            innerError instanceof Error
              ? innerError.message
              : "Unknown processing error",
        });
      }
    }

    const summary = {
      processed: results.filter((r) => r.status === "completed").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      failed: results.filter((r) => r.status === "failed").length,
    };

    const successBody = {
      success: true,
      summary,
      results,
    };

    console.log(
      "[Process Released Payments] 200 response:",
      JSON.stringify(successBody),
    );

    return new Response(JSON.stringify(successBody), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    const errorBody = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    console.log(
      "[Process Released Payments] 500 response:",
      JSON.stringify(errorBody),
    );

    return new Response(JSON.stringify(errorBody), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
});
