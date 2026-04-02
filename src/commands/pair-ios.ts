import type { OpenClawPluginAPI } from 'openclaw';
import { handlePairingCommand } from '../utils/pairing-handler';

export function registerPairIos(api: OpenClawPluginAPI) {
  api.registerCommand({
    name: 'pair-ios',
    description: 'Auto-pair iOS feiclaw app',
    options: [
      { flag: '--claim <payload>', description: 'Base64url-encoded claim payload', required: true }
    ],
    action: async (options: { claim?: string }) => {
      if (!options.claim) {
        console.error('Error: --claim is required');
        process.exit(1);
      }

      try {
        const result = await handlePairingCommand({
          platform: 'ios',
          claim: options.claim,
          api
        });

        if (result.success) {
          console.log('\n✓ iOS pairing successful');
          console.log(`  Device: ${result.deviceId}`);
          console.log(`  Gateway: ${result.gatewayUrl}`);
          console.log('\nNote: Keep the iOS app open to maintain connection.');
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
