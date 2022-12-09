"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fingerprint;

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var _crypto = require("crypto");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 */
function fingerprint(file, options) {
  if (Buffer.isBuffer(file)) {
    // create MD5 hash for buffer type
    var blockSize = 64 * 1024; // 64kb

    var content = file.slice(0, Math.min(blockSize, file.length));
    var hash = (0, _crypto.createHash)('md5').update(content).digest('hex');
    var ret = ['node-buffer', hash, file.length, options.endpoint].join('-');
    return Promise.resolve(ret);
  }

  if (file instanceof fs.ReadStream && file.path != null) {
    return new Promise(function (resolve, reject) {
      var name = path.resolve(file.path);
      fs.stat(file.path, function (err, info) {
        if (err) {
          reject(err);
          return;
        }

        var ret = ['node-file', name, info.size, info.mtime.getTime(), options.endpoint].join('-');
        resolve(ret);
      });
    });
  } // fingerprint cannot be computed for file input type


  return Promise.resolve(null);
}