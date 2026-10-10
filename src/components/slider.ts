import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * Large touch slider. Emits `value-input` while dragging and `value-change`
 * on release, both with `detail.value` in 0..1. While the user is dragging
 * (and shortly after) external value updates are ignored so the thumb does
 * not jump back while HA catches up.
 */
@customElement("ma-slider")
export class MaSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() label = "";

  @state() private _dragValue: number | null = null;
  private _holdUntil = 0;
  private _heldValue = 0;

  private get _shown() {
    if (this._dragValue !== null) return this._dragValue;
    if (Date.now() < this._holdUntil) return this._heldValue;
    return clamp(this.value);
  }

  protected render() {
    const pct = `${this._shown * 100}%`;
    return html`
      <div
        class="track"
        role="slider"
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${Math.round(this._shown * 100)}
        @pointerdown=${this._down}
        @pointermove=${this._move}
        @pointerup=${this._up}
        @pointercancel=${this._up}
      >
        <div class="rail"><div class="fill" style="width:${pct}"></div></div>
        <div class="thumb" style="left:${pct}"></div>
      </div>
    `;
  }

  private _valueAt(ev: PointerEvent) {
    const r = this.getBoundingClientRect();
    return clamp((ev.clientX - r.left) / r.width);
  }

  private _down(ev: PointerEvent) {
    if (this.disabled) return;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._dragValue = this._valueAt(ev);
    this._emit("value-input", this._dragValue);
  }

  private _move(ev: PointerEvent) {
    if (this._dragValue === null) return;
    this._dragValue = this._valueAt(ev);
    this._emit("value-input", this._dragValue);
  }

  private _up() {
    if (this._dragValue === null) return;
    const v = this._dragValue;
    this._dragValue = null;
    this._heldValue = v;
    this._holdUntil = Date.now() + 2000;
    this._emit("value-change", v);
    setTimeout(() => this.requestUpdate(), 2050);
  }

  private _emit(name: string, value: number) {
    this.dispatchEvent(new CustomEvent(name, { detail: { value } }));
  }

  static styles = css`
    :host {
      --_h: var(--ma-slider-height, 12px);
      --_thumb: var(--ma-slider-thumb, 28px);
      display: block;
      height: max(var(--_thumb), 44px);
      touch-action: none;
      user-select: none;
      cursor: pointer;
    }
    :host([disabled]) {
      opacity: 0.4;
      pointer-events: none;
    }
    .track {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .rail {
      position: relative;
      width: 100%;
      height: var(--_h);
      border-radius: calc(var(--_h) / 2);
      background: var(--ma-slider-rail, rgba(255, 255, 255, 0.22));
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--ma-slider-fill, #fff);
      border-radius: inherit;
    }
    .thumb {
      position: absolute;
      top: 50%;
      width: var(--_thumb);
      height: var(--_thumb);
      margin-left: calc(var(--_thumb) / -2);
      transform: translateY(-50%);
      border-radius: 50%;
      background: var(--ma-slider-thumb-color, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
  `;
}

const clamp = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

declare global {
  interface HTMLElementTagNameMap {
    "ma-slider": MaSlider;
  }
}
