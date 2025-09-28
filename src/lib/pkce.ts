function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  const randomString = Array.from(values)
    .map(x => chars[x % chars.length])
    .join('');
  return randomString;
}

async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return digest;
}

function base64UrlEncode(input: ArrayBuffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(input)));
  const base64Url = base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return base64Url;
}

export async function makePkcePair() {
  const codeVerifier = generateRandomString(64);
  const hashBuffer = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashBuffer);

  return {
    codeVerifier,
    codeChallenge,
  };
}
