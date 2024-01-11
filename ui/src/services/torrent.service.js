import { JSONRPCClient } from "json-rpc-2.0";
import { postMessage } from "hashnet-client";

const getCurrentNonceForUrl = url => (
  fetch(url)
    .then(response => response.json())
    .then(messages => messages.map(message => BigInt(message.nonce)))
    .then(nonces => (nonces.length ? nonces.reduce((max, current) => (current > max ? current : max)) : 0n))
    .then(maxBigInt => (maxBigInt + 1n).toString())
);

const client = new JSONRPCClient((jsonRPCRequest) => {
  const [signFunction, keyValue] = window.getHashNetPublicKey().split(":");
  return (
    getCurrentNonceForUrl(`signed://${signFunction}/${keyValue}/hashnet-rpc`)
      .then(nonce => postMessage(JSON.stringify(jsonRPCRequest), "/hashnet-rpc", nonce))
  );
});

class TorrentService {
  async addTorrentByMagnetUrl(magnetUrl) {
    console.log(magnetUrl);

    return client
      .request("add-torrent-by-magnet-url", { magnetUrl });
  }
}

export default new TorrentService();
