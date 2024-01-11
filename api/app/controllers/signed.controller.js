import { validationResult, matchedData } from "express-validator";
import bytes from "bytes";

import db from "#models/index.js";

import { isHashNetRPCMessage, hashNetRPC } from "./hashnet-rpc/index.js";

const serialize = db.mongoose.mongo.BSON.serialize;
const SignedMessage = db.signedMessages;

const dbSizeLimit = BigInt(bytes.parse(process.env.MONGODB_SIZE_LIMIT));

const create = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.sendStatus(400);
    return;
  }

  const data = matchedData(req);
  const {
    hash,
    label,
    nonce,
    relatedTo,
    publicKey,
    signature,
  } = data;

  const rawMessage = {
    hash,
    label,
    nonce,
    publicKey,
    signature,
  };

  if (relatedTo) rawMessage.relatedTo = relatedTo;

  const mongoDb = db.mongoose.connection.db;
  mongoDb.stats({ freeStorage: 1 })
    .then((stats) => {
      const {
        totalSize,
        totalFreeStorageSize,
      } = stats;
      const totalFree = totalFreeStorageSize || 0;
      const freeSpace = dbSizeLimit - BigInt(totalSize - totalFree);

      const message = new SignedMessage(rawMessage);
      // may be calculateObjectSize is more appropriate
      if (BigInt(serialize(message).byteLength) > freeSpace) throw new Error();

      return SignedMessage.find(rawMessage)
        .then(data => {
          if (data.length > 0) return;
          return isHashNetRPCMessage(rawMessage) ? hashNetRPC(req, res, message) : message.save();
        });
    })
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
};

const findAll = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.sendStatus(400);
    return;
  }

  const data = matchedData(req);
  const {
    "0": label,
    signFunction,
    publicKey,
  } = data;

  const condition = {
    label: `/${label}`,
    publicKey: `${signFunction}:${publicKey}`
  };

  SignedMessage.find(condition)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500));
};

const controller = {
  create,
  findAll,
}

export default controller;
