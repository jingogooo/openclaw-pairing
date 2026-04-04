# OpenClaw Pairing Plugin LLM Install Guide

This file is optimized for AI agents and automation tools.

Goal: install `openclaw-pairing` into an existing OpenClaw environment with the
fewest possible decisions.

Plugin id: `openclaw-pairing`

## Inputs

- A machine with `git`, `npm`, and `openclaw`
- An existing OpenClaw gateway installation
- For Docker installs: a working `docker compose` setup with `openclaw-cli` and
  `openclaw-gateway`

## Preferred Local Install

Use this when OpenClaw runs directly on the host.

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
openclaw plugins install .
openclaw plugins enable openclaw-pairing
openclaw plugins inspect openclaw-pairing
```

Expected result:

- `plugins inspect openclaw-pairing` shows the plugin is installed
- `openclaw pair-android --help` works

## Preferred Docker Install

Use this when OpenClaw runs in Docker Compose.

Build the plugin on the host first:

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
```

Then install it into the Dockerized OpenClaw environment:

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

Expected result:

- `plugins inspect openclaw-pairing` succeeds
- the gateway comes back after `docker compose restart openclaw-gateway`

## Fast Validation

Run one of these after install:

```bash
openclaw pair-android --help
openclaw pair-auto --help
```

Docker:

```bash
docker compose run --rm openclaw-cli plugins inspect openclaw-pairing
```

## Pairing Usage

After installation, the most common command is:

```bash
openclaw pair-android --claim "<claim-payload>"
```

Other supported commands:

```bash
openclaw pair-harmony --claim "<claim-payload>"
openclaw pair-ios --claim "<claim-payload>"
openclaw pair-auto --claim "<claim-payload>"
```

## Update

Re-run the same install flow from a fresh checkout:

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
openclaw plugins install .
openclaw plugins enable openclaw-pairing
```

Docker:

```bash
docker compose run --rm \
  -v "/path/to/openclaw-pairing:/plugin:ro" \
  openclaw-cli \
  plugins install /plugin
docker compose run --rm openclaw-cli plugins enable openclaw-pairing
docker compose restart openclaw-gateway
```

## Common Failures

### `openclaw: command not found`

Install OpenClaw first.

### `plugins inspect openclaw-pairing` fails

- confirm `npm run build` completed successfully
- confirm you ran `openclaw plugins enable openclaw-pairing`
- for Docker, restart `openclaw-gateway` after enabling

### Docker install cannot see `/plugin`

Use the real absolute path in the volume mount:

```bash
-v "/absolute/path/to/openclaw-pairing:/plugin:ro"
```

### Pair command still missing

Open a new shell or run:

```bash
exec $SHELL -l
```
