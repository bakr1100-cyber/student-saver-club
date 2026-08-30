import { useState, useEffect, useCallback } from "react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { PDFExportButton } from "./PDFExportButton";
import { ResumeScoreCard } from "./ResumeScoreCard";
import { ResumeImportDialog } from "./ResumeImportDialog";
import { defaultResumeData, type ResumeData } from "@/lib/resume-types";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";


const STORAGE_KEY = "resume-draft-v1";

export function ResumeEditor() {
  const { t } = useI18n();
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [showPreview, setShowPreview] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ResumeData;
        setData({ ...defaultResumeData, ...parsed });
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, isLoaded]);

  const updateData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => updater(prev));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Editor Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            {t("brand.name")}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ResumeImportDialog data={data} onImport={(next) => setData(next)} />
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowPreview((s) => !s)}
            >
              {showPreview ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
              {showPreview ? t("editor.previewOff") : t("editor.previewOn")}
            </Button>
            <PDFExportButton data={data} />
          </div>
        </div>
      </header>

      {/* Editor Body */}
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
          <div className={`${showPreview ? "hidden lg:block" : ""} border-r border-border`}>
            <ResumeForm data={data} onChange={updateData} />
          </div>
          <div className={`${showPreview ? "" : "hidden lg:block"} space-y-4 bg-muted/30 p-4 lg:p-8`}>
            <ResumeScoreCard data={data} />
            <ResumePreview data={data} />
          </div>
        </div>
      </main>

    </div>
  );
}
