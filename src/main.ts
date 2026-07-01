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
let animationFrame = 0;
let selectedSharePrompt: keyof typeof sharePrompts | null = null;

function stageForAge(age: number) {
  return stages.find((stage) => age >= stage.min && age <= stage.max) ?? stages[stages.length - 1];
}

function createGrid() {
  const cells: string[] = [];
  const labels: string[] = [];

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = years - 1 - displayRow;
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

function calculateWeeksSinceBirth(value: string) {
  const birthday = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birthday.getTime())) return 0;

  const now = new Date();
  const diff = now.getTime() - birthday.getTime();
  if (diff <= 0) return 0;

  return Math.min(totalWeeks, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)));
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

function updateCopy(weeks: number, birthday: string) {
  const ageYears = Math.floor(weeks / weeksPerYear);
  const weekInYear = weeks % weeksPerYear;
  const remaining = Math.max(0, totalWeeks - weeks);
  const percent = Math.min(100, (weeks / totalWeeks) * 100);

  stats.textContent = `${formatBirthday(birthday)} · week ${weeks.toLocaleString()} lived · age ${ageYears}, week ${weekInYear + 1} · ${remaining.toLocaleString()} weeks before 100.`;
  shareLine.textContent = selectedSharePrompt ? sharePrompts[selectedSharePrompt] : `This week is one square. Choose it like it matters.`;
  exportTitle.textContent = `Life in Weeks: ${ageYears} years, ${weekInYear + 1} weeks`;
  exportSummary.textContent = `${weeks.toLocaleString()} of 5,200 weeks lived (${percent.toFixed(1)}%).`;
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
  selectedBirthday = value;
  selectedWeeks = calculateWeeksSinceBirth(value);
  updateCopy(selectedWeeks, value);
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
    ? `${formatBirthday(selectedBirthday)} · ${selectedWeeks.toLocaleString()} lived weeks · ${Math.max(0, totalWeeks - selectedWeeks).toLocaleString()} weeks before 100`
    : "5,200 weeks = 100 years. Color = age season.";
  ctx.fillText(summary, width / 2, 164);

  const left = 116;
  const top = 236;
  const cell = 18;
  const gap = 4;
  const axisGap = 42;

  ctx.textAlign = "right";
  ctx.font = "18px ui-monospace, SFMono-Regular, Menlo, monospace";

  for (let displayRow = 0; displayRow < years; displayRow += 1) {
    const age = years - 1 - displayRow;
    const y = top + displayRow * (cell + gap);
    const stage = stageForAge(age);
    ctx.fillStyle = "#8D8981";
    if (age % 5 === 0 || age < 10) ctx.fillText(String(age), left - 18, y + 15);

    for (let week = 0; week < weeksPerYear; week += 1) {
      const index = age * weeksPerYear + week;
      const x = left + axisGap + week * (cell + gap);
      ctx.fillStyle = index < selectedWeeks ? stage.filled : stage.color;
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
