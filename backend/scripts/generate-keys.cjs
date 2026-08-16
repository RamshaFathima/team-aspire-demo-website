// Generates an RSA keypair for RS256 JWT signing → keys/private.pem
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '..', 'keys');
const privatePath = path.join(keysDir, 'private.pem');

if (fs.existsSync(privatePath)) {
    console.log(`[keys] ${privatePath} already exists — skipping`);
    process.exit(0);
}

const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
fs.mkdirSync(keysDir, { recursive: true });
fs.writeFileSync(privatePath, privateKey.export({ type: 'pkcs8', format: 'pem' }));
console.log(`[keys] wrote ${privatePath}`);
