import { c as createLucideIcon, r as reactExports, ad as useTheme, ae as useUpdateProfilePicture, Z as useMyProfile, ab as useActor, ac as useQueryClient, j as jsxRuntimeExports, B as Button, l as ue } from "./index-L9WAJ5s1.js";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-X041SANp.js";
import { I as Input } from "./input-e8bMvGMa.js";
import { L as Label } from "./label-DuvCGBUq.js";
import { b as Camera, a as ChevronUp, C as ChevronDown } from "./chevron-up-C59yoXaQ.js";
import { L as LoaderCircle } from "./loader-circle-Dhg6Ep3n.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function ProfileSetup() {
  var _a, _b;
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [profileFile, setProfileFile] = reactExports.useState(null);
  const [profilePreview, setProfilePreview] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [showAdminSection, setShowAdminSection] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const { theme, setTheme } = useTheme();
  const updatePicture = useUpdateProfilePicture();
  const { data: existingProfile } = useMyProfile();
  const { actor } = useActor();
  const qc = useQueryClient();
  const existingPicUrl = ((_b = (_a = existingProfile == null ? void 0 : existingProfile.profilePicture) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) || null;
  const handleFileChange = (e) => {
    var _a2;
    const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!f) return;
    setProfileFile(f);
    setProfilePreview(URL.createObjectURL(f));
  };
  const submit = async () => {
    if (!name.trim()) {
      ue.error("Jina linahitajika");
      return;
    }
    if (!actor) {
      ue.error("Uunganisho umeshindwa -- jaribu tena");
      return;
    }
    setSaving(true);
    try {
      await actor.registerProfile(
        name.trim(),
        phone.trim(),
        email.trim(),
        theme
      );
      let isAdminNow = false;
      if (showAdminSection) {
        try {
          const claimed = await actor.claimAdminIfNoneYet();
          if (claimed) isAdminNow = true;
        } catch {
        }
      }
      if (!isAdminNow) {
        try {
          isAdminNow = await actor.isCallerAdmin();
        } catch {
        }
      }
      if (profileFile) {
        try {
          await updatePicture.mutateAsync(profileFile);
        } catch {
        }
      }
      await qc.invalidateQueries();
      if (isAdminNow) {
        ue.success("✅ Umesajiliwa kama Admin -- una udhibiti kamili!", {
          duration: 6e3
        });
      } else {
        ue.success("✅ Umesajiliwa!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Registration error:", msg);
      ue.error("Hitilafu ya kusajili. Tafadhali jaribu tena.");
    } finally {
      setSaving(false);
    }
  };
  const avatarSrc = profilePreview || existingPicUrl || void 0;
  const initials = name.trim().slice(0, 2).toUpperCase() || "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center px-6 py-8",
      style: { background: "hsl(var(--background))" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-sm rounded-2xl p-6 shadow-lg",
          style: { background: "hsl(var(--card))" },
          "data-ocid": "profile_setup.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-20 h-20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarSrc, alt: "Picha ya Wasifu" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AvatarFallback,
                    {
                      style: {
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        fontSize: "1.25rem",
                        fontWeight: 700
                      },
                      children: avatarSrc ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28 }) : initials
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a2;
                      return (_a2 = fileRef.current) == null ? void 0 : _a2.click();
                    },
                    "data-ocid": "profile_setup.avatar.upload_button",
                    className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow border-2",
                    style: {
                      background: "hsl(var(--primary))",
                      borderColor: "hsl(var(--card))",
                      color: "hsl(var(--primary-foreground))"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handleFileChange
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-xl font-bold mb-1",
                  style: { color: "hsl(var(--foreground))" },
                  children: "Jaza Taarifa Zako"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-center",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: "Mtumiaji wa kwanza kusajili atakuwa Admin wa mfumo"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", style: { color: "hsl(var(--foreground))" }, children: "Jina Lako / Your Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "Amina Mohamed",
                    className: "mt-1",
                    "data-ocid": "profile_setup.name.input",
                    onKeyDown: (e) => e.key === "Enter" && submit()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", style: { color: "hsl(var(--foreground))" }, children: "Namba ya Simu / Phone Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "phone",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    placeholder: "+255700000000",
                    type: "tel",
                    className: "mt-1",
                    "data-ocid": "profile_setup.phone.input",
                    onKeyDown: (e) => e.key === "Enter" && submit()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", style: { color: "hsl(var(--foreground))" }, children: "Barua Pepe / Email (hiari)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    placeholder: "amina@example.com",
                    type: "email",
                    className: "mt-1",
                    "data-ocid": "profile_setup.email.input",
                    onKeyDown: (e) => e.key === "Enter" && submit()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { style: { color: "hsl(var(--foreground))" }, children: "Mandhari / Theme" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-1", children: ["dark", "light", "gold"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `profile_setup.theme_${t}.toggle`,
                    onClick: () => setTheme(t),
                    className: "py-2 rounded-lg text-xs font-semibold transition-all border",
                    style: {
                      background: theme === t ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: theme === t ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                      borderColor: theme === t ? "hsl(var(--primary))" : "hsl(var(--border))"
                    },
                    children: t === "dark" ? "🌙 Dark" : t === "light" ? "☀️ Light" : "✨ Gold"
                  },
                  t
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl border overflow-hidden",
                  style: { borderColor: "hsl(var(--border))" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "profile_setup.admin.toggle",
                        onClick: () => setShowAdminSection((v) => !v),
                        className: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors",
                        style: {
                          background: showAdminSection ? "hsl(var(--muted))" : "transparent",
                          color: "hsl(var(--muted-foreground))"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛡️" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ingia kama Admin / Become Admin" })
                          ] }),
                          showAdminSection ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
                        ]
                      }
                    ),
                    showAdminSection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "px-4 pb-4 pt-2 space-y-2",
                        style: { background: "hsl(var(--muted) / 0.4)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-xs leading-snug rounded-lg px-3 py-2",
                            style: {
                              background: "hsl(var(--muted))",
                              color: "hsl(var(--foreground))",
                              borderLeft: "3px solid #7c3aed"
                            },
                            children: "✅ Ukibonyeza “🛡️ Sajili kama Admin” mfumo utajaribu kukupa haki za Admin kama hakuna admin mwingine aliyesajiliwa — bila kuhitaji neno la siri lolote."
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: submit,
                  disabled: saving,
                  className: "w-full font-semibold py-5 rounded-xl",
                  "data-ocid": "profile_setup.submit.primary_button",
                  style: {
                    background: showAdminSection ? "linear-gradient(135deg, #4f1d96, #7c3aed)" : "linear-gradient(135deg, #C2185B, #FF00AA)",
                    color: "#fff",
                    border: "none"
                  },
                  children: [
                    saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                    saving ? "Inasajili..." : showAdminSection ? "🛡️ Sajili kama Admin" : "Endelea / Continue"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  ProfileSetup
};
