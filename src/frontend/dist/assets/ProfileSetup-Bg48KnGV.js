import { c as createLucideIcon, r as reactExports, K as useTheme, L as useRegisterProfile, N as useUpdateProfilePicture, q as useMyProfile, j as jsxRuntimeExports, B as Button, f as ue } from "./index-DZuylvf0.js";
import { A as Avatar, a as AvatarImage, b as AvatarFallback, I as Input } from "./input-Dgc8SmGp.js";
import { C as Camera, L as Label } from "./label-C9GURRgi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
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
  const [email, setEmail] = reactExports.useState("");
  const [profileFile, setProfileFile] = reactExports.useState(null);
  const [profilePreview, setProfilePreview] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const { theme, setTheme } = useTheme();
  const register = useRegisterProfile();
  const updatePicture = useUpdateProfilePicture();
  const { data: existingProfile } = useMyProfile();
  const existingPicUrl = ((_b = (_a = existingProfile == null ? void 0 : existingProfile.profilePicture) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) || null;
  const handleFileChange = (e) => {
    var _a2;
    const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!f) return;
    setProfileFile(f);
    const url = URL.createObjectURL(f);
    setProfilePreview(url);
  };
  const submit = async () => {
    if (!name.trim()) {
      ue.error("Jina linahitajika");
      return;
    }
    register.mutate(
      { name: name.trim(), email: email.trim(), theme },
      {
        onSuccess: async () => {
          ue.success("Umesajiliwa!");
          if (profileFile) {
            updatePicture.mutate(profileFile, {
              onSuccess: () => ue.success("Picha imehifadhiwa!"),
              onError: () => ue.error("Picha haikuhifadhiwa")
            });
          }
        },
        onError: () => ue.error("Hitilafu — jaribu tena")
      }
    );
  };
  const avatarSrc = profilePreview || existingPicUrl || void 0;
  const initials = name.trim().slice(0, 2).toUpperCase() || "U";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center px-6",
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
                    "data-ocid": "profile_setup.picture.upload_button",
                    className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2",
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
                    onChange: handleFileChange,
                    "data-ocid": "profile_setup.picture.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mb-1",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: "Picha ya Wasifu / Profile Picture"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-xl font-bold",
                  style: { color: "hsl(var(--foreground))" },
                  children: "Karibu!"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm mt-1",
                  style: { color: "hsl(var(--muted-foreground))" },
                  children: "Weka maelezo yako ili kuanza"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ps-name", children: "Jina lako *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ps-name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && submit(),
                    placeholder: "e.g. Amina Hassan",
                    "data-ocid": "profile_setup.name.input",
                    className: "mt-1"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ps-email", children: "Barua pepe (hiari)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ps-email",
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && submit(),
                    placeholder: "amina@example.com",
                    "data-ocid": "profile_setup.email.input",
                    className: "mt-1"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mandhari (Theme)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-2", children: ["dark", "light", "gold"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTheme(t),
                    "data-ocid": `profile_setup.${t}.toggle`,
                    className: "py-2 px-3 rounded-lg text-sm font-medium border-2 capitalize transition-all",
                    style: {
                      borderColor: theme === t ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: theme === t ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted))",
                      color: theme === t ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                    },
                    children: t === "dark" ? "Giza" : t === "light" ? "Mwanga" : "Dhahabu"
                  },
                  t
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: submit,
                  disabled: register.isPending || updatePicture.isPending,
                  "data-ocid": "profile_setup.submit.primary_button",
                  className: "w-full font-semibold",
                  style: {
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))"
                  },
                  children: register.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "mr-2 animate-spin" }),
                    "Inahifadhi..."
                  ] }) : "Anza Sasa"
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
