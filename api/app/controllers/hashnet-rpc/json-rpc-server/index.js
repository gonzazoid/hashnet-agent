import { JSONRPCServer } from "json-rpc-2.0";
import torrentController from "./torrent.controller.js";

const server = new JSONRPCServer();

server.addMethod("add-torrent-by-magnet-url", ({ magnetUrl }) => torrentController.addTorrentByMagnetUrl(magnetUrl));

export default server;
