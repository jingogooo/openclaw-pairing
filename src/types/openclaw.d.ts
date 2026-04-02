// Type definitions for OpenClaw Plugin API
// This is a simplified version for development

declare module 'openclaw' {
  export interface OpenClawPluginAPI {
    // Register a CLI command
    registerCommand(options: {
      name: string;
      description: string;
      options?: Array<{
        flag: string;
        description: string;
        required?: boolean;
      }>;
      action: (options: Record<string, unknown>) => Promise<void> | void;
    }): void;

    // Register an HTTP route
    registerHttpRoute(options: {
      path: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      handler: (req: HttpRequest, res: HttpResponse) => Promise<void> | void;
    }): void;

    // Get OpenClaw configuration
    getConfig(): OpenClawConfig;

    // Issue a device bootstrap token
    issueDeviceBootstrapToken(options: {
      profile: {
        roles: string[];
        scopes?: string[];
      };
    }): Promise<{ token: string }>;

    // Register a device auto-pair claim
    registerDeviceAutoPairClaim(claim: {
      claimToken: string;
      deviceId: string;
      publicKey: string;
      setupCode: string;
      gatewayUrl: string;
      expiresAtMs: number;
    }): Promise<void>;
  }

  export interface HttpRequest {
    params: Record<string, string>;
    body?: Record<string, unknown>;
    query?: Record<string, string>;
  }

  export interface HttpResponse {
    status(code: number): HttpResponse;
    json(data: Record<string, unknown>): void;
    send(data: string): void;
  }

  export interface OpenClawConfig {
    gateway?: {
      port?: number;
      host?: string;
      auth?: {
        mode?: 'token' | 'password' | 'none';
        token?: string;
        password?: string;
      };
    };
  }
}
