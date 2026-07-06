#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ -f "$ROOT_DIR/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "$ROOT_DIR/deploy.env"
fi

log() {
  echo "[deploy] $*"
}

die() {
  echo "[deploy] ERROR: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

maybe_git_pull() {
  if [[ "${SKIP_GIT_PULL:-false}" == "true" ]]; then
    log "Skipping git pull (SKIP_GIT_PULL=true)"
    return
  fi

  if [[ ! -d "$ROOT_DIR/.git" ]]; then
    log "Not a git repo, skipping pull"
    return
  fi

  log "Pulling latest changes..."
  git pull --ff-only
}

check_node() {
  require_cmd node
  require_cmd npm

  local node_major
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  if (( node_major < 20 )); then
    die "Node.js >= 20 is required (found $(node -v))"
  fi
}

check_ffmpeg() {
  require_cmd ffmpeg
}

ensure_backend_env() {
  if [[ ! -f "$ROOT_DIR/backend/.env" ]]; then
    die "Create backend/.env from backend/.env.example before deploying"
  fi
}

ensure_frontend_env() {
  if [[ ! -f "$ROOT_DIR/frontend/.env" ]]; then
    if [[ -f "$ROOT_DIR/frontend/.env.example" ]]; then
      die "Create frontend/.env from frontend/.env.example before deploying"
    fi
    log "Warning: frontend/.env not found, using build defaults"
  fi
}

install_backend_deps() {
  log "Installing backend dependencies..."
  npm ci --prefix "$ROOT_DIR/backend"
}

build_backend() {
  log "Building backend..."
  npm run build --prefix "$ROOT_DIR/backend"
}

restart_backend() {
  if [[ -n "${PM2_APP_NAME:-}" ]]; then
    require_cmd pm2
    if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
      log "Restarting PM2 app: $PM2_APP_NAME"
      pm2 restart "$PM2_APP_NAME"
    else
      log "Starting PM2 app: $PM2_APP_NAME"
      pm2 start "$ROOT_DIR/backend/dist/index.js" \
        --name "$PM2_APP_NAME" \
        --cwd "$ROOT_DIR/backend"
      pm2 save
    fi
    return
  fi

  if [[ -n "${SYSTEMD_SERVICE:-}" ]]; then
    log "Restarting systemd service: $SYSTEMD_SERVICE"
    sudo systemctl restart "$SYSTEMD_SERVICE"
    return
  fi

  log "Backend built. Restart it manually or set PM2_APP_NAME / SYSTEMD_SERVICE in deploy.env"
}

deploy_backend() {
  check_node
  check_ffmpeg
  ensure_backend_env
  install_backend_deps
  build_backend
  restart_backend
  log "Backend deploy complete"
}

install_frontend_deps() {
  log "Installing frontend dependencies..."
  npm ci --prefix "$ROOT_DIR/frontend"
}

build_frontend() {
  log "Building frontend..."
  npm run build --prefix "$ROOT_DIR/frontend"
}

publish_frontend() {
  if [[ -n "${FRONTEND_WEB_ROOT:-}" ]]; then
    require_cmd rsync
    log "Publishing frontend to $FRONTEND_WEB_ROOT"
    mkdir -p "$FRONTEND_WEB_ROOT"
    rsync -a --delete "$ROOT_DIR/frontend/dist/" "$FRONTEND_WEB_ROOT/"
  else
    log "Built frontend at frontend/dist (set FRONTEND_WEB_ROOT in deploy.env to copy elsewhere)"
  fi

  if [[ "${NGINX_RELOAD:-false}" == "true" ]]; then
    log "Reloading nginx"
    sudo nginx -t
    sudo systemctl reload nginx
  fi
}

deploy_frontend() {
  check_node
  ensure_frontend_env
  install_frontend_deps
  build_frontend
  publish_frontend
  log "Frontend deploy complete"
}
