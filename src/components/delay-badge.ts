import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "../styles";

/**
 * The on-time mark. Drawn rather than typed, like the trip layout's arrow:
 * U+2713 is in neither Home Assistant's body font nor the boards' monospace
 * faces, so it came from whatever fallback font the platform has — a hairline
 * at the badge's 10px, lighter than the figures on every other badge.
 */
const CHECK = html`<svg class="check" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
  <path d="M2.5 6.5 5 9l4.5-5.5" />
</svg>`;

@customElement("openpublictransport-delay-badge")
export class DelayBadge extends LitElement {
  static styles = [
    cardStyles,
    css`
      /* As a block, the host takes its baseline from its own first line box —
         which the template's indentation creates in the inherited font, not in
         the badge's. Aligned against a time beside it the badge then sat a
         line's worth too low. A flex host ignores that whitespace and takes the
         badge's own baseline instead. */
      :host {
        display: inline-flex;
        align-items: baseline;
      }
    `,
  ];

  @property({ type: Number }) delay = 0;
  @property({ type: Boolean, attribute: "is-realtime" }) isRealtime = false;

  protected render() {
    if (this.delay > 0) {
      return html`
        <span class="delay-badge delayed">+${this.delay}</span>
      `;
    }

    if (this.delay === 0 && this.isRealtime) {
      return html`
        <span class="delay-badge on-time" role="img" aria-label="&check;">${CHECK}</span>
      `;
    }

    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "openpublictransport-delay-badge": DelayBadge;
  }
}
