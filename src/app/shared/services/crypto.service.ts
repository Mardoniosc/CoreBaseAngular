import { Injectable } from '@angular/core';
  import * as crypto from 'crypto-js';

    @Injectable()
    export class CryptoService {

    constructor() {
    }


   encrypt(key: any, privateKey: any) {
     const cryptkey = crypto.enc.Utf8.parse(privateKey);
     const encrypted = crypto.AES.encrypt(key, cryptkey, {
      iv: crypto.enc.Hex.parse('32a69475d7acaba3311b907669f7517c'),
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
   });
   return encrypted.toString();
  }


  decrypt(cryptedKey: any, privateKey: any) {
    const cryptoPrivateKey = crypto.enc.Utf8.parse(privateKey);
    const encryptedKey = crypto.enc.Base64.parse(cryptedKey);
    const decrypted = crypto.AES.decrypt({ciphertext: encryptedKey}, cryptoPrivateKey, {
      iv: crypto.enc.Hex.parse('32a69475d7acaba3311b907669f7517c'),
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7
   });
   return decrypted.toString(crypto.enc.Utf8);
  }
}
