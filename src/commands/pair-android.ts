import type { OpenClawPluginAPI } from 'openclaw';
import { handlePairingCommand } from '../utils/pairing-handler';

export function registerPairAndroid(api: OpenClawPluginAPI) {
  api.registerCommand({
    name: 'pair-android',
    description: 'Auto-pair Android feiclaw app',
    options: [
      { flag: '--claim <payload>', description: 'Base64url-encoded claim payload', required: true },
      { flag: '--auto-install', description: 'Auto install plugin if not present', required: false }
    ],
    action: async (options: { claim?: string; autoInstall?: boolean }) => {
      if (!options.claim) {
        console.error('Error: --claim is required');
        process.exit(1);
      }

      try {
        const result = await handlePairingCommand({
          platform: 'android',
          claim: options.claim,
          api
        });

        if (result.success) {
          console.log('\n✓ Pairing successful');
          console.log(`  Device: ${result.deviceId}`);
          console.log(`  Gateway: ${result.gatewayUrl}`);
          console.log(`  Expires: ${new Date(result.expiresAtMs).toISOString()}`);
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
