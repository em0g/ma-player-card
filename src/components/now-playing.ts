import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant, QueueItem } from "../ha/types";
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

@customElement("ma-now-playing")
export class MaNowPlaying extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) localize!: Localize;
  /** The player that owns playback (sync leader or the selected player). */
  @property() entityId = "";
  /** Players whose volume the main slider controls (leader + sync members). */
  @property({ attribute: false }) volumeIds: string[] = [];
  @property({ attribute: false }) nextItem: QueueItem | null = null;

  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      if (this.hass?.states[this.entityId]?.state === "playing") this.requestUpdate();
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  protected render() {
    const e = this.hass.states[this.entityId];
    if (!e) return nothing;
    const t = this.localize;
    const media = hasMedia(e);
    const img = media ? entityImage(this.hass, e) : undefined;

    return html`
      <div class="art-wrap">
        ${img
          ? html`<img class="art" src=${img} alt="" />`
          : html`<div class="art placeholder">${icon(mdiMusicNote)}</div>`}
      </div>
      <div class="info">
        ${media
          ? html`
              <div class="titles">
                <div class="title">${e.attributes.media_title ?? ""}</div>
                <div class="artist">${artistLine(e)}</div>
              </div>
              ${this._renderProgress()} ${this._renderTransport()}
            `
          : html`
              <div class="titles">
                <div class="title">${t("nothing_playing")}</div>
                <div class="artist hint">${t("nothing_playing_hint")}</div>
              </div>
              <div class="idle-actions">
                <button class="pill" @click=${() => this._fire("open-search")}>
                  ${icon(mdiMagnify)} ${t("search")}
                </button>
                <button class="pill" @click=${() => this._fire("open-speakers")}>
                  ${icon(mdiSpeakerMultiple)} ${t("speakers")}
                </button>
              </div>
            `}
        ${this._renderVolume()} ${media ? this._renderNext() : nothing}
      </div>
    `;
  }

  private _renderProgress() {
    const e = this.hass.states[this.entityId];
    const dur = Number(e.attributes.media_duration);
    const pos = currentPosition(e);
    if (!(dur > 0)) return html`<div class="progress-spacer"></div>`;
    return html`
      <div class="progress">
        <ma-slider
          class="seek"
          .value=${(pos ?? 0) / dur}
          ?disabled=${!supports(e, Feature.SEEK)}
          @value-change=${(ev: CustomEvent) =>
            this._call("media_seek", { seek_position: Math.round(ev.detail.value * dur) })}
        ></ma-slider>
        <div class="times"><span>${formatTime(pos)}</span><span>${formatTime(dur)}</span></div>
      </div>
    `;
  }

  private _renderTransport() {
    const e = this.hass.states[this.entityId];
    const a = e.attributes;
    const playing = e.state === "playing";
    const repeat: string = a.repeat ?? "off";
    const nextRepeat = repeat === "off" ? "all" : repeat === "all" ? "one" : "off";
    return html`
      <div class="transport">
        <button
          class="ctl small ${a.shuffle ? "on" : ""}"
          ?disabled=${!supports(e, Feature.SHUFFLE_SET)}
          @click=${() => this._call("shuffle_set", { shuffle: !a.shuffle })}
        >
          ${icon(a.shuffle ? mdiShuffle : mdiShuffleDisabled)}
        </button>
        <button class="ctl" ?disabled=${!supports(e, Feature.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
          ${icon(mdiSkipPrevious)}
        </button>
        <button class="ctl play" @click=${() => this._call("media_play_pause")}>
          ${icon(playing ? mdiPause : mdiPlay)}
        </button>
        <button class="ctl" ?disabled=${!supports(e, Feature.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
          ${icon(mdiSkipNext)}
        </button>
        <button
          class="ctl small ${repeat !== "off" ? "on" : ""}"
          ?disabled=${!supports(e, Feature.REPEAT_SET)}
          @click=${() => this._call("repeat_set", { repeat: nextRepeat })}
        >
          ${icon(repeat === "one" ? mdiRepeatOnce : repeat === "all" ? mdiRepeat : mdiRepeatOff)}
        </button>
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
      <div class="volume">
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
      ${isGroup ? html`<div class="vol-caption">${t("group_volume")} · ${ids.length}</div>` : nothing}
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
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: clamp(24px, 4vw, 64px);
      align-items: center;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      padding: 8px clamp(24px, 3vw, 48px) clamp(24px, 3vh, 40px);
    }
    .art-wrap {
      height: 100%;
      max-height: min(100%, 46vw);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      min-height: 0;
    }
    .art {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      background: rgba(255, 255, 255, 0.06);
    }
    .art.placeholder {
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.35);
    }
    .art.placeholder .icon {
      width: 40%;
      height: 40%;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: clamp(16px, 3vh, 32px);
      min-width: 0;
    }
    .title {
      font-size: clamp(32px, 4.2vw, 64px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.01em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .artist {
      margin-top: 10px;
      line-height: 1.3;
      font-size: clamp(20px, 2.2vw, 32px);
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist.hint {
      white-space: normal;
    }
    .progress {
      --ma-slider-height: 8px;
      --ma-slider-thumb: 22px;
      --ma-slider-fill: rgb(var(--ma-accent));
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .transport {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 620px;
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
    .ctl {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      transition: transform 0.12s ease, background 0.2s;
    }
    .ctl:active {
      transform: scale(0.9);
      background: rgba(255, 255, 255, 0.12);
    }
    .ctl .icon {
      width: 56px;
      height: 56px;
    }
    .ctl.small {
      width: 64px;
      height: 64px;
      color: var(--ma-text-dim);
    }
    .ctl.small .icon {
      width: 34px;
      height: 34px;
    }
    .ctl.small.on {
      color: rgb(var(--ma-accent));
    }
    .ctl.play {
      width: 120px;
      height: 120px;
      background: #fff;
      color: #111;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .ctl.play .icon {
      width: 64px;
      height: 64px;
    }
    .volume {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 620px;
      --ma-slider-height: 14px;
      --ma-slider-thumb: 34px;
    }
    .volume .vol {
      flex: 1;
    }
    .vol-pct {
      width: 3ch;
      text-align: right;
      font-size: 20px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .vol-caption {
      margin-top: -16px;
      padding-left: 76px;
      font-size: 15px;
      color: var(--ma-text-dim);
    }
    .next {
      font-size: 18px;
      display: flex;
      gap: 12px;
      align-items: baseline;
      min-width: 0;
      max-width: 620px;
    }
    .next-label {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 13px;
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
    .idle-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 28px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      font-size: 22px;
      font-weight: 600;
    }
    .pill:active {
      background: rgba(255, 255, 255, 0.24);
    }
    .pill .icon {
      width: 28px;
      height: 28px;
    }
    .icon {
      fill: currentColor;
      display: block;
    }
    @media (max-height: 700px) {
      .ctl.play { width: 96px; height: 96px; }
      .ctl { width: 68px; height: 68px; }
      .ctl .icon { width: 44px; height: 44px; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ma-now-playing": MaNowPlaying;
  }
}
