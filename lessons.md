# lessons.md

Check this file before editing the project.

## 2026-07-01 - Deploy Boundary

The project source lives in `life_in_weeks`, but the public route is served by the existing `official-website` Vercel project at `/life`. Keep the standalone repo and the deployed route in sync when changing the app.

## 2026-07-02 - Profile Container Boundary

Person-specific stages and events should live in `PersonProfile` data, not in the grid renderer. Overlapping stages are expected behavior and should be represented by split week cells rather than collapsed into a single dominant color.
