import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type { Enqueue, HomeAssistant, MaMediaItem, MediaType, SearchResult } from "../ha/types";
import type { Localize, StringKey } from "../localize";
import { getLibrary, playMedia, search } from "../ha/ma-service";
import {
  icon,
  mdiAccountMusic,
  mdiAlbum,
  mdiBookOpenPageVariant,
  mdiClose,
  mdiDotsVertical,
  mdiMagnify,
  mdiMusicNote,
  mdiPlay,
  mdiPlaylistMusic,
  mdiPlaylistPlus,
  mdiPodcast,
  mdiRadio,
  mdiRadioTower,
  mdiSkipForward,
} from "../utils/icon";

type Tab = "all" | MediaType;

interface Section {
  key: string;
  type: MediaType;
  label: StringKey;
}

const SECTIONS: Section[] = [
  { key: "artists", type: "artist", label: "artists" },
  { key: "albums", type: "album", label: "albums" },
  { key: "tracks", type: "track", label: "tracks" },
  { key: "playlists", type: "playlist", label: "playlists" },
  { key: "radio", type: "radio", label: "radio" },
  { key: "podcasts", type: "podcast", label: "podcasts" },
  { key: "audiobooks", type: "audiobook", label: "audiobooks" },
];

const TABS: { tab: Tab; label: StringKey }[] = [
  { tab: "all", label: "all" },
  { tab: "artist", label: "artists" },
  { tab: "album", label: "albums" },
  { tab: "track", label: "tracks" },
  { tab: "playlist", label: "playlists" },
  { tab: "radio", label: "radio" },
  { tab: "podcast", label: "podcasts" },
];

const ALL_TYPES: MediaType[] = ["artist", "album", "track", "playlist", "radio"];
const FAVORITE_TYPES: MediaType[] = ["playlist", "album", "artist", "radio", "track"];

const TYPE_ICON: Record<MediaType, string> = {
  artist: mdiAccountMusic,
  album: mdiAlbum,
  track: mdiMusicNote,
  playlist: mdiPlaylistMusic,
  radio: mdiRadio,
  podcast: mdiPodcast,
  audiobook: mdiBookOpenPageVariant,
};

/**
 * Fullscreen search pinned to the top of the screen. The overlay height
 * follows `visualViewport`, so when the on-screen keyboard opens the result
 * list shrinks instead of ending up underneath the keyboard.
 */
@customElement("ma-search-overlay")
export class MaSearchOverlay extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) localize!: Localize;
  @property() entityId = "";
  @property() playerName = "";
  @property() entryId = "";
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _query = "";
  @state() private _tab: Tab = "all";
  @state() private _results: SearchResult | null = null;
  @state() private _favorites: SearchResult | null = null;
  @state() private _loading = false;
  @state() private _menuItem: MaMediaItem | null = null;
  @state() private _vvHeight: number | null = null;

  @query("input") private _input!: HTMLInputElement;

  private _debounce?: number;
  private _seq = 0;
  private _favoritesRequested = false;
  private _longPressTimer?: number;
  private _longPressed = false;

  private _onViewport = () => {
    const vv = window.visualViewport;
    if (!vv) return;
    this._vvHeight = vv.height;
    // Some WebViews pan the page instead of resizing; keep the overlay glued to the visible area.
    this.style.setProperty("--ma-vv-top", `${vv.offsetTop}px`);
  };

  connectedCallback() {
    super.connectedCallback();
    window.visualViewport?.addEventListener("resize", this._onViewport);
    window.visualViewport?.addEventListener("scroll", this._onViewport);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.visualViewport?.removeEventListener("resize", this._onViewport);
    window.visualViewport?.removeEventListener("scroll", this._onViewport);
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("open") && this.open) this._onViewport();
    if ((changed.has("open") || changed.has("entryId")) && this.open && this.entryId && !this._favoritesRequested) {
      this._favoritesRequested = true;
      this._loadFavorites();
    }
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("open") && this.open) {
      this._input?.focus();
      this._input?.select();
    }
  }

  protected render() {
    if (!this.open) return nothing;
    const t = this.localize;
    const style = this._vvHeight ? `height:${this._vvHeight}px` : "";
    return html`
      <div class="sheet" style=${style}>
        <div class="top">
          <label class="field">
            ${icon(mdiMagnify)}
            <input
              type="search"
              inputmode="search"
              enterkeyhint="search"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder=${t("search_placeholder")}
              .value=${this._query}
              @input=${this._onInput}
              @keydown=${this._onKey}
            />
            ${this._query
              ? html`<button class="clear" @click=${this._clear} aria-label="clear">${icon(mdiClose)}</button>`
              : nothing}
          </label>
          <button class="close" @click=${this._close}>${t("close")}</button>
        </div>
        <div class="tabs">
          ${TABS.map(
            ({ tab, label }) => html`
              <button class="tab ${this._tab === tab ? "on" : ""}" @click=${() => this._setTab(tab)}>
                ${t(label)}
              </button>
            `,
          )}
          <span class="target">${t("playing_on")}: <b>${this.playerName}</b></span>
        </div>
        <div class="results">${this._renderBody()}</div>
        ${this._menuItem ? this._renderMenu(this._menuItem) : nothing}
      </div>
    `;
  }

  private _renderBody() {
    const t = this.localize;
    const q = this._query.trim();
    const data = q.length >= 2 ? this._results : this._favorites;
    if (!data) return html`<div class="msg">${this._loading ? t("searching") : ""}</div>`;

    const sections = SECTIONS.filter((s) => (this._tab === "all" ? true : s.type === this._tab))
      .map((s) => ({ ...s, items: data[s.key] ?? [] }))
      .filter((s) => s.items.length);

    if (!sections.length) {
      return html`<div class="msg">${this._loading ? t("searching") : t("no_results")}</div>`;
    }

    const single = this._tab !== "all";
    return html`
      ${this._loading ? html`<div class="loading-bar"></div>` : nothing}
      ${q.length < 2 ? html`<h2 class="fav-title">${t("favorites")}</h2>` : nothing}
      ${sections.map(
        (s) => html`
          <section>
            ${single ? nothing : html`<h3>${t(s.label)}</h3>`}
            ${s.type === "track"
              ? html`<div class="tracks ${single ? "full" : ""}">${s.items.map((i) => this._renderTrack(i))}</div>`
              : html`<div class="${single ? "grid" : "row"}">${s.items.map((i) => this._renderTile(i))}</div>`}
          </section>
        `,
      )}
    `;
  }

  private _pressHandlers(item: MaMediaItem) {
    return {
      down: () => {
        this._longPressed = false;
        this._longPressTimer = window.setTimeout(() => {
          this._longPressed = true;
          this._menuItem = item;
        }, 550);
      },
      cancel: () => clearTimeout(this._longPressTimer),
      click: () => {
        clearTimeout(this._longPressTimer);
        if (!this._longPressed) this._play(item, defaultEnqueue(item));
      },
    };
  }

  private _renderTile(item: MaMediaItem) {
    const h = this._pressHandlers(item);
    const img = itemImage(item);
    return html`
      <div class="tile ${item.media_type}">
        <button
          class="tile-main"
          @pointerdown=${h.down}
          @pointerup=${h.cancel}
          @pointerleave=${h.cancel}
          @pointercancel=${h.cancel}
          @contextmenu=${(e: Event) => e.preventDefault()}
          @click=${h.click}
        >
          <div class="cover">
            ${img ? html`<img src=${img} alt="" loading="lazy" />` : icon(TYPE_ICON[item.media_type])}
            <span class="play-badge">${icon(mdiPlay)}</span>
          </div>
          <div class="tile-name">${item.name}</div>
          <div class="tile-sub">${subtitle(item, this.localize)}</div>
        </button>
        <button class="more" @click=${() => (this._menuItem = item)} aria-label="more">${icon(mdiDotsVertical)}</button>
      </div>
    `;
  }

  private _renderTrack(item: MaMediaItem) {
    const h = this._pressHandlers(item);
    const img = itemImage(item);
    return html`
      <div class="track">
        <button
          class="track-main"
          @pointerdown=${h.down}
          @pointerup=${h.cancel}
          @pointerleave=${h.cancel}
          @pointercancel=${h.cancel}
          @contextmenu=${(e: Event) => e.preventDefault()}
          @click=${h.click}
        >
          <div class="track-cover">${img ? html`<img src=${img} alt="" loading="lazy" />` : icon(mdiMusicNote)}</div>
          <div class="track-text">
            <div class="tile-name">${item.name}</div>
            <div class="tile-sub">${subtitle(item, this.localize)}</div>
          </div>
        </button>
        <button class="more" @click=${() => (this._menuItem = item)} aria-label="more">${icon(mdiDotsVertical)}</button>
      </div>
    `;
  }

  private _renderMenu(item: MaMediaItem) {
    const t = this.localize;
    const canRadio = ["artist", "album", "track", "playlist"].includes(item.media_type);
    const opt = (ic: string, label: StringKey, enqueue: Enqueue, radio = false) => html`
      <button
        class="menu-opt"
        @click=${() => {
          this._menuItem = null;
          this._play(item, enqueue, radio);
        }}
      >
        ${icon(ic)} ${t(label)}
      </button>
    `;
    const img = itemImage(item);
    return html`
      <div class="scrim" @click=${() => (this._menuItem = null)}>
        <div class="menu" @click=${(e: Event) => e.stopPropagation()}>
          <div class="menu-head">
            <div class="track-cover">${img ? html`<img src=${img} alt="" />` : icon(TYPE_ICON[item.media_type])}</div>
            <div class="track-text">
              <div class="tile-name">${item.name}</div>
              <div class="tile-sub">${subtitle(item, t)}</div>
            </div>
          </div>
          ${opt(mdiPlay, "play_now", item.media_type === "track" ? "play" : "replace")}
          ${item.media_type !== "radio" ? opt(mdiSkipForward, "play_next", "next") : nothing}
          ${item.media_type !== "radio" ? opt(mdiPlaylistPlus, "add_to_queue", "add") : nothing}
          ${canRadio ? opt(mdiRadioTower, "start_radio", "replace", true) : nothing}
        </div>
      </div>
    `;
  }

  private _onInput(e: Event) {
    this._query = (e.target as HTMLInputElement).value;
    clearTimeout(this._debounce);
    this._debounce = window.setTimeout(() => this._runSearch(), 450);
  }

  private _onKey(e: KeyboardEvent) {
    if (e.key === "Enter") {
      clearTimeout(this._debounce);
      this._runSearch();
      // Hide the on-screen keyboard so the results get the whole screen.
      this._input.blur();
    } else if (e.key === "Escape") {
      this._close();
    }
  }

  private _clear() {
    this._query = "";
    this._results = null;
    this._input.focus();
  }

  private _setTab(tab: Tab) {
    this._tab = tab;
    if (this._query.trim().length >= 2) this._runSearch();
  }

  private async _runSearch() {
    const q = this._query.trim();
    if (q.length < 2 || !this.entryId) {
      this._results = null;
      return;
    }
    const seq = ++this._seq;
    this._loading = true;
    try {
      const types = this._tab === "all" ? ALL_TYPES : [this._tab];
      const res = await search(this.hass, this.entryId, q, types, this._tab === "all" ? 12 : 50);
      if (seq === this._seq) this._results = res;
    } catch (err) {
      if (seq === this._seq) this._error(err);
    } finally {
      if (seq === this._seq) this._loading = false;
    }
  }

  private async _loadFavorites() {
    const res: SearchResult = {};
    const keyOf = (type: MediaType) => SECTIONS.find((s) => s.type === type)!.key;
    await Promise.all(
      FAVORITE_TYPES.map(async (type) => {
        try {
          res[keyOf(type)] = await getLibrary(this.hass, this.entryId, type, {
            favorite: true,
            limit: 40,
            order_by: "sort_name",
          });
        } catch {
          res[keyOf(type)] = [];
        }
      }),
    );
    this._favorites = res;
  }

  private async _play(item: MaMediaItem, enqueue: Enqueue, radio = false) {
    try {
      await playMedia(this.hass, this.entityId, item, enqueue, radio);
      const t = this.localize;
      const msg = enqueue === "next" || enqueue === "add" ? t("added_to_queue") : `${t("playing_on")} ${this.playerName}`;
      this.dispatchEvent(new CustomEvent("ma-toast", { detail: `${item.name} · ${msg}`, bubbles: true, composed: true }));
      if (enqueue !== "next" && enqueue !== "add") this._close();
    } catch (err) {
      this._error(err);
    }
  }

  private _close() {
    this._menuItem = null;
    this._input?.blur();
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  private _error(err: unknown) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: err, bubbles: true, composed: true }));
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 20;
      pointer-events: none;
    }
    :host([open]) {
      pointer-events: auto;
    }
    .sheet {
      position: absolute;
      top: var(--ma-vv-top, 0);
      left: 0;
      right: 0;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      background: var(--ma-overlay-bg, rgba(14, 14, 18, 0.97));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: var(--ma-text);
      animation: drop 0.18s ease-out;
    }
    @keyframes drop {
      from { transform: translateY(-16px); opacity: 0; }
      to { transform: none; opacity: 1; }
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      text-align: left;
    }
    .icon {
      fill: currentColor;
      width: 28px;
      height: 28px;
      display: block;
      flex: none;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px 8px;
    }
    .field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 68px;
      padding: 0 12px 0 22px;
      border-radius: 34px;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid transparent;
      color: var(--ma-text-dim);
    }
    .field:focus-within {
      border-color: rgb(var(--ma-accent));
    }
    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: none;
      color: var(--ma-text);
      font: inherit;
      font-size: 26px;
    }
    input::-webkit-search-cancel-button {
      display: none;
    }
    .clear {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .close {
      height: 68px;
      padding: 0 26px;
      border-radius: 34px;
      background: rgba(255, 255, 255, 0.12);
      font-size: 20px;
      font-weight: 600;
    }
    .tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 24px 10px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tab {
      flex: none;
      height: 46px;
      padding: 0 20px;
      border-radius: 23px;
      background: rgba(255, 255, 255, 0.08);
      font-size: 18px;
      font-weight: 600;
    }
    .tab.on {
      background: #fff;
      color: #111;
    }
    .target {
      margin-left: auto;
      flex: none;
      padding-left: 16px;
      font-size: 16px;
      color: var(--ma-text-dim);
    }
    .target b {
      color: var(--ma-text);
    }
    .results {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 0 24px calc(32px + var(--ma-footer-space, 0px));
      position: relative;
    }
    .msg {
      padding: 48px 0;
      text-align: center;
      font-size: 22px;
      color: var(--ma-text-dim);
    }
    .loading-bar {
      position: sticky;
      top: 0;
      height: 3px;
      margin: 0 -24px;
      background: linear-gradient(90deg, transparent, rgb(var(--ma-accent)), transparent);
      background-size: 50% 100%;
      background-repeat: no-repeat;
      animation: load 1s linear infinite;
      z-index: 1;
    }
    @keyframes load {
      from { background-position: -50% 0; }
      to { background-position: 150% 0; }
    }
    .fav-title {
      font-size: 26px;
      margin: 8px 0 0;
    }
    h3 {
      font-size: 20px;
      margin: 18px 0 10px;
      color: var(--ma-text-dim);
      font-weight: 600;
    }
    .row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 176px;
      gap: 18px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
      gap: 22px 18px;
      padding-top: 8px;
    }
    .tile {
      position: relative;
      min-width: 0;
    }
    .tile-main {
      display: block;
      width: 100%;
    }
    .cover {
      position: relative;
      aspect-ratio: 1;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .tile.artist .cover {
      border-radius: 50%;
    }
    .cover img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover > .icon {
      width: 44%;
      height: 44%;
    }
    .play-badge {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgb(var(--ma-accent));
      color: #111;
      display: grid;
      place-items: center;
      opacity: 0;
      transform: scale(0.8);
      transition: 0.15s;
    }
    .tile-main:active .play-badge {
      opacity: 1;
      transform: none;
    }
    .tile-main:active .cover {
      filter: brightness(0.8);
    }
    .tile-name {
      margin-top: 8px;
      font-size: 17px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile-sub {
      font-size: 14px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile .more {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
    }
    .tile .more .icon {
      width: 24px;
      height: 24px;
    }
    .tracks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 24px;
    }
    .tracks.full {
      padding-top: 8px;
    }
    .track {
      display: flex;
      align-items: center;
      border-radius: 12px;
      min-width: 0;
    }
    .track:active {
      background: rgba(255, 255, 255, 0.08);
    }
    .track-main {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
      padding: 6px;
    }
    .track-cover {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      overflow: hidden;
      flex: none;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.08);
      color: var(--ma-text-dim);
    }
    .track-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .track-text {
      min-width: 0;
    }
    .track-text .tile-name {
      margin-top: 0;
    }
    .track .more {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .scrim {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: grid;
      place-items: center;
      z-index: 2;
    }
    .menu {
      width: min(520px, 90vw);
      max-height: 90%;
      overflow-y: auto;
      border-radius: 24px;
      background: #232329;
      padding: 12px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    }
    .menu-head {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 8px 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 6px;
    }
    .menu-head .track-cover {
      width: 72px;
      height: 72px;
    }
    .menu-opt {
      display: flex;
      align-items: center;
      gap: 18px;
      width: 100%;
      height: 68px;
      padding: 0 16px;
      border-radius: 14px;
      font-size: 21px;
      font-weight: 600;
    }
    .menu-opt:active {
      background: rgba(255, 255, 255, 0.1);
    }
  `;
}

function itemImage(item: MaMediaItem): string | undefined {
  const img = item.image || item.album?.image;
  return img && /^https?:|^\//.test(img) ? img : undefined;
}

function subtitle(item: MaMediaItem, t: Localize): string {
  const artists = item.artists?.map((a) => a.name).join(", ");
  if (item.media_type === "track") return [artists, item.album?.name].filter(Boolean).join(" · ");
  if (item.media_type === "album") return artists ?? t("albums");
  const label = SECTIONS.find((s) => s.type === item.media_type)?.label;
  return label ? t(label) : "";
}

const defaultEnqueue = (item: MaMediaItem): Enqueue => (item.media_type === "track" ? "play" : "replace");

declare global {
  interface HTMLElementTagNameMap {
    "ma-search-overlay": MaSearchOverlay;
  }
}
