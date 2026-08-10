import JSZip from "jszip";
import CryptoJS from "crypto-js";
const typeOne = [80, 75, 3, 4, 10, 0, 0, 0]; // PK ....
const typeTwo = [55, 122]; // 7z ....

function isType(dat: ArrayBufferLike, type: number[]): boolean {
  // ArrayBuffer does not support index access at runtime (dat[0] is always
  // undefined), so read the bytes through a Uint8Array view instead.
  const view = new Uint8Array(dat);
  return view[0] === type[0] && view[1] === type[1];
}

export async function decrypt(data: ArrayBufferLike, fileName: string) {
  const sb3 = decryptSb3(data, fileName);
  const zip = await JSZip.loadAsync(new Uint8Array(sb3));
  const json = await zip.file("project.json")!.async("text");
  if (json.startsWith("{")) {
    return sb3;
  } else {
    const v1 = decryptProjectJSON(json);
    const decrypted = decodeURIComponent(atob(v1));
    zip.file("project.json", decrypted);
    return await zip.generateAsync({ type: "arraybuffer" });
  }
}

function decryptProjectJSON(data: string): string {
  const t = data.length - 1,
    n = t % 10,
    r = data.charAt(t);
  return `${data.substring(0, +n)}${r}${data.substring(+n + 1, t)}`;
}

function decryptSb3(data: ArrayBufferLike, fileName: string) {
  if (isType(data, typeOne)) {
    return data;
  } else if (isType(data, typeTwo)) {
    // Keep the same length as the input (the first 8 bytes are replaced by the
    // signature), but ensure it is at least 8 bytes so the signature fits.
    const length = Math.max(data.byteLength, 8);
    const u8a = new Uint8Array(length);
    u8a.set(typeOne, 0);
    u8a.set(new Uint8Array(data.slice(8)), 8);
    return u8a.buffer;
  } else {
    const raw = new TextDecoder("Utf-8").decode(data);
    let key = CryptoJS.enc.Base64.parse("KzdnFCBRvq3" + fileName);
    key.sigBytes = 32;
    let iv = key.clone();
    ((iv.sigBytes = 16), iv.words.splice(4));
    var decrypted = CryptoJS.AES.decrypt(raw, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const bytes = CryptoJS.enc.Utf8.stringify(decrypted);
    const u8a = new Uint8Array(bytes.split(",").map((s) => parseInt(s)));
    return u8a.buffer;
  }
}
