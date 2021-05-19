export function indexIntoObject(path, root) {
  let obj = root;
  for (let el of path) {
    obj = obj[el];
  }
  return obj;
}

export function timeStamp() {
  return Date.now();
}

export function jsonclone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function repeat(count, value) {
  return Array(count).fill(value);
}

export function download(href, name = "img.png") {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function arrayBufferToBase64(arrayBuffer) {
  const decoder = new TextDecoder("utf8");
  const decoded = decoder.decode(arrayBuffer);
  const binaryString = toBinary(decoded);
  return btoa(binaryString);
}

export function hashPhoto(photo) {
  const enc = new TextEncoder(); // always utf-8
  const array = enc.encode(photo);
  return crypto.subtle.digest("SHA-1", array).then(arrayBufferToBase64);
}

export function photoFileName(photo) {
  return hashPhoto(photo).then(
    (hash) => hash.replace(/_/g, "").replace(/\//g, "").substring(3, 13) + ".png"
  );
}

/**
 * Converts the given photo dataurl to a File object
 * @param {string} photo
 */
export async function photoToFile(photo) {
  const res = await fetch(photo);
  const buffer = await res.arrayBuffer();
  const fileName = await photoFileName(photo); //TODO this is not effictient

  const file = new File([buffer], fileName, {
    type: "image/png",
  });
  return file;
}

export async function shareDownload(photos) {
  const files = await Promise.all(photos.map(photoToFile));
  const shareData = { files };
  return await navigator.share(shareData);
}
