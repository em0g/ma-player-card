import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { DisplayOptions, HomeAssistant, QueueItem } from "../ha/types";
import type { Localize } from "../localize";
import { hasMedia } from "../ha/players";
import { mediaCommand } from "../ha/ma-service";
import {
  Feature,
  artistLine,
  currentPosition,
  entityImage,
  formatTime,
  groupVolume,
  setGroupVolume,
  supports,
} from "../utils/media";
import {
  icon,
  mdiChevronDown,
  mdiHistory,
  mdiMagnify,
  mdiMusicNote,
  mdiPause,
  mdiPlay,
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiShuffle,
  mdiShuffleDisabled,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiSpeakerMultiple,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeMedium,
  mdiVolumeOff,
} from "../utils/icon";
import "./slider";

/**
 * Now-playing for regular dashboard cards: `large` (stacked, all controls)
 * and `compact` (one row). Search and speakers open as popups from the card.
 */
@customElement("ma-card-player")
export class MaCardPlayer extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) localize!: Localize;
  @property({ reflect: true }) variant: "large" | "compact" = "large";
  @property({ attribute: false }) options!: DisplayOptions;
  /** The player that owns playback (sync leader or the selected player). */
  @property() entityId = "";
  /** Name shown on the player button (the selected player, not the leader). */
  @property() playerName = "";
  /** Players whose volume the slider controls (leader + sync members). */
  @property({ attribute: false }) volumeIds: string[] = [];
  @property({ attribute: false }) nextItem: QueueItem | null = null;

  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      if (this.options?.show_progress && this.hass?.states[this.entityId]?.state === "playing") this.requestUpdate();
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  protected render() {
    const e = this.hass?.states[this.entityId];
    if (!e || !this.options) return nothing;
    return this.variant === "compact" ? this._renderCompact() : this._renderLarge();
  }

  // ---------- layouts ----------

  private _renderLarge() {
    const e = this.hass.states[this.entityId];
    const o = this.options;
    const t = this.localize;
    const media = hasMedia(e);
    return html`
      ${this._renderHeader()}
      <div class="hero ${o.show_artwork ? "" : "no-art"}">
        ${o.show_artwork ? this._renderArt(media) : nothing}
        <div class="titles">
          <div class="title">${media ? e.attributes.media_title ?? "" : t("nothing_playing")}</div>
          <div class="artist ${media ? "" : "hint"}">${media ? artistLine(e) : t("nothing_playing_hint")}</div>
          ${media && o.show_next_up ? this._renderNext() : nothing}
        </div>
      </div>
      ${media && o.show_progress ? this._renderProgress() : nothing}
      ${media ? this._renderTransport(o.show_shuffle_repeat, o.show_previous) : nothing}
      ${o.show_volume ? this._renderVolume() : nothing}
    `;
  }

  private _renderCompact() {
    const e = this.hass.states[this.entityId];
    const o = this.options;
    const t = this.localize;
    const media = hasMedia(e);
    const playing = e.state === "playing";
    const sub = media ? artistLine(e) : t("nothing_playing_hint");
    return html`
      <div class="row">
        ${o.show_artwork ? this._renderArt(media) : nothing}
        <div class="titles">
          <div class="title">${media ? e.attributes.media_title ?? "" : t("nothing_playing")}</div>
          <div class="artist">${sub}</div>
          ${o.show_player
            ? html`<button class="player-link" @click=${() => this._fire("open-speakers")}>
                ${icon(mdiSpeakerMultiple)}<span>${this._playerLabel()}</span>
              </button>`
            : nothing}
        </div>
        <div class="controls">
          ${media && o.show_shuffle_repeat ? this._shuffleBtn() : nothing}
          ${media && o.show_previous
            ? html`<button class="ctl prev" ?disabled=${!supports(e, Feature.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
                ${icon(mdiSkipPrevious)}
              </button>`
            : nothing}
          ${media
            ? html`<button class="ctl play" @click=${() => this._call("media_play_pause")}>
                ${icon(playing ? mdiPause : mdiPlay)}
              </button>`
            : nothing}
          ${media
            ? html`<button class="ctl" ?disabled=${!supports(e, Feature.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
                ${icon(mdiSkipNext)}
              </button>`
            : nothing}
          ${media && o.show_shuffle_repeat ? this._repeatBtn() : nothing}
          ${this._renderActionIcons()}
        </div>
      </div>
      ${o.show_volume ? this._renderVolume() : nothing}
      ${media && o.show_progress ? this._renderThinProgress() : nothing}
    `;
  }

  // ---------- pieces ----------

  private _playerLabel() {
    const n = this.volumeIds.length;
    return n > 1 ? `${this.playerName} +${n - 1}` : this.playerName;
  }

  private _renderHeader() {
    const o = this.options;
    const t = this.localize;
    if (!o.show_player && !o.show_search && !o.show_recent) return nothing;
    return html`
      <div class="header">
        ${o.show_player
          ? html`<button class="chip player" @click=${() => this._fire("open-speakers")}>
              ${icon(mdiSpeakerMultiple)}<span class="name">${this.playerName}</span>
              ${this.volumeIds.length > 1 ? html`<span class="count">+${this.volumeIds.length - 1}</span>` : nothing}
              ${icon(mdiChevronDown)}
            </button>`
          : nothing}
        <span class="spacer"></span>
        ${o.show_recent
          ? html`<button class="icon-btn" title=${t("recent")} @click=${() => this._fire("open-recent")}>
              ${icon(mdiHistory)}
            </button>`
          : nothing}
        ${o.show_search
          ? html`<button class="icon-btn" title=${t("search")} @click=${() => this._fire("open-search")}>
              ${icon(mdiMagnify)}
            </button>`
          : nothing}
      </div>
    `;
  }

  /** Search / recent buttons at the end of the compact row. */
  private _renderActionIcons() {
    const o = this.options;
    const t = this.localize;
    if (!o.show_search && !o.show_recent) return nothing;
    return html`
      <span class="sep"></span>
      ${o.show_recent
        ? html`<button class="ctl small opt" title=${t("recent")} @click=${() => this._fire("open-recent")}>
            ${icon(mdiHistory)}
          </button>`
        : nothing}
      ${o.show_search
        ? html`<button class="ctl small" title=${t("search")} @click=${() => this._fire("open-search")}>
            ${icon(mdiMagnify)}
          </button>`
        : nothing}
    `;
  }

  private _renderArt(media: boolean) {
    const e = this.hass.states[this.entityId];
    const img = media ? entityImage(this.hass, e) : undefined;
    return img
      ? html`<img class="art" src=${img} alt="" />`
      : html`<div class="art placeholder">${icon(mdiMusicNote)}</div>`;
  }

  private _renderProgress() {
    const e = this.hass.states[this.entityId];
    const dur = Number(e.attributes.media_duration);
    const pos = currentPosition(e);
    if (!(dur > 0)) return nothing;
    return html`
      <div class="progress">
        <ma-slider
          .value=${(pos ?? 0) / dur}
          ?disabled=${!supports(e, Feature.SEEK)}
          @value-change=${(ev: CustomEvent) =>
            this._call("media_seek", { seek_position: Math.round(ev.detail.value * dur) })}
        ></ma-slider>
        <div class="times"><span>${formatTime(pos)}</span><span>${formatTime(dur)}</span></div>
      </div>
    `;
  }

  private _renderThinProgress() {
    const e = this.hass.states[this.entityId];
    const dur = Number(e.attributes.media_duration);
    if (!(dur > 0)) return nothing;
    const pct = Math.min(100, ((currentPosition(e) ?? 0) / dur) * 100);
    return html`<div class="thin-progress"><div style="width:${pct}%"></div></div>`;
  }

  private _shuffleBtn() {
    const e = this.hass.states[this.entityId];
    const on = !!e.attributes.shuffle;
    return html`
      <button
        class="ctl small opt ${on ? "on" : ""}"
        ?disabled=${!supports(e, Feature.SHUFFLE_SET)}
        @click=${() => this._call("shuffle_set", { shuffle: !on })}
      >
        ${icon(on ? mdiShuffle : mdiShuffleDisabled)}
      </button>
    `;
  }

  private _repeatBtn() {
    const e = this.hass.states[this.entityId];
    const repeat: string = e.attributes.repeat ?? "off";
    const nextRepeat = repeat === "off" ? "all" : repeat === "all" ? "one" : "off";
    return html`
      <button
        class="ctl small opt ${repeat !== "off" ? "on" : ""}"
        ?disabled=${!supports(e, Feature.REPEAT_SET)}
        @click=${() => this._call("repeat_set", { repeat: nextRepeat })}
      >
        ${icon(repeat === "one" ? mdiRepeatOnce : repeat === "all" ? mdiRepeat : mdiRepeatOff)}
      </button>
    `;
  }

  private _renderTransport(extras: boolean, previous: boolean) {
    const e = this.hass.states[this.entityId];
    const playing = e.state === "playing";
    return html`
      <div class="transport">
        ${extras ? this._shuffleBtn() : nothing}
        ${previous
          ? html`<button class="ctl" ?disabled=${!supports(e, Feature.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
              ${icon(mdiSkipPrevious)}
            </button>`
          : nothing}
        <button class="ctl play" @click=${() => this._call("media_play_pause")}>
          ${icon(playing ? mdiPause : mdiPlay)}
        </button>
        <button class="ctl" ?disabled=${!supports(e, Feature.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
          ${icon(mdiSkipNext)}
        </button>
        ${extras ? this._repeatBtn() : nothing}
      </div>
    `;
  }

  private _renderVolume() {
    const e = this.hass.states[this.entityId];
    if (!supports(e, Feature.VOLUME_SET)) return nothing;
    const t = this.localize;
    const ids = this.volumeIds.length ? this.volumeIds : [this.entityId];
    const isGroup = ids.length > 1;
    const vol = isGroup ? groupVolume(this.hass, ids) : Number(e.attributes.volume_level ?? 0);
    const muted = !!e.attributes.is_volume_muted;
    const volIcon = muted || vol === 0 ? mdiVolumeOff : vol < 0.33 ? mdiVolumeLow : vol < 0.66 ? mdiVolumeMedium : mdiVolumeHigh;
    return html`
      <div class="volume" title=${isGroup ? `${t("group_volume")} · ${ids.length}` : ""}>
        <button
          class="ctl small"
          title=${muted ? t("unmute") : t("mute")}
          ?disabled=${!supports(e, Feature.VOLUME_MUTE)}
          @click=${() => this._call("volume_mute", { is_volume_muted: !muted })}
        >
          ${icon(volIcon)}
        </button>
        <ma-slider
          class="vol"
          .value=${vol}
          .label=${isGroup ? t("group_volume") : ""}
          @value-input=${(ev: CustomEvent) => this._setVolume(ids, ev.detail.value, true)}
          @value-change=${(ev: CustomEvent) => this._setVolume(ids, ev.detail.value, false)}
        ></ma-slider>
        <span class="vol-pct">${Math.round(vol * 100)}</span>
      </div>
    `;
  }

  private _renderNext() {
    const n = this.nextItem;
    if (!n) return nothing;
    const mi = n.media_item;
    const title = mi?.name ?? n.name;
    const artist = mi?.artists?.map((a) => a.name).join(", ");
    return html`
      <div class="next">
        <span class="next-label">${this.localize("next_up")}</span>
        <span class="next-title">${title}${artist ? html` <span class="dim">– ${artist}</span>` : nothing}</span>
      </div>
    `;
  }

  // ---------- actions ----------

  private _lastVolSend = 0;
  private _setVolume(ids: string[], v: number, live: boolean) {
    // Throttle live updates while dragging; always send the final value.
    const now = Date.now();
    if (live && now - this._lastVolSend < 250) return;
    this._lastVolSend = now;
    const p =
      ids.length > 1
        ? setGroupVolume(this.hass, ids, v)
        : mediaCommand(this.hass, ids[0], "volume_set", { volume_level: Math.round(v * 100) / 100 });
    p.catch((err) => this._error(err));
  }

  private _call(service: string, data: Record<string, unknown> = {}) {
    mediaCommand(this.hass, this.entityId, service, data).catch((err) => this._error(err));
  }

  private _error(err: unknown) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: err, bubbles: true, composed: true }));
  }

  private _fire(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
      container-type: inline-size;
      box-sizing: border-box;
      color: var(--ma-text);
    }
    :host([variant="large"]) {
      gap: 14px;
      padding: 16px 20px 18px;
    }
    :host([variant="compact"]) {
      padding: 10px 12px;
      gap: 6px;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    .icon {
      fill: currentColor;
      display: block;
      width: 24px;
      height: 24px;
      flex: none;
    }

    /* ---- header (large) ---- */
    .header {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .spacer {
      flex: 1;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 12px 0 14px;
      border-radius: 20px;
      background: var(--ma-chip-bg);
      font-weight: 600;
      font-size: 15px;
      min-width: 0;
      max-width: 70%;
    }
    .chip .icon {
      width: 20px;
      height: 20px;
    }
    .chip .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      padding: 1px 8px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-size: 13px;
      font-weight: 700;
    }
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--ma-chip-bg);
    }
    .chip:active,
    .icon-btn:active {
      background: var(--ma-chip-bg-active);
    }

    /* ---- hero (large) ---- */
    .hero {
      display: grid;
      grid-template-columns: minmax(96px, 38%) minmax(0, 1fr);
      gap: 18px;
      align-items: center;
    }
    .hero.no-art {
      grid-template-columns: minmax(0, 1fr);
    }
    .art {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      background: var(--ma-chip-bg);
    }
    .art.placeholder {
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .art.placeholder .icon {
      width: 40%;
      height: 40%;
    }
    .titles {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    :host([variant="large"]) .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.15;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    :host([variant="large"]) .artist {
      margin-top: 6px;
      font-size: 16px;
      line-height: 1.3;
      color: var(--ma-text-dim);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .next {
      margin-top: 12px;
      font-size: 14px;
      display: flex;
      gap: 8px;
      align-items: baseline;
      min-width: 0;
    }
    .next-label {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      font-weight: 700;
      color: rgb(var(--ma-accent));
      flex: none;
    }
    .next-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dim {
      color: var(--ma-text-dim);
    }

    /* ---- progress / transport / volume ---- */
    .progress {
      --ma-slider-height: 6px;
      --ma-slider-thumb: 16px;
      --ma-slider-fill: rgb(var(--ma-accent));
      margin-bottom: -6px;
    }
    .progress ma-slider {
      height: 32px;
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .transport {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
    .ctl {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      transition: transform 0.12s ease, background 0.2s;
    }
    .ctl:active {
      transform: scale(0.9);
      background: var(--ma-chip-bg);
    }
    .ctl .icon {
      width: 36px;
      height: 36px;
    }
    .ctl.small {
      width: 44px;
      height: 44px;
      color: var(--ma-text-dim);
    }
    .ctl.small .icon {
      width: 24px;
      height: 24px;
    }
    .ctl.small.on {
      color: rgb(var(--ma-accent));
    }
    .ctl.play {
      width: 72px;
      height: 72px;
      background: var(--ma-play-bg);
      color: var(--ma-play-fg);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    }
    .ctl.play .icon {
      width: 40px;
      height: 40px;
    }
    .volume {
      display: flex;
      align-items: center;
      gap: 6px;
      --ma-slider-height: 8px;
      --ma-slider-thumb: 22px;
    }
    .volume .vol {
      flex: 1;
    }
    .vol-pct {
      width: 3ch;
      text-align: right;
      font-size: 14px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }

    /* ---- compact ---- */
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    :host([variant="compact"]) .art {
      width: 64px;
      height: 64px;
      flex: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    :host([variant="compact"]) .titles {
      flex: 1;
      gap: 1px;
    }
    :host([variant="compact"]) .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([variant="compact"]) .artist {
      font-size: 14px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .player-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      align-self: flex-start;
      max-width: 100%;
      margin-top: 2px;
      font-size: 13px;
      font-weight: 600;
      color: rgb(var(--ma-accent));
      white-space: nowrap;
    }
    .player-link span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .player-link .icon {
      width: 16px;
      height: 16px;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: none;
    }
    :host([variant="compact"]) .ctl {
      width: 44px;
      height: 44px;
    }
    :host([variant="compact"]) .ctl .icon {
      width: 28px;
      height: 28px;
    }
    :host([variant="compact"]) .ctl.small .icon {
      width: 22px;
      height: 22px;
    }
    :host([variant="compact"]) .ctl.play {
      width: 48px;
      height: 48px;
      box-shadow: none;
    }
    :host([variant="compact"]) .ctl.play .icon {
      width: 30px;
      height: 30px;
    }
    .sep {
      width: 1px;
      height: 28px;
      margin: 0 4px;
      background: var(--ma-chip-bg-active);
    }
    .thin-progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--ma-chip-bg);
    }
    .thin-progress div {
      height: 100%;
      background: rgb(var(--ma-accent));
      transition: width 1s linear;
    }

    /* Narrow cards: stack the large hero, drop secondary compact buttons. */
    @container (max-width: 340px) {
      .hero {
        grid-template-columns: minmax(0, 1fr);
      }
      .hero .art {
        width: min(100%, 240px);
        justify-self: center;
      }
      .hero .titles {
        text-align: center;
      }
      .next {
        justify-content: center;
      }
    }
    @container (max-width: 420px) {
      .controls .opt {
        display: none;
      }
    }
    @container (max-width: 340px) {
      .controls .prev,
      .controls .sep,
      .controls .ctl.small {
        display: none;
      }
      :host([variant="compact"]) .art {
        width: 48px;
        height: 48px;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ma-card-player": MaCardPlayer;
  }
}
