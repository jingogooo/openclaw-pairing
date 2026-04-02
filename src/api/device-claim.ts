import type { OpenClawPluginAPI } from 'openclaw';

interface DeviceClaim {
  claimToken: string;
  deviceId: string;
  publicKey: string;
  setupCode: string;
  gatewayUrl: string;
  expiresAtMs: number;
}

// In-memory store for claims (could be enhanced to use file storage)
const claimsStore = new Map<string, DeviceClaim>();

export function registerDeviceClaimApi(api: OpenClawPluginAPI) {
  // Register HTTP endpoint: POST /device-pair/claims/:token
  api.registerHttpRoute({
    path: '/device-pair/claims/:token',
    method: 'POST',
    handler: async (req, res) => {
      const { token } = req.params;
      const { deviceId, publicKey } = req.body || {};

      if (!deviceId || !publicKey) {
        res.status(400).json({ error: 'Missing deviceId or publicKey' });
        return;
      }

      // Check if claim exists
      const existingClaim = claimsStore.get(token);
      if (!existingClaim) {
        res.status(404).json({ error: 'Claim not found or expired' });
        return;
      }

      // Verify device matches
      if (existingClaim.deviceId !== deviceId) {
        res.status(403).json({ error: 'Device ID mismatch' });
        return;
      }

      // Return setup code
      res.json({
        ok: true,
        setupCode: existingClaim.setupCode,
        gatewayUrl: existingClaim.gatewayUrl,
        expiresAtMs: existingClaim.expiresAtMs
      });
    }
  });

  // Register HTTP endpoint: GET /device-pair/claims/:token
  api.registerHttpRoute({
    path: '/device-pair/claims/:token',
    method: 'GET',
    handler: async (req, res) => {
      const { token } = req.params;

      const claim = claimsStore.get(token);
      if (!claim) {
        res.status(404).json({ error: 'Claim not found or expired' });
        return;
      }

      // Check expiration
      if (Date.now() > claim.expiresAtMs) {
        claimsStore.delete(token);
        res.status(410).json({ error: 'Claim expired' });
        return;
      }

      res.json({
        ok: true,
        deviceId: claim.deviceId,
        expiresAtMs: claim.expiresAtMs
      });
    }
  });

  // Cleanup expired claims periodically
  setInterval(() => {
    const now = Date.now();
    for (const [token, claim] of claimsStore.entries()) {
      if (now > claim.expiresAtMs) {
        claimsStore.delete(token);
      }
    }
  }, 60 * 1000); // Every minute
}

export function registerDeviceAutoPairClaim(claim: DeviceClaim): void {
  claimsStore.set(claim.claimToken, claim);
}

export function getDeviceClaim(token: string): DeviceClaim | undefined {
  return claimsStore.get(token);
}
