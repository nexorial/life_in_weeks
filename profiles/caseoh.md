# CaseOh

## Status

Batch-generated public-figure Life in Weeks profile.

## Agency Agents Line

> Variety-stream comic turning self-aware banter into appointment-viewing comfort chaos.

## Source Families Checked

- [Wikitubia: CaseOh](https://youtube.fandom.com/wiki/CaseOh) for public biography and event cross-checks.
- [Famous Birthdays: CaseOh](https://www.famousbirthdays.com/people/caseoh.html) for public biography and event cross-checks.
- [The Streamer Awards winners](https://thestreamerawards.com/winners) for public biography and event cross-checks.
- [CaseOh YouTube channel](https://www.youtube.com/@caseoh_) for public biography and event cross-checks.

## Verification Notes

- Birth and death dates prefer Wikidata structured values, then the Wikipedia biography when Wikidata is incomplete.
- Some public events have only year or month precision in the source text; those use midpoint machine dates plus visible labels.
- The chronology below is intentionally selective: it favors dated, source-visible turning points over exhaustive coverage.
- Stage labels are editorial groupings for the Life in Weeks visualization; event rows carry the source-grounded facts.

## Verified Chronology

| Date | Event | Validation |
| --- | --- | --- |
| 1998-05-09 | Born in Arkansas as Case Dylan Baker. | Famous Birthdays; Wikitubia |
| Age 14 | Develops a strong interest in games including NBA 2K and Call of Duty. | Wikitubia; approximate age date |
| Before streaming | Works maintenance and lawn-mowing jobs before full-time streaming. | Wikitubia; approximate machine date |
| 2022 | Starts gaining attention on TikTok with gaming and reaction clips. | Wikitubia; creator biography summaries |
| 2023 | Reaction clips and variety-game streams push him into wider Twitch visibility. | Wikitubia; public platform pages |
| 2024 | YouTube and Twitch audience scale sharply as daily stream clips spread. | YouTube channel; public creator summaries |
| 2024 | Wins Content Creator of the Year at The Game Awards 2024. | The Game Awards public results; public coverage |
| 2025 | Wins Best Variety Streamer at The Streamer Awards. | The Streamer Awards winners page |

## Life in Weeks JSON

```json
{
  "name": "CaseOh",
  "birthDate": "1998-05-09",
  "headline": "CaseOh, one week at a time.",
  "subtitle": "CaseOh's public life is mapped through stages, overlapping roles, and sourced events from birth to today.",
  "sourceNote": "No stable English Wikipedia biography was available during generation; dates were checked against Wikitubia, Famous Birthdays, The Streamer Awards, and public channel pages.",
  "stages": [
    {
      "id": "early-life",
      "label": "Early life",
      "startDate": "1998-05-09",
      "endDate": "2012-07-01",
      "location": "Public record",
      "behavior": "Early life: Platform experimentation, audience growth, format shifts, and creator-business leverage",
      "color": "#ead1cc",
      "filled": "#bd6658"
    },
    {
      "id": "first-platforms",
      "label": "First platforms",
      "startDate": "2012-07-01",
      "endDate": "2022-07-01",
      "location": "Public record",
      "behavior": "First platforms: Platform experimentation, audience growth, format shifts, and creator-business leverage",
      "color": "#b8ddd9",
      "filled": "#247f85"
    },
    {
      "id": "breakthrough",
      "label": "Breakthrough attention",
      "startDate": "2022-07-01",
      "endDate": "2024-07-01",
      "location": "Public record",
      "behavior": "Breakthrough attention: Platform experimentation, audience growth, format shifts, and creator-business leverage",
      "color": "#edce8c",
      "filled": "#b7791f"
    },
    {
      "id": "scale",
      "label": "Scaled audience",
      "startDate": "2024-07-01",
      "location": "Public record",
      "behavior": "Scaled audience: Platform experimentation, audience growth, format shifts, and creator-business leverage",
      "color": "#c9c0df",
      "filled": "#725ca0"
    }
  ],
  "events": [
    {
      "id": "born",
      "date": "1998-05-09",
      "stageId": "early-life",
      "message": "Born in Arkansas as Case Dylan Baker."
    },
    {
      "id": "gaming-childhood",
      "date": "2012-07-01",
      "dateLabel": "Age 14",
      "stageId": "first-platforms",
      "message": "Develops a strong interest in games including NBA 2K and Call of Duty."
    },
    {
      "id": "pre-streaming-work",
      "date": "2021-07-01",
      "dateLabel": "Before streaming",
      "stageId": "first-platforms",
      "message": "Works maintenance and lawn-mowing jobs before full-time streaming."
    },
    {
      "id": "tiktok-attention",
      "date": "2022-07-01",
      "dateLabel": "2022",
      "stageId": "breakthrough",
      "message": "Starts gaining attention on TikTok with gaming and reaction clips."
    },
    {
      "id": "viral-rise",
      "date": "2023-07-01",
      "dateLabel": "2023",
      "stageId": "breakthrough",
      "message": "Reaction clips and variety-game streams push him into wider Twitch visibility."
    },
    {
      "id": "million-youtube",
      "date": "2024-07-01",
      "dateLabel": "2024",
      "stageId": "scale",
      "message": "YouTube and Twitch audience scale sharply as daily stream clips spread."
    },
    {
      "id": "game-awards",
      "date": "2024-12-12",
      "dateLabel": "2024",
      "stageId": "scale",
      "message": "Wins Content Creator of the Year at The Game Awards 2024."
    },
    {
      "id": "streamer-awards",
      "date": "2025-12-07",
      "dateLabel": "2025",
      "stageId": "scale",
      "message": "Wins Best Variety Streamer at The Streamer Awards."
    }
  ]
}
```
