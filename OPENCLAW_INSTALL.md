# OpenClaw Install Instructions

Use this file when you want OpenClaw to install this plugin with the shortest
possible prompt.

Repository: `https://github.com/jingogooo/openclaw-pairing`
Plugin id: `openclaw-pairing`

## Task

Install this plugin into an existing OpenClaw environment and verify that the
pairing commands are available.

## Required behavior

1. Detect whether OpenClaw runs directly on the host or in Docker Compose.
1. Clone this repository and build the plugin:

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
```

1. If OpenClaw runs directly on the host, install and verify with:

```bash
openclaw plugins install .
openclaw plugins enable openclaw-pairing
openclaw plugins inspect openclaw-pairing
openclaw pair-android --help
```

1. If OpenClaw runs in Docker Compose, install and verify with:

```bash
cd /path/to/your/openclaw-docker
docker compose run --rm \
  -v "/path/to/openclaw-pairing:/plugin:ro" \
  openclaw-cli \
  plugins install /plugin
docker compose run --rm openclaw-cli plugins enable openclaw-pairing
docker compose restart openclaw-gateway
docker compose run --rm openclaw-cli plugins inspect openclaw-pairing
```

1. If installation fails, stop and report the exact command and the first
actionable error.

## Short prompt to send to OpenClaw

```text
Read and follow:
https://github.com/jingogooo/openclaw-pairing/blob/main/OPENCLAW_INSTALL.md
```
