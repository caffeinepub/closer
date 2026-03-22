import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicy({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        data-ocid="privacy_policy.dialog"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
            🔒 Sera ya Faragha / Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-2">
          <div
            className="space-y-4 text-sm"
            style={{ color: "hsl(var(--foreground))" }}
          >
            <section>
              <h3
                className="font-bold mb-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                Taarifa Tunazohifadhi / Data We Collect
              </h3>
              <ul
                className="space-y-1 list-disc list-inside"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <li>Majina ya watumiaji / User names</li>
                <li>Namba za simu / Phone numbers</li>
                <li>Rekodi za usajili (subscription) / Subscription records</li>
                <li>Historia ya maagizo / Order history</li>
                <li>Picha za wasifu na maduka / Profile and shop photos</li>
              </ul>
            </section>

            <section>
              <h3
                className="font-bold mb-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                Jinsi Tunavyotumia Taarifa / How We Use Your Data
              </h3>
              <p style={{ color: "hsl(var(--muted-foreground))" }}>
                Taarifa zako zinatumika peke yake kwa lengo la kutoa huduma
                zetu. Hazitashirikishwa na watu wa tatu bila ruhusa yako.
              </p>
              <p
                className="mt-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Your information is used solely to provide our services. It will
                not be shared with third parties without your permission.
              </p>
            </section>

            <section>
              <h3
                className="font-bold mb-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                Malipo / Payments
              </h3>
              <p style={{ color: "hsl(var(--muted-foreground))" }}>
                Malipo yanayofanywa nje ya app (kwa mfano M-Pesa direct)
                hayahifadhiwi moja kwa moja katika mfumo wetu. Muuzaji anatakiwa
                kuingiza reference number mwenyewe ili kuthibitisha malipo.
              </p>
              <p
                className="mt-2"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Payments made outside the app (e.g., direct M-Pesa) are not
                stored directly in our system. The seller is required to enter a
                reference number to confirm payment.
              </p>
            </section>

            <section>
              <h3
                className="font-bold mb-2"
                style={{ color: "hsl(var(--primary))" }}
              >
                Mawasiliano / Contact
              </h3>
              <p style={{ color: "hsl(var(--muted-foreground))" }}>
                Kwa maswali yoyote kuhusu faragha yako, wasiliana nasi kupitia
                WhatsApp au njia nyingine zilizoorodheshwa kwenye app.
              </p>
            </section>
          </div>
        </ScrollArea>
        <Button
          onClick={onClose}
          className="w-full mt-2"
          data-ocid="privacy_policy.close_button"
          style={{
            background: "linear-gradient(135deg, #C2185B, #FF00AA)",
            color: "#fff",
          }}
        >
          Imeeleweka / Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
