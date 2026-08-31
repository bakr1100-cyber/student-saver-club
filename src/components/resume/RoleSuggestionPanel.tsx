import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { suggestExperience } from "@/lib/resume-ai.functions";
import { hasAiSession } from "@/lib/ai-auth";

interface Props {
  position: string;
  company: string;
  language: "de" | "en" | "fr" | "es" | "it" | "nl" | "ar";
  onApply: (text: string) => void;
}

export function RoleSuggestionPanel({ position, company, language, onApply }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const suggest = useServerFn(suggestExperience);

  useEffect(() => {
    let cancelled = false;
    if (position.trim().length < 2) { setSuggestions([]); return () => { cancelled = true; }; }
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        if (!(await hasAiSession())) return;
        const result = await suggest({ data: { position, company, language } });
        if (!cancelled) { setSuggestions(result.suggestions); setSelected([]); }
      } catch { /* AI suggestions are optional; the user can still write freely. */ }
      finally { if (!cancelled) setLoading(false); }
    }, 650);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [position, company, language, suggest]);

  const toggle = (index: number) =>
    setSelected((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]));

  if (!position.trim() || (!loading && suggestions.length === 0)) return null;

  return (
    <div className="mb-3 rounded-xl border border-brand/25 bg-brand/5 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-brand" />
        {loading ? <><Loader2 className="h-4 w-4 animate-spin text-brand" /> KI-Vorschläge werden erstellt …</> : <><Sparkles className="h-4 w-4 text-brand" /> KI-Vorschläge für {position}{company ? ` · ${company}` : ""}</>}
      </div>
      <p className="mb-2 text-xs text-muted-foreground">Wähle passende Punkte aus. Danach formuliert die KI daraus deinen finalen Text.</p>
      <div className="space-y-1.5">
        {suggestions.map((suggestion, index) => {
          const active = selected.includes(index);
          return (
            <button
              key={suggestion}
              type="button"
              onClick={() => toggle(index)}
              className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                active ? "border-brand bg-brand/10 text-foreground" : "border-transparent bg-background hover:border-brand/40"
              }`}
            >
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-brand bg-brand text-brand-foreground" : "border-muted-foreground/50"}`}>
                {active && <Check className="h-3 w-3" />}
              </span>
              <span>{suggestion}</span>
            </button>
          );
        })}
      </div>
      <Button type="button" size="sm" className="mt-3" disabled={!selected.length} onClick={() => onApply(selected.map((index) => `• ${suggestions[index]}`).join("\n"))}>
        Auswahl in Beschreibung übernehmen
      </Button>
    </div>
  );
}
