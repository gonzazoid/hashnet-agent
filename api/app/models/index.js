import mongoose from "mongoose";

import dbConfig from "#config/db.config.js";

import hashModel from "./hash.message.model.js";
import chunkModel from "./chunk.message.model.js";
import signedModel from "./signed.message.model.js";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.hashMessages = hashModel(mongoose);
db.chunkMessages = chunkModel(mongoose);
db.signedMessages = signedModel(mongoose);

export default db;
