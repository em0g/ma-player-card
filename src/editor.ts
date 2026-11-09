import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { CardConfig, HomeAssistant } from "./ha/types";
import { DISPLAY_KEYS, LAYOUT_DEFAULTS, layoutOf } from "./ha/options";

type Lang = "sv" | "en";

const labels: Record<Lang, Record<string, string>> = {
  sv: {
    layout: "Layout",
    layout_fullscreen: "Helskärm (surfplatta/kiosk)",
    layout_large: "Stort kort",
    layout_compact: "Kompakt kort",
    default_player: "Standardspelare",
    players: "Spelare att visa (tomt = alla)",
    language: "Språk",
    display: "Visa",
    show_artwork: "Omslagsbild",
    show_progress: "Förloppsindikator",
    show_volume: "Volym",
    show_shuffle_repeat: "Blanda och upprepa",
    show_previous: "Föregående-knapp",
    show_next_up: "Nästa låt",
    show_player: "Högtalarväljare",
    show_search: "Sökknapp",
    show_recent: "Senast spelade-knapp",
    background: "Bakgrund",
    bg_artwork: "Suddigt omslag",
    bg_accent: "Färg från omslaget",
    bg_theme: "Temats kortfärg",
    advanced: "Avancerat",
    hide_unavailable: "Dölj otillgängliga spelare",
    config_entry_id: "Music Assistant config entry (om användaren inte är admin)",
    footer_space: "Fritt utrymme längst ner (px)",
    height: "Höjd (CSS, t.ex. 100dvh)",
  },
  en: {
    layout: "Layout",
    layout_fullscreen: "Fullscreen (tablet/kiosk)",
    layout_large: "Large card",
    layout_compact: "Compact card",
    default_player: "Default player",
    players: "Players to show (empty = all)",
    language: "Language",
    display: "Show",
    show_artwork: "Artwork",
    show_progress: "Progress bar",
    show_volume: "Volume",
    show_shuffle_repeat: "Shuffle and repeat",
    show_previous: "Previous button",
    show_next_up: "Next up",
    show_player: "Speaker picker",
    show_search: "Search button",
    show_recent: "Recently played button",
    background: "Background",
    bg_artwork: "Blurred artwork",
    bg_accent: "Color from artwork",
    bg_theme: "Theme card color",
    advanced: "Advanced",
    hide_unavailable: "Hide unavailable players",
    config_entry_id: "Music Assistant config entry (if the user isn't an admin)",
    footer_space: "Free space at the bottom (px)",
    height: "Height (CSS, e.g. 100dvh)",
  },
};

const MA_PLAYER = { entity: { domain: "media_player", integration: "music_assistant" } };

/** Visual editor shown in the dashboard's card editor. Built on HA's own `ha-form`. */
@customElement("ma-player-card-editor")
export class MaPlayerCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: CardConfig;
  @state() private _ready = !!customElements.get("ha-form") && !!customElements.get("ha-entity-picker");

  setConfig(config: CardConfig) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._ready) loadHaComponents().finally(() => (this._ready = true));
  }

  /** Editor labels follow the HA user's language. */
  private get _lang(): Lang {
    return (this.hass?.language ?? "sv").startsWith("sv") ? "sv" : "en";
  }

  private _l = (key: string) => labels[this._lang][key] ?? key;

  private _schema() {
    const l = this._l;
    const layout = layoutOf(this._config);
    const schema: any[] = [
      {
        name: "layout",
        selector: {
          select: {
            mode: "box",
            options: (["fullscreen", "large", "compact"] as const).map((v) => ({
              value: v,
              label: l(`layout_${v}`),
            })),
          },
        },
      },
      { name: "default_player", selector: MA_PLAYER },
      { name: "players", selector: { entity: { ...MA_PLAYER.entity, multiple: true } } },
      {
        name: "language",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "sv", label: "Svenska" },
              { value: "en", label: "English" },
            ],
          },
        },
      },
    ];

    if (layout !== "fullscreen") {
      schema.push({
        type: "expandable",
        name: "",
        title: l("display"),
        icon: "mdi:eye-outline",
        expanded: true,
        schema: [
          {
            type: "grid",
            name: "",
            schema: DISPLAY_KEYS.filter((k) => k !== "background").map((k) => ({
              name: k,
              selector: { boolean: {} },
            })),
          },
          {
            name: "background",
            selector: {
              select: {
                mode: "dropdown",
                options: ["artwork", "accent", "theme"].map((v) => ({ value: v, label: l(`bg_${v}`) })),
              },
            },
          },
        ],
      });
    }

    schema.push({
      type: "expandable",
      name: "",
      title: l("advanced"),
      icon: "mdi:cog-outline",
      schema: [
        { name: "hide_unavailable", selector: { boolean: {} } },
        ...(layout === "fullscreen"
          ? [
              { name: "footer_space", selector: { number: { min: 0, max: 400, step: 1, mode: "box", unit_of_measurement: "px" } } },
              { name: "height", selector: { text: {} } },
            ]
          : []),
        { name: "config_entry_id", selector: { text: {} } },
      ],
    });
    return schema;
  }

  /** What the form shows: config with the layout's defaults filled in. */
  private _formData() {
    const c = this._config!;
    const layout = layoutOf(c);
    const data: Record<string, unknown> = {
      language: "sv",
      hide_unavailable: true,
      ...c,
      layout,
    };
    if (layout !== "fullscreen") {
      const defs = LAYOUT_DEFAULTS[layout];
      for (const k of DISPLAY_KEYS) if (data[k] === undefined) data[k] = defs[k];
    }
    return data;
  }

  protected render() {
    if (!this.hass || !this._config) return nothing;
    if (!this._ready) return html`<div class="loading">…</div>`;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${(s: { name: string }) => this._l(s.name)}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }

  private _changed(ev: CustomEvent) {
    ev.stopPropagation();
    const value = { ...ev.detail.value } as Record<string, any>;
    const layout = layoutOf(value as CardConfig);

    // Keep the YAML short: drop values that equal the default.
    if (value.layout === "fullscreen") delete value.layout;
    if (value.hide_unavailable === true) delete value.hide_unavailable;
    for (const k of ["players", "default_player", "config_entry_id", "height"]) {
      if (value[k] === "" || (Array.isArray(value[k]) && !value[k].length)) delete value[k];
    }
    if (value.footer_space === 0 || value.footer_space === "") delete value.footer_space;
    // The form shows the old layout's defaults filled in; those aren't real choices.
    const prev = this._config ?? ({} as CardConfig);
    const prevLayout = layoutOf(prev);
    for (const k of DISPLAY_KEYS) {
      const filledDefault =
        prevLayout !== "fullscreen" && prev[k] === undefined && value[k] === LAYOUT_DEFAULTS[prevLayout][k];
      if (layout === "fullscreen" || filledDefault || value[k] === LAYOUT_DEFAULTS[layout][k]) delete value[k];
    }
    if (value.language === "sv") delete value.language;

    this._config = value as CardConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: value }, bubbles: true, composed: true }));
  }

  static styles = css`
    .loading {
      padding: 16px;
    }
  `;
}

/**
 * ha-form and the entity picker are lazy-loaded by HA. Loading a built-in
 * card's editor pulls them in.
 */
async function loadHaComponents() {
  try {
    const helpers = await (window as any).loadCardHelpers?.();
    if (!helpers) return;
    const card = await helpers.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
    await Promise.race([
      customElements.whenDefined("ha-form"),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch {
    /* render anyway; HA usually has the components loaded already */
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ma-player-card-editor": MaPlayerCardEditor;
  }
}
