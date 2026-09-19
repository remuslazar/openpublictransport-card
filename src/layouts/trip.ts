import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "../styles";
import { TripData, TripLeg, CardConfig, HomeAssistant } from "../types";
import { localize } from "../localize";
import "../components/transport-icon";
import "../components/delay-badge";

@customElement("openpublictransport-trip-layout")
export class TripLayout extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: CardConfig;
  @property({ attribute: false }) trip: TripData | null = null;

  private _formatTime(timeStr: string): string {
    return timeStr || "";
  }

  private _getRiskClass(risk: string): string {
    switch (risk.toLowerCase()) {
      case "low":
        return "risk-low";
      case "medium":
        return "risk-medium";
      case "high":
        return "risk-high";
      default:
        return "";
    }
  }

  /**
   * Localized label for a transfer-risk level. Falls back to the old
   * value-plus-noun form when a translation has no label for the level, so an
   * unknown level still says something.
   */
  private _riskLabel(risk: string, lang: string): string {
    const key = `risk_${risk.toLowerCase()}`;
    const label = localize(lang, key);
    return label === key ? `${risk} ${localize(lang, "risk")}` : label;
  }

  private _getRiskIcon(risk: string): string {
    switch (risk.toLowerCase()) {
      case "low":
        return "mdi:check-circle-outline";
      case "medium":
        return "mdi:alert-outline";
      case "high":
        return "mdi:alert-octagon";
      default:
        return "mdi:help-circle-outline";
    }
  }

  private _renderHeader(trip: TripData) {
    if (!this.config.show_header) return nothing;

    return html`
      <div class="trip-header">
        <span>${trip.departure}</span>
        <span class="trip-arrow">&rarr;</span>
        <span>${trip.arrival}</span>
        <span class="trip-duration">${trip.duration_minutes} min</span>
      </div>
    `;
  }

  private _renderMeta(trip: TripData) {
    const lang = this.hass.language;
    const transfers = `${trip.transfers} ${
      trip.transfers !== 1 ? localize(lang, "transfers") : localize(lang, "transfer")
    }`;
    const risk = this._riskLabel(trip.transfer_risk, lang);
    const minTransfer = `${localize(lang, "min_transfer")} ${trip.min_transfer_time} min`;

    /* Each fact is an icon and its value; the icon says which fact it is, and
       the full wording stays reachable as the item's tooltip and accessible
       name rather than taking a line of the card. */
    return html`
      <div class="trip-meta">
        <div class="trip-meta-item" title=${transfers} aria-label=${transfers}>
          <ha-icon icon="mdi:transit-transfer"></ha-icon>
          <span>${trip.transfers}</span>
        </div>
        <div
          class="trip-meta-item ${this._getRiskClass(trip.transfer_risk)}"
          title=${risk}
          aria-label=${risk}
        >
          <ha-icon icon=${this._getRiskIcon(trip.transfer_risk)}></ha-icon>
        </div>
        ${trip.min_transfer_time > 0
          ? html`
              <div class="trip-meta-item" title=${minTransfer} aria-label=${minTransfer}>
                <ha-icon icon="mdi:timer-outline"></ha-icon>
                <span>${trip.min_transfer_time} min</span>
              </div>
            `
          : nothing}
        ${!trip.connection_feasible
          ? html`
              <div class="trip-meta-item risk-high">
                <ha-icon icon="mdi:close-circle"></ha-icon>
                <span>${localize(lang, "connection_at_risk")}</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderLeg(leg: TripLeg) {
    const legClass = leg.transfer ? "trip-leg transfer" : "trip-leg";

    return html`
      <div class=${legClass}>
        <div class="leg-head">
          <div class="leg-station">${leg.origin}</div>
          <div class="leg-duration">${leg.duration_minutes} min</div>
        </div>
        <div class="leg-details">
          <span class="leg-time">${this._formatTime(leg.departure_planned)}</span>
          ${leg.delay > 0
            ? html`
                <openpublictransport-delay-badge
                  .delay=${leg.delay}
                  is-realtime
                ></openpublictransport-delay-badge>
              `
            : nothing}
          <openpublictransport-transport-icon
            transport-type=${leg.transport_type || leg.product}
          ></openpublictransport-transport-icon>
          ${leg.line ? html`<span class="leg-line">${leg.line}</span>` : nothing}
          ${leg.direction
            ? html`<span class="leg-direction">&rarr; ${leg.direction}</span>`
            : nothing}
          ${leg.platform
            ? html`<span>${localize(this.hass.language, "platform")} ${leg.platform}</span>`
            : nothing}
        </div>
        ${leg.transfer
          ? html`<div class="leg-transfer-info">${localize(this.hass.language, "transfer")}</div>`
          : nothing}
      </div>
    `;
  }

  private _renderTimeline(trip: TripData) {
    const lastLeg = trip.legs[trip.legs.length - 1];

    return html`
      <div class="trip-timeline">
        ${trip.legs.map((leg) => this._renderLeg(leg))}
        ${lastLeg
          ? html`
              <div class="trip-leg" style="border-left-color: transparent; padding-bottom: 0;">
                <div class="leg-head">
                  <div class="leg-station">${lastLeg.destination}</div>
                </div>
                <div class="leg-details">
                  <span class="leg-time">${this._formatTime(lastLeg.arrival_planned)}</span>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderAlternatives(trip: TripData) {
    if (!trip.next_journeys || trip.next_journeys.length === 0) return nothing;

    const lang = this.hass.language;
    return html`
      <div class="alt-journeys">
        <div class="alt-journeys-title">${localize(lang, "alternative_connections")}</div>
        ${trip.next_journeys.map(
          (alt) => html`
            <div class="alt-journey">
              <span class="leg-time">${this._formatTime(alt.departure)}</span>
              <span class="trip-arrow">&rarr;</span>
              <span class="leg-time">${this._formatTime(alt.arrival)}</span>
              <span>${alt.duration_minutes} min</span>
              <span>${alt.transfers} ${alt.transfers !== 1 ? localize(lang, "transfers") : localize(lang, "transfer")}</span>
              <span class="alt-risk ${this._getRiskClass(alt.transfer_risk)}">
                <ha-icon
                  icon=${this._getRiskIcon(alt.transfer_risk)}
                  title=${this._riskLabel(alt.transfer_risk, lang)}
                  style="--opt-icon-size:16px;"
                ></ha-icon>
              </span>
            </div>
          `
        )}
      </div>
    `;
  }

  protected render() {
    if (!this.trip) {
      return html`<div class="card-empty">${localize(this.hass.language, "no_trip_data")}</div>`;
    }

    return html`
      <div class="trip-container">
        ${this._renderHeader(this.trip)}
        ${this._renderMeta(this.trip)}
        ${this._renderTimeline(this.trip)}
        ${this._renderAlternatives(this.trip)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openpublictransport-trip-layout": TripLayout;
  }
}
