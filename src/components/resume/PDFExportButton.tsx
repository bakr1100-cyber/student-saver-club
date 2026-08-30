import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Download, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import type { ResumeData } from "@/lib/resume-types";

interface PDFExportButtonProps {
  data: ResumeData;
}

const UNLOCK_KEY = "resume-unlocked-v1";
export const RESUME_PRICE = "9,99 €";

export function PDFExportButton({ data }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    setIsUnlocked(window.localStorage.getItem(UNLOCK_KEY) === "true");
  }, []);

  const exportPdf = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("resume-preview-container");
    if (!element) return;

    setIsExporting(true);
    try {
      const opt = {
        margin: 0,
        filename: `${data.personalDetails.fullName || "Lebenslauf"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      };
      await html2pdf().set(opt).from(element).save();
    } finally {
      setIsExporting(false);
    }
  };

  const handleClick = () => {
    if (isUnlocked) {
      void exportPdf();
      return;
    }
    setShowPaywall(true);
  };

  return (
    <>
      <Button size="sm" onClick={handleClick} disabled={isExporting}>
        {isExporting ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-1.5 h-4 w-4" />
        )}
        PDF herunterladen
      </Button>


      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>PDF-Download freischalten</DialogTitle>
            <DialogDescription>
              Bearbeiten und Vorschau sind unbegrenzt möglich. Der Download deines fertigen
              Lebenslaufs kostet einmalig {RESUME_PRICE} — kein Abo, keine automatische Verlängerung.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "PDF-Download in Druckqualität (A4)",
              "KI-Optimierung & Übersetzung",
              "Alle Vorlagen nutzbar",
              "Unbegrenzte Änderungen an deinem Lebenslauf",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              className="w-full"
              onClick={() => {
                toast.info("Bezahlung wird gerade eingerichtet", {
                  description: "PayPal und Cash Plus Maroc folgen im nächsten Schritt.",
                });
              }}
            >
              Für {RESUME_PRICE} freischalten
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Einmalzahlung · PayPal &amp; Cash Plus Maroc (in Kürze verfügbar)
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
