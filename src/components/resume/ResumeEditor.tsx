import { useState, useEffect, useCallback, useMemo } from "react";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { PDFExportButton } from "./PDFExportButton";
import { ResumeScoreCard } from "./ResumeScoreCard";
import { ResumeImportDialog } from "./ResumeImportDialog";
import { ExtraSectionsDialog } from "./ExtraSectionsDialog";
import { TemplateGallery } from "./TemplateGallery";
import { StepExamples, type WizardStepId } from "./StepExamples";

import { defaultResumeData, type ResumeData } from "@/lib/resume-types";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText, Eye, EyeOff, ArrowLeft, ArrowRight, Check, Cloud, CloudOff, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "motion/react";
import { useResumeAutoSave } from "@/hooks/useResumeAutoSave";
import { toast } from "sonner";

const STORAGE_KEY = "resume-draft-v1";

/** The five wizard steps; the final step combines fine-tuning and the cover letter. */
const wizardSteps: { id: WizardStepId; forms: string[] }[] = [
  { id: "personal", forms: ["personal"] },
  { id: "experience", forms: ["experience"] },
  { id: "education", forms: ["education"] },
  { id: "skills", forms: ["skills"] },
  { id: "finish", forms: ["summary", "settings", "cover-letter"] },
];

const stepLabelKeys = {
  personal: "tab.personal",
  experience: "tab.experience",
  education: "tab.education",
  skills: "tab.skills",
  finish: "tab.finish",
} as const;

const stepHeadlineKeys = {
  personal: "wizard.personal.headline",
  experience: "wizard.experience.headline",
  education: "wizard.education.headline",
  skills: "wizard.skills.headline",
  finish: "wizard.settings.headline",
} as const;

export function ResumeEditor() {
  const { t } = useI18n();
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<"wizard" | "workspace">("wizard");

  const totalSteps = wizardSteps.length;
  const currentStep = wizardSteps[Math.min(stepIndex, totalSteps - 1)]!;
  const progress = useMemo(() => ((stepIndex + 1) / totalSteps) * 100, [stepIndex, totalSteps]);
  const isLastStep = stepIndex === totalSteps - 1;

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

  const handleRestore = useCallback(
    (restored: ResumeData) => {
      setData(restored);
      toast.success(t("autosave.restored"));
    },
    [t]
  );

  const { state: saveState } = useResumeAutoSave({ data, ready: isLoaded, onRestore: handleRestore });

  const goTo = useCallback((index: number) => {
    setStepIndex(Math.max(0, Math.min(wizardSteps.length - 1, index)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Wizard Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
              <FileText className="h-5 w-5 text-brand" />
              <span className="hidden sm:inline">{t("brand.name")}</span>
            </Link>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t("wizard.step")} {stepIndex + 1} {t("wizard.of")} {totalSteps}
              </p>
              <p className="text-sm font-semibold text-foreground">{t(stepLabelKeys[currentStep.id])}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              {saveState === "saving" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("autosave.saving")}
                </>
              ) : saveState === "saved" ? (
                <>
                  <Cloud className="h-3.5 w-3.5 text-brand" /> {t("autosave.saved")}
                </>
              ) : (
                <>
                  <CloudOff className="h-3.5 w-3.5" /> {t("autosave.local")}
                </>
              )}
            </span>
            <LanguageSwitcher />
            <ResumeImportDialog data={data} onImport={(next) => setData(next)} />
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowPreview((s) => !s)}>
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">
                {showPreview ? t("editor.previewOff") : t("editor.previewOn")}
              </span>
            </Button>
            <PDFExportButton data={data} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted">
          <motion.div
            className="h-full bg-brand"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {/* Step rail */}
        <div className="mx-auto hidden max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 md:flex">
          {wizardSteps.map((wizardStep, index) => (
            <button
              key={wizardStep.id}
              type="button"
              onClick={() => goTo(index)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                index === stepIndex
                  ? "bg-brand text-primary-foreground"
                  : index < stepIndex
                    ? "text-brand hover:bg-accent"
                    : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {index < stepIndex ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="tabular-nums">{index + 1}</span>
              )}
              {t(stepLabelKeys[wizardStep.id])}
            </button>
          ))}
        </div>
      </header>

      {/* Wizard Body */}
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-2">
          <div className={`${showPreview ? "hidden lg:block" : ""} border-r border-border`}>
            <div className="space-y-4 px-4 pt-6 lg:px-6">
              <motion.h1
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
              >
                {t(stepHeadlineKeys[currentStep.id])}
              </motion.h1>
              <StepExamples step={currentStep.id} />
            </div>

            {currentStep.id === "finish" && (
              <div className="px-4 pt-6 lg:px-6">
                <TemplateGallery data={data} onChange={updateData} />
              </div>
            )}

            {currentStep.forms.map((formStep) => (
              <ResumeForm key={formStep} data={data} onChange={updateData} step={formStep} />
            ))}

            <div className="px-4 pb-2 lg:px-6">
              <ExtraSectionsDialog data={data} onChange={updateData} />
            </div>

            {/* Step navigation */}
            <div className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:px-6">
              <Button variant="outline" onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                {t("wizard.back")}
              </Button>
              {isLastStep ? (
                <PDFExportButton data={data} label={t("wizard.finish")} />
              ) : (
                <Button
                  className="bg-brand font-semibold text-primary-foreground hover:bg-brand-dark"
                  onClick={() => goTo(stepIndex + 1)}
                >
                  {t("wizard.next")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              )}
            </div>
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
