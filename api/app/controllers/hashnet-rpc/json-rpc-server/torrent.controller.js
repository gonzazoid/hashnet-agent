import path from "node:path";
import WebTorrent from "webtorrent";

import db from "#models/index.js";
import parseTorrent from './parse-torrent.js';

const client = new WebTorrent()

const filesDirectory = process.env.FILES_DIRECTORY;

const ChunkMessage = db.chunkMessages;

const startDownloadingTorrent = url => {
  console.log("START DOWNLOADING!!!", url, filesDirectory);
  // TODO use files volume, from .env
  return client.add(url, { path: path.join(filesDirectory, "torrents") }, torrent => {
    torrent.on('done', () => {
      console.log('torrent download finished')
      const torrentFile = torrent.torrentFile;
      parseTorrent(torrentFile)
        .then(info => {
          console.log(info);
          const {
            files,
            length,
            pieceLength,
            lastPieceLength,
            pieces,
          } = info;
          // TODO check disk space
          const chunks = pieces.map((hash, i) => {
            const startOffset = i * pieceLength;
            const thisChunkLength = i < (pieces.length - 1) ? pieceLength : lastPieceLength;
            const endOffset = startOffset + thisChunkLength - 1;
            const range = [startOffset, endOffset];
            const _files = files
              .filter(file => {
                const fileEnd = file.offset + file.length - 1;
                const overlap = startOffset <= fileEnd && file.offset <= endOffset;
                return overlap;
              })
              .map(file => ({ ...file, path: path.join("torrents", file.path) }));
            return {
              hash: `sha1:${hash}`,
              range,
              files: _files,
            };
          });
          console.log("CHUNKS!!!");
          console.dir(chunks.filter(chunk => chunk.files.length > 1), { depth: null });
          chunks.forEach(chunk => {
            const message = new ChunkMessage(chunk);
            console.log("SAVE MESSAGE!!!", message);
            // Save Message in the database
            message 
              .save(/* message */)
              .then(data => {})
              .catch(err => {
                console.log("ERROR!!!", err);
              });
          });
          torrent.destroy();
        });
    });
    torrent.on('download', bytes => {
      console.log('just downloaded: ' + bytes)
      console.log('total downloaded: ' + torrent.downloaded)
      console.log('download speed: ' + torrent.downloadSpeed)
      console.log('progress: ' + torrent.progress)
    });
  });
};

const addTorrentByMagnetUrl = (magnetUrl) => {
  console.log("BY MAGNET!!!!", magnetUrl);
  return startDownloadingTorrent(magnetUrl);
};

const controller = {
  addTorrentByMagnetUrl,
}

export default controller;
