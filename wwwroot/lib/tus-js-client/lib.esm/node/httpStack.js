function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* eslint-disable max-classes-per-file, node/no-deprecated-api */
// The url.parse method is superseeded by the url.URL constructor,
// but it is still included in Node.js
import * as http from 'http';
import * as https from 'https';
import { parse } from 'url';
import { Readable, Transform } from 'stream';
import throttle from 'lodash.throttle';

var NodeHttpStack = /*#__PURE__*/function () {
  function NodeHttpStack() {
    var requestOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NodeHttpStack);

    this._requestOptions = requestOptions;
  }

  _createClass(NodeHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url, this._requestOptions);
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'NodeHttpStack';
    }
  }]);

  return NodeHttpStack;
}();

export { NodeHttpStack as default };

var Request = /*#__PURE__*/function () {
  function Request(method, url, options) {
    _classCallCheck(this, Request);

    this._method = method;
    this._url = url;
    this._headers = {};
    this._request = null;

    this._progressHandler = function () {};

    this._requestOptions = options || {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      this._progressHandler = progressHandler;
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        var options = _objectSpread(_objectSpread(_objectSpread({}, parse(_this._url)), _this._requestOptions), {}, {
          method: _this._method,
          headers: _objectSpread(_objectSpread({}, _this._requestOptions.headers || {}), _this._headers)
        });

        if (body && body.size) {
          options.headers['Content-Length'] = body.size;
        }

        var httpModule = options.protocol === 'https:' ? https : http;
        _this._request = httpModule.request(options);
        var req = _this._request;
        req.on('response', function (res) {
          var resChunks = [];
          res.on('data', function (data) {
            resChunks.push(data);
          });
          res.on('end', function () {
            var responseText = Buffer.concat(resChunks).toString('utf8');
            resolve(new Response(res, responseText));
          });
        });
        req.on('error', function (err) {
          reject(err);
        });

        if (body instanceof Readable) {
          body.pipe(new ProgressEmitter(_this._progressHandler)).pipe(req);
        } else {
          req.end(body);
        }
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this._request !== null) this._request.abort();
      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._request;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(res, body) {
    _classCallCheck(this, Response);

    this._response = res;
    this._body = body;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._response.statusCode;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._response.headers[header.toLowerCase()];
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._body;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._response;
    }
  }]);

  return Response;
}(); // ProgressEmitter is a simple PassThrough-style transform stream which keeps
// track of the number of bytes which have been piped through it and will
// invoke the `onprogress` function whenever new number are available.


var ProgressEmitter = /*#__PURE__*/function (_Transform) {
  _inherits(ProgressEmitter, _Transform);

  var _super = _createSuper(ProgressEmitter);

  function ProgressEmitter(onprogress) {
    var _this2;

    _classCallCheck(this, ProgressEmitter);

    _this2 = _super.call(this); // The _onprogress property will be invoked, whenever a chunk is piped
    // through this transformer. Since chunks are usually quite small (64kb),
    // these calls can occur frequently, especially when you have a good
    // connection to the remote server. Therefore, we are throtteling them to
    // prevent accessive function calls.

    _this2._onprogress = throttle(onprogress, 100, {
      leading: true,
      trailing: false
    });
    _this2._position = 0;
    return _this2;
  }

  _createClass(ProgressEmitter, [{
    key: "_transform",
    value: function _transform(chunk, encoding, callback) {
      this._position += chunk.length;

      this._onprogress(this._position);

      callback(null, chunk);
    }
  }]);

  return ProgressEmitter;
}(Transform);