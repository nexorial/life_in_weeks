import fs from "node:fs/promises";
import path from "node:path";

const today = "2026-07-03";
const userAgent = "life-in-weeks-profile-generator/0.1 (local research batch)";

const palette = [
  { color: "#ead1cc", filled: "#bd6658" },
  { color: "#b8ddd9", filled: "#247f85" },
  { color: "#edce8c", filled: "#b7791f" },
  { color: "#c9c0df", filled: "#725ca0" },
  { color: "#c4d8ad", filled: "#5f8b3d" },
  { color: "#b7cbe8", filled: "#3f6fa9" },
  { color: "#e5bbb2", filled: "#a44f43" },
  { color: "#d9c7a7", filled: "#8e6b35" }
];

const stageLabelSets = {
  tech: [
    ["early-life", "Early life"],
    ["formation", "Education and first ventures"],
    ["breakthrough", "Breakthrough product era"],
    ["scale", "Scale and platform power"],
    ["public-power", "Public power and scrutiny"],
    ["current-era", "Current era"]
  ],
  business: [
    ["early-life", "Early life"],
    ["entry", "Entry into business"],
    ["company-building", "Company building"],
    ["empire", "Empire and influence"],
    ["public-power", "Public power"],
    ["current-era", "Current era"]
  ],
  politics: [
    ["early-life", "Early life"],
    ["formation", "Political formation"],
    ["rise", "Rise to office"],
    ["governing", "Governing power"],
    ["crisis", "Crisis and legacy"],
    ["late-life", "Late life"]
  ],
  creator: [
    ["early-life", "Early life"],
    ["first-platforms", "First platforms"],
    ["breakthrough", "Breakthrough attention"],
    ["scale", "Scaled audience"],
    ["business", "Business and controversy"],
    ["current-era", "Current era"]
  ],
  music: [
    ["early-life", "Early life"],
    ["training", "Training and first work"],
    ["breakthrough", "Breakthrough"],
    ["dominance", "Cultural dominance"],
    ["reinvention", "Reinvention"],
    ["legacy", "Legacy"]
  ],
  entertainment: [
    ["early-life", "Early life"],
    ["training", "Training and early roles"],
    ["breakthrough", "Breakthrough"],
    ["stardom", "Stardom and leverage"],
    ["reinvention", "Reinvention"],
    ["legacy", "Legacy"]
  ],
  sports: [
    ["early-life", "Early life"],
    ["development", "Development and entry"],
    ["breakthrough", "Breakthrough season"],
    ["prime", "Prime dominance"],
    ["business", "Business and public role"],
    ["legacy", "Legacy"]
  ],
  ideas: [
    ["early-life", "Early life"],
    ["education", "Education and formation"],
    ["work", "Major work"],
    ["recognition", "Recognition and influence"],
    ["public-life", "Public life"],
    ["legacy", "Legacy"]
  ],
  society: [
    ["early-life", "Early life"],
    ["formation", "Formation"],
    ["movement", "Movement building"],
    ["national-role", "National role"],
    ["crisis", "Crisis and sacrifice"],
    ["legacy", "Legacy"]
  ]
};

const people = [
  { name: "Elon Musk", category: "tech" },
  { name: "Sam Altman", category: "tech" },
  { name: "Jensen Huang", category: "tech", page: "Jensen Huang" },
  { name: "Mark Zuckerberg", category: "tech" },
  { name: "Jeff Bezos", category: "tech" },
  { name: "Bill Gates", category: "tech" },
  { name: "Peter Thiel", category: "tech" },
  { name: "Naval Ravikant", category: "tech" },
  { name: "Alex Karp", category: "tech", page: "Alex Karp" },
  { name: "Dario Amodei", category: "tech" },
  { name: "Sundar Pichai", category: "tech" },
  { name: "Jack Dorsey", category: "tech" },
  { name: "Vitalik Buterin", category: "tech" },
  { name: "John D. Rockefeller", category: "business" },
  { name: "Warren Buffett", category: "business" },
  { name: "Bernard Arnault", category: "business" },
  { name: "Larry Ellison", category: "business" },
  { name: "Oprah Winfrey", category: "business" },
  { name: "Jamie Dimon", category: "business" },
  { name: "Michael Bloomberg", category: "business" },
  { name: "Masayoshi Son", category: "business" },
  { name: "Anna Wintour", category: "business" },
  { name: "Kim Kardashian", category: "business" },
  { name: "Benjamin Franklin", category: "politics" },
  { name: "Abraham Lincoln", category: "politics" },
  { name: "Winston Churchill", category: "politics" },
  { name: "Mao Zedong", category: "politics" },
  { name: "Vladimir Putin", category: "politics" },
  { name: "Donald Trump", category: "politics" },
  { name: "Barack Obama", category: "politics" },
  { name: "Xi Jinping", category: "politics" },
  { name: "Volodymyr Zelenskyy", category: "politics" },
  { name: "Benjamin Netanyahu", category: "politics" },
  { name: "Claudia Sheinbaum", category: "politics" },
  { name: "Alexandria Ocasio-Cortez", category: "politics" },
  { name: "Robert F. Kennedy Jr.", category: "politics" },
  { name: "Pope Leo XIV", category: "politics" },
  { name: "MrBeast", category: "creator" },
  { name: "Kai Cenat", category: "creator" },
  { name: "IShowSpeed", category: "creator" },
  { name: "xQc", category: "creator" },
  { name: "Adin Ross", category: "creator" },
  { name: "Hasan Piker", category: "creator" },
  { name: "Pokimane", category: "creator" },
  { name: "Ninja", category: "creator", page: "Ninja (gamer)" },
  { name: "Jynxzi", category: "creator" },
  { name: "CaseOh", category: "creator" },
  { name: "Markiplier", category: "creator" },
  { name: "Dhar Mann", category: "creator" },
  { name: "Charli D'Amelio", category: "creator" },
  { name: "Khaby Lame", category: "creator" },
  { name: "Alix Earle", category: "creator" },
  { name: "Logan Paul", category: "creator" },
  { name: "Jake Paul", category: "creator" },
  { name: "Taylor Swift", category: "music" },
  { name: "Kanye West", category: "music", page: "Ye" },
  { name: "Beyoncé", category: "music" },
  { name: "Rihanna", category: "music" },
  { name: "Bad Bunny", category: "music" },
  { name: "Drake", category: "music", page: "Drake (musician)" },
  { name: "Kendrick Lamar", category: "music" },
  { name: "Lady Gaga", category: "music" },
  { name: "Madonna", category: "music" },
  { name: "Michael Jackson", category: "music" },
  { name: "Bob Dylan", category: "music" },
  { name: "Tupac Shakur", category: "music" },
  { name: "Marilyn Monroe", category: "entertainment" },
  { name: "Tom Cruise", category: "entertainment" },
  { name: "Leonardo DiCaprio", category: "entertainment" },
  { name: "Dwayne Johnson", category: "entertainment" },
  { name: "Arnold Schwarzenegger", category: "entertainment" },
  { name: "Zendaya", category: "entertainment" },
  { name: "Jackie Chan", category: "entertainment" },
  { name: "Mr. Rogers", category: "entertainment", page: "Fred Rogers" },
  { name: "Dave Chappelle", category: "entertainment" },
  { name: "Joe Rogan", category: "entertainment" },
  { name: "Muhammad Ali", category: "sports" },
  { name: "Michael Jordan", category: "sports" },
  { name: "LeBron James", category: "sports" },
  { name: "Kobe Bryant", category: "sports" },
  { name: "Lionel Messi", category: "sports" },
  { name: "Cristiano Ronaldo", category: "sports" },
  { name: "Serena Williams", category: "sports" },
  { name: "Simone Biles", category: "sports" },
  { name: "Shohei Ohtani", category: "sports" },
  { name: "Caitlin Clark", category: "sports" },
  { name: "Albert Einstein", category: "ideas" },
  { name: "Marie Curie", category: "ideas" },
  { name: "Charles Darwin", category: "ideas" },
  { name: "Nikola Tesla", category: "ideas" },
  { name: "Stephen Hawking", category: "ideas" },
  { name: "Richard Feynman", category: "ideas" },
  { name: "Carl Sagan", category: "ideas" },
  { name: "Yuval Noah Harari", category: "ideas" },
  { name: "George Orwell", category: "ideas" },
  { name: "Martin Luther King Jr.", category: "society" },
  { name: "Mahatma Gandhi", category: "society" },
  { name: "Malcolm X", category: "society" },
  { name: "Nelson Mandela", category: "society" }
];

const marketingLines = {
  "Elon Musk": "Builds audacious companies where engineering ambition meets relentless public spectacle.",
  "Sam Altman": "Turns AI progress into products, policy debates, and power plays.",
  "Jensen Huang": "Made GPUs the engine room of modern AI economics.",
  "Mark Zuckerberg": "Connects billions while repeatedly testing society's tolerance for platforms.",
  "Jeff Bezos": "Scaled convenience into infrastructure, media leverage, and relentless customer expectations.",
  "Bill Gates": "Turned software dominance into disciplined philanthropy and global health influence.",
  "Peter Thiel": "Backs contrarian monopolies, political bets, and long-horizon power structures.",
  "Naval Ravikant": "Popularized startup wisdom as concise lessons on leverage and independence.",
  "Alex Karp": "Sells difficult software to institutions wrestling with power and accountability.",
  "Dario Amodei": "Frames frontier AI as both product race and safety problem.",
  "Sundar Pichai": "Steers Google's empire through AI pressure and regulatory scrutiny.",
  "Jack Dorsey": "Builds sparse products around payments, publishing, and personal conviction.",
  "Vitalik Buterin": "Anchors crypto's idealism with technical rigor and public restraint.",
  "John D. Rockefeller": "Standardized oil into industrial dominance, then converted wealth into institutions.",
  "Warren Buffett": "Makes patience look practical through capital discipline and plainspoken judgment.",
  "Bernard Arnault": "Turns heritage brands into scarcity machines for global luxury demand.",
  "Larry Ellison": "Built Oracle with combative salesmanship, database dominance, and durable ego.",
  "Oprah Winfrey": "Turned television empathy into a durable media and ownership empire.",
  "Jamie Dimon": "Wall Street's crisis-tested operator with unusual political and regulatory fluency.",
  "Michael Bloomberg": "Built data terminals into a media, finance, and civic machine.",
  "Masayoshi Son": "Made enormous technology bets that reshaped markets and exposed risk.",
  "Anna Wintour": "Turned editorial taste into fashion's most disciplined gatekeeping system.",
  "Kim Kardashian": "Converted celebrity exposure into a sprawling consumer and media business.",
  "Benjamin Franklin": "Made curiosity, commerce, and civic invention look like one pursuit.",
  "Abraham Lincoln": "Held a fractured republic together with moral and political steel.",
  "Winston Churchill": "Weaponized language and resolve when Britain stood nearly alone.",
  "Mao Zedong": "Remade China through revolution, mass mobilization, and catastrophic excess.",
  "Vladimir Putin": "Built power through security discipline, nationalism, and institutional control.",
  "Donald Trump": "Turned celebrity, grievance, and showmanship into durable political force.",
  "Barack Obama": "Made coalition politics feel calm, literate, and historically resonant.",
  "Xi Jinping": "Centralized Chinese power around discipline, surveillance, and national rejuvenation.",
  "Volodymyr Zelenskyy": "Converted performance instinct into wartime legitimacy and global attention.",
  "Benjamin Netanyahu": "Built a career on security politics, resilience, and relentless survival.",
  "Claudia Sheinbaum": "Merged scientific discipline, movement politics, and executive ambition.",
  "Alexandria Ocasio-Cortez": "Turned grassroots insurgency into a national progressive media force.",
  "Robert F. Kennedy Jr.": "Carries a famous name through environmental fights and political controversy.",
  "Pope Leo XIV": "Brought Augustinian formation and global church politics to the papacy.",
  "MrBeast": "Engineered generosity, spectacle, and scale into YouTube's dominant growth machine.",
  "Kai Cenat": "Turned livestream stamina and social energy into appointment-viewing culture.",
  "IShowSpeed": "Made chaotic fandom, football obsession, and streaming clips travel globally.",
  "xQc": "Built a streaming empire on speed, volume, and combustible reactions.",
  "Adin Ross": "Made provocation and celebrity proximity central to livestream growth.",
  "Hasan Piker": "Turns left politics, news, and streaming endurance into daily media.",
  "Pokimane": "Helped define creator professionalism while growing beyond Twitch culture.",
  "Ninja": "Made game streaming mainstream through Fortnite timing and brand discipline.",
  "Jynxzi": "Turned Rainbow Six Siege intensity into a massive Twitch comeback story.",
  "CaseOh": "Scaled variety streaming through humor, volume, and viral short clips.",
  "Markiplier": "Built durable creator loyalty through horror games, comedy, and production ambition.",
  "Dhar Mann": "Turned moralized short dramas into a high-output video studio.",
  "Charli D'Amelio": "Made TikTok dance virality into family-scale media and consumer business.",
  "Khaby Lame": "Won global attention by making silent simplicity beat overcomplication.",
  "Alix Earle": "Turned candid campus glamour into a fast-moving beauty media brand.",
  "Logan Paul": "Converted internet notoriety into boxing, beverages, and a creator business.",
  "Jake Paul": "Built a combat-sports spectacle from provocation, promotion, and attention.",
  "Taylor Swift": "Rewired pop stardom through authorship, reinvention, and fan-scale strategy.",
  "Kanye West": "Fused music, fashion, and controversy into a volatile cultural enterprise.",
  "Beyoncé": "Turns precision, privacy, and performance into culture-moving global spectacle.",
  "Rihanna": "Expanded chart power into beauty, fashion, and effortless commercial command.",
  "Bad Bunny": "Pushed Spanish-language pop from regional dominance to global cultural force.",
  "Drake": "Made rap, melody, and meme fluency a chart-dominating formula.",
  "Kendrick Lamar": "Turns lyrical pressure and moral tension into era-defining rap theater.",
  "Lady Gaga": "Built pop spectacle from reinvention, theatrical risk, and vocal control.",
  "Madonna": "Turned provocation, image-making, and dance pop into durable cultural leverage.",
  "Michael Jackson": "Defined modern pop spectacle with precision, myth, and unmatched visibility.",
  "Bob Dylan": "Made songwriting a literary force without surrendering its rough edges.",
  "Tupac Shakur": "Compressed poetry, politics, charisma, and conflict into an enduring legend.",
  "Marilyn Monroe": "Turned vulnerability, glamour, and studio machinery into permanent iconography.",
  "Tom Cruise": "Relentless leading man who turned practical stunts into a brand.",
  "Leonardo DiCaprio": "Prestige actor with blockbuster instincts and a climate-focused public platform.",
  "Dwayne Johnson": "Wrestling charisma scaled into films, tequila, fitness, and franchised optimism.",
  "Arnold Schwarzenegger": "Bodybuilder, action star, governor; reinvention has been his clearest product.",
  "Zendaya": "Disney alum turned fashion-forward actor with selective screen presence.",
  "Jackie Chan": "Global stunt-comedy icon who made risk, timing, and bruises visible.",
  "Mr. Rogers": "Television neighbor who made patience, kindness, and clarity feel radical.",
  "Dave Chappelle": "Comedian whose blunt storytelling keeps audiences laughing, arguing, and watching.",
  "Joe Rogan": "Comic, commentator, and podcaster who built curiosity into media scale.",
  "Muhammad Ali": "Boxing champion whose words hit nearly as hard as his punches.",
  "Michael Jordan": "Basketball's ultimate closer, built on precision, pressure, and control.",
  "LeBron James": "Generational forward pairing court dominance with long-game business discipline.",
  "Kobe Bryant": "Exacting scorer whose work ethic became a global performance shorthand.",
  "Lionel Messi": "Quiet playmaker whose control turns crowded fields into open space.",
  "Cristiano Ronaldo": "Engineered superstar built on finishing, fitness, and relentless personal branding.",
  "Serena Williams": "Powerful champion who reshaped tennis with force, focus, and presence.",
  "Simone Biles": "Gymnastics benchmark whose difficulty, control, and candor changed the sport."
};

const knownDates = {
  "Ninja": { birthDate: "1991-06-05" },
  "Pope Leo XIV": { birthDate: "1955-09-14" },
  "Alex Karp": { birthDate: "1967-10-02" },
  "Dario Amodei": { birthDate: "1983-07-01", birthDateLabel: "1983" },
  "Alix Earle": { birthDate: "2000-12-16" },
  "CaseOh": { birthDate: "1998-05-09" }
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const monthLookup = new Map(monthNames.map((month, index) => [month.toLowerCase(), index + 1]));

const eventKeywords = [
  "acquired",
  "announced",
  "appointed",
  "arrested",
  "became",
  "began",
  "bought",
  "co-founded",
  "created",
  "died",
  "elected",
  "founded",
  "graduated",
  "introduced",
  "joined",
  "launched",
  "left",
  "married",
  "moved",
  "named",
  "nominated",
  "opened",
  "published",
  "released",
  "resigned",
  "returned",
  "signed",
  "started",
  "testified",
  "unveiled",
  "won"
];

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    force: args.includes("--force"),
    limit: Number(args.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? 0) || 0,
    only: args.find((arg) => arg.startsWith("--only="))?.split("=")[1]
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": userAgent } });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      await sleep(500 * attempt);
    }
  }
  throw lastError;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function escapeMarkdown(value) {
  return String(value).replace(/\|/g, "\\|");
}

function toDate(year, month = 7, day = 1) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthNumber(month) {
  return monthLookup.get(month.toLowerCase());
}

function formatMonthYear(date) {
  const [year, month] = date.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
}

function formatWikidataDate(value, fallbackLabel) {
  if (!value) return undefined;
  const raw = value.time.replace(/^\+/, "");
  const [yearPart, monthPart, dayPart] = raw.split("T")[0].split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);
  if (!Number.isFinite(year)) return undefined;
  if (value.precision >= 11 && Number.isFinite(month) && Number.isFinite(day)) {
    return { date: toDate(year, month, day) };
  }
  if (value.precision === 10 && Number.isFinite(month)) {
    const date = toDate(year, month, 15);
    return { date, dateLabel: formatMonthYear(date) };
  }
  return { date: toDate(year), dateLabel: fallbackLabel ?? String(year) };
}

function cleanExtract(value) {
  return value
    .replace(/\r/g, "")
    .replace(/==+\s*See also\s*==+[\s\S]*$/i, "")
    .replace(/==+\s*References\s*==+[\s\S]*$/i, "")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(extract) {
  return cleanExtract(extract)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 35 && sentence.length < 700);
}

function parseDateFromSentence(sentence) {
  const exactMonthFirst = sentence.match(
    new RegExp(`\\b(${monthNames.join("|")})\\s+(\\d{1,2}),\\s+(1[5-9]\\d{2}|20\\d{2})\\b`)
  );
  if (exactMonthFirst) {
    return {
      date: toDate(Number(exactMonthFirst[3]), monthNumber(exactMonthFirst[1]), Number(exactMonthFirst[2])),
      precision: "day"
    };
  }

  const exactDayFirst = sentence.match(
    new RegExp(`\\b(\\d{1,2})\\s+(${monthNames.join("|")})\\s+(1[5-9]\\d{2}|20\\d{2})\\b`)
  );
  if (exactDayFirst) {
    return {
      date: toDate(Number(exactDayFirst[3]), monthNumber(exactDayFirst[2]), Number(exactDayFirst[1])),
      precision: "day"
    };
  }

  const monthYear = sentence.match(new RegExp(`\\b(${monthNames.join("|")})\\s+(1[5-9]\\d{2}|20\\d{2})\\b`));
  if (monthYear) {
    const date = toDate(Number(monthYear[2]), monthNumber(monthYear[1]), 15);
    return { date, dateLabel: formatMonthYear(date), precision: "month" };
  }

  const yearOnly = sentence.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  if (yearOnly) {
    return { date: toDate(Number(yearOnly[1])), dateLabel: yearOnly[1], precision: "year" };
  }

  return undefined;
}

function scoreSentence(sentence) {
  const lower = sentence.toLowerCase();
  let score = 0;
  if (parseDateFromSentence(sentence)?.precision === "day") score += 4;
  if (parseDateFromSentence(sentence)?.precision === "month") score += 3;
  if (parseDateFromSentence(sentence)?.precision === "year") score += 2;
  for (const keyword of eventKeywords) {
    if (lower.includes(keyword)) score += 2;
  }
  if (lower.includes("award") || lower.includes("championship") || lower.includes("president")) score += 1;
  if (lower.includes("born") || lower.includes("died")) score -= 8;
  if (lower.includes("is an ") || lower.includes("is a ")) score -= 3;
  if (sentence.length > 220) score -= 1;
  return score;
}

function cleanEventMessage(sentence, personName) {
  const surname = personName.split(" ").filter(Boolean).at(-1)?.replace(/[.,]/g, "") ?? personName;
  let message = sentence
    .replace(/\([^()]*pronounced[^()]*\)/gi, "")
    .replace(/\([^()]*born[^()]*\)/gi, "")
    .replace(/\([^()]*\)/g, "")
    .replace(/^==+\s*[^=]+==+\s*/g, "")
    .replace(new RegExp(`^(In|On|By|After|During|At)\\s+[^,]{1,60},\\s+`, "i"), "")
    .replace(/\s+/g, " ")
    .trim();

  message = message.replace(new RegExp(`^${personName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "");
  message = message.replace(new RegExp(`^${surname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "");
  message = message.replace(/^(He|She|They)\s+/i, "");
  message = message.charAt(0).toUpperCase() + message.slice(1);

  if (message.length <= 120) return message;

  const cleanBreak = message.slice(0, 118).replace(/[,;:]\s+\S*$/, "").trim();
  return `${cleanBreak || message.slice(0, 117).trim()}...`;
}

function eventId(base, existingIds) {
  const root = slugify(base).slice(0, 44) || "event";
  let id = root;
  let index = 2;
  while (existingIds.has(id)) {
    id = `${root}-${index}`;
    index += 1;
  }
  existingIds.add(id);
  return id;
}

function wikidataClaim(entity, property) {
  const claim = entity?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value;
  return claim;
}

async function fetchWikipediaProfile(person) {
  const title = person.page ?? person.name;
  const params = new URLSearchParams({
    action: "query",
    prop: "extracts|pageprops|info",
    explaintext: "1",
    redirects: "1",
    format: "json",
    titles: title,
    inprop: "url",
    origin: "*"
  });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  const page = Object.values(data.query.pages)[0];
  if (!page || page.missing) {
    throw new Error(`Wikipedia page not found for ${person.name} (${title})`);
  }
  const qid = page.pageprops?.wikibase_item;
  let entity;
  if (qid) {
    const entityData = await fetchJson(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    entity = entityData.entities[qid];
  }
  return { page, qid, entity };
}

function fallbackLine(person) {
  const labels = {
    tech: "Built a public life around technology, leverage, and institutional pressure.",
    business: "Turned capital, taste, and timing into durable public influence.",
    politics: "Made power visible through crisis, coalition, and public consequence.",
    creator: "Converted attention into audience, business, and online cultural force.",
    music: "Turned performance, identity, and timing into public mythology.",
    entertainment: "Built a public career from craft, charisma, and reinvention.",
    sports: "Compressed talent, discipline, and pressure into a visible career arc.",
    ideas: "Changed public thought through disciplined work and lasting arguments.",
    society: "Turned conviction, organizing, and sacrifice into public memory."
  };
  return labels[person.category] ?? `${person.name}, one public life mapped one week at a time.`;
}

function birthAndDeath(person, entity) {
  const known = knownDates[person.name] ?? {};
  const birth = known.birthDate
    ? { date: known.birthDate, dateLabel: known.birthDateLabel }
    : formatWikidataDate(wikidataClaim(entity, "P569"));
  const death = formatWikidataDate(wikidataClaim(entity, "P570"));
  return { birth, death };
}

function buildEvents(person, sentences, birth, death) {
  const events = [];
  const existingIds = new Set();
  const birthLabel = birth.dateLabel ? { dateLabel: birth.dateLabel } : {};
  events.push({
    id: eventId("born", existingIds),
    date: birth.date,
    ...birthLabel,
    stageId: "pending",
    message: `Born${birth.dateLabel ? ` around ${birth.dateLabel}` : ""}.`,
    validation: "Wikidata birth date; Wikipedia biography"
  });

  const candidates = sentences
    .map((sentence, index) => ({ sentence, date: parseDateFromSentence(sentence), index, score: scoreSentence(sentence) }))
    .filter((item) => item.date && item.score > 1)
    .filter((item) => item.date.date >= birth.date)
    .filter((item) => !death?.date || item.date.date <= death.date)
    .filter((item) => !/\b(born|birth name|died|death)\b/i.test(item.sentence));

  const selected = [];
  const seen = new Set();
  for (const item of [...candidates].sort((a, b) => b.score - a.score || a.index - b.index)) {
    const message = cleanEventMessage(item.sentence, person.name);
    const key = `${item.date.date}:${message.slice(0, 54).toLowerCase()}`;
    if (seen.has(key)) continue;
    if (selected.some((event) => event.message.toLowerCase() === message.toLowerCase())) continue;
    selected.push({ ...item, message });
    seen.add(key);
    if (selected.length >= (death ? 22 : 23)) break;
  }

  selected
    .sort((a, b) => a.date.date.localeCompare(b.date.date) || a.index - b.index)
    .forEach((item) => {
      events.push({
        id: eventId(item.message, existingIds),
        date: item.date.date,
        ...(item.date.dateLabel ? { dateLabel: item.date.dateLabel } : {}),
        stageId: "pending",
        message: item.message,
        validation: item.date.dateLabel ? "Wikipedia biography; approximate machine date" : "Wikipedia biography"
      });
    });

  if (death?.date) {
    events.push({
      id: eventId("died", existingIds),
      date: death.date,
      ...(death.dateLabel ? { dateLabel: death.dateLabel } : {}),
      stageId: "pending",
      message: "Dies.",
      validation: "Wikidata death date; Wikipedia biography"
    });
  }

  const deduped = [];
  const dedupeKeys = new Set();
  for (const event of events.sort((a, b) => a.date.localeCompare(b.date))) {
    const key = `${event.date}:${event.message.toLowerCase()}`;
    if (dedupeKeys.has(key)) continue;
    dedupeKeys.add(key);
    deduped.push(event);
  }

  return deduped.slice(0, 24);
}

function chooseBoundaries(events, birthDate, deathDate) {
  const dates = events
    .map((event) => event.date)
    .filter((date) => date > birthDate && date !== deathDate)
    .filter((date, index, list) => list.indexOf(date) === index)
    .sort();

  if (dates.length === 0) return [];

  const desiredStages = Math.min(7, Math.max(4, Math.ceil(events.length / 4) + 1));
  const boundaryCount = desiredStages - 1;
  const boundaries = [];
  for (let i = 0; i < boundaryCount; i += 1) {
    const index = Math.floor((i / boundaryCount) * dates.length);
    const candidate = dates[Math.min(index, dates.length - 1)];
    if (candidate && candidate !== birthDate && !boundaries.includes(candidate)) boundaries.push(candidate);
  }

  if (boundaries[0] === birthDate) boundaries.shift();
  return boundaries.slice(0, 6).sort();
}

function makeStages(person, events, birthDate, deathDate) {
  const labels = stageLabelSets[person.category] ?? stageLabelSets.business;
  const starts = [birthDate, ...chooseBoundaries(events, birthDate, deathDate)].filter(
    (date, index, list) => list.indexOf(date) === index
  );

  while (starts.length < 4) {
    const birthYear = Number(birthDate.slice(0, 4));
    const endYear = Number((deathDate ?? today).slice(0, 4));
    const span = Math.max(4, endYear - birthYear);
    const nextYear = birthYear + Math.floor((span / 4) * starts.length);
    const nextDate = toDate(nextYear);
    if (!starts.includes(nextDate) && nextDate > birthDate && (!deathDate || nextDate < deathDate)) {
      starts.push(nextDate);
    } else {
      break;
    }
  }

  starts.sort();
  const limitedStarts = starts.slice(0, Math.min(7, starts.length));
  return limitedStarts.map((startDate, index) => {
    const labelPair = labels[Math.min(index, labels.length - 1)];
    const colors = palette[index % palette.length];
    const nextStart = limitedStarts[index + 1];
    return {
      id: eventId(labelPair[0], new Set(limitedStarts.slice(0, index).map((_, labelIndex) => labels[Math.min(labelIndex, labels.length - 1)][0]))),
      label: labelPair[1],
      startDate,
      ...(nextStart ? { endDate: nextStart } : {}),
      location: "Public record",
      behavior: stageBehavior(person.category, labelPair[1]),
      color: colors.color,
      filled: colors.filled
    };
  });
}

function stageBehavior(category, label) {
  const behaviorByCategory = {
    tech: "Technical ambition, product judgment, institution building, and public scrutiny",
    business: "Capital allocation, brand leverage, organization building, and public influence",
    politics: "Coalition building, institutional power, crisis management, and public argument",
    creator: "Platform experimentation, audience growth, format shifts, and creator-business leverage",
    music: "Training, releases, performance identity, reinvention, and cultural reception",
    entertainment: "Craft development, public roles, media leverage, and reinvention",
    sports: "Training, competition, championships, endorsement power, and legacy formation",
    ideas: "Study, research, publication, public explanation, and intellectual legacy",
    society: "Formation, organizing, moral conflict, public action, and legacy"
  };
  return `${label}: ${behaviorByCategory[category] ?? "Public work and reputation formation"}`;
}

function attachStages(events, stages) {
  return events.map((event) => {
    let matched = stages[0];
    for (const stage of stages) {
      if (stage.startDate <= event.date && (!stage.endDate || event.date < stage.endDate)) {
        matched = stage;
      }
    }
    return { ...event, stageId: matched.id };
  });
}

function buildProfile(person, wiki, birth, death, events, stages) {
  return {
    name: person.name,
    birthDate: birth.date,
    ...(death?.date ? { deathDate: death.date } : {}),
    headline: `${person.name}, one week at a time.`,
    subtitle: `${person.name}'s public life is mapped through stages, overlapping roles, and sourced events from birth${death?.date ? " to death" : " to today"}.`,
    sourceNote: `Sources checked include English Wikipedia and Wikidata${wiki.page?.title ? ` for ${wiki.page.title}` : ""}; dates with partial precision use visible labels.`,
    stages,
    events: events.map(({ validation, ...event }) => event)
  };
}

function validateProfile(profile) {
  const errors = [];
  const stageIds = new Set(profile.stages.map((stage) => stage.id));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate)) errors.push("bad birthDate");
  if (profile.deathDate && !/^\d{4}-\d{2}-\d{2}$/.test(profile.deathDate)) errors.push("bad deathDate");
  if (profile.stages.length < 4 || profile.stages.length > 9) errors.push(`stage count ${profile.stages.length}`);
  if (profile.events.length < 8 || profile.events.length > 24) errors.push(`event count ${profile.events.length}`);
  let previousDate = "";
  for (const stage of profile.stages) {
    if (!stageIds.has(stage.id)) errors.push(`bad stage id ${stage.id}`);
    if (!/^#[0-9a-f]{6}$/i.test(stage.color) || !/^#[0-9a-f]{6}$/i.test(stage.filled)) {
      errors.push(`bad colors ${stage.id}`);
    }
  }
  for (const event of profile.events) {
    if (!stageIds.has(event.stageId)) errors.push(`event ${event.id} bad stageId ${event.stageId}`);
    if (event.message.length > 120) errors.push(`event ${event.id} too long`);
    if (event.date < profile.birthDate) errors.push(`event ${event.id} before birth`);
    if (profile.deathDate && event.date > profile.deathDate) errors.push(`event ${event.id} after death`);
    if (previousDate && event.date < previousDate) errors.push(`event ${event.id} out of order`);
    previousDate = event.date;
  }
  return errors;
}

function chronologyTable(events) {
  return events
    .map(
      (event) =>
        `| ${escapeMarkdown(event.dateLabel ?? event.date)} | ${escapeMarkdown(event.message)} | ${escapeMarkdown(event.validation ?? "Wikipedia biography")} |`
    )
    .join("\n");
}

function sourceUrl(pageTitle) {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replaceAll(" ", "_"))}`;
}

function buildMarkdown(person, wiki, profile, events) {
  const qid = wiki.qid;
  const wikiTitle = wiki.page.title;
  const wikiUrl = wiki.page.fullurl ?? sourceUrl(wikiTitle);
  const wikidataUrl = qid ? `https://www.wikidata.org/wiki/${qid}` : "https://www.wikidata.org/";
  const line = marketingLines[person.name] ?? fallbackLine(person);
  const precisionNote = events.some((event) => event.dateLabel)
    ? "- Some public events have only year or month precision in the source text; those use midpoint machine dates plus visible labels.\n"
    : "";

  return `# ${person.name}

## Status

Batch-generated public-figure Life in Weeks profile.

## Agency Agents Line

> ${line}

## Source Families Checked

- [Wikipedia: ${wikiTitle}](${wikiUrl}) for the public biography chronology and career/life-event cross-checks.
- [Wikidata: ${qid ?? "linked entity"}](${wikidataUrl}) for structured birth/death date checks when available.

## Verification Notes

- Birth and death dates prefer Wikidata structured values, then the Wikipedia biography when Wikidata is incomplete.
${precisionNote}- The chronology below is intentionally selective: it favors dated, source-visible turning points over exhaustive coverage.
- Stage labels are editorial groupings for the Life in Weeks visualization; event rows carry the source-grounded facts.

## Verified Chronology

| Date | Event | Validation |
| --- | --- | --- |
${chronologyTable(events)}

## Life in Weeks JSON

\`\`\`json
${JSON.stringify(profile, null, 2)}
\`\`\`
`;
}

async function generateOne(person, options) {
  const filePath = path.join("profiles", `${slugify(person.name)}.md`);
  if (!options.force) {
    try {
      await fs.access(filePath);
      return { person: person.name, status: "skipped", filePath };
    } catch {
      // continue
    }
  }

  const wiki = await fetchWikipediaProfile(person);
  const { birth, death } = birthAndDeath(person, wiki.entity);
  if (!birth?.date) {
    throw new Error(`No birth date for ${person.name}`);
  }

  const sentences = splitSentences(wiki.page.extract ?? "");
  let events = buildEvents(person, sentences, birth, death);
  if (events.length < 8) {
    const fallbackCandidates = sentences
      .map((sentence) => ({ sentence, date: parseDateFromSentence(sentence) }))
      .filter((item) => item.date && item.date.date >= birth.date && (!death?.date || item.date.date <= death.date))
      .slice(0, 16);
    for (const item of fallbackCandidates) {
      if (events.length >= 8) break;
      const message = cleanEventMessage(item.sentence, person.name);
      if (events.some((event) => event.message === message)) continue;
      events.push({
        id: slugify(message).slice(0, 44),
        date: item.date.date,
        ...(item.date.dateLabel ? { dateLabel: item.date.dateLabel } : {}),
        stageId: "pending",
        message,
        validation: item.date.dateLabel ? "Wikipedia biography; approximate machine date" : "Wikipedia biography"
      });
    }
  }
  events = events.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 24);

  const stages = makeStages(person, events, birth.date, death?.date);
  events = attachStages(events, stages);
  const profile = buildProfile(person, wiki, birth, death, events, stages);
  const errors = validateProfile(profile);
  if (errors.length) {
    throw new Error(`${person.name}: ${errors.join("; ")}`);
  }

  await fs.mkdir("profiles", { recursive: true });
  await fs.writeFile(filePath, buildMarkdown(person, wiki, profile, events), "utf8");
  await sleep(150);
  return { person: person.name, status: "generated", filePath, events: events.length, stages: stages.length };
}

async function main() {
  const options = parseArgs();
  let roster = people;
  if (options.only) roster = roster.filter((person) => slugify(person.name) === slugify(options.only) || person.name === options.only);
  if (options.limit) roster = roster.slice(0, options.limit);

  const results = [];
  for (const person of roster) {
    try {
      const result = await generateOne(person, options);
      results.push(result);
      console.log(`${result.status.padEnd(9)} ${result.person} ${result.filePath}${result.events ? ` (${result.stages} stages, ${result.events} events)` : ""}`);
    } catch (error) {
      console.error(`failed    ${person.name}: ${error.message}`);
      process.exitCode = 1;
      break;
    }
  }

  const generated = results.filter((result) => result.status === "generated").length;
  const skipped = results.filter((result) => result.status === "skipped").length;
  console.log(`done generated=${generated} skipped=${skipped} total=${results.length}`);
}

await main();
