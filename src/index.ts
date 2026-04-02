import type { OpenClawPluginAPI } from 'openclaw';
import { registerDeviceClaimApi } from './api/device-claim';
import { handlePairingCommand } from './utils/pairing-handler';

export function activate(api: OpenClawPluginAPI) {
  // Register CLI commands
  // @ts-ignore - registerCli exists at runtime
  api.registerCli?.(({ program }: { program: any }) => {
    program
      .command('pair-android')
      .description('Auto-pair Android feiclaw app')
      .option('--claim <payload>', 'Base64url-encoded claim payload')
      .action(async (options: any) => {
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
            if (result.expiresAtMs) {
              console.log(`  Expires: ${new Date(result.expiresAtMs).toISOString()}`);
            }
          } else {
            console.error('\n✗ Pairing failed:', result.error);
            process.exit(1);
          }
        } catch (error) {
          console.error('Error during pairing:', error);
          process.exit(1);
        }
      });

    program
      .command('pair-harmony')
      .description('Auto-pair HarmonyOS feiclaw app')
      .option('--claim <payload>', 'Base64url-encoded claim payload')
      .action(async (options: any) => {
        if (!options.claim) {
          console.error('Error: --claim is required');
          process.exit(1);
        }

        try {
          const result = await handlePairingCommand({
            platform: 'harmony',
            claim: options.claim,
            api
          });

          if (result.success) {
            console.log('\n✓ Pairing successful');
            console.log(`  Device: ${result.deviceId}`);
            console.log(`  Gateway: ${result.gatewayUrl}`);
            if (result.expiresAtMs) {
              console.log(`  Expires: ${new Date(result.expiresAtMs).toISOString()}`);
            }
          } else {
            console.error('\n✗ Pairing failed:', result.error);
            process.exit(1);
          }
        } catch (error) {
          console.error('Error during pairing:', error);
          process.exit(1);
        }
      });

    program
      .command('pair-ios')
      .description('Auto-pair iOS feiclaw app')
      .option('--claim <payload>', 'Base64url-encoded claim payload')
      .action(async (options: any) => {
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
            console.log('\n✓ Pairing successful');
            console.log(`  Device: ${result.deviceId}`);
            console.log(`  Gateway: ${result.gatewayUrl}`);
            if (result.expiresAtMs) {
              console.log(`  Expires: ${new Date(result.expiresAtMs).toISOString()}`);
            }
          } else {
            console.error('\n✗ Pairing failed:', result.error);
            process.exit(1);
          }
        } catch (error) {
          console.error('Error during pairing:', error);
          process.exit(1);
        }
      });

    program
      .command('pair-auto')
      .description('Auto-detect platform and pair feiclaw app')
      .option('--claim <payload>', 'Base64url-encoded claim payload')
      .action(async (options: any) => {
        if (!options.claim) {
          console.error('Error: --claim is required');
          process.exit(1);
        }

        // Auto-detect platform from claim
        const platform = 'android'; // TODO: Parse claim to detect platform

        try {
          const result = await handlePairingCommand({
            platform,
            claim: options.claim,
            api
          });

          if (result.success) {
            console.log('\n✓ Pairing successful');
            console.log(`  Device: ${result.deviceId}`);
            console.log(`  Gateway: ${result.gatewayUrl}`);
            if (result.expiresAtMs) {
              console.log(`  Expires: ${new Date(result.expiresAtMs).toISOString()}`);
            }
          } else {
            console.error('\n✗ Pairing failed:', result.error);
            process.exit(1);
          }
        } catch (error) {
          console.error('Error during pairing:', error);
          process.exit(1);
        }
      });
  }, { commands: ['pair-android', 'pair-harmony', 'pair-ios', 'pair-auto'] });

  // Register HTTP API endpoints
  registerDeviceClaimApi(api);

  console.log('[openclaw-pairing] Plugin activated');
}

export function deactivate() {
  console.log('[openclaw-pairing] Plugin deactivated');
}
