import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const markdownPath = join(repoRoot, "marketing", "twitter-100-posts-2026-07-03.md");
const outDir = join(repoRoot, "marketing", "assets", "twitter-creative-2026-07-03");
const manifestPath = join(repoRoot, "marketing", "twitter-creative-assets-2026-07-03.md");
const port = Number(process.env.LIFE_WEEKS_ASSET_PORT ?? 5193);
const chromePort = Number(process.env.LIFE_WEEKS_CHROME_PORT ?? 9333);
const siteUrl = `http://127.0.0.1:${port}/life/`;

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

const publicProfiles = {
  "046": {
    name: "Steve Jobs",
    birthDate: "1955-02-24",
    deathDate: "2011-10-05",
    headline: "Steve Jobs, one week at a time.",
    subtitle: "A public-history grid showing Apple, NeXT, Pixar, the return to Apple, and product-era milestones.",
    sourceNote: "Illustrative public-history profile from widely published biography and company milestone dates; no endorsement implied.",
    stages: [
      stage("early-life", "Early life / California", "1955-02-24", "1972-09-01", 0, "California", "Family, school, electronics, design exposure"),
      stage("reed-india", "Reed / India / Atari", "1972-09-01", "1976-04-01", 1, "Oregon / India / California", "Experimentation, calligraphy, early work"),
      stage("apple-first", "Apple founding era", "1976-04-01", "1985-09-17", 2, "Cupertino", "Company building and personal-computer launches"),
      stage("next-pixar", "NeXT / Pixar", "1985-09-17", "1997-02-07", 3, "California", "Rebuilding, animation, operating-system work"),
      stage("apple-return", "Apple return", "1997-02-07", "2007-06-29", 4, "Cupertino", "Focus, design, iMac, iPod, retail"),
      stage("iphone-era", "iPhone era", "2007-06-29", "2011-10-05", 5, "Cupertino", "Mobile computing and final product cycle")
    ],
    events: [
      event("born", "1955-02-24", "early-life", "Born in San Francisco."),
      event("reed", "1972-09-01", "reed-india", "Starts at Reed College, later audits classes including calligraphy.", "1972"),
      event("apple-founded", "1976-04-01", "apple-first", "Apple is founded with Steve Wozniak and Ronald Wayne."),
      event("macintosh", "1984-01-24", "apple-first", "Apple introduces the Macintosh."),
      event("leaves-apple", "1985-09-17", "next-pixar", "Leaves Apple and begins the NeXT chapter.", "1985"),
      event("pixar-toy-story", "1995-11-22", "next-pixar", "Toy Story opens and Pixar becomes a public company."),
      event("returns", "1997-02-07", "apple-return", "Returns to Apple after the NeXT acquisition closes."),
      event("ipod", "2001-10-23", "apple-return", "Apple introduces iPod."),
      event("iphone", "2007-06-29", "iphone-era", "The first iPhone goes on sale."),
      event("death", "2011-10-05", "iphone-era", "Dies in Palo Alto.")
    ]
  },
  "047": companyProfile("SpaceX", "2002-03-14", "SpaceX from founding to launch systems, Dragon, Starship tests, and reusable-flight milestones.", [
    ["founding", "Founding", "2002-03-14", "2008-09-28", "Company formation and early Falcon 1 attempts"],
    ["falcon-era", "Falcon 1 / Falcon 9", "2008-09-28", "2012-05-25", "First orbit and Falcon 9 buildout"],
    ["dragon", "Dragon / station flights", "2012-05-25", "2015-12-21", "Cargo flights and operational cadence"],
    ["reuse", "Reusable rockets", "2015-12-21", "2020-05-30", "Landing, reuse, launch cadence"],
    ["crew-starship", "Crew / Starship", "2020-05-30", "", "Crewed flight and Starship development"]
  ], [
    ["founding", "2002-03-14", "founding", "SpaceX is founded.", "2002"],
    ["falcon1", "2008-09-28", "falcon-era", "Falcon 1 reaches orbit on flight 4."],
    ["falcon9", "2010-06-04", "falcon-era", "Falcon 9 launches successfully for the first time."],
    ["dragon-iss", "2012-05-25", "dragon", "Dragon berths with the International Space Station."],
    ["landing", "2015-12-21", "reuse", "Falcon 9 first stage lands after orbital launch."],
    ["falcon-heavy", "2018-02-06", "reuse", "Falcon Heavy demo launches."],
    ["crew", "2020-05-30", "crew-starship", "Demo-2 launches astronauts to orbit."],
    ["starship", "2023-04-20", "crew-starship", "First integrated Starship flight test launches."]
  ]),
  "048": {
    name: "Elon Musk",
    birthDate: "1971-06-28",
    headline: "Elon Musk, one week at a time.",
    subtitle: "A neutral public-history grid for companies, launches, acquisitions, and visible career pivots.",
    sourceNote: "Illustrative public-history profile from public company and biography timelines; no endorsement implied.",
    stages: [
      stage("early-life", "Early life / South Africa", "1971-06-28", "1989-06-01", 0, "South Africa", "School, computing, early entrepreneurship"),
      stage("canada-us", "Canada / university", "1989-06-01", "1995-01-01", 1, "Canada / United States", "Migration, study, network building"),
      stage("zip2-paypal", "Zip2 / PayPal", "1995-01-01", "2002-10-03", 2, "Silicon Valley", "Internet startups and payments"),
      stage("spacex-tesla", "SpaceX / Tesla buildout", "2002-03-14", "2016-07-20", 3, "California", "Hard-tech company building"),
      stage("public-tech", "Public tech figure", "2016-07-20", "2022-10-27", 4, "Global", "Transport, energy, AI, public markets"),
      stage("x-ai-era", "X / AI era", "2022-10-27", "", 5, "Global", "Platform ownership, AI, robotics, space")
    ],
    events: [
      event("born", "1971-06-28", "early-life", "Born in Pretoria, South Africa."),
      event("canada", "1989-06-01", "canada-us", "Moves to Canada before studying in North America.", "1989"),
      event("zip2", "1995-01-01", "zip2-paypal", "Co-founds Zip2.", "1995"),
      event("paypal-sale", "2002-10-03", "zip2-paypal", "eBay completes acquisition of PayPal."),
      event("spacex", "2002-03-14", "spacex-tesla", "SpaceX is founded.", "2002"),
      event("tesla", "2004-02-01", "spacex-tesla", "Leads Tesla's Series A investment and joins as chair.", "2004"),
      event("falcon1", "2008-09-28", "spacex-tesla", "Falcon 1 reaches orbit."),
      event("model3", "2016-03-31", "public-tech", "Tesla unveils Model 3."),
      event("twitter", "2022-10-27", "x-ai-era", "Completes acquisition of Twitter."),
      event("xai", "2023-07-12", "x-ai-era", "xAI is announced.")
    ]
  },
  "049": companyProfile("Apple", "1976-04-01", "Apple as a company-life grid, with product eras shown as chapters rather than logos.", [
    ["garage", "Founding / Apple II", "1976-04-01", "1984-01-24", "Early personal-computer company building"],
    ["mac", "Macintosh era", "1984-01-24", "1997-02-07", "Mac, leadership churn, NeXT return setup"],
    ["return", "Return to focus", "1997-02-07", "2001-10-23", "iMac, retail, operating-system reset"],
    ["ipod-iphone", "iPod / iPhone", "2001-10-23", "2010-04-03", "Consumer-device expansion"],
    ["post-pc", "iPad / services / silicon", "2010-04-03", "", "Post-PC products, services, Apple Silicon"]
  ], [
    ["founded", "1976-04-01", "garage", "Apple Computer is founded."],
    ["apple2", "1977-06-10", "garage", "Apple II goes on sale.", "1977"],
    ["mac", "1984-01-24", "mac", "Macintosh is introduced."],
    ["jobs-return", "1997-02-07", "return", "NeXT acquisition brings Steve Jobs back to Apple."],
    ["ipod", "2001-10-23", "ipod-iphone", "iPod is introduced."],
    ["iphone", "2007-06-29", "ipod-iphone", "The first iPhone goes on sale."],
    ["ipad", "2010-04-03", "post-pc", "The first iPad goes on sale."],
    ["silicon", "2020-11-10", "post-pc", "Apple announces the first M1 Macs."]
  ]),
  "050": companyProfile("Grand Theft Auto Series", "1997-10-21", "A game-series chart from the first GTA release to the long wait for GTA VI.", [
    ["origins", "2D origins", "1997-10-21", "2001-10-22", "Top-down crime sandbox origins"],
    ["3d", "3D breakout", "2001-10-22", "2008-04-29", "GTA III, Vice City, San Andreas"],
    ["hd", "HD era", "2008-04-29", "2013-09-17", "GTA IV and expansion years"],
    ["online", "GTA V / Online", "2013-09-17", "", "Long-tail online platform and GTA VI anticipation"]
  ], [
    ["gta1", "1997-10-21", "origins", "The first Grand Theft Auto is released.", "1997"],
    ["gta3", "2001-10-22", "3d", "GTA III releases and shifts the series into 3D."],
    ["vice-city", "2002-10-29", "3d", "Vice City releases."],
    ["san-andreas", "2004-10-26", "3d", "San Andreas releases."],
    ["gta4", "2008-04-29", "hd", "GTA IV releases."],
    ["gta5", "2013-09-17", "online", "GTA V releases."],
    ["online", "2013-10-01", "online", "GTA Online launches."],
    ["trailer", "2023-12-05", "online", "Rockstar publishes the first GTA VI trailer."]
  ]),
  "051": companyProfile("Minecraft", "2009-05-17", "Minecraft as an internet-age grid: public alpha, 1.0, acquisition, and long community life.", [
    ["classic", "Classic / alpha", "2009-05-17", "2011-11-18", "Public builds, survival mode, community growth"],
    ["release", "1.0 / early boom", "2011-11-18", "2014-09-15", "Official release and global growth"],
    ["microsoft", "Microsoft era", "2014-09-15", "2020-05-26", "Acquisition and cross-platform expansion"],
    ["modern", "Modern updates", "2020-05-26", "", "Long-running updates and creator ecosystem"]
  ], [
    ["classic", "2009-05-17", "classic", "Minecraft classic is first made public.", "2009"],
    ["alpha", "2010-06-30", "classic", "Alpha period begins.", "2010"],
    ["release", "2011-11-18", "release", "Minecraft 1.0 officially releases."],
    ["microsoft", "2014-09-15", "microsoft", "Microsoft announces agreement to acquire Mojang."],
    ["bedrock", "2017-09-20", "microsoft", "Better Together update unifies many platforms."],
    ["nether", "2020-06-23", "modern", "Nether Update releases."],
    ["caves", "2021-11-30", "modern", "Caves & Cliffs Part II releases."],
    ["fifteen", "2024-05-17", "modern", "Minecraft marks 15 years since public release.", "2024"]
  ]),
  "052": companyProfile("Twitter / X", "2006-03-21", "Twitter/X as a teenage platform: first tweet, public company years, acquisition, and rebrand.", [
    ["birth", "Prototype / launch", "2006-03-21", "2010-04-14", "First tweet, public launch, early growth"],
    ["platform", "Platform growth", "2010-04-14", "2013-11-07", "Mobile, media, developer ecosystem"],
    ["public-company", "Public company", "2013-11-07", "2022-10-27", "Public market platform era"],
    ["x-era", "X era", "2022-10-27", "", "Ownership change, rebrand, product changes"]
  ], [
    ["first-tweet", "2006-03-21", "birth", "Jack Dorsey sends the first tweet."],
    ["public", "2006-07-15", "birth", "Twitter opens to the public.", "2006"],
    ["new-twitter", "2010-04-14", "platform", "Twitter begins a major platform growth era.", "2010"],
    ["ipo", "2013-11-07", "public-company", "Twitter becomes a public company."],
    ["spaces", "2020-12-17", "public-company", "Twitter Spaces begins rolling out.", "2020"],
    ["acquisition", "2022-10-27", "x-era", "Elon Musk completes acquisition of Twitter."],
    ["rebrand", "2023-07-24", "x-era", "Twitter rebrands as X."],
    ["today", "2026-07-03", "x-era", "The platform continues changing in public.", "Today"]
  ]),
  "053": companyProfile("OpenAI", "2015-12-11", "OpenAI and ChatGPT compressed into a young company-life grid.", [
    ["lab", "Research lab", "2015-12-11", "2019-03-11", "Research agenda and early systems"],
    ["capped-profit", "Capped-profit / API", "2019-03-11", "2022-11-30", "Commercial structure and API products"],
    ["chatgpt", "ChatGPT era", "2022-11-30", "2023-11-29", "Mass consumer adoption and public policy"],
    ["platform", "Platform era", "2023-11-29", "", "Models, apps, enterprise, governance"]
  ], [
    ["founded", "2015-12-11", "lab", "OpenAI is announced."],
    ["openai-gym", "2016-04-27", "lab", "OpenAI Gym is released.", "2016"],
    ["lp", "2019-03-11", "capped-profit", "OpenAI LP structure is announced."],
    ["api", "2020-06-11", "capped-profit", "OpenAI API is announced.", "2020"],
    ["dalle", "2021-01-05", "capped-profit", "DALL-E is introduced.", "2021"],
    ["chatgpt", "2022-11-30", "chatgpt", "ChatGPT launches as a public research preview."],
    ["gpt4", "2023-03-14", "chatgpt", "GPT-4 is announced."],
    ["devday", "2023-11-06", "chatgpt", "First OpenAI DevDay takes place."],
    ["platform", "2024-05-13", "platform", "A new multimodal product cycle begins.", "2024"]
  ]),
  "054": companyProfile("iPhone Era", "2007-06-29", "The iPhone era as a small but world-changing rectangle of recent weeks.", [
    ["first", "First iPhone", "2007-06-29", "2010-06-24", "Touchscreen smartphone mainstreaming"],
    ["app-store", "App Store expansion", "2008-07-10", "2014-09-19", "Apps, cameras, mobile-first culture"],
    ["plus-watch", "Large phones / Watch", "2014-09-19", "2020-10-23", "Bigger screens, wearables, services"],
    ["modern", "Modern iPhone", "2020-10-23", "", "5G, computational photography, AI features"]
  ], [
    ["launch", "2007-06-29", "first", "The first iPhone goes on sale."],
    ["app-store", "2008-07-10", "app-store", "App Store launches."],
    ["iphone4", "2010-06-24", "app-store", "iPhone 4 goes on sale."],
    ["iphone6", "2014-09-19", "plus-watch", "iPhone 6 and 6 Plus go on sale."],
    ["iphone-x", "2017-11-03", "plus-watch", "iPhone X goes on sale."],
    ["iphone12", "2020-10-23", "modern", "iPhone 12 begins the 5G cycle."],
    ["dynamic", "2022-09-16", "modern", "iPhone 14 Pro introduces Dynamic Island."],
    ["today", "2026-07-03", "modern", "The iPhone era remains under 1,000 weeks old.", "Today"]
  ]),
  "055": companyProfile("Nintendo Consoles", "1983-07-15", "Nintendo console launches as a life-grid of hardware chapters.", [
    ["nes-snes", "NES / SNES", "1983-07-15", "1996-06-23", "Home-console foundation"],
    ["n64-gamecube", "N64 / GameCube", "1996-06-23", "2006-11-19", "3D console identity"],
    ["wii-ds", "Wii / DS", "2004-11-21", "2017-03-03", "Mass-market play and handheld strength"],
    ["switch", "Switch era", "2017-03-03", "", "Hybrid console and long-tail platform"]
  ], [
    ["famicom", "1983-07-15", "nes-snes", "Famicom launches in Japan."],
    ["nes-us", "1985-10-18", "nes-snes", "NES launches in the U.S.", "1985"],
    ["snes", "1990-11-21", "nes-snes", "Super Famicom launches in Japan."],
    ["n64", "1996-06-23", "n64-gamecube", "Nintendo 64 launches in Japan."],
    ["gamecube", "2001-09-14", "n64-gamecube", "GameCube launches in Japan."],
    ["wii", "2006-11-19", "wii-ds", "Wii launches in North America."],
    ["switch", "2017-03-03", "switch", "Nintendo Switch launches."],
    ["switch2", "2025-06-05", "switch", "Switch 2 era begins.", "2025"]
  ]),
  "056": {
    name: "Taylor Swift Eras",
    birthDate: "1989-12-13",
    headline: "Taylor Swift eras, one week at a time.",
    subtitle: "A public album-cycle chart using neutral labels and color bands, not album art.",
    sourceNote: "Illustrative public-release-date profile; not affiliated and no endorsement implied.",
    stages: [
      stage("early-life", "Early life / songwriting", "1989-12-13", "2006-10-24", 0, "Pennsylvania / Nashville", "Songwriting, relocation, first deals"),
      stage("country-breakout", "Country breakout", "2006-10-24", "2014-10-27", 1, "Nashville / tours", "Album cycles and touring growth"),
      stage("pop-reinvention", "Pop reinvention", "2014-10-27", "2020-07-24", 2, "Global", "Pop albums, public image shifts, stadium scale"),
      stage("indie-rerecording", "Folklore / re-recordings", "2020-07-24", "2023-03-17", 3, "Global", "Remote albums, catalog strategy, re-recordings"),
      stage("eras", "Eras Tour / cultural scale", "2023-03-17", "", 4, "Global", "Touring, film, platform-scale fandom")
    ],
    events: [
      event("born", "1989-12-13", "early-life", "Born in West Reading, Pennsylvania."),
      event("debut", "2006-10-24", "country-breakout", "Debut album releases."),
      event("fearless", "2008-11-11", "country-breakout", "Fearless releases."),
      event("red", "2012-10-22", "country-breakout", "Red releases."),
      event("1989", "2014-10-27", "pop-reinvention", "1989 releases."),
      event("folklore", "2020-07-24", "indie-rerecording", "Folklore releases."),
      event("midnights", "2022-10-21", "indie-rerecording", "Midnights releases."),
      event("eras-tour", "2023-03-17", "eras", "The Eras Tour begins.")
    ]
  },
  "058": historicalProfile("Marie Curie", "1867-11-07", "1934-07-04", "A science biography grid for education, research, Nobel milestones, and public legacy.", [
    ["born", "1867-11-07", "early", "Born in Warsaw."],
    ["paris", "1891-11-01", "study", "Moves to Paris to study at the Sorbonne.", "1891"],
    ["marriage", "1895-07-26", "research", "Marries Pierre Curie."],
    ["radium", "1898-12-26", "research", "Radium is announced as a new element.", "1898"],
    ["nobel-physics", "1903-12-10", "recognition", "Shares the Nobel Prize in Physics."],
    ["pierre-death", "1906-04-19", "recognition", "Pierre Curie dies in an accident."],
    ["nobel-chemistry", "1911-12-10", "institute", "Receives the Nobel Prize in Chemistry."],
    ["death", "1934-07-04", "institute", "Dies in France."]
  ]),
  "060": companyProfile("Fame Compression", "1955-02-24", "A composite public-life chart showing how small the famous chapter can be.", [
    ["early", "Private formation", "1955-02-24", "1976-04-01", "Long pre-fame setup"],
    ["breakout", "Breakout chapter", "1976-04-01", "1984-01-24", "Visible public breakthrough"],
    ["reset", "Reset / hidden work", "1985-09-17", "1997-02-07", "A quieter rebuilding period"],
    ["icon", "Icon era", "1997-02-07", "2011-10-05", "Publicly remembered chapter"]
  ], [
    ["born", "1955-02-24", "early", "The container starts."],
    ["first-public-work", "1976-04-01", "breakout", "The public story begins to accelerate."],
    ["breakthrough", "1984-01-24", "breakout", "A breakthrough becomes visible."],
    ["reset", "1985-09-17", "reset", "The story leaves the expected path."],
    ["return", "1997-02-07", "icon", "The famous chapter begins again."],
    ["peak", "2007-06-29", "icon", "The public era compresses into a few dense years."],
    ["end", "2011-10-05", "icon", "The public life closes."],
    ["lesson", "2011-10-05", "icon", "Most of the chart was not the famous part."]
  ])
};

function stage(id, label, startDate, endDate, paletteIndex, location, behavior) {
  const swatch = palette[paletteIndex % palette.length];
  return {
    id,
    label,
    startDate,
    ...(endDate ? { endDate } : {}),
    color: swatch.color,
    filled: swatch.filled,
    location,
    behavior
  };
}

function event(id, date, stageId, message, dateLabel) {
  return { id, date, ...(dateLabel ? { dateLabel } : {}), stageId, message };
}

function companyProfile(name, birthDate, subtitle, stageRows, eventRows) {
  return {
    name,
    birthDate,
    headline: `${name}, one week at a time.`,
    subtitle,
    sourceNote: "Illustrative public-history company or cultural timeline; verify exact dates before posting and do not imply endorsement.",
    stages: stageRows.map(([id, label, startDate, endDate, behavior], index) =>
      stage(id, label, startDate, endDate, index, "Public timeline", behavior)
    ),
    events: eventRows.map(([id, date, stageId, message, dateLabel]) => event(id, date, stageId, message, dateLabel))
  };
}

function historicalProfile(name, birthDate, deathDate, subtitle, eventRows) {
  return {
    name,
    birthDate,
    deathDate,
    headline: `${name}, one week at a time.`,
    subtitle,
    sourceNote: "Illustrative educational public-history profile from reliable reference timelines; no endorsement implied.",
    stages: [
      stage("early", "Early life", birthDate, addYears(birthDate, 24), 0, "Early context", "Formation and education"),
      stage("study", "Study / migration", addYears(birthDate, 24), addYears(birthDate, 30), 1, "Study years", "Move into advanced work"),
      stage("research", "Research breakthrough", addYears(birthDate, 30), addYears(birthDate, 38), 2, "Research", "Discovery and collaboration"),
      stage("recognition", "Recognition / loss", addYears(birthDate, 38), addYears(birthDate, 50), 3, "Public science", "Recognition and personal rupture"),
      stage("institute", "Institution / legacy", addYears(birthDate, 50), deathDate, 4, "Institutional work", "Teaching, service, legacy")
    ],
    events: eventRows.map(([id, date, stageId, message, dateLabel]) => event(id, date, stageId, message, dateLabel))
  };
}

function parseEntries(markdown) {
  const lines = markdown.split("\n");
  const entries = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^#### (\d{3})$/);
    if (heading) {
      if (current) entries.push(current);
      current = { id: heading[1] };
      continue;
    }
    if (!current) continue;
    for (const [key, prefix] of [
      ["postCopy", "- Post copy: "],
      ["creative", "- Creative: "],
      ["angle", "- Angle: "],
      ["cta", "- CTA/Experiment: "]
    ]) {
      if (line.startsWith(prefix)) {
        current[key] = line.slice(prefix.length).trim();
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
}

function clamp(value, max) {
  return value.length <= max ? value : `${value.slice(0, max - 1).trim()}...`;
}

function addYears(dateValue, years) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date.toISOString().slice(0, 10);
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function yearsBetween(start, end = "2026-07-03") {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  const birthday = new Date(Date.UTC(b.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
  if (birthday > b) years -= 1;
  return Math.max(0, years);
}

function genericBirthDate(index) {
  const year = 1967 + ((index * 7) % 10);
  const month = String(1 + ((index * 5) % 12)).padStart(2, "0");
  const day = String(1 + ((index * 11) % 27)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function categoryForId(id) {
  const n = Number(id);
  if (n <= 15) return "reflection";
  if (n <= 30) return "product";
  if (n <= 45) return "maker";
  if (n <= 60) return "public";
  if (n <= 75) return "relationship";
  if (n <= 90) return "social";
  return "alternate";
}

function categoryForEntry(entry) {
  const text = `${entry.angle ?? ""} ${entry.creative ?? ""} ${entry.postCopy ?? ""}`.toLowerCase();
  if (/\b(athlete|sports|training|injur|competition)\b/.test(text)) return "athlete";
  if (/\b(student|school|semester|exam|graduation|education)\b/.test(text)) return "student";
  if (/\b(immigrant|visa|cities|countries|paperwork|home changed)\b/.test(text)) return "immigrant";
  if (/\b(creator|artist|practice|show|breakthrough|audience)\b/.test(text)) return "creator";
  if (/\b(career switch|career|resume|job|role|old identity|new field)\b/.test(text)) return "career";
  if (/\b(burnout|recovery|reset)\b/.test(text)) return "recovery";
  if (/\b(parent|parents|couple|relationship|friendship|friend|child|family|visit)\b/.test(text)) return "relationship";
  if (/\b(founder|startup|maker|roadmap|build-in-public|github|shipping|company)\b/.test(text)) return "maker";
  if (/\b(reply|quote|poll|challenge|meme|template|prompt|requests)\b/.test(text)) return "social";
  if (/\b(export|input|static|local-first|screenshot|workflow|account|poster|share)\b/.test(text)) return "product";
  return categoryForId(entry.id);
}

function nameFromEntry(entry) {
  const text = `${entry.creative ?? ""} ${entry.postCopy ?? ""}`;
  const exact = [
    ["Parents", "Parent Timeline"],
    ["parent", "Parent Timeline"],
    ["couple", "Couple Timeline"],
    ["relationship", "Relationship Timeline"],
    ["friend", "Old Friend Timeline"],
    ["founder", "Founder Arc"],
    ["company", "Company Timeline"],
    ["creator", "Creator Arc"],
    ["student", "Student Arc"],
    ["athlete", "Athlete Arc"],
    ["immigrant", "Immigrant Arc"],
    ["burnout", "Burnout Recovery"],
    ["career", "Career Switch Arc"],
    ["birthday", "Birthday Row"],
    ["calendar", "Calendar Contrast"],
    ["poster", "Saved Poster"],
    ["grid", "Visible Grid"],
    ["Netflix", "Netflix Season"],
    ["video game", "Playable Week"],
    ["GitHub", "Contribution Life"],
    ["Spotify", "Wrapped Life"]
  ];
  const hit = exact.find(([needle]) => text.toLowerCase().includes(needle.toLowerCase()));
  return hit ? hit[1] : clamp(entry.angle || `Post ${entry.id}`, 42);
}

function genericProfile(entry, index) {
  const birthDate = genericBirthDate(index);
  const age = yearsBetween(birthDate);
  const category = categoryForEntry(entry);
  const baseName = nameFromEntry(entry);
  const name = `${baseName} ${entry.id}`;
  const p = index % palette.length;

  const stagesByCategory = {
    reflection: [
      ["start", "The container starts", 0, 12, "Family, first memories, early identity"],
      ["school", "School years", 12, 22, "Learning, comparison, first independence"],
      ["search", "Searching years", 22, 30, "Moves, relationships, experiments"],
      ["build", "Building years", 30, 42, "Work, commitments, compounding choices"],
      ["present", "This week", 42, 100, "The current row asks for a decision"]
    ],
    product: [
      ["input", "One input", 0, 18, "Birthday becomes the source of the grid"],
      ["render", "Grid render", 18, 27, "The invisible timeline becomes visible"],
      ["pin", "Pinned moments", 27, 36, "Events land on exact week squares"],
      ["export", "Exportable poster", 36, 48, "The chart becomes a saved image"],
      ["share", "Shared artifact", 48, 100, "The poster moves into conversations"]
    ],
    maker: [
      ["idea", "Idea years", 0, 22, "Taste, tools, and early experiments"],
      ["first-users", "First users", 22, 29, "Prototype, feedback, first use"],
      ["launch", "Launch chapter", 29, 35, "Shipping, iteration, rejection"],
      ["burnout-reset", "Burnout / reset", 35, 41, "Pace breaks, then clarity returns"],
      ["compound", "Compounding", 41, 100, "A narrower product becomes stronger"]
    ],
    relationship: [
      ["origin", "Before the bond", 0, 18, "The personal timeline before this relationship"],
      ["meeting", "Meeting season", 18, 25, "A person enters the grid"],
      ["ordinary", "Ordinary weeks", 25, 40, "Small rituals make the chapter real"],
      ["distance", "Distance / repair", 40, 48, "Gaps, calls, visits, reconnection"],
      ["more-weeks", "More weeks", 48, 100, "The future is planned as shared time"]
    ],
    social: [
      ["setup", "Setup", 0, 18, "The blank template becomes personal"],
      ["reaction", "Reaction", 18, 27, "The first emotional read arrives"],
      ["reply-loop", "Reply loop", 27, 36, "Followers add birthdays and milestones"],
      ["challenge", "Challenge", 36, 44, "Hidden pins become a guessing game"],
      ["remix", "Remix", 44, 100, "The format becomes a reusable prompt"]
    ],
    creator: [
      ["practice", "Practice years", 0, 20, "Private repetition and taste formation"],
      ["first-public-work", "First public work", 20, 28, "Posting, publishing, showing up"],
      ["rejection", "Rejection / iteration", 28, 35, "Weak signals, revisions, small audiences"],
      ["breakthrough", "Breakthrough", 35, 44, "A visible project changes the arc"],
      ["voice", "Mature voice", 44, 100, "The work becomes recognizable"]
    ],
    athlete: [
      ["training", "Training base", 0, 16, "Repetition, coaching, early competition"],
      ["development", "Development years", 16, 24, "Skill acquisition and first serious tests"],
      ["peak", "Peak seasons", 24, 34, "Competition, travel, pressure, public results"],
      ["injury-reset", "Injury / comeback", 34, 42, "Recovery, adaptation, comeback attempts"],
      ["legacy", "Legacy / next role", 42, 100, "Mentorship, commentary, second chapter"]
    ],
    student: [
      ["childhood", "Childhood learning", 0, 12, "Early school and identity"],
      ["secondary", "Secondary school", 12, 18, "Exams, comparison, friendship, pressure"],
      ["college", "College / training", 18, 23, "Semesters, projects, internships"],
      ["transition", "Graduation transition", 23, 30, "First role, debt, relocation, independence"],
      ["lifelong", "Lifelong learning", 30, 100, "Skills compound outside the classroom"]
    ],
    immigrant: [
      ["origin", "Origin place", 0, 18, "Language, family, first sense of home"],
      ["departure", "Departure", 18, 25, "Applications, paperwork, leaving rituals"],
      ["arrival", "Arrival / adaptation", 25, 34, "New city, work, language, uncertainty"],
      ["between-homes", "Between homes", 34, 45, "Family distance and mixed belonging"],
      ["new-roots", "New roots", 45, 100, "Home becomes a layered map"]
    ],
    career: [
      ["first-track", "First track", 0, 24, "Training for an identity that seems fixed"],
      ["old-field", "Old field", 24, 34, "Competence, momentum, and hidden doubt"],
      ["switch", "Switch window", 34, 40, "A decision breaks the old pattern"],
      ["rebuild", "Rebuild", 40, 48, "Apprenticeship, humility, new proof"],
      ["second-arc", "Second arc", 48, 100, "The new identity starts compounding"]
    ],
    recovery: [
      ["pace", "Fast pace", 0, 24, "Ambition arrives before limits are understood"],
      ["overload", "Overload", 24, 34, "Dense commitments and shrinking margin"],
      ["break", "Break point", 34, 38, "The body or mind forces the issue"],
      ["repair", "Repair", 38, 45, "Sleep, boundaries, smaller promises"],
      ["sustainable", "Sustainable rhythm", 45, 100, "A slower chapter keeps more weeks usable"]
    ],
    alternate: [
      ["hook", "Hook", 0, 18, "The visual grabs attention"],
      ["proof", "Proof", 18, 28, "The chart shows the product, not just a claim"],
      ["use-case", "Use case", 28, 38, "A specific audience sees themselves"],
      ["decision", "Decision", 38, 48, "The post asks for one concrete action"],
      ["remix", "Remix", 48, 100, "The angle can be repeated with new profiles"]
    ],
    public: [
      ["origin", "Origin", 0, 18, "Public story before the famous chapter"],
      ["breakout", "Breakout", 18, 28, "The work becomes visible"],
      ["scale", "Scale", 28, 38, "The public timeline grows denser"],
      ["reinvention", "Reinvention", 38, 48, "A pivot changes the color of the chart"],
      ["legacy", "Legacy", 48, 100, "The visible era becomes a reference point"]
    ]
  };

  const selectedStages = stagesByCategory[category] ?? stagesByCategory.reflection;
  const stages = selectedStages.map(([id, label, startAge, endAge, behavior], stageIndex) =>
    stage(
      id,
      label,
      addYears(birthDate, startAge),
      endAge >= 100 ? "" : addYears(birthDate, endAge),
      p + stageIndex,
      categoryLabel(category),
      behavior
    )
  );

  const eventAges = [0, 7, 16, 22, 29, 36, Math.max(1, Math.min(age, 44)), Math.min(99, Math.max(age + 1, 50))];
  const eventMessages = eventMessagesFor(category, entry);
  const events = eventAges.map((eventAge, eventIndex) => {
    const date = addDays(addYears(birthDate, eventAge), eventIndex * 17);
    return event(
      `event-${eventIndex + 1}`,
      date,
      stageIdForAge(selectedStages, eventAge),
      clamp(eventMessages[eventIndex] ?? `${entry.angle} marker ${eventIndex + 1}.`, 112),
      eventIndex === 7 ? "Future" : undefined
    );
  });

  return {
    name,
    birthDate,
    headline: `${baseName}, one week at a time.`,
    subtitle: clamp(entry.creative || "A Life in Weeks marketing creative generated from the post bank.", 210),
    sourceNote: "Illustrative marketing concept generated from the local X/Twitter post bank; dates are fictional unless otherwise labeled.",
    stages,
    events
  };
}

function categoryLabel(category) {
  return {
    reflection: "Personal reflection",
    product: "Product surface",
    maker: "Founder / maker arc",
    relationship: "Relationship timeline",
    social: "Social prompt",
    alternate: "Marketing experiment",
    public: "Public-history format",
    creator: "Creator arc",
    athlete: "Athlete arc",
    student: "Student arc",
    immigrant: "Immigrant arc",
    career: "Career transition",
    recovery: "Recovery arc"
  }[category];
}

function stageIdForAge(stageRows, age) {
  const match = stageRows.find(([, , startAge, endAge]) => startAge <= age && age < endAge);
  return match?.[0] ?? stageRows.at(-1)?.[0] ?? "stage";
}

function eventMessagesFor(category, entry) {
  const angle = entry.angle || "Creative";
  const common = [
    "The container starts.",
    "First memories begin to occupy real space.",
    "A formative chapter takes over the grid.",
    "A move, role, or relationship changes the color.",
    `${angle} becomes the visible turning point.`,
    "The current week asks for a clearer choice.",
    "The poster becomes an artifact worth keeping.",
    "A future week is reserved before it disappears."
  ];
  const sets = {
    product: [
      "The birthday becomes the only input.",
      "The grid renders all 5,200 possible weeks.",
      "The current week becomes easy to find.",
      "Event pins turn vague memory into exact squares.",
      "The export removes the controls and keeps the poster.",
      "The chart is ready to save or send.",
      "The visual becomes a social asset.",
      "The next version starts from user feedback."
    ],
    maker: [
      "The idea appears before the plan is clean.",
      "The first prototype is rough but alive.",
      "A first user makes the week memorable.",
      "A launch changes the shape of the year.",
      "Burnout forces a reset.",
      "The product gets narrower and clearer.",
      "Shipping becomes a repeatable rhythm.",
      "A future roadmap gets a real date."
    ],
    relationship: [
      "The personal timeline starts before the shared one.",
      "A person enters the story.",
      "Ordinary weeks become the relationship.",
      "Distance turns into a visible gap.",
      "A call repairs more than the schedule.",
      "A visit gets pinned before it gets postponed.",
      "The chart asks who deserves more weeks.",
      "The next shared week is chosen on purpose."
    ],
    social: [
      "The blank template becomes a prompt.",
      "The first reaction is stronger than expected.",
      "Replies turn birthdays into rows.",
      "Three hidden pins become a guessing game.",
      "The meme works because the chart is real.",
      "Quote-tweets create new timelines.",
      "The audience picks the next profile.",
      "The format becomes a reusable content engine."
    ],
    alternate: [
      "The hook makes the image understandable fast.",
      "The proof is the exported chart.",
      "The audience segment gets its own timeline.",
      "The CTA asks for one concrete action.",
      "The image carries the product without a thread.",
      "The ad variant tests the clearest promise.",
      "A retargeting prompt points back to the current week.",
      "The winning angle becomes a repeatable template."
    ],
    creator: [
      "Private practice takes the first years.",
      "The first public work gets pinned.",
      "Rejection becomes part of the visible pattern.",
      "A breakthrough changes the audience size.",
      "The voice becomes easier to recognize.",
      "The work starts compounding.",
      "A new format opens another chapter.",
      "The next project gets a real week."
    ],
    athlete: [
      "Training starts before anyone is watching.",
      "The first serious competition changes the calendar.",
      "A peak season gets pinned.",
      "An injury interrupts the expected line.",
      "The comeback becomes its own stage.",
      "A win or loss rewrites the story.",
      "The body sets a new constraint.",
      "A second role begins before the grid ends."
    ],
    student: [
      "The first classroom starts the arc.",
      "School begins to feel endless because it occupies years.",
      "Exams turn pressure into visible weeks.",
      "A semester becomes a stage, not a blur.",
      "Graduation gets pinned as a turning point.",
      "The first job changes the label.",
      "A skill keeps compounding outside school.",
      "The next learning chapter gets chosen."
    ],
    immigrant: [
      "The first home fills the early rows.",
      "The departure plan starts before the move.",
      "Paperwork becomes part of the timeline.",
      "Arrival changes the color of the grid.",
      "Language and work start overlapping.",
      "Family distance becomes visible.",
      "Home becomes more than one place.",
      "The next visit gets pinned before it slips."
    ],
    career: [
      "The first track looks permanent.",
      "Competence builds in the old field.",
      "Doubt becomes harder to ignore.",
      "The switch gets a real date.",
      "The rebuild phase starts smaller than expected.",
      "A new proof point changes the color.",
      "The second arc begins compounding.",
      "A future week is reserved for the next move."
    ],
    recovery: [
      "Ambition starts before the limits are clear.",
      "The calendar fills too densely.",
      "The break point gets pinned without shame.",
      "Repair begins as a small week.",
      "A boundary changes the color of the chart.",
      "The new rhythm becomes visible.",
      "Rest stops looking like wasted space.",
      "A sustainable future week gets protected."
    ]
  };
  return sets[category] ?? common;
}

function profileForEntry(entry, index) {
  return publicProfiles[entry.id] ?? genericProfile(entry, index);
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolveOpen, rejectOpen) => {
      this.ws.addEventListener("open", resolveOpen, { once: true });
      this.ws.addEventListener("error", rejectOpen, { once: true });
    });
    this.ws.addEventListener("message", (eventMessage) => {
      const payload = JSON.parse(eventMessage.data);
      if (!payload.id) return;
      const pending = this.pending.get(payload.id);
      if (!pending) return;
      this.pending.delete(payload.id);
      if (payload.error) pending.reject(new Error(payload.error.message));
      else pending.resolve(payload.result);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const message = JSON.stringify({ id, method, params });
    const promise = new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolve: resolveSend, reject: rejectSend });
    });
    this.ws.send(message);
    return promise;
  }

  close() {
    this.ws.close();
  }
}

async function waitForHttp(url, timeoutMs = 45000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError?.message ?? "unknown error"}`);
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  ];
  const chrome = candidates.find((candidate) => existsSync(candidate));
  if (!chrome) throw new Error("Could not find Chrome, Edge, or Chromium in /Applications.");
  return chrome;
}

async function launchVite() {
  const child = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.on("data", (chunk) => process.stdout.write(`[vite] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[vite] ${chunk}`));
  await waitForHttp(siteUrl);
  return child;
}

async function launchChrome() {
  const userDataDir = join("/tmp", `life-weeks-twitter-assets-${Date.now()}`);
  rmSync(userDataDir, { recursive: true, force: true });
  mkdirSync(userDataDir, { recursive: true });
  const child = spawn(findChrome(), [
    "--headless=new",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    siteUrl
  ], {
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stderr.on("data", (chunk) => process.stderr.write(`[chrome] ${chunk}`));
  await waitForHttp(`http://127.0.0.1:${chromePort}/json/version`);
  return { child, userDataDir };
}

async function connectPage() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const targets = await fetch(`http://127.0.0.1:${chromePort}/json/list`).then((response) => response.json());
    const pageTarget = targets.find((target) => target.type === "page" && target.url.includes(`/life/`)) ?? targets.find((target) => target.type === "page");
    if (pageTarget?.webSocketDebuggerUrl) {
      const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
      await client.open();
      return client;
    }
    await delay(500);
  }
  throw new Error("Could not find a Chrome page target for Life in Weeks.");
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed.");
  }
  return result.result?.value;
}

async function setupPage(client) {
  await client.send("Runtime.enable");
  await client.send("Page.enable");
  await evaluate(client, `
    (() => new Promise((resolve) => {
      if (document.readyState === "complete") resolve(true);
      else window.addEventListener("load", () => resolve(true), { once: true });
    }))()
  `);
  await evaluate(client, `
    (() => {
      if (window.__lifeAssetPatchInstalled) return true;
      window.__lifeAssetPatchInstalled = true;
      window.__lifeLastDownload = null;
      const originalClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function patchedClick() {
        if (this.download && this.href && this.href.startsWith("data:image/png")) {
          window.__lifeLastDownload = { download: this.download, href: this.href };
          return undefined;
        }
        return originalClick.apply(this, arguments);
      };
      return true;
    })()
  `);
}

async function renderAsset(client, entry, profile, fileName) {
  const json = JSON.stringify(profile);
  const result = await evaluate(client, `
    (async () => {
      const profileMode = document.querySelector('[data-mode-option="profile"]');
      const textarea = document.querySelector('[data-ai-profile-json]');
      const importButton = document.querySelector('[data-import-profile]');
      const exportButton = document.querySelector('[data-mode-panel="profile"] [data-export]');
      if (!profileMode || !textarea || !importButton || !exportButton) {
        throw new Error("Life in Weeks import/export controls were not found.");
      }
      profileMode.click();
      textarea.value = ${JSON.stringify(json)};
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      importButton.click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      window.__lifeLastDownload = null;
      exportButton.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      return {
        status: document.querySelector('[data-ai-profile-status]')?.textContent ?? "",
        title: document.querySelector('[data-export-title]')?.textContent ?? "",
        download: window.__lifeLastDownload
      };
    })()
  `);

  if (!result?.download?.href?.startsWith("data:image/png;base64,")) {
    throw new Error(`Export failed for ${entry.id}: ${result?.status ?? "missing download"}`);
  }

  const base64 = result.download.href.split(",", 2)[1];
  const buffer = Buffer.from(base64, "base64");
  const filePath = join(outDir, fileName);
  writeFileSync(filePath, buffer);
  return {
    ...result,
    bytes: buffer.length,
    filePath
  };
}

function buildManifest(rows) {
  return [
    "# Life in Weeks X/Twitter Creative Assets",
    "",
    "Created: 2026-07-03",
    "",
    "These PNGs were generated by driving the local Life in Weeks site in headless Chrome, importing a profile JSON for each post-bank creative, clicking the app's own Export Image button, and saving the exported chart image.",
    "",
    "Source post bank: [twitter-100-posts-2026-07-03.md](twitter-100-posts-2026-07-03.md)",
    "",
    "Safety note: public-figure and company charts are illustrative public-history assets. Verify exact dates before posting, keep no-endorsement language, and do not add copyrighted logos or artwork unless usage rights are clear.",
    "",
    "| Post | Angle | Generated PNG | Profile used | Notes |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => {
      const relPath = row.filePath.replace(`${join(repoRoot, "marketing")}/`, "");
      return `| ${row.id} | ${escapeTable(row.angle)} | [${basename(row.filePath)}](${relPath}) | ${escapeTable(row.profileName)} | ${escapeTable(row.note)} |`;
    }),
    ""
  ].join("\n");
}

function escapeTable(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

async function main() {
  const markdown = readFileSync(markdownPath, "utf8");
  const entries = parseEntries(markdown);
  if (entries.length !== 105) {
    throw new Error(`Expected 105 post entries, found ${entries.length}.`);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const profiles = entries.map((entry, index) => ({
    entry,
    profile: profileForEntry(entry, index),
    fileName: `${entry.id}-${slugify(entry.angle || entry.postCopy || "creative")}.png`
  }));
  writeFileSync(
    join(outDir, "profiles.json"),
    JSON.stringify(
      profiles.map(({ entry, profile, fileName }) => ({ id: entry.id, angle: entry.angle, creative: entry.creative, fileName, profile })),
      null,
      2
    )
  );

  let vite;
  let chrome;
  let client;
  const rows = [];
  try {
    vite = await launchVite();
    chrome = await launchChrome();
    client = await connectPage();
    await setupPage(client);

    for (const [index, item] of profiles.entries()) {
      const rendered = await renderAsset(client, item.entry, item.profile, item.fileName);
      rows.push({
        id: item.entry.id,
        angle: item.entry.angle,
        filePath: rendered.filePath,
        profileName: item.profile.name,
        note: `${Math.round(rendered.bytes / 1024)} KB via ${rendered.title || "export"}`
      });
      process.stdout.write(`[${index + 1}/${profiles.length}] ${item.entry.id} ${item.fileName} (${Math.round(rendered.bytes / 1024)} KB)\n`);
    }

    writeFileSync(manifestPath, buildManifest(rows));
    process.stdout.write(`Wrote ${rows.length} PNG assets to ${outDir}\n`);
    process.stdout.write(`Wrote manifest to ${manifestPath}\n`);
  } finally {
    client?.close();
    if (chrome?.child) await stopProcess(chrome.child);
    if (chrome?.userDataDir) await removeDirectoryWithRetry(chrome.userDataDir);
    if (vite) await stopProcess(vite);
  }
}

async function stopProcess(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    delay(2500).then(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    })
  ]);
}

async function removeDirectoryWithRetry(directory) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      rmSync(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      return;
    } catch (error) {
      if (attempt === 4) {
        process.stderr.write(`Warning: could not remove temporary Chrome profile ${directory}: ${error.message}\n`);
        return;
      }
      await delay(500);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
