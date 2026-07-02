type LifeStage = {
  label: string;
  range: string;
  min: number;
  max: number;
  color: string;
  filled: string;
};

const stages: LifeStage[] = [
  { label: "Baby & Toddler", range: "0-2", min: 0, max: 2, color: "#F6C9D7", filled: "#E95488" },
  { label: "Preschool", range: "3-5", min: 3, max: 5, color: "#FFD89E", filled: "#F59E0B" },
  { label: "Child", range: "6-12", min: 6, max: 12, color: "#F7EFA6", filled: "#D6B50D" },
  { label: "Teen", range: "13-17", min: 13, max: 17, color: "#BDECC8", filled: "#22A05A" },
  { label: "Young Adult", range: "18-24", min: 18, max: 24, color: "#A8E6E0", filled: "#0891B2" },
  { label: "Adult", range: "25-39", min: 25, max: 39, color: "#BFD7FF", filled: "#2563EB" },
  { label: "Middle-aged", range: "40-64", min: 40, max: 64, color: "#D4C7F9", filled: "#7C3AED" },
  { label: "Senior", range: "65+", min: 65, max: 99, color: "#D8D4CC", filled: "#6B7280" }
];

const weeksPerYear = 52;
const years = 100;
const totalWeeks = weeksPerYear * years;
const animationChunkSize = 44;
const msPerDay = 24 * 60 * 60 * 1000;

type LifeAge = {
  fullYears: number;
  fullWeeksThisYear: number;
  remainingDaysThisYear: number;
  currentWeekCell: number;
  filledCells: number;
  elapsedWeeks: number;
};
const sharePrompts = {
  parents: "I just saw my life in weeks. It made me want to call you.",
  partner: "This is my life in weeks. I want more of these with you.",
  friend: "This made me think of the weeks we already spent together, and the ones we should still make happen."
} as const;

function requireElement<T extends Element>(selector: string) {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Life in Weeks markup is missing ${selector}.`);
  }
  return element;
}

const form = requireElement<HTMLFormElement>("[data-life-form]");
const birthdayInput = requireElement<HTMLInputElement>("[data-birthday]");
const grid = requireElement<HTMLElement>("[data-life-grid]");
const axis = requireElement<HTMLElement>("[data-age-axis]");
const legend = requireElement<HTMLElement>("[data-legend]");
const stats = requireElement<HTMLElement>("[data-life-stats]");
const shareLine = requireElement<HTMLElement>("[data-share-line]");
const exportButton = requireElement<HTMLButtonElement>("[data-export]");
const exportTitle = requireElement<HTMLElement>("[data-export-title]");
const exportSummary = requireElement<HTMLElement>("[data-export-summary]");
const viralNote = requireElement<HTMLElement>("[data-viral-note]");
const shareButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-share-prompt]"));

let selectedWeeks = 0;
let selectedBirthday = "";
let selectedLifeAge: LifeAge | null = null;
let animationFrame = 0;
let selectedSharePrompt: keyof typeof sharePrompts | null = null;

function stageForAge(age: number) {
  return stages.find((stage) => age >= stage.min && age <= stage.max) ?? stages[stages.length - 1];
}

function createGrid() {
  const cells: string[] = [];
  const labels: string[] = [];

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = displayRow;
    labels.push(`<span>${age}</span>`);

    for (let week = 0; week < weeksPerYear; week += 1) {
      const index = age * weeksPerYear + week;
      const stage = stageForAge(age);
      cells.push(
        `<button class="week-cell" type="button" aria-label="Age ${age}, week ${week + 1}" data-week-index="${index}" data-age="${age}" style="--stage:${stage.color};--stage-filled:${stage.filled}"></button>`
      );
    }
  }

  axis.innerHTML = labels.join("");
  grid.innerHTML = cells.join("");
}

function createLegend() {
  legend.innerHTML = stages
    .map(
      (stage) => `
        <span class="legend-item">
          <i style="--stage:${stage.color};--stage-filled:${stage.filled}"></i>
          <span>${stage.range}</span>
          <strong>${stage.label}</strong>
        </span>
      `
    )
    .join("");
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(value: string) {
  const birthday = new Date(`${value}T00:00:00`);
  return Number.isNaN(birthday.getTime()) ? null : birthday;
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

function updateCellState(filledWeeks: number) {
  grid.querySelectorAll<HTMLElement>(".week-cell").forEach((cell) => {
    const index = Number(cell.dataset.weekIndex);
    cell.classList.toggle("is-lived", index < filledWeeks);
  });
}

function animateTo(targetWeeks: number) {
  cancelAnimationFrame(animationFrame);
  updateCellState(0);

  let current = 0;
  const step = () => {
    current = Math.min(targetWeeks, current + animationChunkSize);
    updateCellState(current);
    if (current < targetWeeks) {
      animationFrame = requestAnimationFrame(step);
    }
  };

  animationFrame = requestAnimationFrame(step);
}

function formatBirthday(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatAgeDetail(age: LifeAge) {
  return `${age.fullYears} years, ${age.fullWeeksThisYear} weeks, ${age.remainingDaysThisYear} days`;
}

function updateCopy(age: LifeAge, birthday: string) {
  const remaining = Math.max(0, totalWeeks - age.filledCells);
  const percent = Math.min(100, (age.filledCells / totalWeeks) * 100);

  stats.textContent = `${formatBirthday(birthday)} · ${age.elapsedWeeks.toLocaleString()} elapsed weeks · age ${formatAgeDetail(age)} · current square week ${age.currentWeekCell} · ${remaining.toLocaleString()} squares before 100.`;
  shareLine.textContent = selectedSharePrompt ? sharePrompts[selectedSharePrompt] : `This week is one square. Choose it like it matters.`;
  exportTitle.textContent = `Life in Weeks: ${age.fullYears} years, week ${age.currentWeekCell}`;
  exportSummary.textContent = `${age.filledCells.toLocaleString()} of 5,200 squares filled (${percent.toFixed(1)}%). Actual age: ${formatAgeDetail(age)}.`;
}

function setSharePrompt(prompt: keyof typeof sharePrompts) {
  selectedSharePrompt = prompt;
  const copy = sharePrompts[prompt];
  shareLine.textContent = copy;
  viralNote.textContent = copy;
  shareButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.sharePrompt === prompt);
  });
}

function displayLife(value: string) {
  const lifeAge = calculateLifeAge(value);
  selectedBirthday = value;
  selectedLifeAge = lifeAge;
  selectedWeeks = lifeAge.filledCells;
  updateCopy(lifeAge, value);
  animateTo(selectedWeeks);
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

function drawExportImage() {
  const canvas = document.createElement("canvas");
  const scale = 2;
  const width = 1400;
  const height = 1880;
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  ctx.scale(scale, scale);
  ctx.fillStyle = "#F8F7F2";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#141414";
  ctx.textAlign = "center";
  ctx.font = "76px Georgia, serif";
  ctx.fillText("Life in Weeks", width / 2, 112);

  ctx.fillStyle = "#73706A";
  ctx.font = "28px ui-monospace, SFMono-Regular, Menlo, monospace";
  const summary = selectedBirthday
    ? `${formatBirthday(selectedBirthday)} · age ${selectedLifeAge ? formatAgeDetail(selectedLifeAge) : ""} · ${Math.max(0, totalWeeks - selectedWeeks).toLocaleString()} squares before 100`
    : "5,200 squares = 100 birthday years. Filled squares use age-season color.";
  ctx.fillText(summary, width / 2, 164);

  const left = 116;
  const top = 236;
  const cell = 18;
  const gap = 4;
  const axisGap = 42;

  ctx.textAlign = "right";
  ctx.font = "18px ui-monospace, SFMono-Regular, Menlo, monospace";

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = displayRow;
    const y = top + displayRow * (cell + gap);
    const stage = stageForAge(age);
    ctx.fillStyle = "#8D8981";
    if (age % 5 === 0 || age < 10) ctx.fillText(String(age), left - 18, y + 15);

    for (let week = 0; week < weeksPerYear; week += 1) {
      const index = age * weeksPerYear + week;
      const x = left + axisGap + week * (cell + gap);
      ctx.fillStyle = index < selectedWeeks ? stage.filled : "#D8D4CC";
      roundedRect(ctx, x, y, cell, cell, 2);
      ctx.fill();
    }
  }

  const legendTop = top + years * (cell + gap) + 42;
  ctx.textAlign = "left";
  ctx.font = "23px ui-monospace, SFMono-Regular, Menlo, monospace";
  stages.forEach((stage, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = 176 + col * 286;
    const y = legendTop + row * 56;
    ctx.fillStyle = stage.filled;
    roundedRect(ctx, x, y - 22, 26, 26, 3);
    ctx.fill();
    ctx.fillStyle = "#4B4843";
    ctx.fillText(`${stage.range} ${stage.label}`, x + 40, y);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#141414";
  ctx.font = "30px Georgia, serif";
  ctx.fillText(selectedSharePrompt ? sharePrompts[selectedSharePrompt] : "Which square are you spending this week on?", width / 2, height - 62);

  return canvas;
}

function exportImage() {
  const canvas = drawExportImage();
  const link = document.createElement("a");
  const suffix = selectedBirthday ? selectedBirthday : "blank";
  link.download = `life-in-weeks-${suffix}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!birthdayInput.value) return;
  displayLife(birthdayInput.value);
});

exportButton.addEventListener("click", exportImage);

shareButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.sharePrompt as keyof typeof sharePrompts;
    setSharePrompt(prompt);
  });
});

createGrid();
createLegend();
