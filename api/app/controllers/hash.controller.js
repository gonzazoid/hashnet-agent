import path from "node:path";
import { createHash } from 'node:crypto';

import { validationResult, matchedData } from "express-validator"; // hashnet-validator!
import fs from "fs-extra";
import getFolderSize from "get-folder-size";
import bytes from "bytes";

import db from "#models/index.js";
import hashResolver from "#resolvers/hash.resolver.js";

const serialize = db.mongoose.mongo.BSON.serialize;
const HashMessage = db.hashMessages;
const ChunkMessage = db.chunkMessages;

const filesSizeLimit = BigInt(bytes.parse(process.env.FILES_DIRECTORY_SIZE_LIMIT));
const filesDirectory = process.env.FILES_DIRECTORY;

const dbSizeLimit = BigInt(bytes.parse(process.env.MONGODB_SIZE_LIMIT));
const hashMessageMaxSizeStoredInDb = BigInt(bytes.parse(process.env.HASH_MESSAGE_MAX_SIZE_STORED_IN_DB));

const getPathForHashMessage = (hashFunction, hashValue) => {
  const prefix = hashValue.substring(0, 4);
  const rest = hashValue.substring(4);
  return {
    absolute: path.join(filesDirectory, hashFunction, prefix, rest),
    relative: path.join(hashFunction, prefix, rest)
  };
};

// TODO make it async
const checkHash = (file, hashFunc, hashValue) => hashValue === createHash(hashFunc).update(file).digest('hex');

const create = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("ILLEGAL REQUEST!!!", result.array());
    res.sendStatus(400);
    return;
  }

  const data = matchedData(req);
  const {
    "" : file,
    hashFunction,
    hashValue,
  } = data;

  const hash = `${hashFunction}:${hashValue}`;
  const condition = { hash };

  hashResolver.isHashExists(hash)
    .then(exists => {
      if (exists) return;
      const mongoDb = db.mongoose.connection.db;
      mongoDb.stats({ freeStorage: 1 })
        .then((stats) => {
          const {
            totalSize,
            totalFreeStorageSize,
          } = stats;
          const totalFree = totalFreeStorageSize || 0;
          const freeSpace = dbSizeLimit - BigInt((totalSize - totalFree));

          if (!checkHash(file, hashFunction, hashValue)) throw new Error();
          if (BigInt(file.byteLength) > hashMessageMaxSizeStoredInDb) {
            // TODO take into account the block size
            return getFolderSize.strict(filesDirectory, { bigint: true })
              .then(bytes => {
                if (bytes + BigInt(file.byteLength) > filesSizeLimit) throw new Error();

                const { absolute, relative } = getPathForHashMessage(hashFunction, hashValue);
                const chunkMessage = {
                  hash: id,
                  range: [0, file.byteLength - 1],
                  files: [{
                    path: relative,
                    length: file.byteLength,
                    offset: 0,
                  }]
                };
                const message = new ChunkMessage(chunkMessage);
                if (BigInt(serialize(message).byteLength) > freeSpace) throw new Error();

                return fs.outputFile(absolute, file)
                  .then(() => message.save())
              });
          }
         
          const message = new HashMessage({
            hash,
            file,
          });
          if (BigInt(serialize(message).byteLength) > freeSpace) throw new Error();
          return message.save();
        });
    })
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
};

const findByHash = (req, res) => {
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

  const hash = `${hashFunction}:${hashValue}`;
  hashResolver.findByHash(hash)
    .then(file => file ? res.status(200).send(file) : res.sendStatus(404))
    .catch(() => res.sendStatus(500))
};

const controller = {
  create,
  findByHash,
}

export default controller;
