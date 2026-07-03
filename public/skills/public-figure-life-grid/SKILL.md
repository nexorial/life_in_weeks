---
name: public-figure-life-grid
description: Build a KISKIR Life in Weeks public-figure biography poster from a single public figure name. Use when the user wants an agent to research a public person's major life events, turn the chronology into the Life in Weeks profile JSON schema, and generate a matching editorial grid image with GPT Image / gpt-image-2.
---

# Public Figure Life Grid

## Workflow

Take one public figure name and produce a sourced Life in Weeks profile plus a generated image that matches the KISKIR `/life` visual system.

1. Confirm the subject is a public figure. If the subject is private, ask for a public source or stop.
2. Search for major life events and life-stage boundaries using high-confidence public sources.
3. Build a Life in Weeks profile JSON object.
4. Generate the final image with GPT Image 2 (`gpt-image-2`) or the available GPT Image generation tool.
5. Return the image, profile JSON, image prompt, and source notes.

## Research Rules

- Prefer official biographies, institution pages, primary announcements, interviews, public archives, encyclopedias, and reliable news profiles.
- For living people, treat the current date as the end of the open stage. Do not invent future events.
- Use exact dates only when the day is source-supported. If only a month, year, or age is known, use a representative machine date and set `dateLabel` plus `datePrecision`.
- Keep the chronology selective: birth plus 8-16 trajectory-changing events.
- Avoid gossip, private addresses, private family details, allegations without strong sourcing, and derogatory framing.
- Preserve uncertainty in `sourceNote`; do not smooth approximate dates into exact dates.

## Life in Weeks JSON

Return one JSON object with this shape:

```json
{
  "name": "Person Name",
  "birthDate": "YYYY-MM-DD",
  "deathDate": "YYYY-MM-DD",
  "headline": "Person Name, one week at a time.",
  "subtitle": "One sentence explaining the biography arc shown by stages, overlaps, and pinned events.",
  "sourceNote": "Sources checked include official biography, institution pages, interviews, and reliable references; partial dates use visible labels.",
  "stages": [
    {
      "id": "early-life",
      "label": "Early life",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "location": "Primary place or region",
      "behavior": "Dominant work pattern or public identity in this period",
      "color": "#ead1cc",
      "filled": "#bd6658"
    }
  ],
  "events": [
    {
      "id": "born",
      "date": "YYYY-MM-DD",
      "dateLabel": "optional visible label",
      "datePrecision": "day",
      "stageId": "early-life",
      "message": "Short factual event note, 120 characters max"
    }
  ]
}
```

Rules:

- Omit `deathDate` for living people.
- Omit `stage.endDate` for the current stage of a living person or the final stage of a deceased person.
- Use 4-9 stages covering birth to death, or birth to today.
- Every `events[].stageId` must match a stage id.
- Keep every event `message` factual, concrete, and 120 characters or shorter.
- Order stages and events chronologically.

## Visual Style Contract

Match the KISKIR Life in Weeks poster style:

- 100 birthday-year rows by 52 week cells, 5,200 squares total.
- Cream paper background `#f6f4ec`; dark ink `#171614` / `#11110f`; muted dividers `#ded8c8`.
- Serif display headings similar to Georgia; compact sans labels similar to Avenir Next.
- Editorial data-poster composition, not a marketing hero.
- Header eyebrow: `KISKIR / LIFE IN WEEKS`.
- Headline: `{Person Name}, one week at a time.`
- Chart kicker: `Each row is one birthday year / each cell is one week`.
- Filled week cells use stage `filled` colors; future/unlived cells stay pale gray/cream.
- Overlapping stages may appear as split or striped week cells.
- Pin major events as small callout notes connected to their week cells.
- Include a compact legend with each stage label and age/year span.
- No gradients, decorative blobs, stock-photo backgrounds, or portrait collages.

Use this palette in order, repeating only if needed:

```text
#ead1cc / #bd6658
#b8ddd9 / #247f85
#edce8c / #b7791f
#c9c0df / #725ca0
#c4d8ad / #5f8b3d
#b7cbe8 / #3f6fa9
#e5bbb2 / #a44f43
#d9c7a7 / #8e6b35
```

## GPT Image Prompt

After building the JSON, create a concise prompt for `gpt-image-2`:

```text
Create a high-resolution editorial data poster in the KISKIR Life in Weeks style for {Person Name}.

Subject profile:
{compact JSON with name, birthDate/deathDate, stages, and events}

Visual requirements:
- Cream paper background (#f6f4ec), dark ink, Georgia-like serif headline, Avenir-like compact labels.
- Header: "KISKIR / LIFE IN WEEKS".
- Main headline: "{Person Name}, one week at a time."
- Show a 100-row by 52-column week grid, one row per birthday year and one tiny square per week.
- Color lived weeks by life stage using the provided filled colors; keep future/unlived weeks pale.
- Show major events as restrained annotation notes connected to exact or approximate week positions.
- Include a stage legend and one short source note.
- Keep the composition like a quiet museum data poster: precise, flat, readable, no portrait montage, no gradients, no decorative blobs.
```

If using the OpenAI Image API, prefer:

```javascript
await openai.images.generate({
  model: "gpt-image-2",
  prompt,
  size: "1024x1536",
  quality: "high"
});
```

If the local environment exposes an image-generation tool instead of the API, call that tool with the same prompt and request a portrait-oriented high-resolution image.

## Completion Checklist

- Profile JSON parses as one object.
- Dates are valid `YYYY-MM-DD`; approximate dates have visible labels.
- Stage ids are unique; event stage ids resolve.
- Output includes the generated image or image file path.
- Output includes the exact image prompt used.
- Output lists the source families checked and any date precision caveats.
