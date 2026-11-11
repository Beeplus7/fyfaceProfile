#!/usr/bin/env bash
# Deploy Meta/AI-readable surfaces for myfaceprofile without rebuilding the full SPA.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${VPS_HOST:-87.106.103.43}"
USER="${VPS_USER:-root}"
REMOTE="${VPS_DEPLOY_PATH:-/var/www/myfaceprofile}"
PORT="${VPS_SSH_PORT:-22}"
KEY="${VPS_SSH_KEY_PATH:-$HOME/.ssh/aikova_receptionist_deploy}"
PUB="$ROOT/apps/marketing/public"

SSH=(ssh -p "$PORT")
SCP=(scp -P "$PORT")
if [[ -n "$KEY" && -f "$KEY" ]]; then
  SSH=(ssh -p "$PORT" -i "$KEY" -o IdentitiesOnly=yes)
  SCP=(scp -P "$PORT" -i "$KEY" -o IdentitiesOnly=yes)
fi

cd "$ROOT"

echo "==> Uploading AI-readable static files"
"${SCP[@]}" \
  "$PUB/myface-ai-readable.html" \
  "$PUB/llms.txt" \
  "$PUB/robots.txt" \
  "$PUB/sitemap.xml" \
  "$PUB/myface-og.jpg" \
  "${USER}@${HOST}:${REMOTE}/"

echo "==> Patching live index.html head tags"
"${SCP[@]}" "$ROOT/scripts/inject-ai-readable-index.py" "${USER}@${HOST}:/tmp/inject-myface-ai.py"
"${SSH[@]}" "${USER}@${HOST}" "python3 /tmp/inject-myface-ai.py '${REMOTE}/index.html'"

echo "==> Installing nginx bot → AI-readable routes"
"${SCP[@]}" "$ROOT/deploy/nginx-myfaceprofile.conf" "${USER}@${HOST}:/etc/nginx/sites-available/myfaceprofile"
"${SSH[@]}" "${USER}@${HOST}" bash -s <<'EOF'
set -euo pipefail
ln -sfn /etc/nginx/sites-available/myfaceprofile /etc/nginx/sites-enabled/myfaceprofile
nginx -t
systemctl reload nginx
EOF

echo "==> Deployed MyFace AI-readable surfaces + nginx Meta bot routing."
