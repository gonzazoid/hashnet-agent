import { createHash } from "node:crypto";

import * as secp256k1 from "@noble/secp256k1";
import secp256r1 from "secp256r1";
import asn from "asn1.js";

import hashResolver from "#resolvers/hash.resolver.js";

import jsonRpcServer from "./json-rpc-server/index.js"

const ownerPublicKey = process.env.OWNER_PUBLIC_KEY;

const Signature = asn.define("Signature", function() {
  this.seq().obj(
    this.key("r").int(),
    this.key("s").int(),
  );
});


const checkSign = (message) => {
  const {
    publicKey,
    hash,
    signature,
    label,
    nonce,
    relatedTo,
  } = message;

  const [hashFunction, hashValue] = hash.split(":");
  const [sign, keyValue] = publicKey.split(":");
  const [signFunction, signHashFunction] = sign.split(".");

  const tokens = [hashFunction, hashValue, nonce, label];
  if (relatedTo) tokens.push(relatedTo);
  const messageToCheck = tokens.join(" ");
  const hasher = createHash(signHashFunction);
  const digestToCheck = hasher.update(messageToCheck).digest("hex"); // RIGHT

  const buffSignature = Buffer.from(signature, "hex");
  const parsedSig = Signature.decode(buffSignature, "der");
  const r = parsedSig.r.toString(16);
  const s = parsedSig.s.toString(16);
  
  if (signFunction === "secp256k1") {
    const hexSignature = `${r.padStart(64, "0")}${s.padStart(64, "0")}`;
    return secp256k1.verify(hexSignature, digestToCheck, keyValue, { lowS: false });
  }
  if (signFunction === "secp256r1") {
    const buffPubKey = Buffer.from(keyValue, "hex");
    const buffHashValue = Buffer.from(hashValue, "hex");
    return secp256r1.verify(buffHashValue, buffSignature, keyValue);
  }
  throw new Error(`unknown sign function: ${signFunction}`);
};

const isHashNetRPCMessage = (message) => {
  if (message.label !== "/hashnet-rpc") return false;
  if (message.publicKey !== ownerPublicKey) return false;
  try {
    return checkSign(message);
  } catch (e) {
    return false;
  }
  return true;
};

const hashNetRPC = (req, res, message) => {
  return hashResolver.findByHash(message.hash)
    .then(data => JSON.parse(data.toString()))
    .then(json => jsonRpcServer.receive(json));
};

export {
  isHashNetRPCMessage,
  hashNetRPC,
}
