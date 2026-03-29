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

// ─── Smart AI Engine ───────────────────────────────────────────────────────────

function tryMath(input: string): string | null {
  // Evaluate simple arithmetic
  const cleaned = input
    .replace(/x/gi, "*")
    .replace(/÷/g, "/")
    .replace(/[^0-9+\-*/().\s]/g, "")
    .trim();
  if (!cleaned || !/[0-9]/.test(cleaned)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${cleaned})`)();
    if (typeof result === "number" && Number.isFinite(result)) {
      return `Jibu: **${cleaned} = ${result.toLocaleString()}**`;
    }
  } catch {
    // not a math expression
  }
  return null;
}

const knowledge: Array<{ keys: string[]; answer: string }> = [
  // ── Greetings ──
  {
    keys: [
      "habari",
      "hujambo",
      "mambo",
      "vipi",
      "salamu",
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "karibu",
    ],
    answer:
      "Habari! Karibu sana 😊. Mimi ni Msaidizi wa CTM -- ninaweza kukusaidia kuhusu biashara, malipo, maagizo, kilimo, afya, teknolojia, fedha, na maswali mengine mengi. Unauliza nini leo?",
  },
  {
    keys: ["asante", "shukrani", "thank you", "thanks"],
    answer: "Karibu sana! Ikiwa una swali lingine lolote, mimi niko hapa 😊.",
  },
  {
    keys: ["kwaheri", "baadaye", "goodbye", "bye", "tutaonana"],
    answer:
      "Kwaheri! Nakutakia biashara nzuri na siku njema 🌟. Rudi wakati wowote ukihitaji msaada.",
  },

  // ── App / CTM ──
  {
    keys: [
      "malipo",
      "payment",
      "kulipa",
      "lipa",
      "pesa",
      "m-pesa",
      "mpesa",
      "tigo",
      "airtel",
      "halopesa",
    ],
    answer:
      "💳 **Malipo kwenye CTM:**\nTazama namba ya malipo ya duka (kisanduku cha kijani ndani ya duka). Unaweza kulipa kupitia:\n• M-Pesa\n• Tigo Pesa\n• Airtel Money\n• HaloPesa\n• Njia yoyote inayokubaliwa na mwenye duka.\n\nBaada ya kulipa, mwambie mwenye duka namba yako ya malipo ili athibitishe na kuandaa bidhaa yako.",
  },
  {
    keys: ["agizo", "order", "nunua", "oda", "niagize"],
    answer:
      "📦 **Jinsi ya Kuagiza:**\n1. Nenda Soko → chagua kundi la biashara.\n2. Bonyeza duka/bidhaa unayoipenda.\n3. Bonyeza **'Agiza Sasa'**.\n4. Taarifa zako (jina + simu) zitatumwa kwa mwenye duka moja kwa moja.\n5. Mwenye duka atakupigia simu ili kuthibitisha na kukuambia jinsi ya kupokea bidhaa.",
  },
  {
    keys: [
      "duka",
      "shop",
      "biashara",
      "register shop",
      "unda duka",
      "fungua duka",
    ],
    answer:
      "🏪 **Jinsi ya Kufungua Duka:**\n1. Nenda **Ofisi Yangu**.\n2. Bonyeza **'Unda Duka Jipya'**.\n3. Chagua kundi la biashara yako (Welding, Soko, Chipsi, n.k.).\n4. Jaza taarifa: jina, maelezo, namba ya malipo, na picha ya logo.\n5. Bonyeza **Hifadhi** -- duka lako litaonekana mara moja BILA malipo yoyote!",
  },
  {
    keys: ["admin", "mamlaka", "daka admin"],
    answer:
      "🔑 **Kupata Haki za Admin:**\nNenda **Ofisi Yangu → ⚙️ Mipangilio**, kisha bonyeza **'Daka Admin'** (ikiwa hakuna admin mwingine) au **'Futa Admin wa Zamani'** (msimbo: `ctm2026`).\n\nMtumiaji wa **kwanza** kusajili kwenye app huwa Admin moja kwa moja.",
  },
  {
    keys: ["hitilafu", "error", "shida ya app", "inagoma", "haifanyi kazi"],
    answer:
      "🔧 **Jinsi ya Kurekebisha Hitilafu:**\n1. Toka (Logout) kisha ingia tena.\n2. Pakua upya ukurasa (Refresh / F5).\n3. Hakikisha umeingiza taarifa zote zinazohitajika.\n4. Jaribu kwenye kivinjari kingine (Chrome / Firefox).\n5. Ikiwa shida inaendelea, subiri dakika chache kisha jaribu tena.",
  },
  {
    keys: ["notification", "arifa", "sauti", "sound"],
    answer:
      "🔔 **Arifa:**\nMwenye duka anapokea arifa kila mtu akiagiza bidhaa yake -- pamoja na jina na simu ya mteja.\nUnaweza kuchagua sauti ya arifa kwenye ⚙️ **Mipangilio** (Beep, Bell, Chime, au Double).",
  },
  {
    keys: ["pwa", "install", "weka app", "download app", "offline"],
    answer:
      "📱 **Kuweka App kwenye Simu:**\n**Android (Chrome):**\n1. Fungua app kwenye Chrome.\n2. Bonyeza menu (⋮) → **'Add to Home Screen'**.\n\n**iPhone (Safari):**\n1. Bonyeza kitufe cha Share (🔗).\n2. Chagua **'Add to Home Screen'**.\n\nApp itafanya kazi kama app ya kawaida -- hata bila mtandao!",
  },

  // ── Tanzania / Geography ──
  {
    keys: ["tanzania", "dar es salaam", "dodoma", "mkoa", "mji"],
    answer:
      "🇹🇿 **Tanzania:**\nTanzania ni nchi ya Afrika Mashariki. Mji mkuu ni **Dodoma** (kiutawala) na **Dar es Salaam** ni mji mkubwa zaidi kibiashara.\nIdadi ya watu: ~65 milioni. Sarafu: **Shilingi ya Tanzania (TZS)**. Lugha rasmi: Kiswahili na Kiingereza.",
  },
  {
    keys: ["kilimanjaro", "mlima"],
    answer:
      "🏔️ **Mlima Kilimanjaro** ndio mlima mrefu zaidi barani Afrika -- urefu wake ni mita 5,895 juu ya usawa wa bahari. Upo kaskazini mwa Tanzania, karibu na mji wa Moshi.",
  },

  // ── Biashara / Business ──
  {
    keys: ["jinsi ya kuuza", "marketing", "wateja", "ongeza wateja", "masoko"],
    answer:
      "📈 **Vidokezo vya Kuongeza Mauzo:**\n1. **Piga picha nzuri** za bidhaa zako.\n2. **Andika bei wazi** -- wateja hupenda uwazi.\n3. **Jibu haraka** -- mteja asiyejibiwa hukimbia.\n4. **Tuma bei ya sawa** au punguzo kwa wateja wa mara kwa mara.\n5. **Tumia mitandao ya jamii** -- TikTok, Facebook, WhatsApp kwa matangazo ya bure.\n6. **Weka duka lako active** ili liendelee kuonekana kwa wateja.",
  },
  {
    keys: ["faida", "hasara", "biashara inafanya", "mapato", "kipato"],
    answer:
      "💰 **Kuhesabu Faida:**\nFaida = Mapato ya Jumla − Gharama Zote\n\n**Mfano:**\n• Uliuza bidhaa: TZS 50,000\n• Gharama ya kununua: TZS 30,000\n• Usafiri/packing: TZS 2,000\n• **Faida halisi: TZS 18,000**\n\nKumbuka kuweka kumbukumbu ya kila muamala ili usipoteze hesabu.",
  },
  {
    keys: ["biashara ndogo", "startup", "kuanza biashara", "mtaji"],
    answer:
      "🚀 **Kuanza Biashara Ndogo:**\n1. **Chagua bidhaa/huduma** inayohitajika sana eneo lako.\n2. **Anza na mtaji mdogo** -- usisubiri pesa nyingi.\n3. **Sajili biashara** yako kwenye serikali (BRELA Tanzania).\n4. **Weka akaunti ya benki** tofauti na ya kibinafsi.\n5. **Tafuta wateja 10 wa kwanza** -- ndiyo hatua ngumu zaidi lakini muhimu sana.\n6. **Ongeza CTM** -- weka duka lako hapa bure!",
  },

  // ── Kilimo / Agriculture ──
  {
    keys: ["kilimo", "shamba", "mazao", "zao", "mbegu", "rutuba", "mbolea"],
    answer:
      "🌾 **Kilimo Bora:**\n• **Mbolea ya asili (mboji)** ni bora kuliko kemikali -- inapunguza gharama na kulinda ardhi.\n• **Umwagiliaji** wa kutosha unaongeza mavuno hadi mara 3.\n• **Zao bora Tanzania:** mahindi, mpunga, mihogo, nyanya, vitunguu, kahawa, korosho.\n• **Tahadhari ya wadudu:** Tumia dawa za asili au nenda kituo cha kilimo kilicho karibu.\n• **Mazao ya msimu:** Panda wakati wa mvua ili kupunguza gharama za maji.",
  },
  {
    keys: ["mifugo", "ng'ombe", "kuku", "mbuzi", "nguruwe"],
    answer:
      "🐄 **Ufugaji:**\n• **Kuku wa nyama (broiler):** Anakomaa ndani ya siku 42. Faida nzuri kwa mtaji mdogo.\n• **Kuku wa mayai:** Anaanza kutaga baada ya miezi 5. Mayai yanapata soko zuri.\n• **Ng'ombe wa maziwa:** Anahitaji chakula bora, chanjo, na maji safi. Mazao: maziwa, nyama, mbolea.\n• **Mbuzi:** Rahisi kufuga, anapendeza soko la nyama na maziwa.\n• Wasiliana na **Wizara ya Mifugo Tanzania** kwa msaada wa bure.",
  },

  // ── Afya / Health ──
  {
    keys: ["afya", "magonjwa", "dawa", "hospitali", "homa", "malaria"],
    answer:
      "🏥 **Afya ya Msingi:**\n• **Homa ya malaria:** Dalili -- homa, maumivu ya kichwa, baridi. Nenda hospitali haraka kwa kipimo.\n• **Maji safi:** Chemsha maji au tumia dawa za kusafisha kuepuka kipindupindu na kuhara.\n• **Chanjo:** Hakikisha watoto wanachanjwa kwa wakati -- zinaokoa maisha.\n• **Lishe bora:** Kula matunda, mboga, protini na wanga kila siku.\n\n⚠️ Kwa dharura ya kiafya, piga simu **114** (muhutasari Tanzania) au nenda hospitali ya karibu mara moja.",
  },
  {
    keys: ["corona", "covid", "virusi"],
    answer:
      "😷 **Tahadhari za Virusi:**\n• Osha mikono mara kwa mara kwa sabuni na maji.\n• Epuka msongamano wa watu mahali pasipo na uingizaji hewa.\n• Nenda hospitali ukipata dalili za kupumua vibaya, homa kali, au kupoteza hisi ya harufu.",
  },

  // ── Teknolojia / Technology ──
  {
    keys: ["internet", "mtandao", "wifi", "data", "mb", "gb"],
    answer:
      "📶 **Kuokoa Data ya Intaneti:**\n• Zima updates za kiotomatiki kwenye simu.\n• Tumia WiFi nyumbani au mahali pa kazi.\n• Pakua muziki/video ukiwa na WiFi ili uone offline.\n• Tumia vivinjari vinavyookoa data kama **Opera Mini** au **Chrome Data Saver**.",
  },
  {
    keys: ["simu", "phone", "smartphone", "android", "iphone"],
    answer:
      "📱 **Vidokezo vya Simu:**\n• Bonyeza **Settings → Battery** ili uone programu zinazotumia betri nyingi.\n• Hifadhi nakala (backup) ya picha zako kwenye Google Photos (bure).\n• Sasisha programu zako mara kwa mara ili kupata usalama bora.\n• Usitumie hotspot ya WiFi ya bure mahali pa umma kwa shughuli za benki.",
  },
  {
    keys: ["kompyuta", "laptop", "computer", "pc"],
    answer:
      "💻 **Kompyuta:**\n• Weka **antivirus** (Windows Defender ni bure na ni bora).\n• Hifadhi kazi zako kwenye **Google Drive** au **OneDrive** ili usipoteze.\n• Weka nenosiri imara: herufi kubwa + ndogo + nambari + alama (mfano: `Market@2026`).\n• Sasisha mfumo (Windows Update) mara kwa mara.",
  },

  // ── Fedha / Finance ──
  {
    keys: ["akiba", "benki", "akaunti", "kuweka pesa", "faida ya benki"],
    answer:
      "🏦 **Jinsi ya Kuweka Akiba:**\n• **CRDB, NMB, NBC** -- benki kubwa Tanzania zenye akaunti za kawaida.\n• **SACCOS** -- vikundi vya akiba vinavyotoa mkopo kwa riba ndogo.\n• **M-Pesa/Tigo Pesa** -- rahisi kuhifadhi pesa kidogo kidogo.\n• Jaribu kuweka **10-20% ya mapato** yako kila mwezi kwa ajili ya hali ya dharura.",
  },
  {
    keys: ["mkopo", "loan", "kukopa", "riba"],
    answer:
      "💵 **Kuhusu Mikopo:**\n• Kabla ya kukopa, hakikisha una mpango wa kurejesha.\n• Linganisha riba za benki tofauti -- tofauti inaweza kuwa kubwa.\n• **SIDO** na **NEEC** Tanzania wanatoa mikopo kwa biashara ndogo ndogo.\n• Epuka 'fasta loans' zenye riba juu ya 10% kwa mwezi -- zinaweza kukuzalisha deni kubwa.",
  },
  {
    keys: ["inflation", "mfumuko", "bei kupanda", "gharama ya maisha"],
    answer:
      "📊 **Mfumuko wa Bei:**\nMfumuko wa bei unamaanisha pesa inakuwa na thamani ndogo na bidhaa zinaghali zaidi. Jinsi ya kujilinda:\n• Nunua bidhaa kwa wingi (bulk) unapopata bei nzuri.\n• Wekeza kwenye biashara au mali badala ya kushikilia pesa za taslimu.\n• Fuata taarifa za Benki Kuu ya Tanzania (BOT) kuhusu hali ya uchumi.",
  },

  // ── Elimu / Education ──
  {
    keys: ["elimu", "shule", "chuo", "university", "mtihani", "darasa"],
    answer:
      "🎓 **Elimu Tanzania:**\n• **Vyuo vikuu:** UDSM, UDOM, Mzumbe, Ardhi, Sokoine, St. Augustine.\n• **Mitihani ya taifa:** NECTA -- PSLE, CSEE (Form 4), ACSEE (Form 6).\n• **Masomo ya bure online:** Khan Academy, YouTube, Coursera.\n• **Udaholo (scholarship):** HESLB hutoa mikopo kwa wanafunzi wa chuo.",
  },

  // ── Mazingira / Environment ──
  {
    keys: ["hali ya hewa", "mvua", "joto", "baridi", "msimu", "weather"],
    answer:
      "🌤️ **Hali ya Hewa Tanzania:**\n• **Msimu wa mvua kuu (Masika):** Machi -- Mei.\n• **Msimu wa mvua ndogo (Vuli):** Oktoba -- Desemba.\n• **Msimu wa kiangazi:** Juni -- Agosti (baridi zaidi maeneo ya juu).\n• Kwa taarifa za hali ya hewa, angalia **TMA (Tanzania Meteorological Authority)** au tovuti ya weather.com.",
  },

  // ── Haki / Sheria ──
  {
    keys: ["haki", "sheria", "polisi", "korti", "malalamiko", "rights"],
    answer:
      "⚖️ **Haki za Msingi Tanzania:**\n• Una haki ya kupata mwanasheria ukikamatwa.\n• Shirika la **Msaada wa Kisheria Tanzania (LST)** linatoa ushauri wa bure.\n• Lalamika ulaghai wa kidigitali kwa **TCRA** (www.tcra.go.tz) au **Polisi ya Mawasiliano (PCCB)**.",
  },
  {
    keys: ["brela", "TIN", "usajili biashara", "leseni"],
    answer:
      "📋 **Usajili wa Biashara Tanzania:**\n1. **BRELA** (Business Registrations and Licensing Agency) -- sajili jina la biashara.\n2. **TRA** -- pata TIN number (bure online kwa ors.tra.go.tz).\n3. **Leseni ya biashara** -- nenda Halmashauri yako ya Wilaya.\n4. **OSHA** -- kama una wafanyakazi, hakikisha unazingatia afya na usalama mahali pa kazi.",
  },

  // ── Jiografia / General Knowledge ──
  {
    keys: ["africa", "bara la africa", "nchi za africa"],
    answer:
      "🌍 **Afrika:**\nAfrika ni bara kubwa zaidi duniani kwa upande wa nchi -- ina nchi **54**. Idadi ya watu: takriban **1.4 bilioni**. Lugha za kawaida zaidi: Kiswahili, Kiingereza, Kifaransa, Kiarabu. Uchumi mkubwa: Nigeria, Afrika Kusini, Misri, Kenya, Tanzania.",
  },
  {
    keys: ["dunia", "world", "continents", "mabara"],
    answer:
      "🌐 **Mabara ya Dunia (7):**\n1. Asia (kubwa zaidi)\n2. Afrika\n3. Amerika Kaskazini\n4. Amerika Kusini\n5. Antaktika (baridi zaidi)\n6. Ulaya\n7. Australia/Oceania\n\nIdadi ya watu duniani: ~8 bilioni.",
  },
  {
    keys: [
      "capital",
      "mji mkuu",
      "nairobi",
      "kampala",
      "kigali",
      "addis",
      "cairo",
    ],
    answer:
      "🏙️ **Miji Mikuu ya Afrika Mashariki:**\n• Tanzania: **Dodoma**\n• Kenya: **Nairobi**\n• Uganda: **Kampala**\n• Rwanda: **Kigali**\n• Burundi: **Gitega**\n• Ethiopia: **Addis Ababa**",
  },

  // ── Sayansi / Science ──
  {
    keys: ["gesi asilia", "mafuta", "madini", "gold", "dhahabu", "tanzanite"],
    answer:
      "💎 **Madini ya Tanzania:**\n• **Tanzanite** -- inachimbwa Mererani tu duniani kote (Tanzania peke yake!).\n• **Dhahabu (gold)** -- machimbo makubwa: Geita, North Mara, Bulyanhulu.\n• **Almasi (diamond)** -- Mwadui (Williamson Mine) ni maarufu duniani.\n• **Gesi asilia** -- akiba kubwa zimegunduliwa Lindi, Mtwara, na baharini.",
  },
  {
    keys: ["sayari", "jua", "mwezi", "nyota", "space", "anga", "galaxy"],
    answer:
      "🚀 **Mfumo wa Jua:**\n• Sayari 8: Mercury, Venus, Dunia, Mars, Jupiter, Saturn, Uranus, Neptune.\n• Dunia iko umbali wa **km 150 milioni** kutoka Jua.\n• Mwezi unachukua siku **27.3** kuzunguka Dunia.\n• Galaxy yetu inaitwa **Milky Way** -- ina nyota zaidi ya **200 bilioni**!",
  },

  // ── Lugha / Language ──
  {
    keys: ["kiswahili", "lugha", "translate", "tafsiri", "english"],
    answer:
      "🗣️ **Maneno Muhimu Kiswahili - Kiingereza:**\nHabari → Hello/How are you\nAsante → Thank you\nTafadhali → Please\nSamahani → Sorry/Excuse me\nNdiyo → Yes | Hapana → No\nKaribu → Welcome\nHesabu → Bill/Calculation\nBiashara → Business\nBidhaa → Product/Item\nMauzo → Sales",
  },

  // ── Usafiri / Transport ──
  {
    keys: [
      "usafiri",
      "safari",
      "basi",
      "ndege",
      "gari",
      "pikipiki",
      "bodaboda",
    ],
    answer:
      "🚌 **Usafiri Tanzania:**\n• **Basi la UMEME/Rapid Transit (BRT)** -- Dar es Salaam, bei nafuu na haraka.\n• **Ndege za ndani:** Air Tanzania, Precision Air, Coastal Aviation.\n• **Meli:** Dar es Salaam ↔ Zanzibar kwa masaa ~2 (MV Kilimanjaro, n.k.).\n• **Bodaboda/Tuk-tuk:** Weka bei kabla ya kuingia ili kuepuka migogoro.",
  },

  // ── Chakula / Food ──
  {
    keys: [
      "chakula",
      "kupika",
      "ugali",
      "pilau",
      "nyama",
      "samaki",
      "mbogamboga",
    ],
    answer:
      "🍲 **Chakula Maarufu Tanzania:**\n• **Ugali** -- chakula cha msingi kilichopikwa na unga wa mahindi.\n• **Pilau** -- mchele wa viungo, maarufu Zanzibar na pwani.\n• **Nyama Choma** -- nyama ya ng'ombe/mbuzi iliyochomwa mkaa.\n• **Maharage ya nazi** -- maharagwe kupikwa na maziwa ya nazi.\n• **Zanzibar Pizza** -- ndizi, nyama, mayai, na jibini ndani ya uji uliokangwa.",
  },

  // ── Michezo / Sports ──
  {
    keys: ["michezo", "mpira", "simba", "yanga", "timu", "cricket", "marathon"],
    answer:
      "⚽ **Michezo Tanzania:**\n• **Simba SC** na **Young Africans (Yanga)** -- mechi zao ni sherehe kubwa!\n• **Ligi Kuu Tanzania** -- mchezo wa mpira unaopendwa zaidi.\n• **Wanariadha:** Tanzania imewahi kushinda medali za Olympic (marathon).\n• **Cricket, netball, na boxing** pia vinafuatwa.",
  },

  // ── Msaada wa jumla ──
  {
    keys: ["msaada", "help", "nikusaidie", "unaweza", "naweza"],
    answer:
      "🤝 **Ninaweza Kukusaidia Na:**\n💳 Malipo & Fedha\n📦 Maagizo & Biashara\n🏪 Kusimamia Duka\n🌾 Kilimo & Mifugo\n🏥 Afya ya Msingi\n💻 Teknolojia & Simu\n🎓 Elimu\n🌍 Jiografia & Sayansi\n🍲 Chakula & Utamaduni\n⚽ Michezo\n🧮 Hesabu (mfano: 250 * 3)\n\nUliza swali lolote!",
  },
];

function getBotResponse(input: string): string {
  const text = input.toLowerCase().trim();

  // 1. Try math first
  const mathResult = tryMath(text);
  if (mathResult) return mathResult;

  // 2. Score each knowledge entry
  let bestScore = 0;
  let bestAnswer = "";

  for (const entry of knowledge) {
    let score = 0;
    for (const key of entry.keys) {
      if (text.includes(key)) {
        score += key.length; // longer key match = more specific
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  if (bestScore > 0) return bestAnswer;

  // 3. Fallback: smart general response
  return (
    "🤔 Swali lako ni zuri! Sijaweza kupata jibu kamili, lakini naomba uniambie zaidi ili nikusaidie vizuri.\n\n" +
    "Au unaweza kuuliza kuhusu:\n" +
    "💳 Malipo | 📦 Maagizo | 🏪 Duka | 🌾 Kilimo | 🏥 Afya | 💻 Teknolojia | 🎓 Elimu | 🌍 Dunia | 🧮 Hesabu"
  );
}

const QUICK_REPLIES = [
  { emoji: "💳", label: "Malipo", query: "malipo" },
  { emoji: "📦", label: "Maagizo", query: "agizo" },
  { emoji: "🏪", label: "Duka", query: "duka" },
  { emoji: "🌾", label: "Kilimo", query: "kilimo" },
  { emoji: "🏥", label: "Afya", query: "afya" },
  { emoji: "💻", label: "Teknolojia", query: "internet" },
  { emoji: "🎓", label: "Elimu", query: "elimu" },
  { emoji: "🧮", label: "Hesabu", query: "25 * 40" },
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Karibu! Mimi ni Msaidizi wa CTM 🤖\n\nNinaweza kukusaidia kuhusu:\n💳 Malipo & Fedha\n📦 Maagizo\n🏪 Biashara\n🌾 Kilimo\n🏥 Afya\n💻 Teknolojia\n🌍 Habari za Dunia\n🧮 Hesabu (mfano: andika '250 * 3')\n\nUnauliza nini leo?",
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
    }, 700);
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
                width: "min(340px, calc(100vw - 32px))",
                height: "500px",
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
                    🤖
                  </span>
                  <div>
                    <p className="font-semibold text-sm leading-tight">
                      Msaidizi wa CTM
                    </p>
                    <p className="text-xs opacity-80">
                      CTM Smart Assistant · Online
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
                  ✕
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-3 py-3">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
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
                          🤖
                        </span>
                      )}
                      <div
                        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
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
                        🤖
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
                  placeholder="Andika swali lolote..."
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
                  ➤
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
            {open ? "✕" : "🤖"}
          </span>
          {!open && hasUnread && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </motion.button>
      </div>
    </>
  );
}
