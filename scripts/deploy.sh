#!/usr/bin/env bash
# Copy the built card to Home Assistant's /config/www via the SSH add-on.
# Override with HA_SSH (user@host) and HA_WWW (target dir) if needed.
set -euo pipefail
cd "$(dirname "$0")/.."

HA_SSH="${HA_SSH:-root@192.168.3.18}"
HA_WWW="${HA_WWW:-/config/www/ma-player-card}"

[ -f dist/ma-player-card.js ] || { echo "dist/ma-player-card.js missing – run npm run build" >&2; exit 1; }

ssh "$HA_SSH" "mkdir -p '$HA_WWW'"
scp -q dist/ma-player-card.js "$HA_SSH:$HA_WWW/ma-player-card.js"

HASH=$(sha256sum dist/ma-player-card.js | cut -c1-10)
echo "Deployed. Lovelace resource (JavaScript module):"
echo "  /local/ma-player-card/ma-player-card.js?v=$HASH"
