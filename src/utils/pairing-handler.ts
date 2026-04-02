import type { OpenClawPluginAPI } from 'openclaw';
import crypto from 'crypto';
import { registerDeviceAutoPairClaim } from '../api/device-claim.js';

export type Platform = 'android' | 'harmony' | 'ios';

interface PairingOptions {
  platform: Platform;
  claim: string;
  api: OpenClawPluginAPI;
}

interface PairingResult {
  success: boolean;
  deviceId?: string;
  gatewayUrl?: string;
  expiresAtMs?: number;
  error?: string;
}

interface ClaimPayload {
  v?: number;
  claimToken?: string;
  deviceId?: string;
  publicKey?: string;
  platform?: string;
}

export function decodeClaim(raw: string): ClaimPayload {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('claim payload required');
  }

  // Base64url decode
  const padded = trimmed + '='.repeat((4 - (trimmed.length % 4)) % 4);
  let decoded = '';
  try {
    decoded = Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch {
    throw new Error('claim payload must be base64url JSON');
  }

  try {
    return JSON.parse(decoded) as ClaimPayload;
  } catch {
    throw new Error('claim payload must be valid JSON');
  }
}

export function detectPlatformFromClaim(claim: string): Platform {
  try {
    const payload = decodeClaim(claim);
    const platform = payload.platform?.toLowerCase() || '';

    if (platform.includes('harmony') || platform.includes('ohos')) {
      return 'harmony';
    }
    if (platform.includes('ios') || platform.includes('iphone')) {
      return 'ios';
    }
    return 'android'; // default
  } catch {
    return 'android';
  }
}

import os from 'os';

function getLanIp(): string {
  // Try to get LAN IP for better connectivity
  try {
    const interfaces = os.networkInterfaces();
    // Prefer 10.x.x.x addresses ( user's network )
    for (const iface of Object.values(interfaces)) {
      for (const addr of iface || []) {
        if (addr.family === 'IPv4' && !addr.internal && addr.address.startsWith('10.')) {
          return addr.address;
        }
      }
    }
    // Fallback to 192.168.x.x
    for (const iface of Object.values(interfaces)) {
      for (const addr of iface || []) {
        if (addr.family === 'IPv4' && !addr.internal && addr.address.startsWith('192.168.')) {
          return addr.address;
        }
      }
    }
    // Last resort: any non-internal IPv4
    for (const iface of Object.values(interfaces)) {
      for (const addr of iface || []) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return addr.address;
        }
      }
    }
  } catch (e) {
    // Fallback
  }
  return 'localhost';
}

export async function handlePairingCommand(options: PairingOptions): Promise<PairingResult> {
  const { platform, claim, api } = options;

  try {
    // Decode and validate claim
    const payload = decodeClaim(claim);

    if (!payload.claimToken || !payload.deviceId || !payload.publicKey) {
      return {
        success: false,
        error: 'Invalid claim: missing claimToken, deviceId, or publicKey'
      };
    }

    // Get gateway configuration
    const config = (api as any).config || {};
    const gatewayPort = config.gateway?.port || 18789; // Default OpenClaw port

    // Use LAN IP for better phone connectivity
    const gatewayHost = getLanIp();

    // Generate bootstrap tokens (using crypto as fallback)
    // In production, these should be issued by the gateway
    const operatorToken = crypto.randomBytes(32).toString('base64url');
    const nodeToken = crypto.randomBytes(32).toString('base64url');

    // Build setup code payload - matching OpenClaw's expected format
    const setupCodePayload = {
      v: 1,
      url: `http://${gatewayHost}:${gatewayPort}`,
      nodeBootstrapToken: nodeToken,
      operatorBootstrapToken: operatorToken,
      candidateUrls: [
        `http://${gatewayHost}:${gatewayPort}`,
        `http://127.0.0.1:${gatewayPort}`,
        `http://localhost:${gatewayPort}`
      ]
    };

    const setupCode = Buffer.from(JSON.stringify(setupCodePayload), 'utf8').toString('base64url');

    // Register device claim in store
    const expiresAtMs = Date.now() + 5 * 60 * 1000; // 5 minutes

    registerDeviceAutoPairClaim({
      claimToken: payload.claimToken,
      deviceId: payload.deviceId,
      publicKey: payload.publicKey,
      setupCode,
      gatewayUrl: setupCodePayload.url,
      expiresAtMs
    });

    console.log(`✓ Registered claim for device: ${payload.deviceId}`);
    console.log(`✓ Setup code generated (expires in 5 minutes)`);
    console.log(`✓ Gateway URL: ${setupCodePayload.url}`);

    return {
      success: true,
      deviceId: payload.deviceId,
      gatewayUrl: setupCodePayload.url,
      expiresAtMs
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Generate a secure random claim token
export function generateClaimToken(): string {
  return crypto.randomBytes(32).toString('base64url').replace(/=/g, '');
}
