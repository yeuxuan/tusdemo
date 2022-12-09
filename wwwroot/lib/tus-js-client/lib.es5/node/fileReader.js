"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _isStream = _interopRequireDefault(require("is-stream"));

var _BufferSource = _interopRequireDefault(require("./sources/BufferSource.js"));

var _FileSource = _interopRequireDefault(require("./sources/FileSource.js"));

var _StreamSource = _interopRequireDefault(require("./sources/StreamSource.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      if (Buffer.isBuffer(input)) {
        return Promise.resolve(new _BufferSource.default(input));
      }

      if (input instanceof _fs.ReadStream && input.path != null) {
        return (0, _FileSource.default)(input);
      }

      if (_isStream.default.readable(input)) {
        chunkSize = Number(chunkSize);

        if (!Number.isFinite(chunkSize)) {
          return Promise.reject(new Error('cannot create source for stream without a finite value for the `chunkSize` option; specify a chunkSize to control the memory consumption'));
        }

        return Promise.resolve(new _StreamSource.default(input));
      }

      return Promise.reject(new Error('source object may only be an instance of Buffer or Readable in this environment'));
    }
  }]);

  return FileReader;
}();

exports.default = FileReader;