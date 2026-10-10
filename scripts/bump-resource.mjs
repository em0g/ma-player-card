// Point the Lovelace resource at the freshly deployed file (?v=<hash>) so browsers reload it.
// Reads VITE_HA_URL / VITE_HA_TOKEN from .env.local.
import { createConnection, createLongLivedTokenAuth } from "home-assistant-js-websocket";
import { createHash } from "node:crypto";
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").trim().split("\n").map((l) => l.split(/=(.*)/s).slice(0, 2)),
);
const hash = createHash("sha256").update(fs.readFileSync("dist/ma-player-card.js")).digest("hex").slice(0, 10);
const url = `/local/ma-player-card/ma-player-card.js?v=${hash}`;

const conn = await createConnection({ auth: createLongLivedTokenAuth(env.VITE_HA_URL, env.VITE_HA_TOKEN) });
const resources = await conn.sendMessagePromise({ type: "lovelace/resources" });
const existing = resources.find((r) => r.url.startsWith("/local/ma-player-card/"));
if (existing) {
  await conn.sendMessagePromise({ type: "lovelace/resources/update", resource_id: existing.id, res_type: "module", url });
} else {
  await conn.sendMessagePromise({ type: "lovelace/resources/create", res_type: "module", url });
}
console.log(`Resource ${existing ? "updated" : "created"}: ${url}`);
conn.close();
