import type { OpenClawPluginAPI } from 'openclaw';
import { handlePairingCommand, detectPlatformFromClaim } from '../utils/pairing-handler';

export function registerPairAuto(api: OpenClawPluginAPI) {
  api.registerCommand({
    name: 'pair-auto',
    description: 'Auto-detect platform and pair feiclaw app',
    options: [
      { flag: '--claim <payload>', description: 'Base64url-encoded claim payload', required: true }
    ],
    action: async (options: { claim?: string }) => {
      if (!options.claim) {
        console.error('Error: --claim is required');
        process.exit(1);
      }

      try {
        // Detect platform from claim payload
        const platform = detectPlatformFromClaim(options.claim);
        console.log(`Detected platform: ${platform}`);

        const result = await handlePairingCommand({
          platform,
          claim: options.claim,
          api
        });

        if (result.success) {
          console.log(`\n✓ ${platform} pairing successful`);
          console.log(`  Device: ${result.deviceId}`);
          console.log(`  Gateway: ${result.gatewayUrl}`);
        } else {
          console.error('\n✗ Pairing failed:', result.error);
          process.exit(1);
        }
      } catch (error) {
        console.error('Error during pairing:', error);
        process.exit(1);
      }
    }
  });
}
