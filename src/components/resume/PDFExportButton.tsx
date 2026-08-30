import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { ResumeData } from "@/lib/resume-types";

interface PDFExportButtonProps {
  data: ResumeData;
}

export function PDFExportButton({ data }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-preview-container");
    if (!element) return;

    setIsExporting(true);
    try {
      const opt = {
        margin: 0,
        filename: `${data.personalDetails.fullName || "Lebenslauf"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };
      await html2pdf().set(opt).from(element).save();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button size="sm" onClick={handleExport} disabled={isExporting}>
      {isExporting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />}
      PDF
    </Button>
  );
}
