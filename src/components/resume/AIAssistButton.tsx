import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Languages, Wand2, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { optimizeText, translateText } from "@/lib/resume-ai.functions";
import { toast } from "sonner";

interface AIAssistButtonProps {
  text: string;
  language: "de" | "en";
  context?: string;
  onResult: (text: string) => void;
  disabled?: boolean;
}

export function AIAssistButton({ text, language, context, onResult, disabled }: AIAssistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const optimize = useServerFn(optimizeText);
  const translate = useServerFn(translateText);

  const handleOptimize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await optimize({ data: { text, language, context } });
      onResult(result.text);
      toast.success(language === "en" ? "Text optimized" : "Text optimiert");
    } catch (err) {
      toast.error(language === "en" ? "Optimization failed" : "Optimierung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const targetLanguage = language === "de" ? "en" : "de";
      const result = await translate({ data: { text, targetLanguage } });
      onResult(result.text);
      toast.success(language === "en" ? "Translated to German" : "Ins Englische übersetzt");
    } catch (err) {
      toast.error(language === "en" ? "Translation failed" : "Übersetzung fehlgeschlagen");
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
          {language === "en" ? "Optimize with AI" : "Mit KI optimieren"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTranslate}>
          <Languages className="mr-2 h-4 w-4" />
          {language === "en" ? "Translate to German" : "Ins Englische übersetzen"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
