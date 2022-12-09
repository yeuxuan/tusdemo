function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var BufferSource = /*#__PURE__*/function () {
  function BufferSource(buffer) {
    _classCallCheck(this, BufferSource);

    this._buffer = buffer;
    this.size = buffer.length;
  }

  _createClass(BufferSource, [{
    key: "slice",
    value: function slice(start, end) {
      var value = this._buffer.slice(start, end);

      value.size = value.length;
      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {}
  }]);

  return BufferSource;
}();

export { BufferSource as default };