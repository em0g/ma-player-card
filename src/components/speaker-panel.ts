import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../ha/types";
import type { Localize, StringKey } from "../localize";
import { type MaPlayer, getLeader, hasMedia } from "../ha/players";
import { join, mediaCommand, transferQueue, unjoin } from "../ha/ma-service";
import { Feature, entityImage, groupVolume, setGroupVolume, supports } from "../utils/media";
import {
  icon,
  mdiCheck,
  mdiClose,
  mdiPlusCircleOutline,
  mdiSpeaker,
  mdiSpeakerMultiple,
  mdiSwapHorizontal,
  mdiVolumeHigh,
  mdiVolumeOff,
} from "../utils/icon";
import "./slider";

/**
 * Side panel listing every MA player: pick the active one, add/remove
 * players to the active sync group, move the queue, per-room volume.
 */
@customElement("ma-speaker-panel")
export class MaSpeakerPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) localize!: Localize;
  @property({ attribute: false }) players: MaPlayer[] = [];
  /** Currently selected player in the card. */
  @property() activeId = "";
  /** Sync leader of the active player (== activeId when not grouped). */
  @property() leaderId = "";
  /** Leader + its sync members. */
  @property({ attribute: false }) groupIds: string[] = [];

  @state() private _busy = new Set<string>();

  protected render() {
    const t = this.localize;
    const leader = this.hass.states[this.leaderId];
    const leaderName = leader?.attributes.friendly_name ?? "";
    const canGroup = supports(leader, Feature.GROUPING) && leader?.attributes.mass_player_type !== "group";
    const grouped = this.groupIds.length > 1;

    return html`
      <header>
        <h2>${t("speakers")}</h2>
        <button class="icon-btn" @click=${() => this._fire("close")} aria-label=${t("close")}>
          ${icon(mdiClose)}
        </button>
      </header>
      ${grouped
        ? html`
            <section class="group-card">
              <div class="group-head">
                ${icon(mdiSpeakerMultiple)}
                <div>
                  <div class="group-title">${t("group")}: ${leaderName}</div>
                  <div class="group-sub">
                    ${this.groupIds.map((id) => this.hass.states[id]?.attributes.friendly_name).join(", ")}
                  </div>
                </div>
              </div>
              <div class="vol-row">
                <span class="vol-label">${t("group_volume")}</span>
                <ma-slider
                  .value=${groupVolume(this.hass, this.groupIds)}
                  @value-change=${(ev: CustomEvent) =>
                    setGroupVolume(this.hass, this.groupIds, ev.detail.value).catch((e) => this._error(e))}
                ></ma-slider>
              </div>
            </section>
          `
        : nothing}
      <div class="list">${this.players.map((p) => this._renderPlayer(p, canGroup))}</div>
    `;
  }

  private _renderPlayer(p: MaPlayer, canGroup: boolean) {
    const t = this.localize;
    const e = p.entity;
    const isActive = p.id === this.activeId;
    const inGroup = this.groupIds.includes(p.id);
    const isLeader = p.id === this.leaderId;
    const playerLeader = getLeader(this.hass, p.id);
    const media = hasMedia(this.hass.states[playerLeader]);
    const leaderEntity = this.hass.states[playerLeader];
    const img = media ? entityImage(this.hass, leaderEntity) : undefined;
    const busy = this._busy.has(p.id);
    const muted = !!e.attributes.is_volume_muted;

    // A player can be added to the active group if both support grouping and it isn't a permanent group itself.
    const groupable = canGroup && !p.isGroup && supports(e, Feature.GROUPING) && !isLeader && p.available;
    const canTransfer =
      !isActive && !inGroup && p.available && hasMedia(this.hass.states[this.leaderId]) && playerLeader !== this.leaderId;

    return html`
      <div class="player ${isActive ? "active" : ""} ${inGroup ? "in-group" : ""} ${p.available ? "" : "unavailable"}">
        <button class="main" @click=${() => this._select(p.id)} ?disabled=${!p.available}>
          <div class="thumb">
            ${img ? html`<img src=${img} alt="" />` : icon(p.isGroup ? mdiSpeakerMultiple : mdiSpeaker)}
          </div>
          <div class="text">
            <div class="name">
              ${p.name} ${isActive ? html`<span class="badge">${t("active")}</span>` : nothing}
            </div>
            <div class="status">
              ${media
                ? [leaderEntity.attributes.media_title, leaderEntity.attributes.media_artist].filter(Boolean).join(" – ")
                : this._stateLabel(e.state)}
              ${playerLeader !== p.id
                ? html`<span class="dim"> · ${t("grouped_with")} ${this.hass.states[playerLeader]?.attributes.friendly_name}</span>`
                : nothing}
            </div>
          </div>
        </button>
        <div class="actions">
          ${groupable
            ? html`
                <button
                  class="toggle ${inGroup ? "on" : ""}"
                  ?disabled=${busy}
                  @click=${() => this._toggleGroup(p.id, inGroup)}
                  title=${inGroup ? t("remove_from_group") : t("add_to_group")}
                >
                  ${icon(inGroup ? mdiCheck : mdiPlusCircleOutline)}
                  <span>${inGroup ? t("in_group") : t("add_to_group")}</span>
                </button>
              `
            : nothing}
          ${canTransfer
            ? html`
                <button class="icon-btn" ?disabled=${busy} title=${t("transfer_here")} @click=${() => this._transfer(p.id)}>
                  ${icon(mdiSwapHorizontal)}
                </button>
              `
            : nothing}
        </div>
        ${p.available && supports(e, Feature.VOLUME_SET)
          ? html`
              <div class="vol-row">
                <button
                  class="icon-btn small"
                  ?disabled=${!supports(e, Feature.VOLUME_MUTE)}
                  @click=${() => this._cmd(p.id, "volume_mute", { is_volume_muted: !muted })}
                >
                  ${icon(muted ? mdiVolumeOff : mdiVolumeHigh)}
                </button>
                <ma-slider
                  .value=${Number(e.attributes.volume_level ?? 0)}
                  @value-change=${(ev: CustomEvent) =>
                    this._cmd(p.id, "volume_set", { volume_level: Math.round(ev.detail.value * 100) / 100 })}
                ></ma-slider>
                <span class="pct">${Math.round(Number(e.attributes.volume_level ?? 0) * 100)}</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _stateLabel(s: string) {
    const key = (["playing", "paused", "idle", "off", "unavailable"].includes(s) ? s : "idle") as StringKey;
    return this.localize(key);
  }

  private _select(id: string) {
    this.dispatchEvent(new CustomEvent("select-player", { detail: id, bubbles: true, composed: true }));
  }

  private async _toggleGroup(id: string, inGroup: boolean) {
    await this._withBusy(id, () => (inGroup ? unjoin(this.hass, id) : join(this.hass, this.leaderId, [id])));
  }

  private async _transfer(id: string) {
    await this._withBusy(id, () => transferQueue(this.hass, this.leaderId, id));
    this._select(id);
  }

  private _cmd(id: string, service: string, data: Record<string, unknown>) {
    mediaCommand(this.hass, id, service, data).catch((e) => this._error(e));
  }

  private async _withBusy(id: string, fn: () => Promise<unknown>) {
    this._busy = new Set(this._busy).add(id);
    try {
      await fn();
    } catch (e) {
      this._error(e);
    } finally {
      const next = new Set(this._busy);
      next.delete(id);
      this._busy = next;
    }
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
      height: 100%;
      min-height: 0;
      --ma-slider-height: 10px;
      --ma-slider-thumb: 28px;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 12px 28px;
    }
    h2 {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
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
      opacity: 0.4;
      pointer-events: none;
    }
    .icon {
      fill: currentColor;
      width: 30px;
      height: 30px;
      display: block;
      flex: none;
    }
    .icon-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: none;
    }
    .icon-btn:active {
      background: rgba(255, 255, 255, 0.14);
    }
    .icon-btn.small {
      width: 48px;
      height: 48px;
      color: var(--ma-text-dim);
    }
    .icon-btn.small .icon {
      width: 26px;
      height: 26px;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 4px 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .group-card {
      margin: 0 16px 12px;
      padding: 16px 18px;
      border-radius: 18px;
      background: rgba(var(--ma-accent), 0.18);
      border: 1px solid rgba(var(--ma-accent), 0.4);
    }
    .group-head {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .group-title {
      font-size: 20px;
      font-weight: 700;
    }
    .group-sub {
      font-size: 15px;
      color: var(--ma-text-dim);
    }
    .vol-label {
      font-size: 15px;
      color: var(--ma-text-dim);
      flex: none;
    }
    .player {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 4px 8px;
      padding: 10px 10px 6px 12px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.07);
      border: 2px solid transparent;
    }
    .player.active {
      border-color: rgb(var(--ma-accent));
    }
    .player.in-group:not(.active) {
      background: rgba(var(--ma-accent), 0.14);
    }
    .player.unavailable {
      opacity: 0.45;
    }
    .main {
      display: flex;
      align-items: center;
      gap: 14px;
      text-align: left;
      min-width: 0;
      padding: 4px 0;
    }
    .thumb {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      flex: none;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
      color: var(--ma-text-dim);
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .text {
      min-width: 0;
    }
    .name {
      font-size: 21px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-weight: 700;
    }
    .status {
      font-size: 15px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dim {
      opacity: 0.8;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 48px;
      padding: 0 16px 0 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }
    .toggle .icon {
      width: 24px;
      height: 24px;
    }
    .toggle.on {
      background: rgb(var(--ma-accent));
      color: #111;
    }
    .vol-row {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vol-row ma-slider {
      flex: 1;
    }
    .group-card .vol-row {
      margin-top: 10px;
      gap: 14px;
    }
    .pct {
      width: 3ch;
      text-align: right;
      font-size: 16px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
      padding-right: 6px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ma-speaker-panel": MaSpeakerPanel;
  }
}
