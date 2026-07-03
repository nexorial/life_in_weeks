import fs from "node:fs/promises";
import path from "node:path";

const expectedNames = [
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
  "Vitalik Buterin",
  "John D. Rockefeller",
  "Warren Buffett",
  "Bernard Arnault",
  "Larry Ellison",
  "Oprah Winfrey",
  "Jamie Dimon",
  "Michael Bloomberg",
  "Masayoshi Son",
  "Anna Wintour",
  "Kim Kardashian",
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
  "Pope Leo XIV",
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
  "Jake Paul",
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
  "Tupac Shakur",
  "Marilyn Monroe",
  "Tom Cruise",
  "Leonardo DiCaprio",
  "Dwayne Johnson",
  "Arnold Schwarzenegger",
  "Zendaya",
  "Jackie Chan",
  "Mr. Rogers",
  "Dave Chappelle",
  "Joe Rogan",
  "Muhammad Ali",
  "Michael Jordan",
  "LeBron James",
  "Kobe Bryant",
  "Lionel Messi",
  "Cristiano Ronaldo",
  "Serena Williams",
  "Simone Biles",
  "Shohei Ohtani",
  "Caitlin Clark",
  "Albert Einstein",
  "Marie Curie",
  "Charles Darwin",
  "Nikola Tesla",
  "Stephen Hawking",
  "Richard Feynman",
  "Carl Sagan",
  "Yuval Noah Harari",
  "George Orwell",
  "Martin Luther King Jr.",
  "Mahatma Gandhi",
  "Malcolm X",
  "Nelson Mandela"
];

function extractJson(text, file) {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${file}: missing JSON fence`);
  return JSON.parse(match[1]);
}

function validateDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateProfile(profile, file) {
  const errors = [];
  if (!expectedNames.includes(profile.name)) errors.push(`unexpected name ${profile.name}`);
  if (!validateDate(profile.birthDate)) errors.push("invalid birthDate");
  if (profile.deathDate && !validateDate(profile.deathDate)) errors.push("invalid deathDate");
  if (!Array.isArray(profile.stages) || profile.stages.length < 4 || profile.stages.length > 9) {
    errors.push(`invalid stage count ${profile.stages?.length}`);
  }
  if (!Array.isArray(profile.events) || profile.events.length < 8 || profile.events.length > 24) {
    errors.push(`invalid event count ${profile.events?.length}`);
  }

  const stageIds = new Set();
  for (const [index, stage] of (profile.stages ?? []).entries()) {
    if (!stage.id || stageIds.has(stage.id)) errors.push(`bad stage id at ${index}`);
    stageIds.add(stage.id);
    for (const field of ["label", "startDate", "location", "behavior"]) {
      if (!stage[field]) errors.push(`stage ${stage.id ?? index} missing ${field}`);
    }
    if (!validateDate(stage.startDate)) errors.push(`stage ${stage.id} bad startDate`);
    if (stage.endDate && !validateDate(stage.endDate)) errors.push(`stage ${stage.id} bad endDate`);
    if (stage.endDate && stage.endDate <= stage.startDate) errors.push(`stage ${stage.id} end before start`);
    for (const field of ["color", "filled"]) {
      if (stage[field] && !/^#[0-9a-fA-F]{6}$/.test(stage[field])) errors.push(`stage ${stage.id} bad ${field}`);
    }
  }

  let previous = "";
  for (const [index, event] of (profile.events ?? []).entries()) {
    for (const field of ["id", "date", "stageId", "message"]) {
      if (!event[field]) errors.push(`event ${index} missing ${field}`);
    }
    if (!validateDate(event.date)) errors.push(`event ${event.id} bad date`);
    if (!stageIds.has(event.stageId)) errors.push(`event ${event.id} bad stageId`);
    if (event.message.length > 120) errors.push(`event ${event.id} too long`);
    if (event.date < profile.birthDate) errors.push(`event ${event.id} before birth`);
    if (profile.deathDate && event.date > profile.deathDate) errors.push(`event ${event.id} after death`);
    if (previous && event.date < previous) errors.push(`event ${event.id} out of order`);
    previous = event.date;
  }

  return errors.map((error) => `${file}: ${error}`);
}

const files = (await fs.readdir("profiles"))
  .filter((file) => file.endsWith(".md"))
  .sort();

const profiles = [];
const errors = [];
for (const file of files) {
  const text = await fs.readFile(path.join("profiles", file), "utf8");
  try {
    const profile = extractJson(text, file);
    profiles.push({ file, profile });
    errors.push(...validateProfile(profile, file));
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

const seenNames = new Map(profiles.map(({ file, profile }) => [profile.name, file]));
for (const name of expectedNames) {
  if (!seenNames.has(name)) errors.push(`missing expected profile ${name}`);
}

for (const { file, profile } of profiles) {
  if (profiles.filter((item) => item.profile.name === profile.name).length > 1) {
    errors.push(`duplicate profile ${profile.name} in ${file}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const eventCounts = profiles.map(({ profile }) => profile.events.length);
const stageCounts = profiles.map(({ profile }) => profile.stages.length);
console.log(
  JSON.stringify(
    {
      ok: true,
      files: files.length,
      expected: expectedNames.length,
      minEvents: Math.min(...eventCounts),
      maxEvents: Math.max(...eventCounts),
      minStages: Math.min(...stageCounts),
      maxStages: Math.max(...stageCounts)
    },
    null,
    2
  )
);
