import CryptoJS from "crypto-js";
export function decryptVal(text) {
  const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRYPT_SECRET_KEY);
 // console.log(bytes.toString(CryptoJS.enc.Utf8));
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptVal(text) {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPT_SECRET_KEY).toString();
}
