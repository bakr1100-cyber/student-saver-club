import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Languages, Wand2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { optimizeText, translateText } from "@/lib/resume-ai.functions";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { SUPPORTED_LOCALES, localeFlags, localeNames, type Locale } from "@/lib/i18n/locales";

interface AIAssistButtonProps {
  text: string;
  language: Locale;
  context?: string;
  onResult: (text: string) => void;
  disabled?: boolean;
}

export function AIAssistButton({ text, language, context, onResult, disabled }: AIAssistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useI18n();
  const optimize = useServerFn(optimizeText);
  const translate = useServerFn(translateText);

  const handleOptimize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await optimize({ data: { text, language, context } });
      onResult(result.text);
      toast.success(t("ai.optimized"));
    } catch {
      toast.error(t("ai.optimizeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (targetLanguage: Locale) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await translate({ data: { text, targetLanguage } });
      onResult(result.text);
      toast.success(t("ai.translated"));
    } catch {
      toast.error(t("ai.translateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8"
          disabled={disabled || isLoading || !text.trim()}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-4 w-4 text-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOptimize}>
          <Wand2 className="mr-2 h-4 w-4" />
          {t("ai.optimize")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1 text-xs text-muted-foreground">
          <Languages className="mr-1 inline h-3 w-3" />
          {t("ai.translate")}
        </div>
        {SUPPORTED_LOCALES.map((code) => (
          <DropdownMenuItem key={code} onClick={() => handleTranslate(code)}>
            <span className="mr-2">{localeFlags[code]}</span>
            {localeNames[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
