import { css } from "lit";

export const cardStyles = css`
  /* Everything the card paints is taken from the Home Assistant palette, so it
     follows the dashboard's theme — light, dark or custom — instead of carrying
     colours of its own. The --opt-* indirection is kept because the layouts are
     written against it. */
  :host {
    --opt-bg: var(--ha-card-background, var(--card-background-color));
    --opt-text: var(--primary-text-color);
    --opt-text-secondary: var(--secondary-text-color);
    --opt-border: var(--divider-color);
    --opt-accent: var(--primary-color);
    /* Readable text on top of an accent-coloured surface (badges). */
    --opt-on-accent: var(--text-primary-color);
    --opt-delay-red: var(--error-color);
    --opt-delay-green: var(--success-color);
    --opt-delay-yellow: var(--warning-color);
    /* Tinted from the text colour, so the same rule works on a light and on a
       dark theme without a second palette. */
    --opt-header-bg: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    --opt-row-hover: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    --opt-font-family: var(--ha-font-family-body, Roboto, Noto, sans-serif);

    display: block;
  }

  ha-card {
    background: var(--opt-bg);
    color: var(--opt-text);
    overflow: hidden;
    font-family: var(--opt-font-family);
    display: flex;
    flex-direction: column;
    /* The card takes the height its content needs. The max-height only bites
       when the dashboard gives the card a definite height — a fixed row count —
       and the body then scrolls instead of the card overflowing its cell. With
       the row count on auto the height is indefinite, so this resolves to none
       and the card simply grows. */
    max-height: 100%;
  }

  /* The layouts take the height their content needs; the card grows with them,
     so a journey with more legs is not cut off by a fixed card height. */
  openpublictransport-table-layout,
  openpublictransport-next-layout,
  openpublictransport-compact-layout,
  openpublictransport-trip-layout {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .card-header,
  .disruption-banner {
    flex-shrink: 0;
  }

  /* Icon sizing fallback: keeps legacy mdc variable and explicit dimensions in sync. */
  ha-icon {
    --mdc-icon-size: var(--opt-icon-size, 24px);
    width: var(--opt-icon-size, 24px);
    height: var(--opt-icon-size, 24px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--opt-header-bg);
    border-bottom: 1px solid var(--opt-border);
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .card-header .station-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-header .current-time {
    font-variant-numeric: tabular-nums;
    opacity: 0.8;
    margin-left: 12px;
    flex-shrink: 0;
  }

  .card-content {
    /* left/right inset aligns columns with the header; bottom gap below last row */
    padding: 0 4px 12px;
    min-height: 0;
    overflow-y: auto;
  }

  /* Disruption banner */
  .disruption-banner {
    background: var(--opt-delay-red);
    color: var(--opt-on-accent);
    padding: 8px 16px;
    font-size: 12px;
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
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    font-size: 14px;
    vertical-align: middle;
  }

  /* Time column */
  .time-cell {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .time-planned {
    font-weight: 600;
  }

  .time-countdown {
    display: block;
    font-size: 11px;
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
    font-size: 13px;
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
    font-weight: 600;
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

  /* Compact layout */
  .compact-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
  }

  .compact-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 2px solid var(--opt-border);
    background: var(--opt-bg);
    font-size: 13px;
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
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .compact-chip ha-icon {
    --opt-icon-size: 18px;
  }

  /* Trip layout */
  .trip-container {
    /* The wider left inset is the timeline's gutter: the rail and its dots live
       in it, so the header, the facts, every leg and the alternatives all start
       on the same column instead of three. */
    padding: 16px 16px 16px 30px;
  }

  .trip-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
  }

  .trip-header .trip-arrow {
    color: var(--opt-text-secondary);
  }

  .trip-header .trip-duration {
    margin-left: auto;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-normal, 400);
    color: var(--opt-text-secondary);
  }

  /* One quiet line of facts rather than a row of filled boxes, the way Home
     Assistant renders a card's secondary information. */
  .trip-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 14px;
    margin-bottom: 16px;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--opt-text-secondary);
  }

  .trip-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: default;
  }

  .trip-meta-item ha-icon {
    --opt-icon-size: 16px;
    color: var(--opt-text-secondary);
  }

  /* Transfer risk. The colour rides on the icon so the label keeps the body
     text's contrast — painted in the warning hue it was unreadable on a light
     theme. A connection actually at risk is the one case loud enough to colour
     the text as well. */
  .risk-low ha-icon {
    color: var(--opt-delay-green);
  }

  .risk-medium ha-icon {
    color: var(--opt-delay-yellow);
  }

  .risk-high,
  .risk-high ha-icon {
    color: var(--opt-delay-red);
  }

  /* Timeline. Everything is placed from the four sizes below, so the rail, the
     dots and the text keep their relationship whatever those sizes become. */
  .trip-timeline {
    --opt-line-width: 2px;
    --opt-dot-size: 8px;
    --opt-dot-ring: 2px;
    --opt-station-line: 20px;
    /* from the text column to the centre of the rail */
    --opt-rail-offset: 14px;

    position: relative;
  }

  .trip-leg {
    position: relative;
    padding-bottom: 16px;
  }

  /* The rail runs from this leg's dot to the next one, so it meets both centres
     and never leaves a gap at a leg boundary. */
  .trip-leg::after {
    content: "";
    position: absolute;
    left: calc(-1 * var(--opt-rail-offset) - var(--opt-line-width) / 2);
    top: calc(var(--opt-station-line) / 2);
    bottom: calc(-1 * var(--opt-station-line) / 2);
    width: var(--opt-line-width);
    background: var(--opt-border);
  }

  .trip-leg:last-child {
    padding-bottom: 0;
  }

  .trip-leg:last-child::after {
    display: none;
  }

  .trip-leg::before {
    content: "";
    position: absolute;
    /* the dot, ring included, centred on the rail */
    left: calc(-1 * var(--opt-rail-offset) - var(--opt-dot-size) / 2 - var(--opt-dot-ring));
    /* and on the middle of the station's first line */
    top: calc((var(--opt-station-line) - var(--opt-dot-size)) / 2 - var(--opt-dot-ring));
    width: var(--opt-dot-size);
    height: var(--opt-dot-size);
    border-radius: 50%;
    background: var(--opt-accent);
    border: var(--opt-dot-ring) solid var(--opt-bg);
  }

  /* A transfer is a hollow dot: a change of vehicle, not another colour. */
  .trip-leg.transfer::before {
    background: var(--opt-bg);
    box-shadow: inset 0 0 0 var(--opt-dot-ring) var(--opt-accent);
  }

  /* Station and duration share the leg's first line, so the durations line up
     with the station names rather than floating beside the smaller detail row. */
  .leg-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .leg-station {
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--opt-station-line);
  }

  .leg-details {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-s, 12px);
    color: var(--opt-text-secondary);
  }

  .leg-details ha-icon,
  .leg-details openpublictransport-transport-icon {
    --opt-icon-size: 16px;
  }

  .leg-time {
    font-variant-numeric: tabular-nums;
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .leg-line {
    font-weight: var(--ha-font-weight-medium, 500);
  }

  /* Where the vehicle is headed. It can be long, so it yields before the
     duration does. */
  .leg-direction {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  /* The duration sits at the right edge on the station's own line, in the same
     type, so the journey's rhythm can be read down a single column. */
  .leg-duration {
    margin-left: auto;
    flex-shrink: 0;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: var(--opt-station-line);
    font-variant-numeric: tabular-nums;
    color: var(--opt-text);
  }

  .leg-transfer-info {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--opt-text-secondary);
    margin-top: 2px;
  }

  /* Alternative journeys */
  .alt-journeys {
    margin-top: 16px;
    border-top: 1px solid var(--opt-border);
    padding-top: 12px;
  }

  .alt-journeys-title {
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--opt-text-secondary);
    margin-bottom: 8px;
  }

  .alt-journey {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    font-size: var(--ha-font-size-s, 12px);
    font-variant-numeric: tabular-nums;
    color: var(--opt-text-secondary);
    border-bottom: 1px solid var(--opt-border);
  }

  .alt-journey .leg-time {
    color: var(--opt-text);
  }

  .alt-journey .alt-risk {
    margin-left: auto;
    display: inline-flex;
  }

  .alt-journey:last-child {
    border-bottom: none;
  }

  /* Error / Empty states */
  .card-error,
  .card-empty {
    padding: 24px 16px;
    text-align: center;
    font-size: 14px;
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
    color: var(--opt-on-accent);
  }

  .delay-badge.on-time {
    background: var(--opt-delay-green);
    color: var(--opt-on-accent);
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
