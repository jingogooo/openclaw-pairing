import type { OpenClawPluginAPI } from 'openclaw';
import crypto from 'crypto';

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
    const config = api.getConfig();
    const gatewayPort = config.gateway?.port || 8080;
    const gatewayHost = 'localhost'; // Could be enhanced to detect LAN IP

    // Generate operator bootstrap token
    const operatorToken = await api.issueDeviceBootstrapToken({
      profile: {
        roles: ['operator'],
        scopes: [
          'operator.read',
          'operator.write',
          'operator.talk.secrets',
          'operator.approvals'
        ]
      }
    });

    // Generate node bootstrap token
    const nodeToken = await api.issueDeviceBootstrapToken({
      profile: {
        roles: ['node'],
        scopes: ['node.connect', 'node.read']
      }
    });

    // Build setup code payload
    const setupCodePayload = {
      url: `http://${gatewayHost}:${gatewayPort}`,
      nodeBootstrapToken: nodeToken.token,
      operatorBootstrapToken: operatorToken.token,
      candidateUrls: [
        `http://${gatewayHost}:${gatewayPort}`,
        `http://127.0.0.1:${gatewayPort}`
      ]
    };

    const setupCode = Buffer.from(JSON.stringify(setupCodePayload), 'utf8').toString('base64url');

    // Register device claim
    const expiresAtMs = Date.now() + 5 * 60 * 1000; // 5 minutes
    await api.registerDeviceAutoPairClaim({
      claimToken: payload.claimToken,
      deviceId: payload.deviceId,
      publicKey: payload.publicKey,
      setupCode,
      gatewayUrl: setupCodePayload.url,
      expiresAtMs
    });

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
