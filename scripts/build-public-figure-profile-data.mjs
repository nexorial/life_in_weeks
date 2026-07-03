import fs from "node:fs/promises";
import path from "node:path";

const profileDir = "profiles";
const outputPath = "src/publicFigureProfiles.ts";

const categoryGroups = [
  {
    id: "tech-ai-internet",
    label: "Tech / AI / Internet",
    names: [
      "Steve Jobs",
      "Elon Musk",
      "Sam Altman",
      "Jensen Huang",
      "Mark Zuckerberg",
      "Jeff Bezos",
      "Bill Gates",
      "Peter Thiel",
      "Naval Ravikant",
      "Alex Karp",
      "Dario Amodei",
      "Sundar Pichai",
      "Jack Dorsey",
      "Vitalik Buterin"
    ]
  },
  {
    id: "business-money-power",
    label: "Business / Money / Power",
    names: [
      "John D. Rockefeller",
      "Warren Buffett",
      "Bernard Arnault",
      "Larry Ellison",
      "Oprah Winfrey",
      "Jamie Dimon",
      "Michael Bloomberg",
      "Masayoshi Son",
      "Anna Wintour",
      "Kim Kardashian"
    ]
  },
  {
    id: "politics-statecraft",
    label: "Politics / Statecraft",
    names: [
      "Benjamin Franklin",
      "Abraham Lincoln",
      "Winston Churchill",
      "Mao Zedong",
      "Vladimir Putin",
      "Donald Trump",
      "Barack Obama",
      "Xi Jinping",
      "Volodymyr Zelenskyy",
      "Benjamin Netanyahu",
      "Claudia Sheinbaum",
      "Alexandria Ocasio-Cortez",
      "Robert F. Kennedy Jr.",
      "Pope Leo XIV"
    ]
  },
  {
    id: "creators-streamers-internet",
    label: "Creators / Streamers / Internet Celebrities",
    names: [
      "MrBeast",
      "Kai Cenat",
      "IShowSpeed",
      "xQc",
      "Adin Ross",
      "Hasan Piker",
      "Pokimane",
      "Ninja",
      "Jynxzi",
      "CaseOh",
      "Markiplier",
      "Dhar Mann",
      "Charli D'Amelio",
      "Khaby Lame",
      "Alix Earle",
      "Logan Paul",
      "Jake Paul"
    ]
  },
  {
    id: "music-pop-culture",
    label: "Music / Pop Culture",
    names: [
      "Taylor Swift",
      "Kanye West",
      "Beyoncé",
      "Rihanna",
      "Bad Bunny",
      "Drake",
      "Kendrick Lamar",
      "Lady Gaga",
      "Madonna",
      "Michael Jackson",
      "Bob Dylan",
      "Tupac Shakur"
    ]
  },
  {
    id: "film-tv-comedy",
    label: "Film / TV / Comedy",
    names: [
      "Marilyn Monroe",
      "Tom Cruise",
      "Leonardo DiCaprio",
      "Dwayne Johnson",
      "Arnold Schwarzenegger",
      "Zendaya",
      "Jackie Chan",
      "Mr. Rogers",
      "Dave Chappelle",
      "Joe Rogan"
    ]
  },
  {
    id: "sports-competition",
    label: "Sports / Competition",
    names: [
      "Muhammad Ali",
      "Michael Jordan",
      "LeBron James",
      "Kobe Bryant",
      "Lionel Messi",
      "Cristiano Ronaldo",
      "Serena Williams",
      "Simone Biles",
      "Shohei Ohtani",
      "Caitlin Clark"
    ]
  },
  {
    id: "science-ideas-writing",
    label: "Science / Ideas / Writing",
    names: [
      "Albert Einstein",
      "Marie Curie",
      "Charles Darwin",
      "Nikola Tesla",
      "Stephen Hawking",
      "Richard Feynman",
      "Carl Sagan",
      "Yuval Noah Harari",
      "George Orwell"
    ]
  },
  {
    id: "spirituality-activism-society",
    label: "Spirituality / Activism / Society",
    names: ["Martin Luther King Jr.", "Mahatma Gandhi", "Malcolm X", "Nelson Mandela"]
  }
];

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

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function extractJson(text, file) {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${file}: missing JSON fence`);
  return JSON.parse(match[1]);
}

function inferDatePrecision(event) {
  if (event.datePrecision) return event.datePrecision;
  const label = event.dateLabel ?? "";
  if (/^\s*age\s+\d{1,3}\s*$/i.test(label)) return "age";
  if (new RegExp(`^(${monthNames.join("|")})\\s+\\d{4}$`).test(label)) return "month";
  if (/^\d{4}$/.test(label)) return "year";
  return label ? "year" : undefined;
}

function normalizeProfile(profile) {
  return {
    id: slugify(profile.name),
    ...profile,
    events: profile.events.map((event) => ({
      ...event,
      ...(inferDatePrecision(event) ? { datePrecision: inferDatePrecision(event) } : {})
    }))
  };
}

const files = await fs.readdir(profileDir);
const profilesByName = new Map();

for (const file of files.filter((item) => item.endsWith(".md"))) {
  const text = await fs.readFile(path.join(profileDir, file), "utf8");
  const profile = normalizeProfile(extractJson(text, file));
  profilesByName.set(profile.name, profile);
}

const groupedProfiles = categoryGroups.map((group) => {
  const profiles = group.names.map((name) => {
    const profile = profilesByName.get(name);
    if (!profile) throw new Error(`Missing profile for ${name}`);
    return profile;
  });

  return {
    id: group.id,
    label: group.label,
    profiles
  };
});

const expectedCount = categoryGroups.reduce((count, group) => count + group.names.length, 0);
const seenNames = new Set(groupedProfiles.flatMap((group) => group.profiles.map((profile) => profile.name)));
if (expectedCount !== 100 || seenNames.size !== 100) {
  throw new Error(`Expected 100 grouped profiles, got expected=${expectedCount} seen=${seenNames.size}`);
}

const moduleSource = `// Generated by scripts/build-public-figure-profile-data.mjs from profiles/*.md.
// Do not edit profile data here by hand; edit the source Markdown profile and regenerate.

type EventPrecision = "day" | "month" | "year" | "age";

type DevelopmentStage = {
  id: string;
  label: string;
  startDate: string;
  endDate?: string;
  color: string;
  filled: string;
  location: string;
  behavior: string;
};

type LifeEvent = {
  id: string;
  date: string;
  dateLabel?: string;
  datePrecision?: EventPrecision;
  stageId: string;
  message: string;
};

type PublicFigureProfile = {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  headline: string;
  subtitle: string;
  sourceNote: string;
  stages: DevelopmentStage[];
  events: LifeEvent[];
};

type PublicFigureProfileGroup = {
  id: string;
  label: string;
  profiles: PublicFigureProfile[];
};

export const publicFigureProfileGroups: PublicFigureProfileGroup[] = ${JSON.stringify(groupedProfiles, null, 2)};

export const publicFigureProfiles: PublicFigureProfile[] = publicFigureProfileGroups.flatMap((group) => group.profiles);
`;

await fs.writeFile(outputPath, moduleSource, "utf8");
console.log(`Wrote ${outputPath} with ${seenNames.size} profiles across ${groupedProfiles.length} groups.`);
