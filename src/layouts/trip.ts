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

  /**
   * The time a leg will actually happen: the provider's estimate when it has
   * one, the timetable otherwise. The journey's own header already reports the
   * estimate, so legs that reported the timetable disagreed with it by exactly
   * the delay — the card showed 09:42 under a header that said 09:46.
   */
  private _realTime(estimated?: string, planned?: string): string {
    return this._formatTime(estimated || planned || "");
  }

  /**
   * A duration in the viewer's own language: 83 minutes reads as "1h 23m" in
   * English and "1h, 23 Min." in German, instead of a bare minute count that
   * the reader has to divide by 60.
   *
   * `Intl.DurationFormat` carries the locale data for this (Chrome 129+,
   * Safari 18.4+). Where it is missing — an older kiosk browser, say — the
   * plain form is used, which is what the card showed before.
   */
  private _formatDuration(minutes: number): string {
    const total = Math.max(0, Math.round(minutes || 0));
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    const durationFormat = (Intl as unknown as { DurationFormat?: new (...args: unknown[]) => { format: (d: unknown) => string } })
      .DurationFormat;

    if (durationFormat) {
      try {
        return new durationFormat(this.hass.language, { style: "narrow" }).format(
          hours ? { hours, minutes: mins } : { minutes: mins }
        );
      } catch {
        /* fall through to the plain form below */
      }
    }

    return hours ? `${hours} h ${mins} min` : `${mins} min`;
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
        <span class="time-span">
          <span>${trip.departure}</span>
          <span class="trip-arrow">&rarr;</span>
          <span>${trip.arrival}</span>
        </span>
        <span class="trip-duration">${this._formatDuration(trip.duration_minutes)}</span>
      </div>
    `;
  }

  private _renderMeta(trip: TripData) {
    const lang = this.hass.language;
    const transfers = `${trip.transfers} ${
      trip.transfers !== 1 ? localize(lang, "transfers") : localize(lang, "transfer")
    }`;
    const risk = this._riskLabel(trip.transfer_risk, lang);
    const minTransferValue = this._formatDuration(trip.min_transfer_time);
    const minTransfer = `${localize(lang, "min_transfer")} ${minTransferValue}`;

    /* A fact gets words where its value cannot speak for itself: a bare count
       and a risk state mean nothing without them, and a tooltip is no help on a
       wall display, where nobody hovers. The wait is the exception — a duration
       beside a timer, on a line that has already said "transfer" once. */
    return html`
      <div class="trip-meta">
        <div class="trip-meta-item" title=${transfers}>
          <ha-icon icon="mdi:transit-transfer"></ha-icon>
          <span>${transfers}</span>
        </div>
        <div class="trip-meta-item ${this._getRiskClass(trip.transfer_risk)}" title=${risk}>
          <ha-icon icon=${this._getRiskIcon(trip.transfer_risk)}></ha-icon>
          <span>${risk}</span>
        </div>
        ${trip.min_transfer_time > 0
          ? html`
              <div class="trip-meta-item" title=${minTransfer}>
                <ha-icon icon="mdi:timer-outline"></ha-icon>
                <span>${minTransferValue}</span>
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

  private _renderLeg(leg: TripLeg, next?: TripLeg) {
    const legClass = leg.transfer ? "trip-leg transfer" : "trip-leg";
    /* When this leg gets in, shown only where it tells the reader something:
       if the next leg leaves the moment this one arrives the number below
       already says it, and the last leg's arrival is the destination's own
       time on the row beneath. What is left is the arrivals that open a wait. */
    const arrival = this._realTime(leg.arrival_estimated, leg.arrival_planned);
    const showArrival =
      !!next && !!arrival && arrival !== this._realTime(next.departure_estimated, next.departure_planned);

    return html`
      <div class=${legClass}>
        <div class="leg-head">
          <div class="leg-station">${leg.origin}</div>
          <div class="leg-head-time">
            ${leg.delay > 0
              ? html`
                  <openpublictransport-delay-badge
                    .delay=${leg.delay}
                    is-realtime
                  ></openpublictransport-delay-badge>
                `
              : nothing}
            <div class="leg-time leg-departure">
              ${this._realTime(leg.departure_estimated, leg.departure_planned)}
            </div>
          </div>
        </div>
        <div class="leg-details">
          <openpublictransport-transport-icon
            transport-type=${leg.transport_type || leg.product}
          ></openpublictransport-transport-icon>
          ${leg.line || leg.direction
            ? html`
                <span class="leg-service">
                  ${leg.line ? html`<span class="leg-line">${leg.line}</span>` : nothing}
                  ${leg.direction
                    ? html`
                        <span class="trip-arrow">&rarr;</span>
                        <span class="leg-direction">${leg.direction}</span>
                      `
                    : nothing}
                </span>
              `
            : nothing}
          ${leg.platform
            ? html`<span>${localize(this.hass.language, "platform")} ${leg.platform}</span>`
            : nothing}
          <span class="leg-duration">${this._formatDuration(leg.duration_minutes)}</span>
          ${showArrival ? html`<span class="leg-arrival">${arrival}</span>` : nothing}
        </div>
        ${this._renderTransferNote(leg)}
      </div>
    `;
  }

  /**
   * The change out of this leg, with the wait it costs. Standing on the
   * platform, how long the connection is matters more than that there is one,
   * and the journey's own minimum does not say at which change it falls.
   */
  private _renderTransferNote(leg: TripLeg) {
    const hasWait = typeof leg.transfer_minutes === "number";
    if (!leg.transfer && !hasWait) return nothing;

    const label = localize(this.hass.language, "transfer");
    return html`
      <div class="leg-transfer-info">
        <ha-icon icon="mdi:timer-outline"></ha-icon>
        <span>${hasWait ? `${label} · ${this._formatDuration(leg.transfer_minutes as number)}` : label}</span>
      </div>
    `;
  }

  private _renderTimeline(trip: TripData) {
    const lastLeg = trip.legs[trip.legs.length - 1];

    return html`
      <div class="trip-timeline">
        ${trip.legs.map((leg, i) => this._renderLeg(leg, trip.legs[i + 1]))}
        ${lastLeg
          ? html`
              <div class="trip-leg" style="border-left-color: transparent; padding-bottom: 0;">
                <div class="leg-head">
                  <div class="leg-station">${lastLeg.destination}</div>
                  <div class="leg-head-time">
                    <div class="leg-time leg-departure">
                      ${this._realTime(lastLeg.arrival_estimated, lastLeg.arrival_planned)}
                    </div>
                  </div>
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
              <span class="time-span">
                <span class="leg-time">${this._formatTime(alt.departure)}</span>
                <span class="trip-arrow">&rarr;</span>
                <span class="leg-time">${this._formatTime(alt.arrival)}</span>
              </span>
              <span>${this._formatDuration(alt.duration_minutes)}</span>
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
