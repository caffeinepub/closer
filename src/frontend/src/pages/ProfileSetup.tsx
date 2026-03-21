import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { type Theme, useTheme } from "../context/ThemeContext";
import {
  useMyProfile,
  useRegisterProfile,
  useUpdateProfilePicture,
} from "../hooks/useQueries";

export function ProfileSetup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const register = useRegisterProfile();
  const updatePicture = useUpdateProfilePicture();
  const { data: existingProfile } = useMyProfile();

  const existingPicUrl =
    existingProfile?.profilePicture?.getDirectURL?.() || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfileFile(f);
    const url = URL.createObjectURL(f);
    setProfilePreview(url);
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Jina linahitajika");
      return;
    }
    register.mutate(
      { name: name.trim(), email: email.trim(), theme },
      {
        onSuccess: async () => {
          toast.success("Umesajiliwa!");
          if (profileFile) {
            updatePicture.mutate(profileFile, {
              onSuccess: () => toast.success("Picha imehifadhiwa!"),
              onError: () => toast.error("Picha haikuhifadhiwa"),
            });
          }
        },
        onError: () => toast.error("Hitilafu — jaribu tena"),
      },
    );
  };

  const avatarSrc = profilePreview || existingPicUrl || undefined;
  const initials = name.trim().slice(0, 2).toUpperCase() || "U";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(var(--background))" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-lg"
        style={{ background: "hsl(var(--card))" }}
        data-ocid="profile_setup.panel"
      >
        <div className="flex flex-col items-center mb-6">
          {/* Profile picture upload */}
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
              data-ocid="profile_setup.picture.upload_button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2"
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
              data-ocid="profile_setup.picture.input"
            />
          </div>
          <p
            className="text-xs mb-1"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Picha ya Wasifu / Profile Picture
          </p>
          <h2
            className="text-xl font-bold"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Karibu!
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Weka maelezo yako ili kuanza
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ps-name">Jina lako *</Label>
            <Input
              id="ps-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Amina Hassan"
              data-ocid="profile_setup.name.input"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ps-email">Barua pepe (hiari)</Label>
            <Input
              id="ps-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="amina@example.com"
              data-ocid="profile_setup.email.input"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Mandhari (Theme)</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(["dark", "light", "gold"] as Theme[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTheme(t)}
                  data-ocid={`profile_setup.${t}.toggle`}
                  className="py-2 px-3 rounded-lg text-sm font-medium border-2 capitalize transition-all"
                  style={{
                    borderColor:
                      theme === t
                        ? "hsl(var(--primary))"
                        : "hsl(var(--border))",
                    background:
                      theme === t
                        ? "hsl(var(--primary) / 0.15)"
                        : "hsl(var(--muted))",
                    color:
                      theme === t
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {t === "dark" ? "Giza" : t === "light" ? "Mwanga" : "Dhahabu"}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={register.isPending || updatePicture.isPending}
            data-ocid="profile_setup.submit.primary_button"
            className="w-full font-semibold"
            style={{
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {register.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Inahifadhi...
              </>
            ) : (
              "Anza Sasa"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
