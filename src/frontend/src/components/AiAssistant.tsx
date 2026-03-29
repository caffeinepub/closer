import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString("sw-TZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBotResponse(input: string): string {
  const text = input.toLowerCase();

  if (
    text.includes("malipo") ||
    text.includes("payment") ||
    text.includes("kulipa") ||
    text.includes("lipa")
  ) {
    return "Ili kulipa, tazama namba ya malipo ya duka (iko kwenye ukurasa wa duka, kisanduku cha kijani \uD83D\uDCB3). Unaweza kulipa kupitia M-Pesa, Tigo Pesa, Airtel Money au njia yoyote inayokubaliwa na mwenye duka. Baada ya kulipa, mwambie mwenye duka namba ya malipo yako ili athibitishe.";
  }
  if (
    text.includes("agizo") ||
    text.includes("order") ||
    text.includes("bidhaa") ||
    text.includes("nunua")
  ) {
    return "Hatua za kuagiza:\n1) Tafuta duka au bidhaa unayoitaka kwenye Soko.\n2) Fungua duka na bonyeza bidhaa.\n3) Bonyeza 'Agiza Sasa'.\n4) Taarifa zako (jina + simu) zitatumwa kwa mwenye duka.\n5) Mwenye duka atakuwasiliana nawe kuthibitisha na kukuambia jinsi ya kulipa.";
  }
  if (
    text.includes("duka") ||
    text.includes("shop") ||
    text.includes("biashara") ||
    text.includes("register")
  ) {
    return "Ili kuunda duka:\n1) Nenda 'Ofisi Yangu'.\n2) Bonyeza 'Unda Duka Jipya'.\n3) Chagua kundi la biashara yako (Soko, Chipsi, Welding, n.k.).\n4) Jaza taarifa za duka (jina, maelezo, namba ya malipo).\n5) Bonyeza Hifadhi. Duka lako litaonekana mara moja bila ya malipo yoyote!";
  }
  if (text.includes("admin") || text.includes("mamlaka")) {
    return "Ili kupata haki za admin: Nenda Ofisi Yangu \u2192 \u2699\uFE0F Mipangilio. Utaona chaguo la 'Daka Admin' au 'Futa Admin wa Zamani'. Kama una msimbo wa reset, ingiza: ctm2026. Mtumiaji wa kwanza kujisajili anakuwa Admin moja kwa moja.";
  }
  if (
    text.includes("hitilafu") ||
    text.includes("error") ||
    text.includes("shida") ||
    text.includes("tatizo")
  ) {
    return "Kama unakutana na hitilafu:\n1) Jaribu kutoka (Logout) kisha kuingia tena.\n2) Pakua upya ukurasa (Refresh).\n3) Hakikisha umeingiza taarifa zote zinazohitajika.\n4) Kama shida inaendelea, jaribu tena baadaye au wasiliana na msaada.";
  }
  if (
    text.includes("bei") ||
    text.includes("price") ||
    text.includes("tzs") ||
    text.includes("shilingi")
  ) {
    return "Bei zote zinaonyeshwa kwa Shilingi za Tanzania (TZS). Bei ya bidhaa inaonekana kwenye kila kadi ya bidhaa. Hakuna ada za ziada au makato ya asilimia kwenye app hii.";
  }
  if (
    text.includes("notification") ||
    text.includes("arifa") ||
    text.includes("taarifa")
  ) {
    return "Mwenye duka anapokea arifa kila mtu akiagiza bidhaa yake -- pamoja na jina na namba ya simu ya mteja. Unaweza kuchagua sauti ya arifa kwenye \u2699\uFE0F Mipangilio (Beep, Bell, Chime, au Double).";
  }
  if (
    text.includes("kutafuta") ||
    text.includes("search") ||
    text.includes("tafuta")
  ) {
    return "Ili kutafuta: Bonyeza 'Soko' kwenye menyu ya chini. Chagua kundi la biashara (Soko, Chipsi, Welding, n.k.) kisha tafuta bidhaa au duka ndani ya kundi hilo. Pia unaweza kutumia kisanduku cha kutafuta juu ya ukurasa.";
  }
  if (
    text.includes("profile") ||
    text.includes("akaunti") ||
    text.includes("account") ||
    text.includes("usajili") ||
    text.includes("sajili")
  ) {
    return "Ili kusajili:\n1) Bonyeza Login.\n2) Ingia kwa Internet Identity.\n3) Jaza jina lako, namba ya simu, na email.\n4) Bonyeza Hifadhi. Akaunti yako itaundwa mara moja!";
  }

  return "Samahani, sijaelewa vizuri swali lako. Unaweza kuuliza kuhusu:\n\uD83D\uDCB3 Malipo | \uD83D\uDCE6 Maagizo | \uD83C\uDFEA Duka | \uD83D\uDD11 Admin | \u2753 Msaada\n\nAu andika swali lako kwa undani zaidi.";
}

const QUICK_REPLIES = [
  { emoji: "\uD83D\uDCB3", label: "Malipo", query: "malipo" },
  { emoji: "\uD83D\uDCE6", label: "Maagizo", query: "agizo" },
  { emoji: "\uD83C\uDFEA", label: "Duka langu", query: "duka" },
  { emoji: "\uD83D\uDD11", label: "Admin", query: "admin" },
  { emoji: "\u2753", label: "Msaada", query: "msaada" },
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Karibu! Mimi ni Msaidizi wa CTM \uD83E\uDD16. Ninaweza kukusaidia kuhusu malipo, maagizo, duka, na zaidi. Unauliza nini?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom whenever messages change or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text: trimmed,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(trimmed);
      const botMsg: Message = {
        id: nextId.current++,
        role: "bot",
        text: botResponse,
        time: getTime(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setHasUnread(true);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage(input);
  }

  return (
    <>
      <div className="fixed z-[1000]" style={{ bottom: "88px", right: "16px" }}>
        <AnimatePresence>
          {open && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="absolute bottom-16 right-0 rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden"
              style={{
                width: "min(320px, calc(100vw - 32px))",
                height: "460px",
              }}
              data-ocid="ai_assistant.panel"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="robot">
                    \uD83E\uDD16
                  </span>
                  <div>
                    <p className="font-semibold text-sm leading-tight">
                      Msaidizi wa CTM
                    </p>
                    <p className="text-xs opacity-80">
                      CTM Assistant \u00B7 Online
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
                  data-ocid="ai_assistant.close_button"
                  aria-label="Funga"
                >
                  \u2715
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-3 py-3">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "bot" && (
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #e91e8c)",
                          }}
                          role="img"
                          aria-label="bot"
                        >
                          \uD83E\uDD16
                        </span>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                          msg.role === "user"
                            ? "text-white rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                        style={
                          msg.role === "user"
                            ? {
                                background:
                                  "linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)",
                              }
                            : undefined
                        }
                      >
                        {msg.text}
                        <div
                          className={`text-[10px] mt-1 ${
                            msg.role === "user"
                              ? "text-white/60 text-right"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #e91e8c)",
                        }}
                        role="img"
                        aria-label="bot typing"
                      >
                        \uD83E\uDD16
                      </span>
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted-foreground/50"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick replies shown initially */}
                  {messages.length === 1 && !isTyping && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {QUICK_REPLIES.map((qr) => (
                        <button
                          key={qr.query}
                          type="button"
                          onClick={() => sendMessage(qr.query)}
                          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                          style={{ borderColor: "#e91e8c", color: "#e91e8c" }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.background =
                              "linear-gradient(135deg, #7c3aed, #e91e8c)";
                            el.style.color = "white";
                            el.style.borderColor = "transparent";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.background = "transparent";
                            el.style.color = "#e91e8c";
                            el.style.borderColor = "#e91e8c";
                          }}
                          data-ocid={`ai_assistant.${qr.query}.button`}
                        >
                          {qr.emoji} {qr.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-border px-3 py-2 flex gap-2 items-center bg-background">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Andika swali lako..."
                  className="flex-1 text-sm bg-muted rounded-full px-4 py-2 outline-none border-none text-foreground placeholder:text-muted-foreground"
                  data-ocid="ai_assistant.input"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity text-white font-bold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)",
                  }}
                  data-ocid="ai_assistant.submit_button"
                  aria-label="Tuma"
                >
                  \u27A4
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger button */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
          style={{
            background: open
              ? "linear-gradient(135deg, #e91e8c 0%, #7c3aed 100%)"
              : "linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)",
          }}
          data-ocid="ai_assistant.open_modal_button"
          aria-label="Msaidizi wa CTM"
        >
          <span role="img" aria-label={open ? "close" : "assistant"}>
            {open ? "\u2715" : "\uD83E\uDD16"}
          </span>
          {!open && hasUnread && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </motion.button>
      </div>
    </>
  );
}
