import type { CardConfig, CardLayout, DisplayOptions } from "./types";

/** Defaults per layout. Anything set in the card config wins. */
export const LAYOUT_DEFAULTS: Record<Exclude<CardLayout, "fullscreen">, DisplayOptions> = {
  large: {
    show_artwork: true,
    show_progress: true,
    show_volume: true,
    show_shuffle_repeat: true,
    show_previous: true,
    show_next_up: true,
    show_player: true,
    show_search: true,
    show_recent: true,
    background: "artwork",
  },
  compact: {
    show_artwork: true,
    show_progress: true,
    show_volume: false,
    show_shuffle_repeat: false,
    show_previous: true,
    show_next_up: false,
    show_player: true,
    show_search: true,
    show_recent: false,
    background: "artwork",
  },
};

export const DISPLAY_KEYS = Object.keys(LAYOUT_DEFAULTS.large) as (keyof DisplayOptions)[];

export const layoutOf = (config: CardConfig | undefined): CardLayout => config?.layout ?? "fullscreen";

/** Effective display options for a large/compact card. */
export function displayOptions(config: CardConfig): DisplayOptions {
  const layout = layoutOf(config);
  const base = LAYOUT_DEFAULTS[layout === "compact" ? "compact" : "large"];
  const out = { ...base };
  for (const k of DISPLAY_KEYS) {
    if (config[k] !== undefined) (out as any)[k] = config[k];
  }
  return out;
}
