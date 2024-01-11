import path from "node:path";
import fs from "fs-extra";
import MultiStream from "multistream";

import db from "#models/index.js";

const HashMessage = db.hashMessages;
const ChunkMessage = db.chunkMessages;

const filesDirectory = process.env.FILES_DIRECTORY;

const stream2buffer = (stream) => {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
};

const resolvePath = relativePath => path.join(filesDirectory, relativePath);

const findByHash = (hash) => {
  const condition = { hash };

  return HashMessage.find(condition)
    .then(data => {
      if (data.length > 0) {
        const fileDesc = data[0];
        const { file } = fileDesc;
        return file;
      }

      return ChunkMessage.find(condition)
        .then(data => {
          if (data.length == 0) return null;
          else {
            const streams = data[0].files.map(fdesc => {
              const {
                path: relativePath,
                length,
                offset,
		          } = fdesc;
              const filePath = resolvePath(relativePath);
              const start = offset < data[0].range[0] ? data[0].range[0] - offset : 0;
              const end = offset + length - 1 < data[0].range[1] ? Infinity : data[0].range[1] - offset;
              return fs.createReadStream(filePath, { start, end });
	          });
            const resultStream = new MultiStream(streams);
            return stream2buffer(resultStream);
          }
        });
    })
};

const isHashExists = hash => HashMessage
    .find({ hash })
    .then(data => data.length > 0 ? true : ChunkMessage.find(condition).then(data => data.length > 0));

const resolver = {
  findByHash,
  isHashExists
}

export default resolver;
