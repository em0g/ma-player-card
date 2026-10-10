// Dev harness: renders the card against the real Home Assistant over websocket.
// Needs VITE_HA_URL and VITE_HA_TOKEN in .env.local.
import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  type HassEntities,
} from "home-assistant-js-websocket";
import "../src/ma-player-card";
import type { CardConfig, HomeAssistant } from "../src/ha/types";

const url = import.meta.env.VITE_HA_URL as string;
const token = import.meta.env.VITE_HA_TOKEN as string;
const status = document.getElementById("status")!;

const params = new URLSearchParams(location.search);
const config: CardConfig = {
  type: "custom:ma-player-card",
  height: "100dvh",
  ...(params.get("player") ? { default_player: params.get("player")! } : {}),
  ...(params.get("lang") ? { language: params.get("lang") as "sv" | "en" } : {}),
};

async function main() {
  const auth = createLongLivedTokenAuth(url, token);
  const conn = await createConnection({ auth });
  status.textContent = `connected to ${url}`;

  const card = document.createElement("ma-player-card");
  card.setConfig(config);
  document.body.appendChild(card);

  subscribeEntities(conn, (states: HassEntities) => {
    const hass: HomeAssistant = {
      states: states as HomeAssistant["states"],
      language: "sv",
      callWS: (msg) => conn.sendMessagePromise(msg as any),
      hassUrl: (path = "") => new URL(path, url).toString(),
    };
    card.hass = hass;
  });
}

main().catch((err) => {
  status.textContent = `error: ${err?.message ?? err}`;
  console.error(err);
});
