import crypto from 'crypto';
import { logger } from './logger';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
  const keyEnv = process.env.ENCRYPTION_KEY;
  if (!keyEnv) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  // Convert to buffer
  const keyBuffer = Buffer.from(keyEnv, 'utf8');

  // Validate key is exactly 32 bytes
  if (keyBuffer.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be exactly 32 bytes (256 bits). Got ${keyBuffer.length} bytes. ` +
      `Hint: Use a 32-character UTF-8 string or 64-character hex string.`
    );
  }

  return keyBuffer;
}

const KEY = getEncryptionKey();

export function encrypt(text: string): string {
  if (!text) {
    throw new Error('Cannot encrypt empty string');
  }

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return [iv.toString('hex'), encrypted.toString('hex'), tag.toString('hex')].join(':');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Encryption failed: ${message}`);
  }
}

export function decrypt(encryptedText: string): string | null {
  if (!encryptedText) {
    return null;
  }

  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format: expected 3 parts separated by colons');
    }

    const [ivHex, encryptedHex, tagHex] = parts;

    if (!ivHex || !encryptedHex || !tagHex) {
      throw new Error('Invalid encrypted text: missing parts');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    // Validate buffer sizes
    if (iv.length !== 16) {
      throw new Error(`Invalid IV length: expected 16 bytes, got ${iv.length}`);
    }
    if (tag.length !== 16) {
      throw new Error(`Invalid tag length: expected 16 bytes, got ${tag.length}`);
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Decryption failed: ${message}`);
    return null;
  }
}
