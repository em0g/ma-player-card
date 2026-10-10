import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, HomeAssistant, QueueItem } from "./ha/types";
import { type MaPlayer, getLeader, getPlayers, getSyncMembers, hasMedia, pickDefault } from "./ha/players";
import { getQueue, resolveConfigEntryId } from "./ha/ma-service";
import { getLocalize, type Localize } from "./localize";
import { dominantColor } from "./utils/color";
import { entityImage } from "./utils/media";
import { icon, mdiChevronDown, mdiHistory, mdiMagnify, mdiSpeakerMultiple } from "./utils/icon";
import "./components/now-playing";
import "./components/speaker-panel";
import "./components/search-overlay";

const VERSION = "0.1.1";
const STORAGE_KEY = "ma-player-card.active";
const DEFAULT_ACCENT = "120, 170, 255";

type Panel = "none" | "speakers" | "search" | "recent";

@customElement("ma-player-card")
export class MaPlayerCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config!: CardConfig;
  @state() private _activeId?: string;
  @state() private _panel: Panel = "none";
  @state() private _nextItem: QueueItem | null = null;
  @state() private _entryId = "";
  @state() private _accent = DEFAULT_ACCENT;
  @state() private _toast: { text: string; error: boolean } | null = null;

  private _localize: Localize = getLocalize("sv");
  private _players: MaPlayer[] = [];
  private _queueKey = "";
  private _entryRequested = false;
  private _accentFor = "";
  private _toastTimer?: number;
  @state() private _top = 0;
  private _measureFrame?: number;

  /**
   * Fill the screen from wherever the card starts. HA's --header-height can't be
   * trusted because kiosk-mode hides the header without resetting it.
   */
  private _measure = () => {
    cancelAnimationFrame(this._measureFrame!);
    this._measureFrame = requestAnimationFrame(() => {
      const top = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY));
      if (top !== this._top) this._top = top;
    });
  };

  static getStubConfig() {
    return { type: "custom:ma-player-card" };
  }

  setConfig(config: CardConfig) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { hide_unavailable: true, ...config };
    this._localize = getLocalize(config.language ?? "sv");
  }

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: "full", rows: "auto" };
  }

  protected willUpdate(changed: PropertyValues) {
    if (!this.hass || !this._config) return;
    if (changed.has("hass") || changed.has("_config")) {
      this._players = getPlayers(this.hass, this._config);
      if (!this._activeId || !this.hass.states[this._activeId]) {
        this._activeId = pickDefault(this._players, this.hass, readStored() ?? this._config.default_player);
      }
    }
    if (!this._activeId) return;
    if (!this._entryRequested) {
      this._entryRequested = true;
      resolveConfigEntryId(this.hass, this._config.config_entry_id)
        .then((id) => (this._entryId = id))
        .catch((err) => this._showError(err));
    }
    if (changed.has("hass") || changed.has("_activeId")) {
      this._refreshQueue();
      this._refreshAccent();
    }
  }

  private get _leaderId() {
    return this._activeId ? getLeader(this.hass, this._activeId) : "";
  }

  private get _groupIds() {
    const leader = this._leaderId;
    return leader ? [leader, ...getSyncMembers(this.hass, leader)] : [];
  }

  /** Fetch "next up" whenever the playing item on the leader changes. */
  private _refreshQueue() {
    const leader = this._leaderId;
    const e = this.hass.states[leader];
    const key = `${leader}|${e?.attributes.media_content_id}|${e?.attributes.media_title}|${e?.attributes.active_queue}`;
    if (key === this._queueKey) return;
    this._queueKey = key;
    if (!hasMedia(e)) {
      this._nextItem = null;
      return;
    }
    getQueue(this.hass, leader)
      .then((q) => {
        if (this._queueKey === key) this._nextItem = q?.next_item ?? null;
      })
      .catch(() => (this._nextItem = null));
  }

  private _refreshAccent() {
    const e = this.hass.states[this._leaderId];
    const img = hasMedia(e) ? entityImage(this.hass, e) : undefined;
    if (!img) {
      this._accentFor = "";
      this._accent = DEFAULT_ACCENT;
      return;
    }
    if (img === this._accentFor) return;
    this._accentFor = img;
    dominantColor(img).then((c) => {
      if (this._accentFor === img) this._accent = c ?? DEFAULT_ACCENT;
    });
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    const t = this._localize;
    const activeId = this._activeId;
    if (!activeId) {
      return html`<div class="empty">No Music Assistant players found.</div>`;
    }
    const leaderId = this._leaderId;
    const leader = this.hass.states[leaderId];
    const groupIds = this._groupIds;
    const bg = hasMedia(leader) ? entityImage(this.hass, leader) : undefined;
    const activeName = this.hass.states[activeId]?.attributes.friendly_name ?? activeId;
    const height = this._config.height ?? `calc(100dvh - ${this._top}px)`;

    return html`
      <div
        class="root"
        style="--ma-accent:${this._accent};--ma-footer-space:${this._config.footer_space ?? 0}px;height:${height}"
      >
        <div class="bg">
          ${bg ? html`<div class="bg-img" style="background-image:url('${bg}')"></div>` : nothing}
          <div class="bg-tint"></div>
        </div>

        <div class="topbar">
          <button class="search-btn" @click=${() => (this._panel = "search")}>
            ${icon(mdiMagnify)} <span>${t("search")}</span>
          </button>
          <button class="recent-btn" @click=${() => (this._panel = "recent")}>
            ${icon(mdiHistory)} <span>${t("recent")}</span>
          </button>
          <button class="player-btn" @click=${() => (this._panel = "speakers")}>
            ${icon(mdiSpeakerMultiple)}
            <span class="player-name">${activeName}</span>
            ${groupIds.length > 1 ? html`<span class="count">+${groupIds.length - 1}</span>` : nothing}
            ${icon(mdiChevronDown)}
          </button>
        </div>

        <ma-now-playing
          class="main"
          .hass=${this.hass}
          .localize=${t}
          .entityId=${leaderId}
          .volumeIds=${groupIds}
          .nextItem=${this._nextItem}
          @open-search=${() => (this._panel = "search")}
          @open-speakers=${() => (this._panel = "speakers")}
        ></ma-now-playing>

        <div class="scrim ${this._panel === "speakers" ? "show" : ""}" @click=${this._closePanel}></div>
        <aside class="drawer ${this._panel === "speakers" ? "open" : ""}">
          ${this._panel === "speakers"
            ? html`
                <ma-speaker-panel
                  .hass=${this.hass}
                  .localize=${t}
                  .players=${this._players}
                  .activeId=${activeId}
                  .leaderId=${leaderId}
                  .groupIds=${groupIds}
                  @select-player=${(e: CustomEvent<string>) => this._select(e.detail)}
                  @close=${this._closePanel}
                ></ma-speaker-panel>
              `
            : nothing}
        </aside>

        <ma-search-overlay
          .hass=${this.hass}
          .localize=${t}
          .entityId=${leaderId}
          .playerName=${activeName}
          .entryId=${this._entryId}
          .mode=${this._panel === "recent" ? "recent" : "search"}
          ?open=${this._panel === "search" || this._panel === "recent"}
          @close=${this._closePanel}
        ></ma-search-overlay>

        ${this._toast
          ? html`<div class="toast ${this._toast.error ? "error" : ""}">${this._toast.text}</div>`
          : nothing}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this._measure);
    this._measure();
    // Header visibility (kiosk-mode) can settle after first paint.
    setTimeout(this._measure, 500);
    setTimeout(this._measure, 2000);
    this.addEventListener("ma-error", this._onError as EventListener);
    this.addEventListener("ma-toast", this._onToast as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._measure);
    this.removeEventListener("ma-error", this._onError as EventListener);
    this.removeEventListener("ma-toast", this._onToast as EventListener);
  }

  private _onError = (e: CustomEvent) => this._showError(e.detail);
  private _onToast = (e: CustomEvent<string>) => this._showToast(e.detail, false);

  private _showError(err: any) {
    const msg = err?.message ?? (typeof err === "string" ? err : this._localize("error"));
    this._showToast(msg, true);
    console.warn("[ma-player-card]", err);
  }

  private _showToast(text: string, error: boolean) {
    this._toast = { text, error };
    clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => (this._toast = null), error ? 6000 : 3000);
  }

  private _closePanel = () => {
    this._panel = "none";
  };

  private _select(id: string) {
    this._activeId = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage unavailable – selection just isn't remembered */
    }
  }

  static styles = css`
    :host {
      display: block;
      --ma-text: #fff;
      --ma-text-dim: rgba(255, 255, 255, 0.68);
      color: var(--ma-text);
      font-family: var(--ha-font-family-body, var(--primary-font-family, system-ui, sans-serif));
    }
    .root {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 480px;
      background: #0d0d10;
      border-radius: var(--ma-card-radius, 0);
    }
    .bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 0;
    }
    .bg-img {
      position: absolute;
      inset: -10%;
      background-size: cover;
      background-position: center;
      filter: blur(60px) saturate(1.3) brightness(0.55);
      transform: scale(1.1);
      transition: background-image 0.6s;
    }
    .bg-tint {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 30%, rgba(var(--ma-accent), 0.3), transparent 60%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.55));
      transition: background 0.6s;
    }
    .topbar,
    .main {
      position: relative;
      z-index: 1;
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px clamp(24px, 3vw, 48px) 8px;
    }
    .main {
      flex: 1;
      min-height: 0;
      margin-bottom: var(--ma-footer-space, 0px);
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
    .icon {
      fill: currentColor;
      width: 28px;
      height: 28px;
      flex: none;
      display: block;
    }
    .search-btn,
    .recent-btn,
    .player-btn {
      height: 64px;
      border-radius: 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-size: 21px;
      transition: background 0.15s;
    }
    .search-btn:active,
    .recent-btn:active,
    .player-btn:active {
      background: rgba(255, 255, 255, 0.22);
    }
    .search-btn {
      flex: 1;
      max-width: 560px;
      padding: 0 26px;
      color: var(--ma-text-dim);
    }
    .recent-btn {
      flex: none;
      padding: 0 24px 0 20px;
      font-weight: 600;
    }
    .player-btn {
      margin-left: auto;
      padding: 0 20px 0 22px;
      font-weight: 600;
      max-width: 45%;
    }
    .player-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      padding: 2px 10px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-size: 16px;
      font-weight: 700;
    }
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 5;
      background: rgba(0, 0, 0, 0.45);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }
    .scrim.show {
      opacity: 1;
      pointer-events: auto;
    }
    .drawer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: var(--ma-footer-space, 0px);
      z-index: 6;
      width: min(560px, 46%);
      background: rgba(22, 22, 28, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
      transform: translateX(105%);
      transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .drawer.open {
      transform: none;
    }
    .toast {
      position: absolute;
      left: 50%;
      bottom: calc(28px + var(--ma-footer-space, 0px));
      transform: translateX(-50%);
      z-index: 30;
      max-width: 80%;
      padding: 16px 26px;
      border-radius: 16px;
      background: rgba(40, 40, 46, 0.96);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      font-size: 19px;
      animation: pop 0.2s ease-out;
    }
    .toast.error {
      background: #8b1f1f;
    }
    @keyframes pop {
      from { opacity: 0; transform: translate(-50%, 10px); }
    }
    .empty {
      padding: 32px;
      font-size: 20px;
    }
  `;
}

function readStored(): string | undefined {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

declare global {
  interface Window {
    customCards?: { type: string; name: string; description: string; preview?: boolean }[];
  }
  interface HTMLElementTagNameMap {
    "ma-player-card": MaPlayerCard;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ma-player-card",
  name: "MA Player Card",
  description: "Fullscreen Music Assistant player for kiosk dashboards",
});

console.info(`%c MA-PLAYER-CARD %c ${VERSION} `, "background:#78aaff;color:#111;font-weight:700", "");
