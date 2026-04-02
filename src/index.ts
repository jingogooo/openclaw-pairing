import type { OpenClawPluginAPI } from 'openclaw';
import { registerPairAndroid } from './commands/pair-android';
import { registerPairHarmony } from './commands/pair-harmony';
import { registerPairIos } from './commands/pair-ios';
import { registerPairAuto } from './commands/pair-auto';
import { registerDeviceClaimApi } from './api/device-claim';

export function activate(api: OpenClawPluginAPI) {
  // Register CLI commands
  registerPairAndroid(api);
  registerPairHarmony(api);
  registerPairIos(api);
  registerPairAuto(api);

  // Register HTTP API endpoints
  registerDeviceClaimApi(api);

  console.log('[openclaw-pairing] Plugin activated');
}

export function deactivate() {
  console.log('[openclaw-pairing] Plugin deactivated');
}
