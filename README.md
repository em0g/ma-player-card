# MA Player Card

A fullscreen [Music Assistant](https://music-assistant.io) player card for Home Assistant, built for wall tablets running a kiosk dashboard.

- Large now-playing view with blurred artwork background and accent color from the cover
- Big transport, seek and volume controls (group volume when speakers are synced)
- Speaker drawer: pick the active player, add/remove speakers to the group, move the queue, per-room volume
- Search pinned to the top of the screen so the on-screen keyboard never covers it; favorites when the field is empty
- Swedish (default) and English UI

All communication goes through Home Assistant's Music Assistant integration – no direct connection to the MA server.

## Installation

### HACS
Add this repository as a custom repository (type *Dashboard*) and install **MA Player Card**.

### Manual
Copy `dist/ma-player-card.js` to `/config/www/ma-player-card/` and add the resource
`/local/ma-player-card/ma-player-card.js` (JavaScript module).

## Usage

Put the card in a view of type **panel** so it fills the screen:

```yaml
views:
  - title: Musik
    path: musik
    type: panel
    cards:
      - type: custom:ma-player-card
        default_player: media_player.vardagsrum_2
```

| Option | Default | Description |
|---|---|---|
| `default_player` | – | Player shown first on a device that hasn't picked one yet |
| `players` | all MA players | List of entity ids to show (in this order) |
| `hide_unavailable` | `true` | Hide unavailable players in the speaker list |
| `config_entry_id` | auto | Music Assistant config entry; set it if the dashboard user isn't an admin |
| `language` | `sv` | `sv` or `en` |
| `footer_space` | `0` | Pixels to keep free at the bottom (e.g. for navbar-card) |
| `height` | fills the screen below the card's top | Card height (CSS) |

The selected player is remembered per device (localStorage).

## Development

```sh
npm install
cp .env.example .env.local   # set VITE_HA_URL and VITE_HA_TOKEN (long-lived token)
npm run dev                  # opens /dev/ – the card running against your real HA
npm run build                # dist/ma-player-card.js
npm run deploy               # build + copy to HA over SSH (HA_SSH, HA_WWW)
```
