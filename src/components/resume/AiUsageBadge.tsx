import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { getAiUsage } from "@/lib/resume-ai.functions";
import { useI18n } from "@/lib/i18n";

interface Usage {
  tier: string;
  used: number;
  limit: number;
  remaining: number;
}

/** Shows the signed-in user's remaining daily AI calls. Hidden when signed out. */
export function AiUsageBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  const loadUsage = useServerFn(getAiUsage);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    let active = true;
    loadUsage()
      .then((data) => {
        if (active) setUsage(data as Usage);
      })
      .catch(() => {
        /* signed out — nothing to show */
      });
    return () => {
      active = false;
    };
  }, [loadUsage]);

  if (!usage) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground ${className ?? ""}`}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>
        {t("ai.usage.today")}: {usage.used}/{usage.limit}
      </span>
    </div>
  );
}
