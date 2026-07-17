# r/dataisbeautiful

Status: Draft only — not posted.

Current rules: https://www.reddit.com/r/dataisbeautiful/about/rules

Format: Native image post

Image: [assets/cristiano-ronaldo-in-weeks.png](assets/cristiano-ronaldo-in-weeks.png)

Flair: `OC`, if offered

Safest timing: Monday ET

## Title

```text
[OC] Cristiano Ronaldo’s public life and football career on a 5,200-cell week grid
```

## Optional image caption

```text
The grid uses 52 week cells per birthday year across a 100-year frame.

Colors show eight overlapping public stages; 22 annotations mark source-checked milestones. Exact dates pin to one week. When only a year is supportable—the 1997 move to Sporting’s academy, for example—the visualization keeps that reduced precision visible instead of inventing a day.

I built this to test whether a public biography can be compressed without hiding uncertainty.
```

## First top-level comment

Post this immediately after submitting the image.

```markdown
Sources + tools, from the creator:

The chronology was checked against:

- [FIFA’s account of Ronaldo’s final World Cup](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/cristiano-ronaldo-farewell) and the [official Portugal–Spain match report](https://fdp.fifa.org/assetspublic/ce281/r12538/pdf/FullTimeMatchReport-English.pdf)
- [AP on his last-World-Cup confirmation](https://www.foxsports.com/articles/soccer/cristiano-ronaldo-says-it-again-his-6th-world-cup-with-portugal-will-be-his-last) and [AP on becoming the first man to score at six World Cups](https://apnews.com/article/ronaldo-world-cup-score-b511151c5a78afb738e8249c07d30aef)
- [UEFA’s Portugal appearance and scoring records](https://www.uefa.com/uefaeuro/history/news/023f-0e9797c3479b-bdb6067609d3-1000--most-capped-european-ronaldo/) and its [EURO 2016 chronology](https://www.uefa.com/uefaeuro/history/news/0253-0d81c491a256-b198b14f955a-1000--cristiano-ronaldo-s-record-breaking-euro/)
- Official Manchester United, Real Madrid, Juventus, Al Nassr, Ballon d’Or, and UEFA records for the club and award chronology
- [Guinness World Records](https://www.guinnessworldrecords.com/news/2024/8/cristiano-ronaldo-extends-social-media-domination-as-youtube-channel-smashes-record) for the YouTube milestone

Tools and method:

- Static browser app built with TypeScript, HTML/CSS, and Canvas. The uploaded image is the app’s direct “Export Image” output.
- Exact dates map to one week cell. Month-, year-, or age-level dates retain a visible precision label and span rather than receiving a fabricated exact date.
- Concurrent stages split the color inside a cell.
- AI assisted the initial research organization and profile drafting. I reviewed the retained wording and checked each included event against the source families above. Stage names and colors are editorial groupings, not independent measurements.

Interactive version: https://kiskir.dev/life
```

## Before posting

- Keep `[OC]` and the plain descriptive title.
- Do not replace “final World Cup” with “retirement.”
- The source/tool comment is required; the image footer names only source families.
- `5,200` means the designed 52 × 100 frame, not an exact Gregorian-century total.

