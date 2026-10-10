import type {
  Enqueue,
  HomeAssistant,
  MaMediaItem,
  MediaType,
  QueueInfo,
  SearchResult,
} from "./types";

interface CallServiceResult<T> {
  context: unknown;
  response: T;
}

export const CALL_TIMEOUT_MS = 15000;

export class TimeoutError extends Error {
  constructor(what: string) {
    super(`${what}: no answer within ${CALL_TIMEOUT_MS / 1000} s`);
    this.name = "TimeoutError";
  }
}

function withTimeout<T>(p: Promise<T>, what: string): Promise<T> {
  let timer: number;
  return Promise.race([
    p,
    new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new TimeoutError(what)), CALL_TIMEOUT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

/** All service calls go over the websocket so errors can be caught and shown in the card. */
export async function callService<T = unknown>(
  hass: HomeAssistant,
  domain: string,
  service: string,
  data: Record<string, unknown> = {},
  entityId?: string | string[],
  returnResponse = false,
): Promise<T | undefined> {
  const res = await withTimeout(
    hass.callWS<CallServiceResult<T>>({
      type: "call_service",
      domain,
      service,
      service_data: data,
      ...(entityId ? { target: { entity_id: entityId } } : {}),
      ...(returnResponse ? { return_response: true } : {}),
    }),
    `${domain}.${service}`,
  );
  return res?.response;
}

let cachedEntryId: string | undefined;

export async function resolveConfigEntryId(hass: HomeAssistant, configured?: string): Promise<string> {
  if (configured && configured !== "auto") return configured;
  if (cachedEntryId) return cachedEntryId;
  const entries = await hass.callWS<{ entry_id: string; state: string }[]>({
    type: "config_entries/get",
    domain: "music_assistant",
  });
  const entry = entries.find((e) => e.state === "loaded") ?? entries[0];
  if (!entry) throw new Error("Music Assistant integration not found");
  cachedEntryId = entry.entry_id;
  return cachedEntryId;
}

const hasName = (i: MaMediaItem) => !!i.name?.trim();

export async function search(
  hass: HomeAssistant,
  entryId: string,
  query: string,
  types: MediaType[],
  limit: number,
): Promise<SearchResult> {
  const res = await callService<SearchResult>(
    hass,
    "music_assistant",
    "search",
    { config_entry_id: entryId, name: query, media_type: types, limit },
    undefined,
    true,
  );
  const out: SearchResult = {};
  for (const [k, v] of Object.entries(res ?? {})) out[k] = (v ?? []).filter(hasName);
  return out;
}

export async function getLibrary(
  hass: HomeAssistant,
  entryId: string,
  mediaType: MediaType,
  opts: { favorite?: boolean; limit?: number; order_by?: string } = {},
): Promise<MaMediaItem[]> {
  const res = await callService<{ items: MaMediaItem[] }>(
    hass,
    "music_assistant",
    "get_library",
    { config_entry_id: entryId, media_type: mediaType, limit: opts.limit ?? 30, ...opts },
    undefined,
    true,
  );
  return (res?.items ?? []).filter(hasName);
}

export function playMedia(
  hass: HomeAssistant,
  entityId: string,
  item: MaMediaItem,
  enqueue: Enqueue,
  radioMode = false,
) {
  return callService(
    hass,
    "music_assistant",
    "play_media",
    {
      media_id: item.uri,
      media_type: item.media_type,
      enqueue,
      ...(radioMode ? { radio_mode: true } : {}),
    },
    entityId,
  );
}

export async function getQueue(hass: HomeAssistant, entityId: string): Promise<QueueInfo | null> {
  const res = await callService<Record<string, QueueInfo>>(
    hass,
    "music_assistant",
    "get_queue",
    {},
    entityId,
    true,
  );
  return res?.[entityId] ?? null;
}

export const transferQueue = (hass: HomeAssistant, source: string, target: string) =>
  callService(hass, "music_assistant", "transfer_queue", { source_player: source, auto_play: true }, target);

export const join = (hass: HomeAssistant, leader: string, members: string[]) =>
  callService(hass, "media_player", "join", { group_members: members }, leader);

export const unjoin = (hass: HomeAssistant, member: string) =>
  callService(hass, "media_player", "unjoin", {}, member);

export const mediaCommand = (
  hass: HomeAssistant,
  entityId: string,
  service: string,
  data: Record<string, unknown> = {},
) => callService(hass, "media_player", service, data, entityId);
