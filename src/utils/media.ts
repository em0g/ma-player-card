import type { HassEntity, HomeAssistant } from "../ha/types";
import { mediaCommand } from "../ha/ma-service";

export const Feature = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  SHUFFLE_SET: 32768,
  REPEAT_SET: 262144,
  GROUPING: 524288,
} as const;

export const supports = (e: HassEntity | undefined, f: number) =>
  !!e && ((e.attributes.supported_features ?? 0) & f) !== 0;

/** entity_picture is relative to HA; resolve so it also works from the dev page. */
export function entityImage(hass: HomeAssistant, e: HassEntity | undefined): string | undefined {
  const pic: string | undefined = e?.attributes.entity_picture_local || e?.attributes.entity_picture;
  if (!pic) return undefined;
  if (/^https?:/.test(pic)) return pic;
  return hass.hassUrl ? hass.hassUrl(pic) : pic;
}

export function formatTime(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return "–:––";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export function currentPosition(e: HassEntity | undefined): number | undefined {
  const a = e?.attributes;
  if (!a || a.media_position === undefined) return undefined;
  let pos = Number(a.media_position);
  if (e!.state === "playing" && a.media_position_updated_at) {
    pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
  }
  const dur = Number(a.media_duration);
  return dur > 0 ? Math.min(pos, dur) : pos;
}

export const volumeOf = (hass: HomeAssistant, id: string): number =>
  Number(hass.states[id]?.attributes.volume_level ?? 0);

/** Average volume across a set of players (used as "group volume"). */
export const groupVolume = (hass: HomeAssistant, ids: string[]): number =>
  ids.length ? ids.reduce((sum, id) => sum + volumeOf(hass, id), 0) / ids.length : 0;

/**
 * Set group volume by shifting every member by the same delta, which keeps
 * the relative balance between rooms (same approach as MA's group volume).
 */
export function setGroupVolume(hass: HomeAssistant, ids: string[], target: number) {
  const delta = target - groupVolume(hass, ids);
  return Promise.all(
    ids.map((id) =>
      mediaCommand(hass, id, "volume_set", {
        volume_level: round(Math.min(1, Math.max(0, volumeOf(hass, id) + delta))),
      }),
    ),
  );
}

export const round = (v: number) => Math.round(v * 100) / 100;

export const artistLine = (e: HassEntity | undefined): string =>
  [e?.attributes.media_artist, e?.attributes.media_album_name].filter(Boolean).join(" · ");
