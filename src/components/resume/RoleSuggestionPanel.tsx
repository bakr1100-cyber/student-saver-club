import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  position: string;
  company: string;
  onApply: (text: string) => void;
}

const SAP_SUGGESTIONS = [
  "Analyse, Design und Implementierung komplexer SAP-Lösungen für Großkunden",
  "Optimierung von Geschäftsprozessen durch maßgeschneiderte SAP-Konfigurationen",
  "Beratung von Fachabteilungen bei Systemumstellungen, Tests und Go-live",
  "Steuerung der Abstimmung zwischen Kunden, Entwicklung und Projektleitung",
];

const DEFAULT_SUGGESTIONS = [
  "Betreuung von Kunden und Umsetzung von Aufgaben im Verantwortungsbereich",
  "Optimierung von Abläufen und zuverlässige Zusammenarbeit mit internen Teams",
  "Planung, Priorisierung und termingerechte Umsetzung von Projekten",
  "Dokumentation der Ergebnisse und transparente Kommunikation mit Stakeholdern",
];

export function RoleSuggestionPanel({ position, company, onApply }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const suggestions = useMemo(() => {
    const role = position.toLowerCase();
    return role.includes("sap") || role.includes("berater") || role.includes("consult")
      ? SAP_SUGGESTIONS
      : DEFAULT_SUGGESTIONS;
  }, [position]);

  const toggle = (index: number) =>
    setSelected((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]));

  if (!position.trim()) return null;

  return (
    <div className="mb-3 rounded-xl border border-brand/25 bg-brand/5 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-brand" />
        KI-Vorschläge für {position}{company ? ` · ${company}` : ""}
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
