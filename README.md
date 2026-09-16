# OpenPublicTransport Card

[![HACS][hacsbadge]][hacs]

[hacs]: https://github.com/hacs/integration
[hacsbadge]: https://img.shields.io/badge/HACS-Default-blue.svg?style=for-the-badge

A custom Home Assistant Lovelace card for displaying public transport departures. Works with the [openpublictransport](https://github.com/NerdySoftPaw/hacs-publictransport) integration.

![Screenshot placeholder](screenshot.png)

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** > **+ Explore & Download Repositories**.
3. Search for **OpenPublicTransport Card**.
4. Click **Download**.
5. Restart Home Assistant.

### Manual

1. Download `openpublictransport-card.js` from the [latest release](https://github.com/NerdySoftPaw/openpublictransport-card/releases/latest).
2. Copy it to `config/www/openpublictransport-card.js`.
3. Add the resource in **Settings** > **Dashboards** > **Resources**:
   - URL: `/local/openpublictransport-card.js`
   - Type: JavaScript Module

## Layouts

### Table Layout (Abfahrtstafel)

Classic departure board with time, line, destination, and platform columns.

```yaml
type: custom:openpublictransport-card
entity: sensor.dusseldorf_hbf_departures
layout: table
max_departures: 10
theme: dark
show_header: true
show_platform: true
show_delay: true
show_realtime_indicator: true
```

### Compact Layout (Chips)

Space-efficient chip-based view — ideal for dashboards with limited space.

```yaml
type: custom:openpublictransport-card
entity: sensor.dusseldorf_hbf_departures
layout: compact
max_departures: 6
theme: auto
```

### Next Departure (Widget)

Single large next departure — perfect for a glanceable dashboard widget.

```yaml
type: custom:openpublictransport-card
entity: sensor.dusseldorf_hbf_departures
layout: next
theme: auto
show_platform: true
show_delay: true
```

### Trip Layout (Journey)

Multi-leg journey view for A→B trip planning sensors.

```yaml
type: custom:openpublictransport-card
entity: sensor.trip_home_to_work
layout: trip
theme: auto
show_header: true
```

## Options

| Option                    | Type    | Default | Description                                                                 |
| ------------------------- | ------- | ------- | --------------------------------------------------------------------------- |
| `entity`                  | string  | **required** | Entity ID of the transport sensor                                      |
| `layout`                  | string  | `table` | Card layout: `table`, `compact`, `next`, `trip`                             |
| `max_departures`          | number  | `10`    | Maximum number of departures to display                                     |
| `line_filter`             | string  | `""`    | Show only specific lines, comma-separated (e.g. `U6, S1, RE5`). Empty = all. Departure layouts only — see [Filters and the trip layout](#filters-and-the-trip-layout) |
| `destination_filter`      | string  | `""`    | Show only departures heading to matching destinations, comma-separated substring match (e.g. `Duisburg, Flughafen`). Empty = all. Departure layouts only |
| `show_header`             | boolean | `true`  | Show the card header with station name                                      |
| `show_platform`           | boolean | `true`  | Show platform/track column                                                  |
| `show_delay`              | boolean | `true`  | Show delay badges                                                           |
| `show_realtime_indicator` | boolean | `true`  | Show green checkmark for on-time realtime                                   |
| `theme`                   | string  | `auto`  | Theme: `dark`, `light`, `auto`                                              |

## Line Colors

Line badge colors are applied automatically when the provider supplies them (e.g. VBB, BVG in Berlin). No configuration needed — if the integration returns `line_color` and `line_text_color`, the badge uses them; otherwise it falls back to the card's accent color.

## Line Filter

The `line_filter` option filters departures directly in the card, independently of the integration's own `line_filter` setting. Both can be combined:

- **Integration filter** (`line_filter` in HA config): reduces API load, affects all entities using that stop
- **Card filter** (`line_filter` in card YAML): visual only, useful when you want different views of the same sensor

```yaml
type: custom:openpublictransport-card
entity: sensor.dusseldorf_hbf_departures
layout: table
line_filter: "U79, U75"   # show only U79 and U75
```

## Destination Filter

The `destination_filter` option shows only departures heading toward one or more destinations/directions — handy when a stop is served in both directions and you only care about one. Matching is **case-insensitive substring**, comma-separated (any match wins):

- `Duisburg` matches `Duisburg Hbf` and `Duisburg Hbf via Stadtmitte`
- `Duisburg, Flughafen` matches either destination
- Empty = show all destinations

It can be combined freely with `line_filter`, and like the line filter it works independently of the integration's own filter — point several cards at the same sensor, each showing a different direction:

```yaml
type: custom:openpublictransport-card
entity: sensor.dusseldorf_hbf_departures
layout: table
destination_filter: "Duisburg"   # only departures toward Duisburg
```

## Filters and the trip layout

Both filters apply to the departure layouts (`table`, `compact`, `next`). With `layout: trip`
they do nothing, and the editor replaces them with a pointer to the device instead of showing
fields that would be ignored.

That is not an omission. A trip sensor reports one connection in full plus a handful of
alternatives, and the alternatives carry only times, duration, transfers and transfer risk —
no lines at all. A card filter could therefore judge the connection on screen but none of the
ones that might replace it, so hiding a connection would leave the card empty even when the
device has a matching one.

Filter connections where the choice is still open — on the device:

**Settings → Devices & services → OpenPublicTransport → your trip device → Configure**

The **line filter** and the **transportation types** selector there apply to the whole
connection: a journey is kept only when every vehicle on it passes, so a trip filtered to
`U43, U47` no longer returns one that finishes on a bus. Requires integration 2026.9.1 or
newer; before that the settings were shown on trip devices but ignored.

## Development

```bash
npm install
npm run build
# or for watch mode:
npm run dev
```

## License

MIT - Copyright (c) 2026 NerdySoftPaw

## 💰 You can help me by Donating
  [![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/nerdysoftpaw) [![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/nerdysoftpaw90) 

