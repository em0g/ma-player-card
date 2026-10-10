import type { CardConfig, HassEntity, HomeAssistant } from "./types";

export interface MaPlayer {
  id: string;
  name: string;
  entity: HassEntity;
  /** MA group player (permanent syncgroup), as opposed to a single player. */
  isGroup: boolean;
  available: boolean;
  playing: boolean;
}

export const isMaEntity = (e: HassEntity | undefined): e is HassEntity =>
  !!e && e.entity_id.startsWith("media_player.") && "mass_player_type" in e.attributes;

export function getPlayers(hass: HomeAssistant, config: CardConfig): MaPlayer[] {
  const ids = config.players?.length
    ? config.players
    : Object.keys(hass.states).filter((id) => isMaEntity(hass.states[id]));

  const players = ids
    .map((id) => hass.states[id])
    .filter((e): e is HassEntity => !!e)
    .map((e) => toPlayer(e))
    .filter((p) => p.available || config.hide_unavailable === false);

  if (config.players?.length) return players;
  // Groups first, then alphabetical.
  return players.sort((a, b) =>
    a.isGroup === b.isGroup ? a.name.localeCompare(b.name, "sv") : a.isGroup ? -1 : 1,
  );
}

export function toPlayer(e: HassEntity): MaPlayer {
  return {
    id: e.entity_id,
    name: e.attributes.friendly_name ?? e.entity_id,
    entity: e,
    isGroup: e.attributes.mass_player_type === "group",
    available: e.state !== "unavailable" && e.state !== "unknown",
    playing: e.state === "playing",
  };
}

const members = (e: HassEntity | undefined): string[] => e?.attributes.group_members ?? [];

/**
 * The player that actually owns playback for `id`: the sync leader when `id`
 * has been joined to another player, otherwise `id` itself.
 */
export function getLeader(hass: HomeAssistant, id: string): string {
  const own = members(hass.states[id]);
  if (own.length > 1 && own[0] !== id && own.includes(id) && hass.states[own[0]]) return own[0];
  for (const [otherId, e] of Object.entries(hass.states)) {
    if (otherId === id || !isMaEntity(e) || e.attributes.mass_player_type === "group") continue;
    const m = members(e);
    if (m.length > 1 && m[0] === otherId && m.includes(id)) return otherId;
  }
  return id;
}

/** Players synced to `leaderId` (excluding the leader itself). Empty for permanent groups. */
export function getSyncMembers(hass: HomeAssistant, leaderId: string): string[] {
  const e = hass.states[leaderId];
  if (!e || e.attributes.mass_player_type === "group") return [];
  return members(e).filter((m) => m !== leaderId);
}

export function hasMedia(e: HassEntity | undefined): boolean {
  if (!e) return false;
  // Idle players keep the last item when the queue ended; show it so it can be restarted.
  return (
    !["off", "unavailable", "unknown", "standby"].includes(e.state) &&
    !!(e.attributes.media_title || e.attributes.media_content_id)
  );
}

/** Pick a sensible player to show when nothing has been chosen yet. */
export function pickDefault(players: MaPlayer[], hass: HomeAssistant, preferred?: string): string | undefined {
  if (preferred && hass.states[preferred]) return preferred;
  const ma = players.filter((p) => p.entity.attributes.app_id === "music_assistant");
  return (
    ma.find((p) => p.playing)?.id ??
    players.find((p) => p.playing)?.id ??
    ma.find((p) => p.entity.state === "paused")?.id ??
    players[0]?.id
  );
}
