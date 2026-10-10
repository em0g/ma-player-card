#!/usr/bin/env bash
# Dev deploy: overwrite the HACS-installed card on Home Assistant via the SSH add-on,
# so changes can be tried on the tablet before cutting a release.
# Override with HA_SSH (user@host) and HA_WWW (target dir) if needed.
set -euo pipefail
cd "$(dirname "$0")/.."

HA_SSH="${HA_SSH:-root@192.168.3.18}"
HA_WWW="${HA_WWW:-/config/www/community/ma-player-card}"

[ -f dist/ma-player-card.js ] || { echo "dist/ma-player-card.js missing – run npm run build" >&2; exit 1; }

ssh "$HA_SSH" "mkdir -p '$HA_WWW'"
# Plain ssh + cat: the SSH add-on has SFTP (needed by modern scp) disabled by default.
ssh "$HA_SSH" "cat > '$HA_WWW/ma-player-card.js'" < dist/ma-player-card.js
# HACS also ships a .gz that HA would serve instead of our fresh file.
ssh "$HA_SSH" "rm -f '$HA_WWW/ma-player-card.js.gz'"
echo "Copied to $HA_SSH:$HA_WWW"
