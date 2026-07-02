# Profile in Weeks

A static KISKIR page that maps a person into a 100-year, 52-week grid.

The current sample profile is Sam Altman. The renderer is data-driven through
`PersonProfile` in `src/main.ts`: add stages with date ranges and colors, then
add life events with dates and stage IDs. If stages overlap in the same week,
the square is split into equal color bands.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
```

## Deployment Boundary

This repo is the source project. The public route is deployed through the existing `official-website` project at:

`https://kiskir.dev/life`

Keep `life_in_weeks` and `official-website/life` synchronized for public releases.
