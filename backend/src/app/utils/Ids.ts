import { randomBytes, randomInt } from 'crypto';

const year = () => new Date().getFullYear();

export const makeGatewayRef = (): string =>
    `ASPPAY-${Date.now()}-${randomBytes(4).toString('hex')}`;

export const makeReceiptNumber = (): string =>
    `ASP-${year()}-${String(randomInt(0, 999999)).padStart(6, '0')}`;

export const makeCertificateNumber = (): string =>
    `ASP-CERT-${year()}-${String(randomInt(0, 999999)).padStart(6, '0')}`;

/** Short, unambiguous public verification code, e.g. 7FK3-Q9ZM. */
export const makeVerificationCode = (): string => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const pick = () => alphabet[randomInt(0, alphabet.length)];
    const part = (n: number) => Array.from({ length: n }, pick).join('');
    return `${part(4)}-${part(4)}`;
};

export const slugify = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
