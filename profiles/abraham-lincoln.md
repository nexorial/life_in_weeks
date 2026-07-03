# Abraham Lincoln

## Status

Batch-generated public-figure Life in Weeks profile.

## Agency Agents Line

> Held a fractured republic together with moral and political steel.

## Source Families Checked

- [Wikipedia: Abraham Lincoln](https://en.wikipedia.org/wiki/Abraham_Lincoln) for the public biography chronology and career/life-event cross-checks.
- [Wikidata: Q91](https://www.wikidata.org/wiki/Q91) for structured birth/death date checks when available.

## Verification Notes

- Birth and death dates prefer Wikidata structured values, then the Wikipedia biography when Wikidata is incomplete.
- Some public events have only year or month precision in the source text; those use midpoint machine dates plus visible labels.
- The chronology below is intentionally selective: it favors dated, source-visible turning points over exhaustive coverage.
- Stage labels are editorial groupings for the Life in Weeks visualization; event rows carry the source-grounded facts.

## Verified Chronology

| Date | Event | Validation |
| --- | --- | --- |
| 1809-02-12 | Born. | Wikidata birth date; Wikipedia biography |
| 1809-02-12 | Was the 16th president of the United States, serving from 1861 until his assassination in 1865. | Wikipedia biography |
| 1816 | The family moved to Indiana, where land titles were more reliable. | Wikipedia biography; approximate machine date |
| 1819-12-02 | Thomas married Sarah Bush Johnston, a widow with three children of her own, on December 2, 1819. | Wikipedia biography |
| March 1830 | Moved west to Illinois and settled in Macon County. | Wikipedia biography; approximate machine date |
| 1842-11-04 | Initially broke off the engagement in early 1841, but the two were reconciled and married on November 4, 1842. | Wikipedia biography |
| 1848 | When it became clear that Clay could not secure the nomination | Wikipedia biography; approximate machine date |
| 1851 | Abraham became increasingly distant from Thomas | Wikipedia biography; approximate machine date |
| 1854 | Which opened the territories to slavery | Wikipedia biography; approximate machine date |
| 1854 | Was elected to the Illinois legislature | Wikipedia biography; approximate machine date |
| 1860 | Won the 1860 presidential election, becoming the first Republican president. | Wikipedia biography; approximate machine date |
| 1860-11-06 | Was elected as the first Republican president. | Wikipedia biography |
| 1861-08-06 | Signed the Confiscation Act, | Wikipedia biography |
| June 1862 | Made an unannounced visit to West Point | Wikipedia biography; approximate machine date |
| June 1862 | However, in June 1862, Congress passed an act banning slavery in all federal territories, which Lincoln signed. | Wikipedia biography; approximate machine date |
| 1862 | Removed McClellan as general-in-chief | Wikipedia biography; approximate machine date |
| 1863-01-01 | Issued the Emancipation Proclamation, which declared the slaves in the states "in rebellion" to be free. | Wikipedia biography |
| 1863-11-19 | Delivered the Gettysburg Address, which became one of the most famous speeches in American history. | Wikipedia biography |
| 1863-12-08 | If they signed an oath of allegiance. | Wikipedia biography |
| 1864-06-30 | Lincoln signed into law the Yosemite Grant | Wikipedia biography |
| 1865-01-31 | Passage became part of Lincoln's re-election platform | Wikipedia biography |
| March 1865 | Federal banknotes became the dominant form of paper currency. | Wikipedia biography; approximate machine date |
| 1865-04-14 | Five days | Wikipedia biography |
| 1865-04-15 | Dies. | Wikidata death date; Wikipedia biography |

## Life in Weeks JSON

```json
{
  "name": "Abraham Lincoln",
  "birthDate": "1809-02-12",
  "deathDate": "1865-04-15",
  "headline": "Abraham Lincoln, one week at a time.",
  "subtitle": "Abraham Lincoln's public life is mapped through stages, overlapping roles, and sourced events from birth to death.",
  "sourceNote": "Sources checked include English Wikipedia and Wikidata for Abraham Lincoln; dates with partial precision use visible labels.",
  "stages": [
    {
      "id": "early-life",
      "label": "Early life",
      "startDate": "1809-02-12",
      "endDate": "1816-07-01",
      "location": "Public record",
      "behavior": "Early life: Coalition building, institutional power, crisis management, and public argument",
      "color": "#ead1cc",
      "filled": "#bd6658"
    },
    {
      "id": "formation",
      "label": "Political formation",
      "startDate": "1816-07-01",
      "endDate": "1842-11-04",
      "location": "Public record",
      "behavior": "Political formation: Coalition building, institutional power, crisis management, and public argument",
      "color": "#b8ddd9",
      "filled": "#247f85"
    },
    {
      "id": "rise",
      "label": "Rise to office",
      "startDate": "1842-11-04",
      "endDate": "1854-07-01",
      "location": "Public record",
      "behavior": "Rise to office: Coalition building, institutional power, crisis management, and public argument",
      "color": "#edce8c",
      "filled": "#b7791f"
    },
    {
      "id": "governing",
      "label": "Governing power",
      "startDate": "1854-07-01",
      "endDate": "1861-08-06",
      "location": "Public record",
      "behavior": "Governing power: Coalition building, institutional power, crisis management, and public argument",
      "color": "#c9c0df",
      "filled": "#725ca0"
    },
    {
      "id": "crisis",
      "label": "Crisis and legacy",
      "startDate": "1861-08-06",
      "endDate": "1863-01-01",
      "location": "Public record",
      "behavior": "Crisis and legacy: Coalition building, institutional power, crisis management, and public argument",
      "color": "#c4d8ad",
      "filled": "#5f8b3d"
    },
    {
      "id": "late-life",
      "label": "Late life",
      "startDate": "1863-01-01",
      "endDate": "1864-06-30",
      "location": "Public record",
      "behavior": "Late life: Coalition building, institutional power, crisis management, and public argument",
      "color": "#b7cbe8",
      "filled": "#3f6fa9"
    },
    {
      "id": "late-life-2",
      "label": "Late life",
      "startDate": "1864-06-30",
      "location": "Public record",
      "behavior": "Late life: Coalition building, institutional power, crisis management, and public argument",
      "color": "#e5bbb2",
      "filled": "#a44f43"
    }
  ],
  "events": [
    {
      "id": "born",
      "date": "1809-02-12",
      "stageId": "early-life",
      "message": "Born."
    },
    {
      "id": "was-the-16th-president-of-the-united-states-",
      "date": "1809-02-12",
      "stageId": "early-life",
      "message": "Was the 16th president of the United States, serving from 1861 until his assassination in 1865."
    },
    {
      "id": "the-family-moved-to-indiana-where-land-title",
      "date": "1816-07-01",
      "dateLabel": "1816",
      "stageId": "formation",
      "message": "The family moved to Indiana, where land titles were more reliable."
    },
    {
      "id": "thomas-married-sarah-bush-johnston-a-widow-w",
      "date": "1819-12-02",
      "stageId": "formation",
      "message": "Thomas married Sarah Bush Johnston, a widow with three children of her own, on December 2, 1819."
    },
    {
      "id": "moved-west-to-illinois-and-settled-in-macon-",
      "date": "1830-03-15",
      "dateLabel": "March 1830",
      "stageId": "formation",
      "message": "Moved west to Illinois and settled in Macon County."
    },
    {
      "id": "initially-broke-off-the-engagement-in-early-",
      "date": "1842-11-04",
      "stageId": "rise",
      "message": "Initially broke off the engagement in early 1841, but the two were reconciled and married on November 4, 1842."
    },
    {
      "id": "when-it-became-clear-that-clay-could-not-sec",
      "date": "1848-07-01",
      "dateLabel": "1848",
      "stageId": "rise",
      "message": "When it became clear that Clay could not secure the nomination"
    },
    {
      "id": "abraham-became-increasingly-distant-from-tho",
      "date": "1851-07-01",
      "dateLabel": "1851",
      "stageId": "rise",
      "message": "Abraham became increasingly distant from Thomas"
    },
    {
      "id": "which-opened-the-territories-to-slavery",
      "date": "1854-07-01",
      "dateLabel": "1854",
      "stageId": "governing",
      "message": "Which opened the territories to slavery"
    },
    {
      "id": "was-elected-to-the-illinois-legislature",
      "date": "1854-07-01",
      "dateLabel": "1854",
      "stageId": "governing",
      "message": "Was elected to the Illinois legislature"
    },
    {
      "id": "won-the-1860-presidential-election-becoming-",
      "date": "1860-07-01",
      "dateLabel": "1860",
      "stageId": "governing",
      "message": "Won the 1860 presidential election, becoming the first Republican president."
    },
    {
      "id": "was-elected-as-the-first-republican-presiden",
      "date": "1860-11-06",
      "stageId": "governing",
      "message": "Was elected as the first Republican president."
    },
    {
      "id": "signed-the-confiscation-act",
      "date": "1861-08-06",
      "stageId": "crisis",
      "message": "Signed the Confiscation Act,"
    },
    {
      "id": "made-an-unannounced-visit-to-west-point",
      "date": "1862-06-15",
      "dateLabel": "June 1862",
      "stageId": "crisis",
      "message": "Made an unannounced visit to West Point"
    },
    {
      "id": "however-in-june-1862-congress-passed-an-act-",
      "date": "1862-06-15",
      "dateLabel": "June 1862",
      "stageId": "crisis",
      "message": "However, in June 1862, Congress passed an act banning slavery in all federal territories, which Lincoln signed."
    },
    {
      "id": "removed-mcclellan-as-general-in-chief",
      "date": "1862-07-01",
      "dateLabel": "1862",
      "stageId": "crisis",
      "message": "Removed McClellan as general-in-chief"
    },
    {
      "id": "issued-the-emancipation-proclamation-which-d",
      "date": "1863-01-01",
      "stageId": "late-life",
      "message": "Issued the Emancipation Proclamation, which declared the slaves in the states \"in rebellion\" to be free."
    },
    {
      "id": "delivered-the-gettysburg-address-which-becam",
      "date": "1863-11-19",
      "stageId": "late-life",
      "message": "Delivered the Gettysburg Address, which became one of the most famous speeches in American history."
    },
    {
      "id": "if-they-signed-an-oath-of-allegiance",
      "date": "1863-12-08",
      "stageId": "late-life",
      "message": "If they signed an oath of allegiance."
    },
    {
      "id": "lincoln-signed-into-law-the-yosemite-grant",
      "date": "1864-06-30",
      "stageId": "late-life-2",
      "message": "Lincoln signed into law the Yosemite Grant"
    },
    {
      "id": "passage-became-part-of-lincoln-s-re-election",
      "date": "1865-01-31",
      "stageId": "late-life-2",
      "message": "Passage became part of Lincoln's re-election platform"
    },
    {
      "id": "federal-banknotes-became-the-dominant-form-o",
      "date": "1865-03-15",
      "dateLabel": "March 1865",
      "stageId": "late-life-2",
      "message": "Federal banknotes became the dominant form of paper currency."
    },
    {
      "id": "five-days",
      "date": "1865-04-14",
      "stageId": "late-life-2",
      "message": "Five days"
    },
    {
      "id": "died",
      "date": "1865-04-15",
      "stageId": "late-life-2",
      "message": "Dies."
    }
  ]
}
```
