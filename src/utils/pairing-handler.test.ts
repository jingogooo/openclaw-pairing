import { describe, it, expect } from '@jest/globals';
import { decodeClaim, detectPlatformFromClaim, generateClaimToken } from './pairing-handler';

describe('decodeClaim', () => {
  it('should decode valid base64url claim', () => {
    const payload = { v: 1, claimToken: 'test123', deviceId: 'device456', publicKey: 'key789' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const result = decodeClaim(encoded);

    expect(result.v).toBe(1);
    expect(result.claimToken).toBe('test123');
    expect(result.deviceId).toBe('device456');
    expect(result.publicKey).toBe('key789');
  });

  it('should throw error for invalid base64', () => {
    expect(() => decodeClaim('invalid!!!')).toThrow('claim payload must be base64url JSON');
  });

  it('should throw error for non-JSON payload', () => {
    const encoded = Buffer.from('not json').toString('base64url');
    expect(() => decodeClaim(encoded)).toThrow('claim payload must be valid JSON');
  });

  it('should throw error for empty claim', () => {
    expect(() => decodeClaim('')).toThrow('claim payload required');
  });
});

describe('detectPlatformFromClaim', () => {
  it('should detect Android platform', () => {
    const payload = { platform: 'android', deviceId: 'test' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    expect(detectPlatformFromClaim(encoded)).toBe('android');
  });

  it('should detect HarmonyOS platform', () => {
    const payload = { platform: 'harmony', deviceId: 'test' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    expect(detectPlatformFromClaim(encoded)).toBe('harmony');
  });

  it('should detect HarmonyOS from ohos keyword', () => {
    const payload = { platform: 'ohos', deviceId: 'test' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    expect(detectPlatformFromClaim(encoded)).toBe('harmony');
  });

  it('should detect iOS platform', () => {
    const payload = { platform: 'ios', deviceId: 'test' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    expect(detectPlatformFromClaim(encoded)).toBe('ios');
  });

  it('should default to Android for unknown platform', () => {
    const payload = { platform: 'unknown', deviceId: 'test' };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');

    expect(detectPlatformFromClaim(encoded)).toBe('android');
  });

  it('should default to Android for invalid claim', () => {
    expect(detectPlatformFromClaim('invalid')).toBe('android');
  });
});

describe('generateClaimToken', () => {
  it('should generate a valid token', () => {
    const token = generateClaimToken();
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(20);
  });

  it('should generate unique tokens', () => {
    const token1 = generateClaimToken();
    const token2 = generateClaimToken();
    expect(token1).not.toBe(token2);
  });
});
