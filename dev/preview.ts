// Offline preview of all layouts with fake players – no Home Assistant needed.
//   /dev/preview.html            overview of every layout
//   /dev/preview.html?light      same on a light theme
//   /dev/preview.html?shot=...   single scenes used for the README screenshots
//                                (large, large-variants, compact, popup)
import "../src/ma-player-card";
import type { CardConfig, HomeAssistant } from "../src/ha/types";

/** Made-up album art so screenshots don't use real covers. */
const cover = (a: string, b: string, c: string, title: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
        <radialGradient id="s" cx="0.7" cy="0.3" r="0.6"><stop offset="0" stop-color="${c}" stop-opacity="0.95"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <circle cx="280" cy="120" r="210" fill="url(#s)"/>
      <path d="M0 300 C 90 250 160 330 250 290 S 360 250 400 270 L400 400 L0 400Z" fill="#000" opacity="0.28"/>
      <text x="28" y="360" font-family="Georgia, serif" font-size="34" fill="#fff" opacity="0.92">${title}</text>
    </svg>`,
  );

const NORTHERN = cover("#1d2b64", "#0f9b8e", "#b6f0c8", "Northern Lights");
const TIDE = cover("#5b1a3a", "#e0603b", "#ffd27a", "Slow Tide");

const ALL_FEATURES = 1 | 2 | 4 | 8 | 16 | 32 | 32768 | 262144 | 524288;

const player = (id: string, name: string, extra: Record<string, any> = {}, state = "playing") => ({
  entity_id: id,
  state,
  last_changed: "",
  last_updated: "",
  attributes: {
    friendly_name: name,
    mass_player_type: "player",
    app_id: "music_assistant",
    supported_features: ALL_FEATURES,
    volume_level: 0.35,
    ...extra,
  },
});

const now = new Date().toISOString();
const states: HomeAssistant["states"] = {
  "media_player.kok": player("media_player.kok", "Kök", {
    media_title: "Aurora Over the Fjord",
    media_artist: "The Polar Quartet",
    media_album_name: "Northern Lights",
    media_content_id: "library://track/1",
    media_duration: 254,
    media_position: 98,
    media_position_updated_at: now,
    entity_picture: NORTHERN,
    shuffle: true,
    repeat: "all",
    volume_level: 0.42,
    group_members: ["media_player.kok", "media_player.vardagsrum"],
  }),
  "media_player.vardagsrum": player("media_player.vardagsrum", "Vardagsrum", {
    volume_level: 0.3,
    group_members: ["media_player.kok", "media_player.vardagsrum"],
  }),
  "media_player.sovrum": player("media_player.sovrum", "Sovrum", {
    media_title: "Harbor at Dusk",
    media_artist: "Marina Vale",
    media_album_name: "Slow Tide",
    media_content_id: "library://track/2",
    media_duration: 201,
    media_position: 37,
    media_position_updated_at: now,
    entity_picture: TIDE,
    volume_level: 0.22,
  }),
  "media_player.kontor": player("media_player.kontor", "Kontor", {}, "idle"),
};

const NEXT: Record<string, any> = {
  "media_player.kok": { name: "Midnight Sun", media_item: { name: "Midnight Sun", artists: [{ name: "The Polar Quartet" }] } },
  "media_player.sovrum": { name: "Low Water", media_item: { name: "Low Water", artists: [{ name: "Marina Vale" }] } },
};

const hass: HomeAssistant = {
  states,
  language: "sv",
  callWS: async (msg: any): Promise<any> => {
    if (msg.type === "config_entries/get") return [{ entry_id: "mock", domain: "music_assistant", state: "loaded" }];
    if (msg.service === "get_queue") {
      const id = msg.target?.entity_id;
      return { response: { [id]: { next_item: NEXT[id] ?? null } } };
    }
    console.info("[mock callWS]", msg);
    return { response: {} };
  },
};

// ---------- scenes ----------

type Item = Partial<CardConfig> & { width?: number; light?: boolean };
type Scene = { bg: string; light?: boolean; rows: Item[][]; after?: (cards: HTMLElement[]) => void };

const K = "media_player.kok";
const S = "media_player.sovrum";
const O = "media_player.kontor";

const scenes: Record<string, Scene> = {
  large: { bg: "#111114", rows: [[{ layout: "large", default_player: K, width: 440 }]] },
  "large-variants": {
    bg: "#e9e9ee",
    light: true,
    rows: [
      [
        { layout: "large", default_player: K, width: 380 },
        { layout: "large", default_player: S, background: "accent", show_shuffle_repeat: false, width: 380 },
        { layout: "large", default_player: S, background: "theme", show_recent: false, width: 380 },
      ],
    ],
  },
  compact: {
    bg: "#111114",
    rows: [
      [{ layout: "compact", default_player: K, width: 600 }],
      [{ layout: "compact", default_player: S, show_volume: true, show_recent: true, background: "accent", width: 600 }],
      [{ layout: "compact", default_player: O, width: 600 }],
      [
        { layout: "compact", default_player: K, width: 320 },
        { layout: "compact", default_player: S, background: "accent", show_artwork: false, width: 264 },
      ],
    ],
  },
  "compact-light": {
    bg: "#e9e9ee",
    light: true,
    rows: [
      [{ layout: "compact", default_player: K, background: "theme", width: 600 }],
      [{ layout: "compact", default_player: S, background: "theme", show_volume: true, width: 600 }],
    ],
  },
  popup: {
    bg: "#111114",
    rows: [
      [
        { layout: "compact", default_player: K, width: 520 },
      ],
    ],
    after: (cards) => {
      setTimeout(() => {
        const inner = cards[0].shadowRoot?.querySelector("ma-card-player")?.shadowRoot;
        (inner?.querySelector(".player-link") as HTMLElement | null)?.click();
      }, 300);
    },
  },
  overview: {
    bg: "#111114",
    rows: [
      [{ layout: "large", default_player: K, width: 420 }, { layout: "large", default_player: S, background: "accent", width: 420 }],
      [{ layout: "large", default_player: S, background: "theme", width: 420 }, { layout: "large", default_player: K, width: 300 }],
      [{ layout: "compact", default_player: K, width: 560 }, { layout: "compact", default_player: S, show_volume: true, width: 560 }],
      [{ layout: "compact", default_player: O, background: "theme", width: 560 }, { layout: "compact", default_player: K, width: 300 }],
    ],
  },
};

const params = new URLSearchParams(location.search);
const scene = scenes[params.get("shot") ?? "overview"] ?? scenes.overview;
const light = scene.light || params.has("light");

const style = document.body.style;
style.background = light && !scene.light ? "#f2f2f2" : scene.bg;
if (light) {
  style.setProperty("--primary-text-color", "#1c1c1f");
  style.setProperty("--secondary-text-color", "#6b6b74");
  style.setProperty("--card-background-color", "#fff");
}

const root = document.getElementById("cards")!;
const cards: HTMLElement[] = [];
for (const row of scene.rows) {
  const r = document.createElement("div");
  r.className = "row";
  root.appendChild(r);
  for (const { width, light: _l, ...c } of row) {
    const card = document.createElement("ma-player-card");
    card.style.width = `${width ?? 420}px`;
    card.setConfig({ type: "custom:ma-player-card", ...c });
    card.hass = hass;
    r.appendChild(card);
    cards.push(card);
  }
}
scene.after?.(cards);
