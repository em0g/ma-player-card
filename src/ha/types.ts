export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

/** The subset of the frontend `hass` object the card relies on. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  callWS<T = any>(msg: Record<string, unknown>): Promise<T>;
  hassUrl?(path?: string): string;
}

export type CardLayout = "fullscreen" | "large" | "compact";
export type CardBackground = "artwork" | "accent" | "theme";

/** Display options for the large and compact layouts (fullscreen ignores them). */
export interface DisplayOptions {
  show_artwork: boolean;
  show_progress: boolean;
  show_volume: boolean;
  show_shuffle_repeat: boolean;
  show_previous: boolean;
  show_next_up: boolean;
  show_player: boolean;
  show_search: boolean;
  show_recent: boolean;
  background: CardBackground;
}

export interface CardConfig extends Partial<DisplayOptions> {
  type: string;
  /** Default `fullscreen`. */
  layout?: CardLayout;
  default_player?: string;
  players?: string[];
  hide_unavailable?: boolean;
  config_entry_id?: string;
  language?: "sv" | "en";
  height?: string;
  /** Pixels kept free at the bottom, e.g. for a navbar-card overlaying the view. */
  footer_space?: number;
}

export type MediaType =
  | "artist"
  | "album"
  | "track"
  | "playlist"
  | "radio"
  | "podcast"
  | "audiobook";

export interface MaMediaItem {
  media_type: MediaType;
  uri: string;
  name: string;
  version?: string;
  image?: string | null;
  favorite?: boolean;
  artists?: { name: string; uri: string }[];
  album?: { name: string; uri: string; image?: string | null };
}

export type SearchResult = Partial<Record<string, MaMediaItem[]>>;

export interface QueueItem {
  queue_item_id: string;
  name: string;
  duration?: number;
  media_item?: MaMediaItem;
  image?: string | null;
}

export interface QueueInfo {
  queue_id: string;
  active: boolean;
  name: string;
  items: number;
  current_item: QueueItem | null;
  next_item: QueueItem | null;
}

export type Enqueue = "play" | "replace" | "next" | "replace_next" | "add";
