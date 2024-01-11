import { validationResult, matchedData } from "express-validator"; // hashnet-validator!

import db from "#models/index.js";

const SignedMessage = db.signedMessages;

const findAllRelatedToHash = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.sendStatus(400);
    return;
  }

  const data = matchedData(req);
  const {
    hashFunction,
    hashValue,
  } = data;

  const url = `hash://${hashFunction}/${hashValue}`;

  const condition = { relatedTo: url };
  SignedMessage.find(condition)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500));
};

const findAllRelatedToSigned = (req, res) => {
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

  const url = `signed://${signFunction}/${publicKey}/${label}`;

  const condition = { relatedTo: url };
  SignedMessage.find(condition)
    .then(data => res.status(200).json(data))
    .catch(() => res.sendStatus(500));
};

const controller = {
  findAllRelatedToHash,
  findAllRelatedToSigned,
}

export default controller;
