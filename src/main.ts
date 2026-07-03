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

type EventPrecision = "day" | "month" | "year" | "age";

type LifeEvent = {
  id: string;
  date: string;
  dateLabel?: string;
  datePrecision?: EventPrecision;
  stageId: string;
  message: string;
};

type PersonProfile = {
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

type AppMode = "personal" | "profile";

type PersonalEventDraft = {
  id: string;
  date: string;
  message: string;
};

type LifeAge = {
  fullYears: number;
  fullWeeksThisYear: number;
  remainingDaysThisYear: number;
  currentWeekCell: number;
  filledCells: number;
  elapsedWeeks: number;
};

type EventCellPosition = {
  index: number;
  age: number;
  weekInYear: number;
  date: Date;
};

type EventSegment = {
  age: number;
  startWeek: number;
  endWeek: number;
  startIndex: number;
  endIndex: number;
};

type EventPosition = EventCellPosition & {
  precision: EventPrecision;
  startDate: Date;
  endDate: Date;
  segments: EventSegment[];
};

type PositionedEvent = {
  lifeEvent: LifeEvent;
  position: EventPosition;
};

const weeksPerYear = 52;
const years = 100;
const totalWeeks = weeksPerYear * years;
const msPerDay = 24 * 60 * 60 * 1000;
const maxEventCharacters = 120;
const eventNoteHeight = 94;
const eventNoteGap = 8;
const compactEventBreakpoint = 760;
const defaultPersonalBirthDate = "1990-01-01";
const personalReflectionLine =
  "Your weeks are grouped by life phase, and pinned moments stay local to this browser session using only the birthday and events entered here.";

const profiles: PersonProfile[] = [
  {
    id: "sam-altman",
    name: "Sam Altman",
    birthDate: "1985-04-22",
    headline: "Sam Altman, one week at a time.",
    subtitle:
      "A 5,200-square biography container: stages are colored from public date ranges, overlapping work is split inside each week, and major events are pinned onto the grid.",
    sourceNote:
      "Sample data is assembled from public biography references plus YC, OpenAI, and Green Dot primary announcements. Year-only childhood events are placed near the middle of the known year.",
    stages: [
      {
        id: "childhood",
        label: "Childhood / St. Louis",
        startDate: "1985-04-22",
        endDate: "2003-09-01",
        color: "#ead1cc",
        filled: "#bd6658",
        location: "Chicago -> Clayton, Missouri",
        behavior: "Early computing, school, identity formation"
      },
      {
        id: "stanford",
        label: "Stanford / AI Lab",
        startDate: "2003-09-01",
        endDate: "2005-05-01",
        color: "#b8ddd9",
        filled: "#247f85",
        location: "Stanford, California",
        behavior: "Computer science, AI lab, founder network"
      },
      {
        id: "loopt",
        label: "Loopt founder",
        startDate: "2005-01-01",
        endDate: "2012-03-21",
        color: "#edce8c",
        filled: "#b7791f",
        location: "Mountain View / Silicon Valley",
        behavior: "Mobile location product, fundraising, team building"
      },
      {
        id: "investor",
        label: "Investor / hard-tech bets",
        startDate: "2012-03-21",
        color: "#c9c0df",
        filled: "#725ca0",
        location: "San Francisco",
        behavior: "Capital allocation, networks, long-horizon bets"
      },
      {
        id: "yc",
        label: "Y Combinator",
        startDate: "2011-01-01",
        endDate: "2019-03-11",
        color: "#c4d8ad",
        filled: "#5f8b3d",
        location: "Mountain View / San Francisco",
        behavior: "Startup selection, advising, institution building"
      },
      {
        id: "openai",
        label: "OpenAI",
        startDate: "2015-12-11",
        color: "#b7cbe8",
        filled: "#3f6fa9",
        location: "San Francisco",
        behavior: "AI lab creation, product deployment, governance"
      },
      {
        id: "public-ai",
        label: "AI policy / public figure",
        startDate: "2022-11-30",
        color: "#e5bbb2",
        filled: "#a44f43",
        location: "Global",
        behavior: "Public communication, regulation, geopolitical AI debate"
      }
    ],
    events: [
      { id: "born", date: "1985-04-22", stageId: "childhood", message: "Born in Chicago." },
      {
        id: "st-louis",
        date: "1989-07-01",
        dateLabel: "1989",
        datePrecision: "year",
        stageId: "childhood",
        message: "Family moves to the St. Louis area."
      },
      {
        id: "first-mac",
        date: "1993-04-22",
        dateLabel: "Age 8",
        datePrecision: "age",
        stageId: "childhood",
        message: "Gets an Apple Macintosh and starts learning to code."
      },
      {
        id: "stanford-start",
        date: "2003-09-01",
        dateLabel: "2003",
        datePrecision: "year",
        stageId: "stanford",
        message: "Studies computer science at Stanford and works around the AI lab."
      },
      {
        id: "loopt-start",
        date: "2005-01-01",
        dateLabel: "2005",
        datePrecision: "year",
        stageId: "loopt",
        message: "Leaves Stanford and co-founds Loopt."
      },
      {
        id: "yc-join",
        date: "2011-01-01",
        dateLabel: "2011",
        datePrecision: "year",
        stageId: "yc",
        message: "Joins Y Combinator as a partner."
      },
      {
        id: "loopt-sale",
        date: "2012-03-21",
        stageId: "loopt",
        message: "Green Dot announces it will acquire Loopt for $43.4M."
      },
      {
        id: "yc-president",
        date: "2014-02-21",
        stageId: "yc",
        message: "Paul Graham announces Altman will become YC president."
      },
      {
        id: "openai-start",
        date: "2015-12-11",
        stageId: "openai",
        message: "OpenAI is announced with Altman and Elon Musk as co-chairs."
      },
      {
        id: "openai-ceo",
        date: "2019-03-11",
        dateLabel: "2019",
        datePrecision: "year",
        stageId: "openai",
        message: "Leaves YC leadership to focus full-time on OpenAI as CEO."
      },
      {
        id: "chatgpt",
        date: "2022-11-30",
        stageId: "public-ai",
        message: "OpenAI releases ChatGPT as a public research preview."
      },
      {
        id: "senate",
        date: "2023-05-16",
        stageId: "public-ai",
        message: "Testifies before the U.S. Senate on AI oversight."
      },
      {
        id: "return-ceo",
        date: "2023-11-29",
        stageId: "public-ai",
        message: "Returns as OpenAI CEO after a board crisis and new initial board."
      }
    ]
  }
];

const readingPrompts = {
  stages: "Stage recognition: color shows the dominant context; striped cells mean overlapping identities.",
  behavior: "Behavior analysis: read each colored band as the work pattern that dominated that period.",
  events: "Event tracking: pinned notes show the weeks where public events changed the trajectory."
} as const;

const generatedStagePalette = [
  { color: "#ead1cc", filled: "#bd6658" },
  { color: "#b8ddd9", filled: "#247f85" },
  { color: "#edce8c", filled: "#b7791f" },
  { color: "#c9c0df", filled: "#725ca0" },
  { color: "#c4d8ad", filled: "#5f8b3d" },
  { color: "#b7cbe8", filled: "#3f6fa9" },
  { color: "#e5bbb2", filled: "#a44f43" },
  { color: "#d9c7a7", filled: "#8e6b35" }
];

const personalStageTemplates = [
  {
    id: "baby-toddler",
    label: "Baby & Toddler",
    startAge: 0,
    endAge: 3,
    color: "#ead1cc",
    filled: "#bd6658",
    location: "Home / care",
    behavior: "Care, attachment, first words, first steps"
  },
  {
    id: "preschool",
    label: "Preschool",
    startAge: 3,
    endAge: 6,
    color: "#b8ddd9",
    filled: "#247f85",
    location: "Home / early school",
    behavior: "Play, language, routines, first friendships"
  },
  {
    id: "child",
    label: "Child",
    startAge: 6,
    endAge: 13,
    color: "#edce8c",
    filled: "#b7791f",
    location: "School / family",
    behavior: "Learning, hobbies, confidence, belonging"
  },
  {
    id: "teen",
    label: "Teen",
    startAge: 13,
    endAge: 18,
    color: "#c4d8ad",
    filled: "#5f8b3d",
    location: "School / peers",
    behavior: "Identity, independence, friendships, experiments"
  },
  {
    id: "young-adult",
    label: "Young Adult",
    startAge: 18,
    endAge: 25,
    color: "#b7cbe8",
    filled: "#3f6fa9",
    location: "New rooms",
    behavior: "Study, first work, moves, self-definition"
  },
  {
    id: "adult",
    label: "Adult",
    startAge: 25,
    endAge: 40,
    color: "#c9c0df",
    filled: "#725ca0",
    location: "Work / relationships",
    behavior: "Career, partnership, taste, compound routines"
  },
  {
    id: "middle-aged",
    label: "Middle-aged",
    startAge: 40,
    endAge: 65,
    color: "#e5bbb2",
    filled: "#a44f43",
    location: "Chosen circles",
    behavior: "Mastery, family systems, durable obligations"
  },
  {
    id: "senior",
    label: "Senior",
    startAge: 65,
    color: "#d9c7a7",
    filled: "#8e6b35",
    location: "Wider orbit",
    behavior: "Reflection, mentoring, freedom, continuity"
  }
] as const;

function requireElement<T extends Element>(selector: string) {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Life in Weeks markup is missing ${selector}.`);
  }
  return element;
}

const appShell = requireElement<HTMLElement>("[data-app-shell]");
const pageEyebrow = requireElement<HTMLElement>("[data-page-eyebrow]");
const modeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-mode-option]"));
const modePanels = Array.from(document.querySelectorAll<HTMLElement>("[data-mode-panel]"));
const personalForm = requireElement<HTMLFormElement>("[data-personal-form]");
const personalBirthDateInput = requireElement<HTMLInputElement>("[data-personal-birthdate]");
const personalStatus = requireElement<HTMLElement>("[data-personal-status]");
const form = requireElement<HTMLFormElement>("[data-profile-form]");
const profileSelect = requireElement<HTMLSelectElement>("[data-profile-select]");
const grid = requireElement<HTMLElement>("[data-life-grid]");
const axis = requireElement<HTMLElement>("[data-age-axis]");
const legend = requireElement<HTMLElement>("[data-legend]");
const stats = requireElement<HTMLElement>("[data-life-stats]");
const shareLine = requireElement<HTMLElement>("[data-share-line]");
const exportButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-export]"));
const exportTitle = requireElement<HTMLElement>("[data-export-title]");
const exportSummary = requireElement<HTMLElement>("[data-export-summary]");
const viralNote = requireElement<HTMLElement>("[data-viral-note]");
const viralNoteContainer = viralNote.closest<HTMLElement>(".viral-note");
const profileTitle = requireElement<HTMLElement>("[data-profile-title]");
const profileSubtitle = requireElement<HTMLElement>("[data-profile-subtitle]");
const stageCardLabel = requireElement<HTMLElement>("[data-stage-card-label]");
const stageCardCopy = requireElement<HTMLElement>("[data-stage-card-copy]");
const stageMetric = requireElement<HTMLElement>("[data-stage-metric]");
const behaviorCardLabel = requireElement<HTMLElement>("[data-behavior-card-label]");
const behaviorCardCopy = requireElement<HTMLElement>("[data-behavior-card-copy]");
const behaviorMetric = requireElement<HTMLElement>("[data-behavior-metric]");
const eventCardLabel = requireElement<HTMLElement>("[data-event-card-label]");
const eventCardCopy = requireElement<HTMLElement>("[data-event-card-copy]");
const eventMetric = requireElement<HTMLElement>("[data-event-metric]");
const sourceNote = requireElement<HTMLElement>("[data-source-note]");
const aiNameInput = requireElement<HTMLInputElement>("[data-ai-name]");
const aiPromptOutput = requireElement<HTMLTextAreaElement>("[data-ai-prompt]");
const copyProfilePromptButton = requireElement<HTMLButtonElement>("[data-copy-profile-prompt]");
const aiProfileJsonInput = requireElement<HTMLTextAreaElement>("[data-ai-profile-json]");
const importProfileButton = requireElement<HTMLButtonElement>("[data-import-profile]");
const aiProfileStatus = requireElement<HTMLElement>("[data-ai-profile-status]");
const readingButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-reading-prompt]"));
const eventForm = requireElement<HTMLFormElement>("[data-event-form]");
const eventKicker = requireElement<HTMLElement>("[data-event-kicker]");
const eventTitle = requireElement<HTMLElement>("[data-event-title]");
const eventDateLabel = requireElement<HTMLElement>("[data-event-date-label]");
const eventDateInput = requireElement<HTMLInputElement>("[data-event-date]");
const eventCopyLabel = requireElement<HTMLElement>("[data-event-copy-label]");
const eventCopyInput = requireElement<HTMLTextAreaElement>("[data-event-copy]");
const eventSubmit = requireElement<HTMLButtonElement>("[data-event-submit]");
const eventCount = requireElement<HTMLElement>("[data-event-count]");
const eventError = requireElement<HTMLElement>("[data-event-error]");
const chartCard = requireElement<HTMLElement>("[data-export-card]");
const annotationStage = requireElement<HTMLElement>("[data-annotation-stage]");
const eventLines = requireElement<SVGSVGElement>("[data-event-lines]");
const eventNotes = requireElement<HTMLElement>("[data-event-notes]");

if (!modeButtons.length || !modePanels.length || !exportButtons.length) {
  throw new Error("Life in Weeks markup is missing mode or export controls.");
}

let activeMode: AppMode = "personal";
let publicSelectedProfile = profiles[0];
let selectedProfile = profiles[0];
let selectedWeeks = 0;
let selectedLifeAge: LifeAge | null = null;
let selectedReadingPrompt: keyof typeof readingPrompts = "stages";
let profileEventState = new Map<string, LifeEvent[]>(profiles.map((profile) => [profile.id, [...profile.events]]));
let personalBirthDate = defaultPersonalBirthDate;
let personalEventDrafts: PersonalEventDraft[] = [];
let nextPersonalEventId = 1;
let lifeEvents: LifeEvent[] = [];
let nextEventId = 1;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addYears(date: Date, yearCount: number) {
  return new Date(date.getFullYear() + yearCount, date.getMonth(), date.getDate());
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getReferenceDate(profile = selectedProfile) {
  const deathDate = profile.deathDate ? parseLocalDate(profile.deathDate) : null;
  return deathDate ? startOfLocalDay(deathDate) : startOfLocalDay(new Date());
}

function stageById(stageId: string) {
  return selectedProfile.stages.find((stage) => stage.id === stageId);
}

function stageEndDate(stage: DevelopmentStage, referenceDate = getReferenceDate()) {
  const parsed = stage.endDate ? parseLocalDate(stage.endDate) : referenceDate;
  return parsed ? addDays(startOfLocalDay(parsed), 1) : addDays(referenceDate, 1);
}

function stageOverlapsRange(stage: DevelopmentStage, rangeStart: Date, rangeEnd: Date, referenceDate = getReferenceDate()) {
  const stageStart = parseLocalDate(stage.startDate);
  if (!stageStart) return false;
  const cappedRangeStart = rangeStart.getTime() > referenceDate.getTime() ? referenceDate : rangeStart;
  return startOfLocalDay(stageStart).getTime() < rangeEnd.getTime() && stageEndDate(stage, referenceDate).getTime() > cappedRangeStart.getTime();
}

function stagesForWeek(profile: PersonProfile, age: number, week: number, referenceDate = getReferenceDate(profile)) {
  const birthDate = parseLocalDate(profile.birthDate);
  if (!birthDate) return [];
  const birthdayYearStart = addYears(startOfLocalDay(birthDate), age);
  const weekStart = addDays(birthdayYearStart, week * 7);
  const weekEnd = addDays(weekStart, 7);
  if (weekStart.getTime() > referenceDate.getTime()) return [];
  return profile.stages.filter((stage) => stageOverlapsRange(stage, weekStart, weekEnd, referenceDate));
}

function stagesForDate(profile: PersonProfile, date: Date, referenceDate = getReferenceDate(profile)) {
  const day = startOfLocalDay(date);
  return profile.stages.filter((stage) => stageOverlapsRange(stage, day, addDays(day, 1), referenceDate));
}

function createPersonalStages(birthDateValue: string): DevelopmentStage[] {
  const birthDate = parseLocalDate(birthDateValue);
  if (!birthDate) return [];
  const birth = startOfLocalDay(birthDate);

  return personalStageTemplates.map((template) => {
    const startDate = addYears(birth, template.startAge);
    const endAge = "endAge" in template ? template.endAge : undefined;
    const endDate = endAge === undefined ? undefined : addDays(addYears(birth, endAge), -1);

    return {
      id: template.id,
      label: template.label,
      startDate: formatDateValue(startDate),
      ...(endDate ? { endDate: formatDateValue(endDate) } : {}),
      color: template.color,
      filled: template.filled,
      location: template.location,
      behavior: template.behavior
    };
  });
}

function stageIdForPersonalEvent(stages: DevelopmentStage[], dateValue: string) {
  const eventDate = parseLocalDate(dateValue);
  if (!eventDate) return stages[0]?.id ?? "early-life";
  const eventTime = startOfLocalDay(eventDate).getTime();
  let matchedStage: DevelopmentStage | undefined;

  stages.forEach((stage) => {
    const start = parseLocalDate(stage.startDate);
    const end = stage.endDate ? parseLocalDate(stage.endDate) : null;
    if (!start) return;
    const startTime = startOfLocalDay(start).getTime();
    const endTime = end ? addDays(startOfLocalDay(end), 1).getTime() : Number.POSITIVE_INFINITY;
    if (startTime <= eventTime && eventTime < endTime) {
      matchedStage = stage;
    }
  });

  return matchedStage?.id ?? stages[0]?.id ?? "early-life";
}

function createPersonalProfile(birthDateValue: string, eventDrafts: PersonalEventDraft[]): PersonProfile {
  const stages = createPersonalStages(birthDateValue);
  const birth = parseLocalDate(birthDateValue);
  const hundredthBirthday = birth ? addYears(startOfLocalDay(birth), years) : null;
  const events = eventDrafts
    .map((event) => {
      const eventDate = parseLocalDate(event.date);
      if (!birth || !hundredthBirthday || !eventDate) return null;
      const eventTime = startOfLocalDay(eventDate).getTime();
      if (eventTime < startOfLocalDay(birth).getTime() || eventTime >= hundredthBirthday.getTime()) return null;

      return {
        id: event.id,
        date: event.date,
        stageId: stageIdForPersonalEvent(stages, event.date),
        message: event.message
      };
    })
    .filter((event): event is LifeEvent => event !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    id: "personal-timeline",
    name: "Personal Timeline",
    birthDate: birthDateValue,
    headline: "Your life, one week at a time.",
    subtitle:
      "A 5,200-week map: lived squares are grouped by broad life phase, and your own moments can be pinned to their exact weeks.",
    sourceNote: "",
    stages,
    events
  };
}

function activeStageColors(stages: DevelopmentStage[]) {
  return stages.length ? stages.map((stage) => stage.filled) : ["#9b958c"];
}

function cellGradient(stages: DevelopmentStage[]) {
  const colors = activeStageColors(stages);
  if (colors.length === 1) return colors[0];

  const segment = 100 / colors.length;
  const stops = colors.map((color, index) => {
    const start = (index * segment).toFixed(2);
    const end = ((index + 1) * segment).toFixed(2);
    return `${color} ${start}% ${end}%`;
  });
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}

function stageRangeLabel(stage: DevelopmentStage) {
  const start = parseLocalDate(stage.startDate);
  const end = stage.endDate ? parseLocalDate(stage.endDate) : null;
  const birth = parseLocalDate(selectedProfile.birthDate);
  if (!start || !birth) return stage.endDate ? `${stage.startDate} - ${stage.endDate}` : `${stage.startDate} - now`;

  const startAge = calculateLifeAge(selectedProfile.birthDate, start).fullYears;
  const endAge = end ? calculateLifeAge(selectedProfile.birthDate, end).fullYears : selectedLifeAge?.fullYears;
  const endLabel = end ? String(end.getFullYear()) : "now";
  return `${start.getFullYear()} - ${endLabel} / age ${startAge}${endAge === undefined ? "+" : `-${endAge}`}`;
}

function createGrid() {
  const cells: string[] = [];
  const labels: string[] = [];
  const referenceDate = getReferenceDate(selectedProfile);

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = displayRow;
    labels.push(`<span>${age}</span>`);

    for (let week = 0; week < weeksPerYear; week += 1) {
      const index = age * weeksPerYear + week;
      const stages = stagesForWeek(selectedProfile, age, week, referenceDate);
      const stageNames = stages.map((stage) => stage.label).join(" + ") || "Unmapped";
      const label = `Age ${age}, week ${week + 1}. Stage: ${stageNames}`;
      cells.push(
        `<button class="week-cell" type="button" aria-label="${escapeHtml(label)}" data-base-label="${escapeHtml(label)}" data-week-index="${index}" data-age="${age}" data-week="${week}" style="--stage-filled:${cellGradient(stages)}"></button>`
      );
    }
  }

  axis.innerHTML = labels.join("");
  grid.innerHTML = cells.join("");
}

function createLegend() {
  legend.innerHTML = selectedProfile.stages
    .map(
      (stage) => `
        <span class="legend-item">
          <i style="--stage-filled:${stage.filled}"></i>
          <span>
            <strong>${escapeHtml(stage.label)}</strong>
            <small>${escapeHtml(stageRangeLabel(stage))} / ${escapeHtml(stage.location)}</small>
          </span>
        </span>
      `
    )
    .join("");
}

function calculateLifeAge(value: string, referenceDate = new Date()): LifeAge {
  const birthday = parseLocalDate(value);
  if (!birthday) {
    return {
      fullYears: 0,
      fullWeeksThisYear: 0,
      remainingDaysThisYear: 0,
      currentWeekCell: 0,
      filledCells: 0,
      elapsedWeeks: 0
    };
  }

  const today = startOfLocalDay(referenceDate);
  const birthDate = startOfLocalDay(birthday);
  const elapsedDaysSinceBirth = Math.floor((today.getTime() - birthDate.getTime()) / msPerDay);
  if (elapsedDaysSinceBirth < 0) {
    return {
      fullYears: 0,
      fullWeeksThisYear: 0,
      remainingDaysThisYear: 0,
      currentWeekCell: 0,
      filledCells: 0,
      elapsedWeeks: 0
    };
  }

  let fullYears = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (birthdayThisYear.getTime() > today.getTime()) {
    fullYears -= 1;
  }

  const lastBirthday = new Date(birthDate.getFullYear() + fullYears, birthDate.getMonth(), birthDate.getDate());
  const daysThisYear = Math.floor((today.getTime() - lastBirthday.getTime()) / msPerDay);
  const fullWeeksThisYear = Math.floor(daysThisYear / 7);
  const remainingDaysThisYear = daysThisYear % 7;
  const currentWeekCell = Math.min(
    weeksPerYear,
    fullWeeksThisYear + (remainingDaysThisYear > 0 || daysThisYear === 0 ? 1 : 0)
  );

  return {
    fullYears,
    fullWeeksThisYear,
    remainingDaysThisYear,
    currentWeekCell,
    filledCells: Math.min(totalWeeks, fullYears * weeksPerYear + currentWeekCell),
    elapsedWeeks: Math.min(totalWeeks, Math.floor(elapsedDaysSinceBirth / 7))
  };
}

function calculateDatePosition(profile: PersonProfile, eventValue: string | Date): EventCellPosition | null {
  const birthday = parseLocalDate(profile.birthDate);
  const eventDate = eventValue instanceof Date ? eventValue : parseLocalDate(eventValue);
  if (!birthday || !eventDate) return null;

  const birthDate = startOfLocalDay(birthday);
  const lifeEventDate = startOfLocalDay(eventDate);
  const hundredthBirthday = addYears(birthDate, years);
  if (lifeEventDate.getTime() < birthDate.getTime() || lifeEventDate.getTime() >= hundredthBirthday.getTime()) {
    return null;
  }

  let age = lifeEventDate.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(lifeEventDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (birthdayThisYear.getTime() > lifeEventDate.getTime()) {
    age -= 1;
  }

  const lastBirthday = addYears(birthDate, age);
  const daysThisYear = Math.floor((lifeEventDate.getTime() - lastBirthday.getTime()) / msPerDay);
  const weekInYear = clamp(Math.floor(daysThisYear / 7), 0, weeksPerYear - 1);

  return {
    index: age * weeksPerYear + weekInYear,
    age,
    weekInYear,
    date: lifeEventDate
  };
}

function parseEventPrecision(value: string): EventPrecision | null {
  if (value === "day" || value === "month" || value === "year" || value === "age") return value;
  return null;
}

function ageFromEventLabel(label: string | undefined) {
  const match = /^\s*age\s+(\d{1,3})\s*$/i.exec(label ?? "");
  return match ? clamp(Number(match[1]), 0, years - 1) : null;
}

function inferEventPrecision(lifeEvent: LifeEvent): EventPrecision {
  if (lifeEvent.datePrecision) return lifeEvent.datePrecision;
  if (ageFromEventLabel(lifeEvent.dateLabel) !== null) return "age";
  if (/^\d{4}-\d{1,2}$/.test(lifeEvent.dateLabel ?? "")) return "month";
  if (/^\d{4}$/.test(lifeEvent.dateLabel ?? "")) return "year";
  return "day";
}

function firstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function firstDayOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function firstDayOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function firstDayOfNextYear(date: Date) {
  return new Date(date.getFullYear() + 1, 0, 1);
}

function eventDateRange(profile: PersonProfile, lifeEvent: LifeEvent, precision: EventPrecision) {
  const birth = parseLocalDate(profile.birthDate);
  const eventDate = parseLocalDate(lifeEvent.date);
  if (!birth || !eventDate) return null;

  const birthDate = startOfLocalDay(birth);
  const anchorDate = startOfLocalDay(eventDate);
  let startDate = anchorDate;
  let endDate = addDays(anchorDate, 1);

  if (precision === "month") {
    startDate = firstDayOfMonth(anchorDate);
    endDate = firstDayOfNextMonth(anchorDate);
  }

  if (precision === "year") {
    startDate = firstDayOfYear(anchorDate);
    endDate = firstDayOfNextYear(anchorDate);
  }

  if (precision === "age") {
    const anchorPosition = calculateDatePosition(profile, anchorDate);
    const age = ageFromEventLabel(lifeEvent.dateLabel) ?? anchorPosition?.age ?? 0;
    startDate = addYears(birthDate, age);
    endDate = addYears(birthDate, age + 1);
  }

  const hundredthBirthday = addYears(birthDate, years);
  const clampedStart = startDate.getTime() < birthDate.getTime() ? birthDate : startDate;
  const clampedEnd = endDate.getTime() > hundredthBirthday.getTime() ? hundredthBirthday : endDate;
  if (clampedEnd.getTime() <= clampedStart.getTime()) return null;

  return {
    startDate: clampedStart,
    endDate: clampedEnd
  };
}

function positionFromIndex(index: number, date: Date): EventCellPosition {
  return {
    index,
    age: Math.floor(index / weeksPerYear),
    weekInYear: index % weeksPerYear,
    date
  };
}

function eventSegmentsForRange(profile: PersonProfile, startDate: Date, endDate: Date) {
  const startPosition = calculateDatePosition(profile, startDate);
  const endPosition = calculateDatePosition(profile, addDays(endDate, -1));
  if (!startPosition || !endPosition) return [];

  const segments: EventSegment[] = [];
  for (let age = startPosition.age; age <= endPosition.age; age += 1) {
    const startWeek = age === startPosition.age ? startPosition.weekInYear : 0;
    const endWeek = age === endPosition.age ? endPosition.weekInYear : weeksPerYear - 1;
    if (endWeek < startWeek) continue;
    segments.push({
      age,
      startWeek,
      endWeek,
      startIndex: age * weeksPerYear + startWeek,
      endIndex: age * weeksPerYear + endWeek
    });
  }

  return segments;
}

function calculateEventPosition(profile: PersonProfile, eventValue: LifeEvent | string): EventPosition | null {
  const lifeEvent =
    typeof eventValue === "string"
      ? {
          id: "draft-event",
          date: eventValue,
          datePrecision: "day" as const,
          stageId: "",
          message: ""
        }
      : eventValue;
  const precision = inferEventPrecision(lifeEvent);
  const range = eventDateRange(profile, lifeEvent, precision);
  if (!range) return null;

  const segments = eventSegmentsForRange(profile, range.startDate, range.endDate);
  if (!segments.length) return null;

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const midpointIndex =
    precision === "day"
      ? firstSegment.startIndex
      : Math.floor((firstSegment.startIndex + lastSegment.endIndex) / 2);
  const anchorPosition = positionFromIndex(midpointIndex, parseLocalDate(lifeEvent.date) ?? range.startDate);

  return {
    ...anchorPosition,
    precision,
    startDate: range.startDate,
    endDate: range.endDate,
    segments
  };
}

function formatProfileDate(value: string) {
  const date = parseLocalDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatEventDate(lifeEvent: LifeEvent) {
  return lifeEvent.dateLabel ?? formatProfileDate(lifeEvent.date);
}

function precisionRangeAgeLabel(position: EventPosition) {
  const firstAge = position.segments[0]?.age ?? position.age;
  const lastAge = position.segments[position.segments.length - 1]?.age ?? position.age;
  return firstAge === lastAge ? `age ${firstAge}` : `age ${firstAge}-${lastAge}`;
}

function formatEventPositionDetail(position: EventPosition) {
  if (position.precision === "day") {
    return `age ${position.age}, week ${position.weekInYear + 1}`;
  }

  if (position.precision === "month") {
    return `${precisionRangeAgeLabel(position)}, known month`;
  }

  if (position.precision === "year") {
    return `${precisionRangeAgeLabel(position)}, known year`;
  }

  return `age ${position.age} row`;
}

function formatAgeDetail(age: LifeAge) {
  return `${age.fullYears} years, ${age.fullWeeksThisYear} weeks, ${age.remainingDaysThisYear} days`;
}

function countCharacters(value: string) {
  return Array.from(value.trim()).length;
}

function updateEventCount() {
  eventCount.textContent = `${countCharacters(eventCopyInput.value)} / ${maxEventCharacters}`;
}

function setEventError(message: string, tone: "error" | "success" = "error") {
  eventError.textContent = message;
  eventError.classList.toggle("is-success", tone === "success");
}

function setProfileImportStatus(message: string, tone: "error" | "success" = "error") {
  aiProfileStatus.textContent = message;
  aiProfileStatus.classList.toggle("is-success", tone === "success");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textField(record: Record<string, unknown>, key: string, fallback = "") {
  const value = record[key];
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function firstTextField(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = textField(record, key);
    if (value) return value;
  }
  return fallback;
}

function clampText(value: string, maxCharacters: number) {
  const characters = Array.from(value.trim());
  if (characters.length <= maxCharacters) return value.trim();
  return `${characters.slice(0, Math.max(0, maxCharacters - 3)).join("").trimEnd()}...`;
}

function isValidDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const date = parseLocalDate(value);
  return (
    date !== null &&
    date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
  );
}

function requireDateValue(value: string, fieldName: string) {
  if (!isValidDateValue(value)) {
    throw new Error(`${fieldName} must be a valid YYYY-MM-DD date.`);
  }
  return value;
}

function normalizeHexColor(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function slugFromText(value: string, fallback: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || fallback;
}

function uniqueId(baseId: string, existingIds: Set<string>) {
  let candidate = baseId;
  let suffix = 2;
  while (existingIds.has(candidate)) {
    candidate = `${baseId}-${suffix}`;
    suffix += 1;
  }
  existingIds.add(candidate);
  return candidate;
}

function profilePromptTarget() {
  return aiNameInput.value.trim() || "[PERSON_NAME]";
}

function buildAiProfilePrompt(personName: string) {
  const target = personName.trim() || "[PERSON_NAME]";

  return [
    `Research ${target} and return data for a local Life in Weeks profile.`,
    "",
    "Return only one JSON object. Do not wrap it in Markdown. Use public, high-confidence facts. Use YYYY-MM-DD for every machine date. If an exact day is unknown, use a representative anchor date inside the known month/year/age, add dateLabel with the visible value, and set datePrecision to month, year, or age. Omit deathDate if the person is living.",
    "",
    "Schema:",
    "{",
    `  "name": "${target}",`,
    '  "birthDate": "YYYY-MM-DD",',
    '  "deathDate": "YYYY-MM-DD",',
    `  "headline": "${target}, one week at a time.",`,
    '  "subtitle": "One sentence explaining the biography arc shown by stages, overlaps, and pinned events.",',
    '  "sourceNote": "One short sentence naming the source families used, such as official biographies, institution pages, interviews, and reliable references.",',
    '  "stages": [',
    '    {',
    '      "id": "early-life",',
    '      "label": "Early life",',
    '      "startDate": "YYYY-MM-DD",',
    '      "endDate": "YYYY-MM-DD",',
    '      "location": "Primary place or region",',
    '      "behavior": "Dominant work pattern or identity in this period",',
    '      "color": "#ead1cc",',
    '      "filled": "#bd6658"',
    '    }',
    '  ],',
    '  "events": [',
    '    {',
    '      "id": "born",',
    '      "date": "YYYY-MM-DD",',
    '      "dateLabel": "optional visible label",',
    '      "datePrecision": "day | month | year | age",',
    '      "stageId": "early-life",',
    '      "message": "Short event note, 120 characters max"',
    '    }',
    '  ]',
    "}",
    "",
    "Rules:",
    "- Omit deathDate entirely for living people.",
    "- Omit stage.endDate for the current stage of a living person or the final stage of a deceased person.",
    "- Use 4 to 9 stages that cover the public life from birth to deathDate or today.",
    "- Each event.stageId must match one stage id.",
    "- Use 8 to 16 events, ordered chronologically, including birth and the most trajectory-changing moments.",
    "- Use datePrecision day only when the exact day is known. Use month/year/age when only that precision is supported.",
    "- Keep event messages factual, concrete, and no longer than 120 characters.",
    "- Colors may be omitted; if included, use 6-digit hex values."
  ].join("\n");
}

function updateAiProfilePrompt() {
  aiPromptOutput.value = buildAiProfilePrompt(profilePromptTarget());
}

function extractJsonPayload(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Paste the AI JSON response first.");
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new Error("The pasted response is not valid JSON.");
  }
}

function normalizeImportedStages(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("The profile needs a stages array.");
  }

  const usedIds = new Set<string>();
  const stages = value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`stages[${index}] must be an object.`);
    }

    const palette = generatedStagePalette[index % generatedStagePalette.length];
    const label = firstTextField(item, ["label", "name"], `Stage ${index + 1}`);
    const id = uniqueId(slugFromText(firstTextField(item, ["id", "label", "name"], label), `stage-${index + 1}`), usedIds);
    const startDate = requireDateValue(textField(item, "startDate"), `stages[${index}].startDate`);
    const endDateText = textField(item, "endDate");
    const endDate = endDateText ? requireDateValue(endDateText, `stages[${index}].endDate`) : undefined;

    if (endDate) {
      const start = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      if (start && end && end.getTime() < start.getTime()) {
        throw new Error(`stages[${index}].endDate must be after startDate.`);
      }
    }

    return {
      id,
      label: clampText(label, 42),
      startDate,
      endDate,
      color: normalizeHexColor(textField(item, "color"), palette.color),
      filled: normalizeHexColor(textField(item, "filled"), palette.filled),
      location: clampText(firstTextField(item, ["location", "place"], "Location unknown"), 72),
      behavior: clampText(firstTextField(item, ["behavior", "pattern", "description"], "Public life stage"), 96)
    };
  });

  if (!stages.length) {
    throw new Error("Add at least one stage.");
  }

  return stages;
}

function stageIdForImportedEvent(stages: DevelopmentStage[], eventDateValue: string) {
  const eventDate = parseLocalDate(eventDateValue);
  if (!eventDate) return stages[0]?.id ?? "stage-1";

  const eventTime = startOfLocalDay(eventDate).getTime();
  let matchedStage: DevelopmentStage | undefined;
  stages.forEach((stage) => {
    const start = parseLocalDate(stage.startDate);
    const end = stage.endDate ? parseLocalDate(stage.endDate) : null;
    if (!start) return;
    const startTime = startOfLocalDay(start).getTime();
    const endTime = end ? addDays(startOfLocalDay(end), 1).getTime() : Number.POSITIVE_INFINITY;
    if (startTime <= eventTime && eventTime < endTime) {
      matchedStage = stage;
    }
  });

  return matchedStage?.id ?? stages[0]?.id ?? "stage-1";
}

function normalizeImportedEvents(value: unknown, stages: DevelopmentStage[], birthDate: string, deathDate?: string) {
  if (!Array.isArray(value)) {
    throw new Error("The profile needs an events array.");
  }

  const birth = parseLocalDate(birthDate);
  const death = deathDate ? parseLocalDate(deathDate) : null;
  if (!birth) throw new Error("birthDate is invalid.");

  const hundredthBirthday = addYears(startOfLocalDay(birth), years);
  const stageIds = new Set(stages.map((stage) => stage.id));
  const usedIds = new Set<string>();

  const events = value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`events[${index}] must be an object.`);
    }

    const date = requireDateValue(textField(item, "date"), `events[${index}].date`);
    const parsedDate = parseLocalDate(date);
    if (!parsedDate) {
      throw new Error(`events[${index}].date is invalid.`);
    }

    const eventTime = startOfLocalDay(parsedDate).getTime();
    if (eventTime < startOfLocalDay(birth).getTime() || eventTime >= hundredthBirthday.getTime()) {
      throw new Error(`events[${index}].date must fit between birth and the 100th birthday.`);
    }

    if (death && eventTime > startOfLocalDay(death).getTime()) {
      throw new Error(`events[${index}].date is after deathDate.`);
    }

    const message = firstTextField(item, ["message", "description", "summary", "label"]);
    if (!message) {
      throw new Error(`events[${index}].message is required.`);
    }

    const requestedStageId = slugFromText(textField(item, "stageId"), "");
    const stageId = requestedStageId && stageIds.has(requestedStageId) ? requestedStageId : stageIdForImportedEvent(stages, date);
    const id = uniqueId(slugFromText(firstTextField(item, ["id", "message"], message), `event-${index + 1}`), usedIds);
    const dateLabel = textField(item, "dateLabel");
    const datePrecision = parseEventPrecision(textField(item, "datePrecision"));

    return {
      id,
      date,
      ...(dateLabel ? { dateLabel: clampText(dateLabel, 24) } : {}),
      ...(datePrecision ? { datePrecision } : {}),
      stageId,
      message: clampText(message, maxEventCharacters)
    };
  });

  if (!events.length) {
    throw new Error("Add at least one event.");
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeImportedProfile(value: unknown): PersonProfile {
  if (!isRecord(value)) {
    throw new Error("The pasted data must be one JSON object.");
  }

  const name = firstTextField(value, ["name", "personName"]);
  if (!name) {
    throw new Error("The profile name is required.");
  }

  const birthDate = requireDateValue(textField(value, "birthDate"), "birthDate");
  const deathDateText = textField(value, "deathDate");
  const deathDate = deathDateText ? requireDateValue(deathDateText, "deathDate") : undefined;
  if (deathDate) {
    const birth = parseLocalDate(birthDate);
    const death = parseLocalDate(deathDate);
    if (birth && death && death.getTime() < birth.getTime()) {
      throw new Error("deathDate must be after birthDate.");
    }
  }

  const stages = normalizeImportedStages(value.stages);
  const events = normalizeImportedEvents(value.events, stages, birthDate, deathDate);
  const safeName = clampText(name, 64);

  return {
    id: slugFromText(firstTextField(value, ["id", "name"], safeName), "imported-profile"),
    name: safeName,
    birthDate,
    deathDate,
    headline: clampText(textField(value, "headline", `${safeName}, one week at a time.`), 96),
    subtitle: clampText(
      textField(
        value,
        "subtitle",
        "A 5,200-square biography container built from pasted stages, events, and public date ranges."
      ),
      220
    ),
    sourceNote: clampText(
      textField(value, "sourceNote", "Generated from pasted JSON. Verify dates before sharing."),
      220
    ),
    stages,
    events
  };
}

function addImportedProfile(profile: PersonProfile) {
  const existingIds = new Set(profiles.map((item) => item.id));
  const importedProfile = {
    ...profile,
    id: uniqueId(profile.id, existingIds)
  };

  profiles.push(importedProfile);
  profileEventState.set(importedProfile.id, [...importedProfile.events]);
  populateProfiles();
  profileSelect.value = importedProfile.id;
  activeMode = "profile";
  selectProfile(importedProfile.id);
  setProfileImportStatus(`${importedProfile.name} rendered from pasted JSON.`, "success");
}

function fallbackCopyAiPrompt() {
  aiPromptOutput.focus();
  aiPromptOutput.select();
  const copied = document.execCommand("copy");
  setProfileImportStatus(copied ? "Prompt copied." : "Prompt selected for copying.", "success");
}

function copyAiPrompt() {
  updateAiProfilePrompt();
  if (!navigator.clipboard) {
    fallbackCopyAiPrompt();
    return;
  }

  navigator.clipboard
    .writeText(aiPromptOutput.value)
    .then(() => setProfileImportStatus("Prompt copied.", "success"))
    .catch(fallbackCopyAiPrompt);
}

function importProfileFromAiResponse() {
  try {
    const payload = extractJsonPayload(aiProfileJsonInput.value);
    addImportedProfile(normalizeImportedProfile(payload));
  } catch (error) {
    setProfileImportStatus(error instanceof Error ? error.message : "Could not import this profile.");
  }
}

function updateCellState(filledWeeks: number) {
  grid.querySelectorAll<HTMLElement>(".week-cell").forEach((cell) => {
    const index = Number(cell.dataset.weekIndex);
    cell.classList.toggle("is-lived", index < filledWeeks);
  });
}

function resetEventCells() {
  grid.querySelectorAll<HTMLElement>(".week-cell").forEach((cell) => {
    cell.classList.remove("has-event");
    cell.classList.remove("has-event-range");
    cell.style.removeProperty("--event-color");
    if (cell.dataset.baseLabel) {
      cell.setAttribute("aria-label", cell.dataset.baseLabel);
    }
  });
}

function getPositionedEvents() {
  return lifeEvents
    .map((lifeEvent) => {
      const position = calculateEventPosition(selectedProfile, lifeEvent);
      return position ? { lifeEvent, position } : null;
    })
    .filter((lifeEvent): lifeEvent is PositionedEvent => lifeEvent !== null)
    .sort((a, b) => a.position.index - b.position.index || a.lifeEvent.date.localeCompare(b.lifeEvent.date));
}

function placeVariableEventNotes(anchorYs: number[], noteHeights: number[], stageHeight: number, noteGap = eventNoteGap) {
  if (!anchorYs.length) return [];

  const noteTops = anchorYs.map((anchorY, index) => {
    const maxTop = Math.max(0, stageHeight - noteHeights[index]);
    return clamp(anchorY - noteHeights[index] / 2, 0, maxTop);
  });

  for (let index = 1; index < noteTops.length; index += 1) {
    noteTops[index] = Math.max(noteTops[index], noteTops[index - 1] + noteHeights[index - 1] + noteGap);
  }

  for (let index = noteTops.length - 1; index >= 0; index -= 1) {
    const maxTop = Math.max(0, stageHeight - noteHeights[index]);
    if (index === noteTops.length - 1) {
      noteTops[index] = Math.min(noteTops[index], maxTop);
    } else {
      noteTops[index] = Math.min(noteTops[index], noteTops[index + 1] - noteHeights[index] - noteGap);
    }
  }

  return noteTops.map((top, index) => clamp(top, 0, Math.max(0, stageHeight - noteHeights[index])));
}

function stackVariableEventNotes(noteHeights: number[], noteGap = eventNoteGap) {
  let top = 0;
  return noteHeights.map((height) => {
    const noteTop = top;
    top += height + noteGap;
    return noteTop;
  });
}

function useCompactEventLayout() {
  return window.innerWidth <= compactEventBreakpoint;
}

function prepareAnnotationStage(eventCount: number, compact: boolean, stackHeight?: number) {
  const hasEvents = eventCount > 0;
  chartCard.classList.toggle("has-events", hasEvents);
  annotationStage.classList.toggle("has-events", hasEvents);
  annotationStage.style.paddingTop = "";
  annotationStage.style.minHeight = "";

  if (compact && hasEvents) {
    const estimate = eventCount * (eventNoteHeight + eventNoteGap) + 18;
    annotationStage.style.minHeight = `${grid.offsetHeight + (stackHeight ?? estimate) + 22}px`;
  }
}

function eventColor(lifeEvent: LifeEvent) {
  return stageById(lifeEvent.stageId)?.filled ?? "#161512";
}

function eventStageLabel(lifeEvent: LifeEvent) {
  return stageById(lifeEvent.stageId)?.label ?? "Unmapped stage";
}

function renderLifeEvents() {
  resetEventCells();
  eventLines.replaceChildren();
  eventNotes.replaceChildren();

  const positionedEvents = getPositionedEvents();
  prepareAnnotationStage(positionedEvents.length, useCompactEventLayout());
  if (!positionedEvents.length) return;

  const compact = useCompactEventLayout();
  let stageRect = annotationStage.getBoundingClientRect();
  let gridRect = grid.getBoundingClientRect();
  if (stageRect.width === 0 || stageRect.height === 0) return;

  eventLines.setAttribute("width", String(stageRect.width));
  eventLines.setAttribute("height", String(stageRect.height));
  eventLines.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);

  type MeasuredEvent = PositionedEvent & {
    cell: HTMLElement;
    anchorX: number;
    anchorY: number;
    railSegments: {
      startX: number;
      endX: number;
      y: number;
    }[];
  };

  const measureEvents = (): MeasuredEvent[] =>
    positionedEvents
      .map(({ lifeEvent, position }) => {
        const cell = grid.querySelector<HTMLElement>(`[data-week-index="${position.index}"]`);
        if (!cell) return null;

        const cellRect = cell.getBoundingClientRect();
        const railSegments = position.segments
          .map((segment) => {
            const startCell = grid.querySelector<HTMLElement>(`[data-week-index="${segment.startIndex}"]`);
            const endCell = grid.querySelector<HTMLElement>(`[data-week-index="${segment.endIndex}"]`);
            if (!startCell || !endCell) return null;
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const railOffset = compact ? 1 : 2;
            return {
              startX: startRect.left - stageRect.left + startRect.width / 2,
              endX: endRect.left - stageRect.left + endRect.width / 2,
              y: startRect.top - stageRect.top + startRect.height + railOffset
            };
          })
          .filter((segment): segment is { startX: number; endX: number; y: number } => segment !== null);
        const anchorSegment =
          position.precision === "day"
            ? null
            : railSegments.reduce<{ startX: number; endX: number; y: number } | null>((widest, segment) => {
                if (!widest) return segment;
                return segment.endX - segment.startX > widest.endX - widest.startX ? segment : widest;
              }, null);

        return {
          lifeEvent,
          position,
          cell,
          anchorX: anchorSegment ? (anchorSegment.startX + anchorSegment.endX) / 2 : cellRect.left - stageRect.left + cellRect.width / 2,
          anchorY: anchorSegment ? anchorSegment.y : cellRect.top - stageRect.top + cellRect.height / 2,
          railSegments
        };
      })
      .filter((event): event is MeasuredEvent => event !== null);

  let measuredEvents = measureEvents();
  let noteLeft = compact ? gridRect.left - stageRect.left : gridRect.right - stageRect.left + 54;
  const notes = measuredEvents.map((event) => {
    const color = eventColor(event.lifeEvent);
    const note = document.createElement("article");
    note.className = "event-note";
    note.classList.toggle("event-note--range", event.position.precision !== "day");
    note.style.left = `${noteLeft}px`;
    note.style.top = "0";
    note.style.visibility = "hidden";
    note.style.setProperty("--event-color", color);
    note.dataset.eventId = event.lifeEvent.id;

    const date = document.createElement("time");
    date.dateTime = event.lifeEvent.date;
    date.textContent = `${formatEventDate(event.lifeEvent)} / ${formatEventPositionDetail(event.position)} / ${eventStageLabel(event.lifeEvent)}`;

    const message = document.createElement("div");
    message.textContent = event.lifeEvent.message;

    note.append(date, message);
    eventNotes.append(note);
    return note;
  });

  const noteHeights = notes.map((note) => note.getBoundingClientRect().height);
  if (compact) {
    const stackHeight = noteHeights.reduce((total, height) => total + height + eventNoteGap, 0) + 18;
    prepareAnnotationStage(positionedEvents.length, true, stackHeight);
    stageRect = annotationStage.getBoundingClientRect();
    gridRect = grid.getBoundingClientRect();
    eventLines.setAttribute("width", String(stageRect.width));
    eventLines.setAttribute("height", String(stageRect.height));
    eventLines.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    measuredEvents = measureEvents();
    noteLeft = gridRect.left - stageRect.left;
    notes.forEach((note) => {
      note.style.left = `${noteLeft}px`;
    });
  }

  const noteTops = compact
    ? stackVariableEventNotes(noteHeights).map((top) => top + (gridRect.bottom - stageRect.top) + 18)
    : placeVariableEventNotes(
        measuredEvents.map((event) => event.anchorY),
        noteHeights,
        stageRect.height
      );

  measuredEvents.forEach((event, index) => {
    const color = eventColor(event.lifeEvent);
    const baseLabel = event.cell.getAttribute("aria-label") ?? "";
    event.cell.classList.add(event.position.precision === "day" ? "has-event" : "has-event-range");
    if (event.position.precision === "day") {
      event.cell.style.setProperty("--event-color", color);
    }
    event.cell.setAttribute(
      "aria-label",
      `${baseLabel}. ${event.position.precision === "day" ? "Event" : "Approximate event"} on ${formatEventDate(event.lifeEvent)}: ${event.lifeEvent.message}`
    );

    const noteTop = noteTops[index];
    const noteAnchorX = compact ? noteLeft + 8 : noteLeft;
    const noteAnchorY = compact ? noteTop : noteTop + 22;
    const compactRailY = gridRect.bottom - stageRect.top + 10;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", `event-line${event.position.precision === "day" ? "" : " event-line--range"}`);
    path.style.setProperty("--event-color", color);
    const pathDefinition = compact
      ? [
          `M ${event.anchorX.toFixed(1)} ${event.anchorY.toFixed(1)}`,
          `L ${event.anchorX.toFixed(1)} ${compactRailY.toFixed(1)}`,
          `L ${noteAnchorX.toFixed(1)} ${compactRailY.toFixed(1)}`,
          `L ${noteAnchorX.toFixed(1)} ${noteAnchorY.toFixed(1)}`
        ].join(" ")
      : [
          `M ${event.anchorX.toFixed(1)} ${event.anchorY.toFixed(1)}`,
          `C ${(event.anchorX + 42).toFixed(1)} ${event.anchorY.toFixed(1)},`,
          `${(noteLeft - 34).toFixed(1)} ${noteAnchorY.toFixed(1)},`,
          `${noteLeft.toFixed(1)} ${noteAnchorY.toFixed(1)}`
        ].join(" ");
    path.setAttribute("d", pathDefinition);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("class", event.position.precision === "day" ? "event-line-dot" : "event-range-anchor");
    dot.style.setProperty("--event-color", color);
    dot.setAttribute("cx", event.anchorX.toFixed(1));
    dot.setAttribute("cy", event.anchorY.toFixed(1));
    dot.setAttribute("r", event.position.precision === "day" ? "3" : "4");

    const rangeRails =
      event.position.precision === "day"
        ? []
        : event.railSegments.map((segment) => {
            const rail = document.createElementNS("http://www.w3.org/2000/svg", "path");
            rail.setAttribute("class", `event-range-marker event-range-marker--${event.position.precision}`);
            rail.style.setProperty("--event-color", color);
            rail.setAttribute(
              "d",
              `M ${segment.startX.toFixed(1)} ${segment.y.toFixed(1)} L ${segment.endX.toFixed(1)} ${segment.y.toFixed(1)}`
            );
            return rail;
          });

    const note = notes[index];
    note.style.left = `${noteLeft}px`;
    note.style.top = `${noteTop}px`;
    note.style.visibility = "";

    eventLines.append(...rangeRails, path, dot);
  });
}

function countOverlappedWeeks(filledWeeks: number) {
  let overlapCount = 0;
  for (let index = 0; index < filledWeeks; index += 1) {
    const age = Math.floor(index / weeksPerYear);
    const week = index % weeksPerYear;
    if (stagesForWeek(selectedProfile, age, week).length > 1) {
      overlapCount += 1;
    }
  }
  return overlapCount;
}

function activeReflectionLine() {
  return activeMode === "personal" ? personalReflectionLine : readingPrompts[selectedReadingPrompt];
}

function updateProfileTitle() {
  if (activeMode === "personal") {
    profileTitle.replaceChildren("Your life, one week", document.createElement("br"), "at a time.");
    return;
  }

  profileTitle.textContent = selectedProfile.headline;
}

function updateCopy(age: LifeAge) {
  const remaining = Math.max(0, totalWeeks - age.filledCells);
  const percent = Math.min(100, (age.filledCells / totalWeeks) * 100);
  const referenceDate = getReferenceDate(selectedProfile);
  const activeNow = stagesForDate(selectedProfile, referenceDate).map((stage) => stage.label);
  const overlapCount = countOverlappedWeeks(age.filledCells);
  const dateRange = selectedProfile.deathDate
    ? `${formatProfileDate(selectedProfile.birthDate)} - ${formatProfileDate(selectedProfile.deathDate)}`
    : `Born ${formatProfileDate(selectedProfile.birthDate)}`;
  const ageLabel = selectedProfile.deathDate ? "lifespan" : "age";
  const activeStageLabel = selectedProfile.deathDate ? "Final" : "Now";
  const currentPersonalPhase = activeNow[activeNow.length - 1];

  updateProfileTitle();
  profileSubtitle.textContent = selectedProfile.subtitle;
  sourceNote.textContent =
    activeMode === "personal"
      ? activeReflectionLine()
      : `${selectedProfile.sourceNote} ${activeReflectionLine()}`;

  if (activeMode === "personal") {
    pageEyebrow.textContent = "KISKIR / personal timeline";
    stats.textContent = `${dateRange} / ${age.elapsedWeeks.toLocaleString()} elapsed weeks / ${ageLabel} ${formatAgeDetail(age)} / ${remaining.toLocaleString()} squares before 100.`;
    shareLine.textContent = "";
    viralNoteContainer?.setAttribute("hidden", "");
    exportTitle.textContent = "Personal Timeline";
    exportSummary.textContent = `${selectedProfile.stages.length} life phases / ${lifeEvents.length} personal events mapped / ${percent.toFixed(1)}% of the 100-year grid filled.`;
    stageCardLabel.textContent = "Life phases";
    stageCardCopy.textContent = "Each color maps to a broad life phase.";
    stageMetric.textContent = `${selectedProfile.stages.length} phases`;
    behaviorCardLabel.textContent = "Current phase";
    behaviorCardCopy.textContent = "Phase notes describe the general context of this birthday year.";
    behaviorMetric.textContent = currentPersonalPhase ?? "No active phase";
    eventCardLabel.textContent = "Personal moments";
    eventCardCopy.textContent = "Exact notes pin to weeks; approximate moments can span a month, year, or age row.";
    eventMetric.textContent = `${lifeEvents.length} events mapped`;
    return;
  }

  pageEyebrow.textContent = "KISKIR / public figure profile";
  viralNoteContainer?.setAttribute("hidden", "");
  stats.textContent = `${selectedProfile.name} / ${dateRange} / ${age.elapsedWeeks.toLocaleString()} elapsed weeks / ${ageLabel} ${formatAgeDetail(age)} / ${remaining.toLocaleString()} squares before 100.`;
  shareLine.textContent = activeReflectionLine();
  exportTitle.textContent = `${selectedProfile.name} in Weeks`;
  exportSummary.textContent = `${selectedProfile.stages.length} stages / ${lifeEvents.length} mapped events / ${overlapCount.toLocaleString()} lived weeks contain overlapping stages / ${percent.toFixed(1)}% of the 100-year grid filled.`;
  stageCardLabel.textContent = "Stage recognition";
  stageCardCopy.textContent = "Each color maps to a named public development stage.";
  stageMetric.textContent = `${selectedProfile.stages.length} stages`;
  behaviorCardLabel.textContent = "Behavior analysis";
  behaviorCardCopy.textContent = "Stage notes describe the dominant public work pattern.";
  behaviorMetric.textContent = activeNow.length
    ? `${activeStageLabel}: ${activeNow.join(" + ")}`
    : "No active public stage";
  eventCardLabel.textContent = "Event tracking";
  eventCardCopy.textContent = "Exact events pin to weeks; approximate public dates draw honest month, year, or age spans.";
  eventMetric.textContent = `${lifeEvents.length} events mapped`;
  viralNote.textContent = activeReflectionLine();
}

function setReadingPrompt(prompt: keyof typeof readingPrompts) {
  selectedReadingPrompt = prompt;
  const copy = activeReflectionLine();
  shareLine.textContent = copy;
  viralNote.textContent = copy;
  readingButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.readingPrompt === prompt);
  });
}

function displayProfile() {
  const lifeAge = calculateLifeAge(selectedProfile.birthDate, getReferenceDate(selectedProfile));
  selectedLifeAge = lifeAge;
  selectedWeeks = lifeAge.filledCells;
  createGrid();
  createLegend();
  updateCopy(lifeAge);
  updateCellState(selectedWeeks);
  renderLifeEvents();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawSplitCell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, colors: string[]) {
  ctx.save();
  roundedRect(ctx, x, y, size, size, 2);
  ctx.clip();
  const segment = size / colors.length;
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + index * segment, y, segment + 0.5, size);
  });
  ctx.restore();
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  const pushWrappedWord = (word: string) => {
    let fragment = "";
    Array.from(word).forEach((character) => {
      const nextFragment = `${fragment}${character}`;
      if (ctx.measureText(nextFragment).width <= maxWidth || !fragment) {
        fragment = nextFragment;
      } else {
        lines.push(fragment);
        fragment = character;
      }
    });
    currentLine = fragment;
  };

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(nextLine).width <= maxWidth || !currentLine) {
      if (ctx.measureText(word).width > maxWidth && !currentLine) {
        pushWrappedWord(word);
      } else {
        currentLine = nextLine;
      }
    } else {
      lines.push(currentLine);
      if (ctx.measureText(word).width > maxWidth) {
        pushWrappedWord(word);
      } else {
        currentLine = word;
      }
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length ? lines : [text];
}

function drawExportImage() {
  const canvas = document.createElement("canvas");
  const scale = 2;
  const width = 1700;
  const height = 2220;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#F6F4EC";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#141414";
  ctx.textAlign = "center";
  ctx.font = "76px Georgia, serif";
  ctx.fillText(activeMode === "personal" ? "Personal Timeline" : `${selectedProfile.name} in Weeks`, width / 2, 112);

  ctx.fillStyle = "#73706A";
  ctx.font = "26px Avenir Next, Avenir, Gill Sans, sans-serif";
  const summary = selectedLifeAge
    ? `${formatProfileDate(selectedProfile.birthDate)}${selectedProfile.deathDate ? ` - ${formatProfileDate(selectedProfile.deathDate)}` : ""} / ${selectedProfile.deathDate ? "lifespan" : "age"} ${formatAgeDetail(selectedLifeAge)} / ${selectedProfile.stages.length} stages / ${lifeEvents.length} mapped events`
    : "5,200 squares = 100 birthday years.";
  ctx.fillText(summary, width / 2, 164);

  const left = 96;
  const top = 236;
  const cell = 12;
  const gap = 3;
  const axisGap = 42;
  const gridWidth = weeksPerYear * cell + (weeksPerYear - 1) * gap;
  const gridHeight = years * cell + (years - 1) * gap;
  const gridLeft = left + axisGap;
  const referenceDate = getReferenceDate(selectedProfile);

  ctx.textAlign = "right";
  ctx.font = "18px Avenir Next, Avenir, Gill Sans, sans-serif";

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = displayRow;
    const y = top + displayRow * (cell + gap);
    ctx.fillStyle = "#8D8981";
    if (age % 5 === 0) ctx.fillText(String(age), left - 18, y + 15);

    for (let week = 0; week < weeksPerYear; week += 1) {
      const index = age * weeksPerYear + week;
      const x = gridLeft + week * (cell + gap);
      const stages = index < selectedWeeks ? stagesForWeek(selectedProfile, age, week, referenceDate) : [];
      drawSplitCell(ctx, x, y, cell, index < selectedWeeks ? activeStageColors(stages) : ["#ddd8cc80"]);
    }
  }

  const positionedEvents = getPositionedEvents();
  const noteLeft = gridLeft + gridWidth + 70;
  const canvasRailY = (age: number) => top + age * (cell + gap) + cell + 2;
  const canvasAnchor = (position: EventPosition) => {
    if (position.precision === "day") {
      return {
        x: gridLeft + position.weekInYear * (cell + gap) + cell / 2,
        y: top + position.age * (cell + gap) + cell / 2
      };
    }

    const widestSegment = position.segments.reduce<EventSegment | null>((widest, segment) => {
      if (!widest) return segment;
      return segment.endIndex - segment.startIndex > widest.endIndex - widest.startIndex ? segment : widest;
    }, null);

    if (!widestSegment) {
      return {
        x: gridLeft + position.weekInYear * (cell + gap) + cell / 2,
        y: top + position.age * (cell + gap) + cell / 2
      };
    }

    const startX = gridLeft + widestSegment.startWeek * (cell + gap) + cell / 2;
    const endX = gridLeft + widestSegment.endWeek * (cell + gap) + cell / 2;
    return {
      x: (startX + endX) / 2,
      y: canvasRailY(widestSegment.age)
    };
  };
  ctx.font = "23px Georgia, serif";
  const exportNotes = positionedEvents.map(({ lifeEvent }) => {
    const lines = wrapCanvasText(ctx, lifeEvent.message, 430).slice(0, 3);
    return {
      lines,
      height: 78 + (lines.length - 1) * 27
    };
  });
  const noteTops = placeVariableEventNotes(
    positionedEvents.map(({ position }) => canvasAnchor(position).y - top),
    exportNotes.map((note) => note.height),
    gridHeight,
    12
  );

  positionedEvents.forEach(({ lifeEvent, position }, index) => {
    const exportNote = exportNotes[index];
    const color = eventColor(lifeEvent);
    const { x: anchorX, y: anchorY } = canvasAnchor(position);
    const noteTop = top + noteTops[index];
    const noteAnchorY = noteTop + 31;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    if (position.precision !== "day") {
      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.lineWidth = position.precision === "month" ? 3 : 2.2;
      ctx.setLineDash(position.precision === "month" ? [] : [7, 6]);
      position.segments.forEach((segment) => {
        const startX = gridLeft + segment.startWeek * (cell + gap) + cell / 2;
        const endX = gridLeft + segment.endWeek * (cell + gap) + cell / 2;
        const y = canvasRailY(segment.age);
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      });
      ctx.restore();
    }

    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.bezierCurveTo(anchorX + 42, anchorY, noteLeft - 38, noteAnchorY, noteLeft, noteAnchorY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, position.precision === "day" ? 4 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFDF8";
    ctx.lineWidth = 3;
    if (position.precision === "day") {
      roundedRect(ctx, anchorX - 6, anchorY - 6, 12, 12, 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(anchorX, anchorY, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 253, 248, 0.92)";
    roundedRect(ctx, noteLeft, noteTop, 470, exportNote.height, 4);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillRect(noteLeft, noteTop, 4, exportNote.height);

    ctx.textAlign = "left";
    ctx.fillStyle = "#777269";
    ctx.font = "15px Avenir Next, Avenir, Gill Sans, sans-serif";
    ctx.fillText(
      `${formatEventDate(lifeEvent)} / ${formatEventPositionDetail(position)} / ${eventStageLabel(lifeEvent)}`,
      noteLeft + 18,
      noteTop + 21
    );

    ctx.fillStyle = "#272520";
    ctx.font = "23px Georgia, serif";
    exportNote.lines.forEach((line, lineIndex) => {
      ctx.fillText(line, noteLeft + 18, noteTop + 54 + lineIndex * 27);
    });
  });

  const legendTop = top + gridHeight + 58;
  ctx.textAlign = "left";
  ctx.font = "21px Avenir Next, Avenir, Gill Sans, sans-serif";
  selectedProfile.stages.forEach((stage, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 176 + col * 630;
    const y = legendTop + row * 64;
    ctx.fillStyle = stage.filled;
    roundedRect(ctx, x, y - 22, 26, 26, 3);
    ctx.fill();
    ctx.fillStyle = "#292723";
    ctx.fillText(`${stage.label} / ${stageRangeLabel(stage)}`, x + 40, y);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#8D8981";
  ctx.font = "18px Avenir Next, Avenir, Gill Sans, sans-serif";
  ctx.fillText(activeReflectionLine(), width / 2, height - 62);

  return canvas;
}

function exportImage() {
  const canvas = drawExportImage();
  const link = document.createElement("a");
  link.download = `${selectedProfile.id}-in-weeks.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function populateProfiles() {
  profileSelect.innerHTML = profiles
    .map((profile) => `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`)
    .join("");
}

function getStoredProfileEvents(profile: PersonProfile) {
  const storedEvents = profileEventState.get(profile.id);
  if (storedEvents) return [...storedEvents];
  const fallbackEvents = [...profile.events];
  profileEventState.set(profile.id, fallbackEvents);
  return fallbackEvents;
}

function resetEventForm() {
  eventDateInput.value = "";
  eventCopyInput.value = "";
  setEventError("");
  updateEventCount();
}

function setPersonalStatus(message: string, tone: "error" | "success" = "success") {
  personalStatus.textContent = message;
  personalStatus.classList.toggle("is-error", tone === "error");
}

function setEventDateBounds() {
  const birth = parseLocalDate(selectedProfile.birthDate);
  eventDateInput.min = selectedProfile.birthDate;

  if (!birth) {
    eventDateInput.removeAttribute("max");
    return;
  }

  if (selectedProfile.deathDate) {
    eventDateInput.max = selectedProfile.deathDate;
    return;
  }

  eventDateInput.max = formatDateValue(addDays(addYears(startOfLocalDay(birth), years), -1));
}

function syncModeUi() {
  appShell.dataset.mode = activeMode;
  modeButtons.forEach((button) => {
    const isSelected = button.dataset.modeOption === activeMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  modePanels.forEach((panel) => {
    panel.hidden = panel.dataset.modePanel !== activeMode;
  });

  if (activeMode === "personal") {
    eventKicker.textContent = "Personal events";
    eventTitle.textContent = "Pin a moment to your timeline.";
    eventDateLabel.textContent = "Moment date";
    eventCopyLabel.textContent = "Note";
    eventCopyInput.placeholder = "Brief private note (120 chars max)";
    eventSubmit.textContent = "Add Moment";
  } else {
    eventKicker.textContent = "Life events";
    eventTitle.textContent = "Pin another event to the profile.";
    eventDateLabel.textContent = "Event date";
    eventCopyLabel.textContent = "Annotation";
    eventCopyInput.placeholder = "Brief note (120 chars max)";
    eventSubmit.textContent = "Add Event";
  }

  setEventDateBounds();
}

function renderPersonalTimeline(statusMessage = "") {
  const birthdayValue = personalBirthDateInput.value;
  if (!isValidDateValue(birthdayValue)) {
    setPersonalStatus("Choose a valid birthday.", "error");
    return false;
  }

  const birthday = parseLocalDate(birthdayValue);
  if (!birthday || startOfLocalDay(birthday).getTime() > startOfLocalDay(new Date()).getTime()) {
    setPersonalStatus("Birthday cannot be in the future.", "error");
    return false;
  }

  personalBirthDate = birthdayValue;
  selectedProfile = createPersonalProfile(personalBirthDate, personalEventDrafts);
  lifeEvents = [...selectedProfile.events];
  nextEventId = lifeEvents.length + 1;
  syncModeUi();
  displayProfile();
  setPersonalStatus(statusMessage);
  return true;
}

function selectProfile(profileId: string) {
  publicSelectedProfile = profiles.find((profile) => profile.id === profileId) ?? profiles[0];
  selectedProfile = publicSelectedProfile;
  lifeEvents = getStoredProfileEvents(selectedProfile);
  nextEventId = lifeEvents.length + 1;
  resetEventForm();
  syncModeUi();
  displayProfile();
}

function activateMode(mode: AppMode) {
  activeMode = mode;
  resetEventForm();
  syncModeUi();

  if (activeMode === "personal") {
    renderPersonalTimeline();
    return;
  }

  profileSelect.value = publicSelectedProfile.id;
  selectProfile(publicSelectedProfile.id);
}

function inferStageForEvent(dateValue: string) {
  const date = parseLocalDate(dateValue);
  if (!date) return selectedProfile.stages[0]?.id ?? "custom";
  const stages = stagesForDate(selectedProfile, date);
  return stages[stages.length - 1]?.id ?? selectedProfile.stages[0]?.id ?? "custom";
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.modeOption === "profile" ? "profile" : "personal";
    activateMode(mode);
  });
});

personalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeMode = "personal";
  syncModeUi();
  renderPersonalTimeline("Timeline rendered.");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  activeMode = "profile";
  selectProfile(profileSelect.value);
});

profileSelect.addEventListener("change", () => {
  activeMode = "profile";
  selectProfile(profileSelect.value);
});

exportButtons.forEach((button) => {
  button.addEventListener("click", exportImage);
});

aiNameInput.addEventListener("input", () => {
  updateAiProfilePrompt();
  setProfileImportStatus("");
});

copyProfilePromptButton.addEventListener("click", copyAiPrompt);
importProfileButton.addEventListener("click", importProfileFromAiResponse);

readingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.readingPrompt as keyof typeof readingPrompts;
    setReadingPrompt(prompt);
    updateCopy(selectedLifeAge ?? calculateLifeAge(selectedProfile.birthDate, getReferenceDate(selectedProfile)));
  });
});

eventCopyInput.addEventListener("input", () => {
  updateEventCount();
  if (countCharacters(eventCopyInput.value) <= maxEventCharacters) {
    setEventError("");
  }
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = eventCopyInput.value.trim();
  const characterCount = countCharacters(message);
  if (!eventDateInput.value) {
    setEventError("Choose an event date.");
    return;
  }

  if (!message) {
    setEventError("Write the annotation text.");
    return;
  }

  if (characterCount > maxEventCharacters) {
    setEventError("Keep the annotation within 120 characters.");
    return;
  }

  const position = calculateEventPosition(selectedProfile, eventDateInput.value);
  if (!position) {
    setEventError(
      activeMode === "personal"
        ? "Moment date must fit between your birthday and 100th birthday."
        : "Event date must fit between the profile birthday and 100th birthday."
    );
    return;
  }

  if (activeMode === "personal") {
    personalEventDrafts = [
      ...personalEventDrafts,
      {
        id: `personal-event-${nextPersonalEventId}`,
        date: eventDateInput.value,
        message
      }
    ];
    nextPersonalEventId += 1;
  } else {
    lifeEvents = [
      ...lifeEvents,
      {
        id: `event-${nextEventId}`,
        date: eventDateInput.value,
        stageId: inferStageForEvent(eventDateInput.value),
        message
      }
    ];
    nextEventId += 1;
    profileEventState.set(selectedProfile.id, lifeEvents);
  }

  eventDateInput.value = "";
  eventCopyInput.value = "";
  updateEventCount();
  if (activeMode === "personal") {
    renderPersonalTimeline();
    setEventError("Moment pinned to the grid.", "success");
    return;
  }

  setEventError("Event pinned to the grid.", "success");
  updateCopy(selectedLifeAge ?? calculateLifeAge(selectedProfile.birthDate, getReferenceDate(selectedProfile)));
  renderLifeEvents();
});

window.addEventListener("resize", renderLifeEvents);

populateProfiles();
updateAiProfilePrompt();
personalBirthDateInput.value = personalBirthDate;
profileSelect.value = publicSelectedProfile.id;
setReadingPrompt("stages");
activateMode("personal");
