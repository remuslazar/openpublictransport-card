# PR assets

Images for pull request descriptions, kept on this orphan branch so they never
enter a pull request's diff.

`fix-trip-card-legibility/` — stock v1.9.0 beside the `fix/trip-card-legibility`
build, both with `theme: ha`, each card 384px wide (one column of a sections
dashboard), on a light and a dark dashboard. Taken in a Home Assistant 2026.9.3
sandbox from frozen fixtures: a real VVS journey from Köngen Kirchheimer Str. to
Stuttgart Stadtmitte, and a departure board taken from Stuttgart Hauptbahnhof
with one platform change and one on-time departure added so those styles show.
The page clock is frozen at the board's moment, 14:38.

`feat-alternative-journey-dialog/` — the `feat/alternative-journey-dialog`
build: the trip card with `theme: ha`, and the dialog an alternative row opens,
in `theme: ha` and in the departure board (`theme: auto`), on a light and a dark
dashboard. Card 384px wide in a 480px window. Taken in a Home Assistant 2026.10.2
sandbox from a frozen fixture: a real VVS journey from Ludwigsburg Bf to
Stuttgart Flughafen/Messe, planned with the integration's `plan_trip` on
2026-10-17, its alternatives carrying the legs `get_journeys` would return.
The dialog shows the 12:40 connection: RE8, a ten-minute walk, U6.
