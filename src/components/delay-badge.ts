import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "../styles";

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
        <span class="delay-badge on-time">&check;</span>
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
