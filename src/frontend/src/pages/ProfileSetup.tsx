import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { type Theme, useTheme } from "../context/ThemeContext";
import { useActor } from "../hooks/useActor";
import { useMyProfile, useUpdateProfilePicture } from "../hooks/useQueries";

export function ProfileSetup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const updatePicture = useUpdateProfilePicture();
  const { data: existingProfile } = useMyProfile();
  const { actor } = useActor();
  const qc = useQueryClient();

  const existingPicUrl =
    existingProfile?.profilePicture?.getDirectURL?.() || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfileFile(f);
    setProfilePreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Jina linahitajika");
      return;
    }
    if (!actor) {
      toast.error("Uunganisho umeshindwa -- jaribu tena");
      return;
    }

    setSaving(true);
    try {
      await actor.registerProfile(
        name.trim(),
        phone.trim(),
        email.trim(),
        theme,
      );

      // Check if caller became admin (e.g. first user)
      let isAdminNow = false;
      try {
        isAdminNow = await actor.isCallerAdmin();
      } catch {
        // ignore
      }

      // Upload profile picture if provided
      if (profileFile) {
        try {
          await updatePicture.mutateAsync(profileFile);
        } catch {
          // non-critical
        }
      }

      await qc.invalidateQueries();

      if (isAdminNow) {
        toast.success("✅ Umesajiliwa kama Admin -- una udhibiti kamili!", {
          duration: 6000,
        });
      } else {
        toast.success("✅ Umesajiliwa!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Registration error:", msg);
      toast.error("Hitilafu ya kusajili. Tafadhali jaribu tena.");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = profilePreview || existingPicUrl || undefined;
  const initials = name.trim().slice(0, 2).toUpperCase() || "U";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: "hsl(var(--background))" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-lg"
        style={{ background: "hsl(var(--card))" }}
        data-ocid="profile_setup.panel"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarSrc} alt="Picha ya Wasifu" />
              <AvatarFallback
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                {avatarSrc ? <User size={28} /> : initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-ocid="profile_setup.avatar.upload_button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow border-2"
              style={{
                background: "hsl(var(--primary))",
                borderColor: "hsl(var(--card))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Jaza Taarifa Zako
          </h2>
          <p
            className="text-xs text-center"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Mtumiaji wa kwanza kusajili atakuwa Admin wa mfumo
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" style={{ color: "hsl(var(--foreground))" }}>
              Jina Lako / Your Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amina Mohamed"
              className="mt-1"
              data-ocid="profile_setup.name.input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div>
            <Label htmlFor="phone" style={{ color: "hsl(var(--foreground))" }}>
              Namba ya Simu / Phone Number
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+255700000000"
              type="tel"
              className="mt-1"
              data-ocid="profile_setup.phone.input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div>
            <Label htmlFor="email" style={{ color: "hsl(var(--foreground))" }}>
              Barua Pepe / Email (hiari)
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amina@example.com"
              type="email"
              className="mt-1"
              data-ocid="profile_setup.email.input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div>
            <Label style={{ color: "hsl(var(--foreground))" }}>
              Mandhari / Theme
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(["dark", "light", "gold"] as Theme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid={`profile_setup.theme_${t}.toggle`}
                  onClick={() => setTheme(t)}
                  className="py-2 rounded-lg text-xs font-semibold transition-all border"
                  style={{
                    background:
                      theme === t ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    color:
                      theme === t
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--muted-foreground))",
                    borderColor:
                      theme === t
                        ? "hsl(var(--primary))"
                        : "hsl(var(--border))",
                  }}
                >
                  {t === "dark"
                    ? "🌙 Dark"
                    : t === "light"
                      ? "☀️ Light"
                      : "✨ Gold"}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={saving}
            className="w-full font-semibold py-5 rounded-xl"
            data-ocid="profile_setup.submit.primary_button"
            style={{
              background: "linear-gradient(135deg, #C2185B, #FF00AA)",
              color: "#fff",
              border: "none",
            }}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {saving ? "Inasajili..." : "Endelea / Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
