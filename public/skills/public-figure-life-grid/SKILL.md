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
5. Audit every event connector line against the matching pinned event card. Regenerate until the connector check passes.
6. Return the image, profile JSON, image prompt, source notes, and connector-audit result.

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
- Event connector integrity is mandatory: each connector line must start on the exact event week cell and terminate on the matching pinned event bullet or the left edge of that same event card.
- Do not draw detached intermediate dots, loose line endpoints, or connector lines that stop in blank space between the grid and the pinned-event list.
- Do not let one connector point to a different date card. The date label beside the card must match the event marker/date that the line starts from.
- Preferred safe layout: place pinned-event cards near their actual event cells, using left-side, right-side, top, or bottom callouts as needed. Do not force every event into a single right-side rail if that makes lines start from row edges instead of event cells.
- The marker belongs on the actual 100 x 52 grid cell for the event date, not on the age axis, not on the right boundary, and not on a convenient proxy position.
- The connector may travel across the grid/gutter, but its first visible point must be the exact event cell marker.
- Keep `Stage Legend` separate from connector traffic, below the grid or in a farther column. Do not place the legend between any event marker and its card.
- If the line-to-card geometry becomes crowded, use numbered markers and matching numbered cards, but still keep a visible one-to-one mapping.
- Include a compact legend with each stage label and age/year span.
- No gradients, decorative blobs, stock-photo backgrounds, or portrait collages.

## Date-to-Cell Calculation

Compute every event marker from the subject's birthday before generating the image:

```text
age row = full birthday years elapsed on the event date
last birthday = birth month/day in the event year, or previous year if the event is before that year's birthday
days since last birthday = event date - last birthday
week column = floor(days since last birthday / 7) + 1, clamped to 1..52
```

Examples:

- If birthDate is `1975-05-19`, the birth event `1975-05-19` is `age 0, week 1`.
- If birthDate is `1975-05-19`, current date `2026-07-04` is `age 51, week 7`.
- If birthDate is `1975-05-19`, event `2026-04-20` is `age 50, week 49` because it happens before the 51st birthday.

Never move an event to the end of its age row just to make connector routing easier.

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
- Calculate each event marker's `age row` and `week column` from the birthday. Place the marker on that exact square. Do not move it to the row edge for convenience.
- Connector accuracy is required: every connector line must visibly originate from the exact grid event cell and run to the matching event card in the Pinned Events list, touching that card's bullet or left edge. Never end a connector at a free-floating dot or blank margin. Never connect a marker to the wrong date card.
- Keep Pinned Events in chronological order and keep connector endpoints aligned to the same row as their matching card. If visual crowding makes this hard, add small matching numbers on the grid marker and card.
- Place each Pinned Event card near its event marker so the connector visibly starts at the exact cell. Use a left callout for left-side cells and a right callout for right-side cells. Do not force all cards into one right rail if that would cause proxy row-edge connectors.
- Put numbered grid event markers on the exact event cells. Do not put connector numbers on the left age axis or right grid boundary unless that boundary is the real event cell.
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

## Connector Audit

After each generated image, inspect the connectors before returning the result:

1. Count grid event markers, connector lines, and pinned event cards. They should map one-to-one for every connected event.
2. Check each marker's cell position against the date-to-cell calculation. If the birth event is not at `age 0, week 1`, or a dated event is on the wrong age/week cell, the image fails.
3. Trace each connector from its exact grid cell marker to the right side. The line must visibly touch the matching event card's bullet, label, or left edge.
4. Compare the connected card's date label with the marker's event date. If a marker for `2001` points to a `2013` card, the image fails.
5. Reject images with loose dots, orphaned line endings, connectors stopping in empty space, or lines crossing into the wrong card.
6. Reject images where a connector starts from a row edge, gutter, axis, or boundary proxy while the event marker is elsewhere on the row.
7. Reject images where the stage legend sits between an event marker and its pinned-event card.
8. Reject images where numbered markers appear on an axis or boundary proxy instead of the exact event cell.
9. If any connector or cell position fails, regenerate with a correction prompt that explicitly says: `Fix the event anchors and connectors: calculate each event's age row and week column from the birthday, place every marker on the exact event cell, move each card near its marker if needed, connect that exact cell directly to the matching pinned event card, remove proxy edge connectors and intermediary dots, and keep all other style unchanged.`

## Completion Checklist

- Profile JSON parses as one object.
- Dates are valid `YYYY-MM-DD`; approximate dates have visible labels.
- Stage ids are unique; event stage ids resolve.
- Every event marker is on the correct age/week cell computed from birthDate and event date.
- Every visible connector line starts at the exact event cell and terminates at the matching pinned event card, with no loose endpoint dots or wrong-card connections.
- Output includes the generated image or image file path.
- Output includes the exact image prompt used.
- Output lists the source families checked and any date precision caveats.
