import type { ResumeData } from "@/lib/resume-types";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { EuropeanTemplate } from "./templates/EuropeanTemplate";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const Template =
    data.settings.template === "minimalist"
      ? MinimalistTemplate
      : data.settings.template === "european"
        ? EuropeanTemplate
        : ModernTemplate;

  return (
    <div className="mx-auto max-w-[210mm]">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">Live-Vorschau</p>
        <p className="text-xs text-muted-foreground">{data.settings.template === "minimalist" ? "Minimalist" : data.settings.template === "european" ? "Europäisch" : "Modern"}</p>
      </div>
      <div
        id="resume-preview-container"
        className={cn(
          "relative min-h-[297mm] w-full overflow-hidden bg-white p-[20mm] shadow-sm",
          "print:shadow-none print:p-0"
        )}
        style={{ aspectRatio: "210 / 297" }}
      >
        <Template data={data} />
      </div>
    </div>
  );
}
