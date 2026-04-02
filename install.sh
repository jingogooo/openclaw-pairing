#!/bin/bash
set -e

# OpenClaw Pairing Plugin Installer
# Supports: Android, HarmonyOS, iOS

REPO="jingogooo/openclaw-pairing"
API_URL="https://api.github.com/repos/${REPO}/releases/latest"

echo "========================================"
echo "  Feiclaw OpenClaw Pairing Plugin"
echo "  Platform: Android/HarmonyOS/iOS"
echo "========================================"
echo ""

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "❌ Error: openclaw is not installed"
    echo "   Please install OpenClaw first:"
    echo "   npm install -g openclaw"
    exit 1
fi

echo "✓ OpenClaw found"

# Get latest release info
echo ""
echo "📦 Checking for latest release..."
LATEST_RELEASE=$(curl -s "${API_URL}" || echo "")

if [ -z "$LATEST_RELEASE" ] || [ "$LATEST_RELEASE" = "null" ]; then
    echo "⚠️  Could not fetch latest release, using fallback..."
    VERSION="1.0.0"
else
    VERSION=$(echo "$LATEST_RELEASE" | grep -o '"tag_name": "[^"]*"' | cut -d'"' -f4)
    VERSION=${VERSION:-"1.0.0"}
fi

echo "✓ Latest version: ${VERSION}"

# Detect install method
echo ""
echo "🔧 Installing plugin..."

# Try plugin install first (preferred method)
if openclaw plugins install "github:${REPO}" 2>/dev/null; then
    echo "✓ Plugin installed via openclaw plugins"
else
    echo "⚠️  Plugin install failed, trying manual install..."

    # Create temp directory
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    # Try to download pre-built package first
    DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/openclaw-pairing-${VERSION}.tgz"

    if curl -sL --fail "$DOWNLOAD_URL" -o "plugin.tgz" 2>/dev/null; then
        echo "📦 Downloading pre-built package..."
        tar -xzf plugin.tgz
        cd package

        # Install dependencies and link
        npm install --production
        npm link

        echo "✓ Plugin manually installed"
    else
        echo "📦 No pre-built package found, installing from source..."

        # Clone from git
        if ! git clone --depth 1 --branch "${VERSION}" "https://github.com/${REPO}.git" package 2>/dev/null; then
            # Fallback: clone main branch if tag doesn't exist
            if ! git clone --depth 1 "https://github.com/${REPO}.git" package 2>/dev/null; then
                echo "❌ Failed to clone repository"
                echo "   Please manually install from: https://github.com/${REPO}"
                rm -rf "$TEMP_DIR"
                exit 1
            fi
        fi

        cd package

        # Install dependencies
        if command -v npm &> /dev/null; then
            npm install
            npm link
        elif command -v pnpm &> /dev/null; then
            pnpm install
            pnpm link
        elif command -v yarn &> /dev/null; then
            yarn install
            yarn link
        else
            echo "❌ No package manager found (npm, pnpm, or yarn)"
            rm -rf "$TEMP_DIR"
            exit 1
        fi

        echo "✓ Plugin installed from source"
    fi

    # Cleanup
    rm -rf "$TEMP_DIR"
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
if openclaw pair-android --help &>/dev/null || openclaw pair-auto --help &>/dev/null; then
    echo "✓ Plugin installed successfully!"
    echo ""
    echo "Available commands:"
    echo "  openclaw pair-android --claim <payload>  # Pair Android device"
    echo "  openclaw pair-harmony --claim <payload>  # Pair HarmonyOS device"
    echo "  openclaw pair-ios --claim <payload>      # Pair iOS device"
    echo "  openclaw pair-auto --claim <payload>     # Auto-detect platform"
    echo ""
    echo "🎉 Ready to pair your feiclaw app!"
else
    echo "⚠️  Installation may have failed"
    echo "   Try: openclaw plugins list"
    exit 1
fi
