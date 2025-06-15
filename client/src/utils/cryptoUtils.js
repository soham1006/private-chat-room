import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

export function encrypt(message) {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
