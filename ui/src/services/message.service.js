// from https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
const byteToHex = [];

for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, "0");
  byteToHex.push(hexOctet);
}

function arrayBuffer2hexString(arrayBuffer) {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

  for (let i = 0; i < buff.length; ++i) hexOctets.push(byteToHex[buff[i]]);

  return hexOctets.join("");
}

const normalize = (data) => {
  if (data instanceof ArrayBuffer) return data;
  if (ArrayBuffer.isView(data)) return data.buffer; // typed array and DataView
  if (typeof data === "string" || data instanceof String) {
    const encoder = new TextEncoder();
    const view = encoder.encode(data);
    return view.buffer;
  }
  return undefined;
};

class MessageDataService {
  createSignedEntity(data) {
    console.log("CREATE SIGNED ENTITY!!!", data);
    // TODO verify data
    /* eslint-disable-next-line no-undef */
    const publicKey = getHashNetPublicKey();
    return fetch(`signed://${publicKey.replace(":", "/")}`, { method: "post", body: JSON.stringify(data) });
  }

  async createHashEntity(data) {
    if (!crypto || !crypto.subtle || !crypto.subtle.digest) throw new Error();
    if (!window.getHashNetPublicKey) throw new Error();

    const hashFuncResolveTable = {
      sha1: "SHA-1",
      sha256: "SHA-256",
      sha384: "SHA-384",
      sha512: "SHA-512",
    };
    /* eslint-disable-next-line no-undef */
    const publicKey = getHashNetPublicKey();
    const [signedFormula] = publicKey.split(":");
    const [, signedHashFunc] = signedFormula.split(".");
    if (!(signedHashFunc in hashFuncResolveTable)) throw new Error();
    const dataToPublish = normalize(data);
    console.log("DATA TO PUBLISH!!!", dataToPublish);
    if (dataToPublish === undefined) throw new Error();
    const digest = await crypto.subtle.digest(hashFuncResolveTable[signedHashFunc], dataToPublish);
    console.log("DIGEST!!!", digest);
    const hexDigest = arrayBuffer2hexString(digest);
    const url = `hash://${signedHashFunc}/${hexDigest}`;
    console.log("POST URL!!!", url);
    const response = await fetch(url, { method: "POST", body: dataToPublish });
    if (response.status !== 200) throw new Error();
    return `${signedHashFunc}:${hexDigest}`;
  }

  findRelated(related) {
    return fetch(related);
  }
}

export default new MessageDataService();
