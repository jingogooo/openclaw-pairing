# Quick Start Guide

## For End Users

### 1. Install the Plugin

```bash
# One-line install
curl -fsSL https://raw.githubusercontent.com/jingogooo/openclaw-pairing/main/install.sh | sh
```

### Docker Gateway

If your OpenClaw gateway runs in Docker Compose, install the plugin from a
local checkout:

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build

cd /path/to/your/openclaw-docker
docker compose run --rm \
  -v "/path/to/openclaw-pairing:/plugin:ro" \
  openclaw-cli \
  plugins install /plugin
docker compose run --rm openclaw-cli plugins enable openclaw-pairing
docker compose restart openclaw-gateway
```

### 2. Use Feiclaw App to Pair

1. Open Feiclaw App on your phone
2. Tap "Pair with OpenClaw"
3. Copy the pairing command shown in the app
4. Paste and run the command on your computer

### 3. Done!

Your phone is now paired with OpenClaw.

---

## For Plugin Developers

### Setup Development Environment

```bash
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing
npm install
npm run build
npm link
```

### Test the Plugin

```bash
# In OpenClaw directory
openclaw plugins link /path/to/openclaw-pairing

# Test a command
openclaw pair-android --help
```

### Build for Release

```bash
npm run build
npm pack
```

---

## Troubleshooting

### Plugin not found

Make sure OpenClaw is installed:
```bash
npm install -g openclaw
```

### Permission denied on install

Use sudo or fix npm permissions:
```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Command not found after install

Restart your terminal or reload shell:
```bash
exec $SHELL -l
```

---

## Platform-Specific Notes

### Android
- Requires Android 8.0+
- Enable "Install from unknown sources" if installing APK manually

### HarmonyOS
- Compatible with HarmonyOS 2.0+
- Some features may require HarmonyOS 3.0+

### iOS
- Requires iOS 15.0+
- Must install via TestFlight or App Store
- Keep app open during pairing

---

## Getting Help

- GitHub Issues: https://github.com/jingogooo/openclaw-pairing/issues
- Discussions: https://github.com/jingogooo/openclaw-pairing/discussions
