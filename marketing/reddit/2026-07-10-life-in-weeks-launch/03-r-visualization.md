# r/visualization

Status: Draft only — not posted.

Current rules: https://www.reddit.com/r/visualization/about/rules

Format: Native image post, 48–72 hours after the previous post

Image: [assets/lionel-messi-in-weeks.png](assets/lionel-messi-in-weeks.png)

Suggested flair: `Feedback`, `Discussion`, or `Design`, whichever is available

## Title

```text
How would you show a year-only event on a week-level biography without implying a precise date?
```

## Body

```markdown
I’m testing a 100-year week grid for public biographies. This example maps Lionel Messi through eight overlapping stages and these 15 sourced events:

- **June 24, 1987** — Born in Rosario, Argentina.
- **2000 (year precision)** — Moves to Barcelona and enters the club's youth system after leaving Newell's Old Boys.
- **October 16, 2004** — Makes his official FC Barcelona first-team debut.
- **June 16, 2006** — Scores on his World Cup debut, becoming Argentina's youngest scorer at the tournament.
- **May 27, 2009** — Scores in the Champions League final as Barcelona completes a historic treble.
- **December 1, 2009** — Wins his first Ballon d'Or.
- **July 10, 2021** — Captains Argentina to the Copa América title, his first senior international trophy.
- **August 10, 2021** — Joins Paris Saint-Germain after leaving Barcelona.
- **December 18, 2022** — Captains Argentina to the World Cup title and receives the tournament's Golden Ball.
- **July 15, 2023** — Inter Miami announces his signing.
- **August 19, 2023** — Leads Inter Miami to the Leagues Cup, the club's first trophy.
- **October 30, 2023** — Wins a record-extending eighth Ballon d'Or.
- **July 14, 2024** — Argentina retains the Copa América title.
- **June 16, 2026** — Scores a hat trick in his 200th Argentina appearance and sixth World Cup.
- **July 7, 2026** — Scores the 83rd-minute equalizer as Argentina comes from 2–0 down to beat Egypt 3–2.

His move into Barcelona’s youth system is supported only as “2000,” while most later milestones have exact dates. I represent that uncertainty with a dashed year span and a visible “2000” label instead of assigning a made-up week.

Does that visual language successfully communicate “somewhere within this year,” or does the connector still imply more precision than the data supports?

I’m also unsure about overlapping stages: club and national-team periods currently appear as split-color cells. Would separate tracks be easier to read, or would they make the biography feel too much like a conventional timeline?
```

## First comment

```markdown
Implementation context, since it affects the design question:

- 52 columns per birthday year and 100 rows
- Day precision: a single weekly anchor
- Month precision: a solid span
- Year or age precision: a dashed span plus its original label
- Concurrent stages: split-color cells

The visualization is built with TypeScript and Canvas, and this image is the direct output of its “Export Image” function rather than a page screenshot.

The Messi chronology was checked against FIFA, AP, FC Barcelona, CONMEBOL, Inter Miami, and official match records. The year-level Barcelona move stays year-level because the public sources do not support one agreed exact relocation date.

I’m the maker. The interactive version is here if inspecting the states would help: https://kiskir.dev/life
```

## Before posting

- Keep the product link secondary to the actual design question.
- Do not reuse the Ronaldo image or the same title as the first post.
- Read and answer the design feedback before considering another community.
