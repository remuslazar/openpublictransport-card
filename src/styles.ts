import { css } from "lit";

/**
 * Rules for the card element alone: its palettes, one per `theme`. The card
 * carries the resolved theme as `data-theme` ("auto" resolves to "dark" or
 * "light" by the dashboard's mode), and the palettes set the --opt-* variables
 * there.
 *
 * They are kept out of cardStyles, which every layout and badge shares. Each of
 * those has its own shadow root, and a palette declared in the shared sheet was
 * declared again on every one of them — where no data-theme exists — so
 * everything inside a layout was painted from the base block whatever the
 * theme said. Declared once, on the card, the variables inherit into every
 * shadow root below it.
 */
export const hostStyles = css`
  /* theme: ha, and the palette before a theme is applied. Everything is taken
     from the Home Assistant palette and type, so the card follows the
     dashboard's theme — light, dark or custom — instead of carrying colours of
     its own. */
  :host {
    --opt-bg: var(--ha-card-background, var(--card-background-color));
    --opt-text: var(--primary-text-color);
    --opt-text-secondary: var(--secondary-text-color);
    --opt-border: var(--divider-color);
    --opt-accent: var(--primary-color);
    /* Readable text on top of an accent-coloured surface (line badges). */
    --opt-on-accent: var(--text-primary-color);
    --opt-delay-red: var(--error-color);
    --opt-delay-green: var(--success-color);
    --opt-delay-yellow: var(--warning-color);
    /* Readable text on top of the delay colours (delay badges, the banner). */
    --opt-on-delay: var(--text-primary-color);
    /* Home Assistant's own heading: no band and no rule, no capitals, and the
       size and weight of its heading card's title. The entities card's 24px
       title outweighs a departure list below it. */
    --opt-header-bg: transparent;
    --opt-header-rule: transparent;
    --opt-header-font-size: var(--ha-font-size-l, 16px);
    --opt-header-font-weight: var(--ha-font-weight-normal, 400);
    --opt-header-line-height: var(--ha-line-height-normal, 1.6);
    /* Labels (column headings, the station line) in sentence case, untracked. */
    --opt-caps: none;
    --opt-tracking: 0;
    /* Small text on Home Assistant's scale: labels, countdowns, chips, badges. */
    --opt-font-size-label: var(--ha-font-size-s, 12px);
    --opt-font-size-badge: var(--ha-font-size-s, 12px);
    --opt-row-hover: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    --opt-font-family: var(--ha-font-family-body, Roboto, Noto, sans-serif);
    --opt-font-weight-medium: var(--ha-font-weight-medium, 500);
  }

  /* The departure board: gold on black, in a monospace face. */
  :host([data-theme="dark"]) {
    --opt-bg: #0a0a0a;
    --opt-text: #ffd700;
    --opt-text-secondary: #cccccc;
    --opt-border: rgba(255, 215, 0, 0.15);
    --opt-accent: var(--accent-color, #ffd700);
    --opt-on-accent: #000000;
    --opt-delay-red: #e53935;
    --opt-delay-green: #43a047;
    --opt-delay-yellow: #fdd835;
    /* Black, not white: white on this red measures 4.2:1 and on this green
       3.3:1, below the 4.5:1 a badge's small figures need. The red itself stays,
       since it is also text on the black card, where it measures 4.7:1. */
    --opt-on-delay: #000000;
    /* The board's header: a band under a rule, in tracked capitals. */
    --opt-header-bg: rgba(0, 0, 0, 0.4);
    --opt-header-rule: var(--opt-border);
    --opt-header-font-size: 14px;
    --opt-header-font-weight: 700;
    --opt-header-line-height: normal;
    --opt-caps: uppercase;
    --opt-tracking: 1;
    --opt-font-size-label: 11px;
    --opt-font-size-badge: 13px;
    --opt-row-hover: rgba(255, 215, 0, 0.05);
    --opt-font-family: "Roboto Mono", "Courier New", monospace;
    /* The faces this falls back to — Courier New, DejaVu Sans Mono — have no
       medium, so 500 would drop to regular and a station name would lose the
       bold it has always had here. */
    --opt-font-weight-medium: 600;
  }

  /* The same board on white. */
  :host([data-theme="light"]) {
    --opt-bg: #ffffff;
    --opt-text: #1a1a1a;
    --opt-text-secondary: #666666;
    --opt-border: rgba(0, 0, 0, 0.12);
    --opt-accent: var(--accent-color, #ffd700);
    --opt-on-accent: #000000;
    /* A shade darker than the dark board's red and green, which measure 4.2:1
       and 3.3:1 against white text and white paper; these measure 5.0:1 and
       5.1:1. */
    --opt-delay-red: #d32f2f;
    --opt-delay-green: #2e7d32;
    --opt-delay-yellow: #fdd835;
    --opt-on-delay: #ffffff;
    --opt-header-bg: #f5f5f5;
    --opt-header-rule: var(--opt-border);
    --opt-header-font-size: 14px;
    --opt-header-font-weight: 700;
    --opt-header-line-height: normal;
    --opt-caps: uppercase;
    --opt-tracking: 1;
    --opt-font-size-label: 11px;
    --opt-font-size-badge: 13px;
    --opt-row-hover: rgba(0, 0, 0, 0.03);
    --opt-font-family: "Roboto Mono", "Courier New", monospace;
    --opt-font-weight-medium: 600;
  }
`;

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    background: var(--opt-bg);
    color: var(--opt-text);
    overflow: hidden;
    font-family: var(--opt-font-family);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Each layout fills the card so its body (not the whole card) can scroll */
  openpublictransport-table-layout,
  openpublictransport-next-layout,
  openpublictransport-compact-layout,
  openpublictransport-trip-layout {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  .card-header,
  .disruption-banner {
    flex-shrink: 0;
  }

  /* Icon sizing fallback: keeps legacy mdc variable and explicit dimensions in sync.
     The flex box is not cosmetic: an ha-icon holds an inline-flex ha-svg-icon,
     so as a block it puts that child on a text baseline and the glyph lands
     about 2px below the middle of the icon's own box — enough to read as
     misaligned beside a label. Laying the child out as a flex item centres the
     glyph in its box, which is what makes Home Assistant's own headings line
     up, and removes any need to nudge icons by hand. */
  ha-icon {
    --mdc-icon-size: var(--opt-icon-size, 24px);
    width: var(--opt-icon-size, 24px);
    height: var(--opt-icon-size, 24px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The header is the one place the themes part ways in shape rather than
     colour: the board's band of tracked capitals under a rule, or Home
     Assistant's own heading. Each theme's palette says which. */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12px 16px;
    background: var(--opt-header-bg);
    border-bottom: 1px solid var(--opt-header-rule);
    font-size: var(--opt-header-font-size);
    font-weight: var(--opt-header-font-weight);
    line-height: var(--opt-header-line-height);
    text-transform: var(--opt-caps);
    letter-spacing: calc(var(--opt-tracking) * 1px);
  }

  .card-header .station-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The clock is secondary to the station, and keeps the body size under a
     title that is larger than it. */
  .card-header .current-time {
    font-size: var(--ha-font-size-m, 14px);
    font-variant-numeric: tabular-nums;
    opacity: 0.8;
    margin-left: 12px;
    flex-shrink: 0;
  }

  .card-content {
    /* left/right inset aligns columns with the header; bottom gap below last row */
    padding: 0 4px 12px;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  /* Disruption banner */
  .disruption-banner {
    background: var(--opt-delay-red);
    color: var(--opt-on-delay);
    padding: 8px 16px;
    font-size: var(--ha-font-size-s, 12px);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .disruption-banner ha-icon {
    --opt-icon-size: 16px;
  }

  /* Table layout */
  .departure-table {
    width: 100%;
    border-collapse: collapse;
  }

  .departure-table thead th {
    padding: 8px 12px;
    text-align: left;
    font-size: var(--opt-font-size-label);
    font-weight: var(--opt-font-weight-medium);
    text-transform: var(--opt-caps);
    letter-spacing: calc(var(--opt-tracking) * 0.5px);
    color: var(--opt-text-secondary);
    /* keep the header row pinned at the top of the scrolling list */
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--opt-bg);
    /* divider that stays attached to the cell (border-bottom can detach with collapse) */
    box-shadow: inset 0 -1px 0 var(--opt-border);
  }

  .departure-table tbody tr {
    border-bottom: 1px solid var(--opt-border);
    transition: background-color 0.15s ease;
  }

  .departure-table tbody tr:hover {
    background: var(--opt-row-hover);
  }

  .departure-table tbody tr:last-child {
    border-bottom: none;
  }

  .departure-table td {
    padding: 10px 12px;
    font-size: var(--ha-font-size-m, 14px);
    vertical-align: middle;
  }

  /* Time column */
  .time-cell {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .time-planned {
    font-weight: var(--opt-font-weight-medium);
  }

  .time-countdown {
    display: block;
    font-size: var(--opt-font-size-label);
    opacity: 0.7;
    margin-top: 2px;
  }

  /* Line cell */
  .line-cell {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .line-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: var(--opt-font-size-badge);
    background: var(--opt-accent);
    color: var(--opt-on-accent);
  }

  /* Destination */
  .destination-cell {
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Platform */
  .platform-cell {
    text-align: center;
    font-weight: var(--opt-font-weight-medium);
  }

  .platform-changed {
    text-decoration: line-through;
    opacity: 0.5;
    margin-right: 4px;
  }

  .platform-new {
    color: var(--opt-delay-red);
    font-weight: 700;
  }

  /* Notices */
  .notice-icon {
    --opt-icon-size: 16px;
    color: var(--opt-delay-yellow);
    cursor: help;
  }

  /* Compact layout. The chips start on Home Assistant's 16px inset, where the
     header's text starts. */
  .compact-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
  }

  /* The icon is a transport-icon element, not an ha-icon, so it is sized by
     the variable it reads: the ha-icon rule this replaces never matched, and
     the chips drew ha-icon's 24px default. */
  .compact-chip {
    --opt-icon-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 2px solid var(--opt-border);
    background: var(--opt-bg);
    font-size: var(--opt-font-size-badge);
    transition: border-color 0.2s ease;
  }

  .compact-chip.on-time {
    border-color: var(--opt-delay-green);
  }

  .compact-chip.delayed {
    border-color: var(--opt-delay-red);
  }

  .compact-chip .chip-line {
    font-weight: 700;
  }

  .compact-chip .chip-destination {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0.8;
  }

  .compact-chip .chip-countdown {
    font-weight: var(--opt-font-weight-medium);
    font-variant-numeric: tabular-nums;
  }

  /* Trip layout */
  .trip-container {
    padding: 16px;
  }

  .trip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
  }

  .trip-header .trip-arrow {
    opacity: 0.5;
  }

  .trip-header .trip-duration {
    margin-left: auto;
    font-size: 13px;
    font-weight: 400;
    opacity: 0.7;
  }

  .trip-meta {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 12px;
  }

  .trip-meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    background: var(--opt-header-bg);
  }

  .trip-meta-item ha-icon {
    --opt-icon-size: 14px;
  }

  /* Transfer risk badges */
  .risk-low {
    color: var(--opt-delay-green);
  }

  .risk-medium {
    color: var(--opt-delay-yellow);
  }

  .risk-high {
    color: var(--opt-delay-red);
  }

  /* Timeline */
  .trip-timeline {
    position: relative;
    padding-left: 24px;
  }

  .trip-leg {
    position: relative;
    padding-bottom: 16px;
    padding-left: 16px;
    border-left: 2px solid var(--opt-border);
    margin-left: 6px;
  }

  .trip-leg:last-child {
    border-left-color: transparent;
  }

  .trip-leg::before {
    content: "";
    position: absolute;
    left: -7px;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--opt-accent);
    border: 2px solid var(--opt-bg);
  }

  .trip-leg.transfer::before {
    background: var(--opt-delay-yellow);
  }

  .leg-station {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .leg-details {
    font-size: 12px;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .leg-details ha-icon {
    --opt-icon-size: 14px;
  }

  .leg-time {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .leg-transfer-info {
    font-size: 11px;
    color: var(--opt-delay-yellow);
    margin-top: 4px;
    font-style: italic;
  }

  /* Alternative journeys */
  .alt-journeys {
    margin-top: 16px;
    border-top: 1px solid var(--opt-border);
    padding-top: 12px;
  }

  .alt-journeys-title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.6;
    margin-bottom: 8px;
  }

  .alt-journey {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    font-size: 13px;
    border-bottom: 1px solid var(--opt-border);
  }

  .alt-journey:last-child {
    border-bottom: none;
  }

  /* Error / Empty states */
  .card-error,
  .card-empty {
    padding: 24px 16px;
    text-align: center;
    font-size: var(--ha-font-size-m, 14px);
    opacity: 0.7;
  }

  .card-error {
    color: var(--opt-delay-red);
  }

  .card-error ha-icon {
    --opt-icon-size: 40px;
    display: block;
    margin: 0 auto 12px;
  }

  /* Delay badge */
  .delay-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
  }

  .delay-badge.delayed {
    background: var(--opt-delay-red);
    color: var(--opt-on-delay);
  }

  .delay-badge.on-time {
    background: var(--opt-delay-green);
    color: var(--opt-on-delay);
  }

  /* Editor styles */
  .card-config {
    padding: 16px;
  }

  .card-config .config-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
  }

  .card-config .config-row label {
    font-weight: 500;
  }

  .card-config ha-entity-picker,
  .card-config ha-select,
  .card-config ha-textfield {
    width: 100%;
  }

  .config-section {
    margin-bottom: 16px;
  }

  .config-section-title {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.6;
    margin-bottom: 8px;
  }
`;
