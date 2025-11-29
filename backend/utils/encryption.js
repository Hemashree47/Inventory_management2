import crypto from 'crypto';

const ENCRYPTION_KEY = 'asdfghjklpoiuytrewqzxcvbnm123456'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(password) {
    const iv = crypto.randomBytes(IV_LENGTH); // Ensure IV_LENGTH is a number
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);

    let encrypted = cipher.update(password, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText) {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedData, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);

    let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}
