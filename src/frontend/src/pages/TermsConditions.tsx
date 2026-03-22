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

export function TermsConditions({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg"
        data-ocid="terms.dialog"
        style={{
          background: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "hsl(var(--foreground))" }}>
            📋 Masharti ya Matumizi / Terms &amp; Conditions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-2">
          <div
            className="space-y-3 text-sm"
            style={{ color: "hsl(var(--foreground))" }}
          >
            <p
              className="font-semibold"
              style={{ color: "hsl(var(--primary))" }}
            >
              Kwa kutumia Closer to Market, unakubali masharti yafuatayo:
            </p>
            <ol
              className="space-y-3 list-decimal list-inside"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Ada ya Mwezi:
                </span>{" "}
                Muuzaji lazima alipe ada ya mwezi ili duka lake liwe active na
                lionekane kwa wateja. (Seller must pay monthly fee for shop to
                be active and visible to customers.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Kufungwa Automatic:
                </span>{" "}
                Ada ikikosa kulipwa, duka linafungwa automatically na
                halionekani kwa wateja. (Unpaid subscription automatically
                closes the shop.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Wajibu wa Muuzaji:
                </span>{" "}
                Muuzaji anawajibika kwa bidhaa, ubora, na huduma anazotoa. App
                haisimamii ubora wa bidhaa. (Seller is responsible for their
                products, quality, and services.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Migogoro ya Malipo:
                </span>{" "}
                App haitawajibika kwa migogoro ya malipo yanayofanywa nje ya
                mfumo wake (M-Pesa direct, etc.). (App is not responsible for
                payment disputes outside its system.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Reference Number:
                </span>{" "}
                Muuzaji lazima athibitishe malipo yake ya ada kwa kuingiza
                reference number sahihi. (Seller must confirm subscription
                payment by entering the correct reference number.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Uthibitishaji wa Reference:
                </span>{" "}
                Reference number lazima ipitie format validation na duplication
                check. Kila ref lazima iwe ya kipekee. (Reference numbers must
                pass format validation and duplication checks.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Uhakiki wa Admin:
                </span>{" "}
                Admin anaweza kufanya manual verification ya reference number
                yoyote. (Admin can manually verify any reference number.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Arifa za Admin:
                </span>{" "}
                Admin anapokea arifa kila wakati reference number mpya
                inapotumwa. (Admin receives notification every time a new
                reference number is submitted.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Mmiliki wa App:
                </span>{" "}
                Mmiliki wa app (admin) hapaswi kulipa ada ya usajili. Ada ni kwa
                wauzaji pekee. (App owner does not pay subscription fee. Fee is
                for sellers only.)
              </li>
              <li>
                <span
                  className="font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Risiti za Order:
                </span>{" "}
                Risiti za kila order lazima ziwe na jina na namba ya simu ya
                mteja kwa usalama. (Order receipts must include customer name
                and phone number for security.)
              </li>
            </ol>

            <div
              className="mt-4 p-3 rounded-lg"
              style={{ background: "hsl(var(--muted))" }}
            >
              <p
                className="text-xs"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Masharti haya yanaweza kubadilishwa wakati wowote. Matumizi
                endelevu ya app yanamaanisha umekubali masharti yaliyosasishwa.
                (These terms may be updated at any time. Continued use of the
                app constitutes acceptance of updated terms.)
              </p>
            </div>
          </div>
        </ScrollArea>
        <Button
          onClick={onClose}
          className="w-full mt-2"
          data-ocid="terms.close_button"
          style={{
            background: "linear-gradient(135deg, #1565C0, #6A1B9A)",
            color: "#fff",
          }}
        >
          Imeeleweka / Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}
