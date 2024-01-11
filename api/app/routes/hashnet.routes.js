import { Buffer } from 'node:buffer';

import express, { Router } from "express";

import hash from "#controllers/hash.controller.js";
import signed from "#controllers/signed.controller.js"
import related from "#controllers/related.controller.js"

import {
  getHashValidator,
  postHashValidator,
  getSignedValidator,
  postSignedValidator,
} from "#validators/index.js";

const hashMessageSizeLimit = process.env.HASH_MESSAGE_SIZE_LIMIT;
const signedMessageSizeLimit = process.env.SIGNED_MESSAGE_SIZE_LIMIT;

export default app => {

  var router = Router();

  app.use("/hash/*", express.raw({limit: hashMessageSizeLimit, type: ["application/*", "text/*"]}));
  router.post("/hash/:hashFunction/:hashValue", postHashValidator, hash.create);
  router.get("/hash/:hashFunction/:hashValue", getHashValidator, hash.findByHash);

  app.use("/signed/*", express.json({limit: signedMessageSizeLimit, type: ["application/json", "text/*"]}));
  router.post("/signed/:urlSignFunction/:urlPublicKey", postSignedValidator, signed.create);
  router.get("/signed/:signFunction/:publicKey/*", getSignedValidator, signed.findAll);

  router.get("/related/:hashFunction/:hashValue", getHashValidator, related.findAllRelatedToHash);
  router.get("/related/:signFunction/:publicKey/*", getSignedValidator, related.findAllRelatedToSigned);

  app.use("/", router);
};
