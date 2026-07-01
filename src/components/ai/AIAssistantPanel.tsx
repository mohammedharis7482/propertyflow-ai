"use client";

import { useState } from "react";
import { Bot, Building2, Home, MessageCircle, Sparkles, TrendingUp, X } from "lucide-react";

import AIBadge from "@/components/ai/AIBadge";
import { Button } from "@/components/ui/button";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { formatEnumLabel, formatNumber, safeText } from "@/lib/formatters";
import { getAIRecommendations, getMarketSignals } from "@/services/ai.service";

type AssistantRole = "user" | "agent" | "admin";
type PromptKey = "matches" | "markets" | "listing" | "leads";

interface AIAssistantPanelProps {
  open: boolean;
  role: AssistantRole;
  onOpenChange: (open: boolean) => void;
}

interface AssistantResponse {
  title: string;
  body: string;
  meta?: string;
}

const prompts: { key: PromptKey; label: string; icon: typeof Sparkles }[] = [
  { key: "matches", label: "Show my best property matches", icon: Home },
  { key: "markets", label: "Which locations are trending?", icon: TrendingUp },
  { key: "listing", label: "How can I improve this listing?", icon: Building2 },
  { key: "leads", label: "Which leads are high priority?", icon: MessageCircle },
];

export default function AIAssistantPanel({
  open,
  role,
  onOpenChange,
}: AIAssistantPanelProps) {
  const [loadingKey, setLoadingKey] = useState<PromptKey | null>(null);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handlePrompt(key: PromptKey) {
    setLoadingKey(key);
    setError(null);

    try {
      if (key === "matches") {
        const data = await getAIRecommendations();
        const best = data.results?.[0];
        setResponse({
          title: best
            ? safeText(best.property.title, "Best property match")
            : "No matches ready yet",
          body: best
            ? safeText(best.reason, "This property aligns with your recent activity.")
            : "Save or inquire about properties to improve your recommendations.",
          meta: best ? `AI Match ${best.match_score}%` : "Recommendations need user signals",
        });
        return;
      }

      if (key === "markets") {
        const data = await getMarketSignals();
        const city = data.top_cities?.[0]?.city;
        setResponse({
          title: city ? `${city} is leading demand` : "Market signals are building",
          body: safeText(
            data.demand_summary,
            "Market signals will improve as more listings and inquiries are created."
          ),
          meta: `${formatNumber(data.inquiry_counts)} inquiries · ${formatNumber(
            data.listing_counts
          )} listings`,
        });
        return;
      }

      if (key === "listing") {
        setResponse({
          title: "Listing quality checks are ready",
          body:
            role === "agent"
              ? "Open your listings page and review each listing quality signal. The score checks images, features, pricing, location, and publishing readiness."
              : "Listing quality scoring is available for property owners and admins on listing management surfaces.",
          meta: "Rule-based listing completeness",
        });
        return;
      }

      setResponse({
        title: "Lead priority is active",
        body:
          role === "agent"
            ? "Open your inquiries page to see lead priority for each inquiry. Higher scores usually mean stronger message intent, complete contact details, and high-value property interest."
            : "Lead priority is available to agents and admins on inquiry management pages.",
        meta: formatEnumLabel(role),
      });
    } catch (promptError) {
      setError(getActionErrorMessage(promptError));
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      <button
        type="button"
        aria-label="Close AI assistant"
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />

      <aside className="absolute bottom-0 right-0 top-auto flex max-h-[90vh] w-full max-w-full flex-col overflow-hidden rounded-t-[2rem] border border-border bg-white shadow-2xl shadow-slate-950/10 sm:bottom-auto sm:right-4 sm:top-20 sm:max-h-[calc(100vh-6rem)] sm:w-[min(calc(100vw-2rem),520px)] sm:rounded-[2rem]">
        <div className="shrink-0 border-b border-border px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <AIBadge label="PropertyFlow signal-based assistant" />
              <h2 className="mt-3 font-heading text-2xl font-bold">
                PropertyFlow Assistant
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Powered by PropertyFlow signals. OpenAI integration comes later.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-white transition hover:border-emerald-200 hover:text-primary"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="min-w-0 rounded-[1.5rem] bg-[#F8FAF9] p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                <Bot size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold">Guided prompts</p>
                <p className="text-sm text-muted-foreground">
                  Choose a signal-backed prompt.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {prompts.map((prompt) => {
                const Icon = prompt.icon;

                return (
                  <button
                    key={prompt.key}
                    type="button"
                    disabled={Boolean(loadingKey)}
                    onClick={() => handlePrompt(prompt.key)}
                    className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left text-sm font-semibold transition hover:border-emerald-200 hover:bg-emerald-50/40 disabled:opacity-70"
                  >
                    <Icon size={17} className="shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate">{prompt.label}</span>
                    {loadingKey === prompt.key && (
                      <span className="text-xs text-muted-foreground">
                        Checking...
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {response ? (
            <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-sm">
              <AIBadge label={response.meta ?? "AI Signal"} />
              <h3 className="mt-4 font-heading text-xl font-bold">
                {response.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {response.body}
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-border bg-white p-5">
              <p className="text-sm leading-7 text-muted-foreground">
                This assistant does not generate free-form AI text yet. It reads
                existing PropertyFlow recommendation, market, listing, and lead
                signals.
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-white px-5 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-2xl bg-white"
            onClick={() => onOpenChange(false)}
          >
            Close Assistant
          </Button>
        </div>
      </aside>
    </div>
  );
}
