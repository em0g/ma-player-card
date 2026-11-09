// Offline preview of all layouts with fake players: /dev/preview.html (?light for a light theme).
import "../src/ma-player-card";
import type { CardConfig, HomeAssistant } from "../src/ha/types";

const cover =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#c8372d"/><circle cx="150" cy="160" r="90" fill="#f2c14e"/><text x="20" y="50" font-size="34" font-family="sans-serif" fill="#fff">MOCK ALBUM</text></svg>`,
  );

const player = (id: string, name: string, extra: Record<string, any> = {}, state = "playing") => ({
  entity_id: id,
  state,
  last_changed: "",
  last_updated: "",
  attributes: {
    friendly_name: name,
    mass_player_type: "player",
    app_id: "music_assistant",
    supported_features: 1 | 2 | 4 | 8 | 16 | 32 | 32768 | 262144 | 524288,
    volume_level: 0.35,
    ...extra,
  },
});

const states: HomeAssistant["states"] = {
  "media_player.kok": player("media_player.kok", "Kök", {
    media_title: "In the Mood (Live at Carnegie Hall, NYC, 1939)",
    media_artist: "Glenn Miller Orchestra",
    media_album_name: "The Carnegie Hall Concert",
    media_duration: 209,
    media_position: 64,
    media_position_updated_at: new Date().toISOString(),
    entity_picture: cover,
    shuffle: true,
    repeat: "all",
    group_members: ["media_player.kok", "media_player.vardagsrum"],
  }),
  "media_player.vardagsrum": player("media_player.vardagsrum", "Vardagsrum", {
    group_members: ["media_player.kok", "media_player.vardagsrum"],
  }),
  "media_player.sovrum": player("media_player.sovrum", "Sovrum", {}, "idle"),
};

const hass: HomeAssistant = {
  states,
  language: "sv",
  callWS: async (msg: any): Promise<any> => {
    console.info("[mock callWS]", msg);
    if (msg.type === "config_entries/get") return [{ entry_id: "mock", domain: "music_assistant" }];
    return { response: {} };
  },
};

const light = new URLSearchParams(location.search).has("light");
document.body.classList.toggle("light", light);

const sections: [string, Partial<CardConfig>[], string?][] = [
  ["Stort kort", [
    { layout: "large" },
    { layout: "large", background: "accent", show_shuffle_repeat: false },
    { layout: "large", background: "theme", show_next_up: false },
  ]],
  ["Stort kort – smalt", [{ layout: "large" }], "narrow"],
  ["Kompakt kort", [
    { layout: "compact" },
    { layout: "compact", show_volume: true, show_recent: true, background: "accent" },
    { layout: "compact", background: "theme", default_player: "media_player.sovrum" },
  ]],
  ["Kompakt kort – smalt", [{ layout: "compact" }], "narrow"],
];

const root = document.getElementById("cards")!;
for (const [title, configs, cls] of sections) {
  const h = document.createElement("h2");
  h.textContent = title;
  const grid = document.createElement("div");
  grid.className = `grid ${cls ?? ""}`;
  root.append(h, grid);
  for (const c of configs) {
    const card = document.createElement("ma-player-card");
    card.setConfig({ type: "custom:ma-player-card", default_player: "media_player.kok", ...c });
    card.hass = hass;
    grid.appendChild(card);
  }
}
