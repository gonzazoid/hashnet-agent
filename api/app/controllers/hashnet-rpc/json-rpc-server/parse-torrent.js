/*! parse-torrent. MIT License. WebTorrent LLC <https://webtorrent.io/opensource> */

import bencode from 'bencode'
import path from 'path'
import { /* hash, */ arr2hex, arr2text } from 'uint8-util'
// import queueMicrotask from 'queue-microtask'

/**
 * Parse a .torrent file
 * @param  {ArrayBufferView} torrentId
 * @return {Object}
 */
async function parseTorrent (torrentId) {
  if (ArrayBuffer.isView(torrentId)) {
    // if .torrent file (buffer)
    return await decodeTorrentFile(torrentId) // might throw
  } else {
    throw new Error('Invalid torrent identifier')
  }
}

/**
 * Parse a torrent. Throws an exception if the torrent is missing required fields.
 * @param  {ArrayBufferView|Object} torrent
 * @return {Object}        parsed torrent
 */
async function decodeTorrentFile (torrent) {
  if (ArrayBuffer.isView(torrent)) {
    torrent = bencode.decode(torrent)
  }

  // sanity check
  ensure(torrent.info, 'info')
  ensure(torrent.info['name.utf-8'] || torrent.info.name, 'info.name')
  ensure(torrent.info['piece length'], 'info[\'piece length\']')
  ensure(torrent.info.pieces, 'info.pieces')

  if (torrent.info.files) {
    torrent.info.files.forEach(file => {
      ensure(typeof file.length === 'number', 'info.files[0].length')
      ensure(file['path.utf-8'] || file.path, 'info.files[0].path')
    })
  } else {
    ensure(typeof torrent.info.length === 'number', 'info.length')
  }

  const result = {
    info: torrent.info,
    infoBuffer: bencode.encode(torrent.info),
    name: arr2text(torrent.info['name.utf-8'] || torrent.info.name),
    announce: []
  }

  // result.infoHashBuffer = await hash(result.infoBuffer)
  // result.infoHash = arr2hex(result.infoHashBuffer)

  if (torrent.info.private !== undefined) result.private = !!torrent.info.private

  if (torrent['creation date']) result.created = new Date(torrent['creation date'] * 1000)
  if (torrent['created by']) result.createdBy = arr2text(torrent['created by'])

  if (ArrayBuffer.isView(torrent.comment)) result.comment = arr2text(torrent.comment)

  // announce and announce-list will be missing if metadata fetched via ut_metadata
  if (Array.isArray(torrent['announce-list']) && torrent['announce-list'].length > 0) {
    torrent['announce-list'].forEach(urls => {
      urls.forEach(url => {
        result.announce.push(arr2text(url))
      })
    })
  } else if (torrent.announce) {
    result.announce.push(arr2text(torrent.announce))
  }

  // handle url-list (BEP19 / web seeding)
  if (ArrayBuffer.isView(torrent['url-list'])) {
    // some clients set url-list to empty string
    torrent['url-list'] = torrent['url-list'].length > 0
      ? [torrent['url-list']]
      : []
  }
  result.urlList = (torrent['url-list'] || []).map(url => arr2text(url))

  // remove duplicates by converting to Set and back
  result.announce = Array.from(new Set(result.announce))
  result.urlList = Array.from(new Set(result.urlList))

  const files = torrent.info.files || [torrent.info]
  result.files = files.map((file, i) => {
    const parts = [].concat(result.name, file['path.utf-8'] || file.path || []).map(p => ArrayBuffer.isView(p) ? arr2text(p) : p)
    return {
      path: path.join.apply(null, [path.sep].concat(parts)).slice(1),
      name: parts[parts.length - 1],
      length: file.length,
      offset: files.slice(0, i).reduce(sumLength, 0)
    }
  })

  result.length = files.reduce(sumLength, 0)

  const lastFile = result.files[result.files.length - 1]

  result.pieceLength = torrent.info['piece length']
  result.lastPieceLength = ((lastFile.offset + lastFile.length) % result.pieceLength) || result.pieceLength
  result.pieces = splitPieces(torrent.info.pieces)

  return result
}

function sumLength (sum, file) {
  return sum + file.length
}

function splitPieces (buf) {
  const pieces = []
  for (let i = 0; i < buf.length; i += 20) {
    pieces.push(arr2hex(buf.slice(i, i + 20)))
  }
  return pieces
}

function ensure (bool, fieldName) {
  if (!bool) throw new Error(`Torrent is missing required field: ${fieldName}`)
}

export default parseTorrent
