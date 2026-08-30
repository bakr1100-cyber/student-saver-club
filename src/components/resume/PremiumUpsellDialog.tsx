import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PREMIUM_PRICE, STANDARD_PRICE } from "@/lib/entitlements";

interface PremiumUpsellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: "cover-letter" | "voice";
}

const featureTitles: Record<PremiumUpsellDialogProps["feature"], string> = {
  "cover-letter": "KI-Anschreiben ist Teil von Premium",
  voice: "Spracheingabe ist Teil von Premium",
};

export function PremiumUpsellDialog({ open, onOpenChange, feature }: PremiumUpsellDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{featureTitles[feature]}</DialogTitle>
          <DialogDescription>
            Im Standard-Paket für einmalig {STANDARD_PRICE} sind der Editor, alle Vorlagen, die
            KI-Textoptimierung, die KI-Übersetzung und der PDF-Download enthalten. Anschreiben und
            Spracheingabe gehören zu Premium ({PREMIUM_PRICE} einmalig).
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            "Alles aus dem Standard-Paket",
            "KI-Anschreiben passend zur Stellenanzeige",
            "Spracheingabe (Darija, Arabisch, Französisch, Deutsch)",
            "Lebenslauf und Anschreiben als PDF",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full"
            onClick={() =>
              toast.info("Bezahlung wird gerade eingerichtet", {
                description: "PayPal und Cash Plus Maroc folgen im nächsten Schritt.",
              })
            }
          >
            Premium für {PREMIUM_PRICE} freischalten
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Einmalzahlung · kein Abo · PayPal &amp; Cash Plus Maroc (in Kürze)
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
