/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _bufferLoader = __webpack_require__(5);

var _bufferLoader2 = _interopRequireDefault(_bufferLoader);

var _fileLoader = __webpack_require__(1);

var _fileLoader2 = _interopRequireDefault(_fileLoader);

var _numberRecogniser = __webpack_require__(2);

var _numberRecogniser2 = _interopRequireDefault(_numberRecogniser);

var _songPlayer = __webpack_require__(3);

var _songPlayer2 = _interopRequireDefault(_songPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_numberRecogniser2.default.checkCompatibility()) {
    init();
}

function init() {
    var songUrlInput = document.getElementById('songUrl');
    var beatsPerMinuteInput = document.getElementById('beatsPerMinute');
    var beatsPerBarInput = document.getElementById('beatsPerBar');
    var playbackRateInput = document.getElementById('playbackRate');
    var startBarkeepButton = document.getElementById('startBarkeep');
    var loadingSampleProgressBar = document.getElementById('loadingSampleProgressBar');
    var jumpToBarNumberInput = document.getElementById('jumpToBarNumber');
    var jumpToBarButton = document.getElementById('jumpToBarButton');
    var recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

    startBarkeepButton.onclick = function () {
        var songPlayer = void 0;
        var fileLoader = new _fileLoader2.default();
        var playbackRate = Number.parseInt(playbackRateInput.value) / 100;
        fileLoader.loadByUrl(songUrlInput.value).then(function (fileData) {
            return _bufferLoader2.default.loadBuffer(fileData, playbackRate, function (p) {
                console.log(p);
            });
        }).then(function (buffer) {
            songPlayer = new _songPlayer2.default(buffer, playbackRate, beatsPerMinuteInput.value, beatsPerBarInput.value);
            songPlayer.play();
        });

        jumpToBarButton.onclick = function (e) {
            songPlayer.play(Number.parseInt(jumpToBarNumberInput.value));
        };
        var onNumberRecognised = function onNumberRecognised(n) {
            recognisedNumberDisplayElement.innerHTML = n;
            recognisedNumberDisplayElement.innerHTML = n;
            recognisedNumberDisplayElement.innerHTML = n;
            songPlayer.play(n);
        };
        var numberRecogniser = new _numberRecogniser2.default(onNumberRecognised);
        numberRecogniser.startListening();
    };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileLoader = function () {
    function FileLoader() {
        _classCallCheck(this, FileLoader);
    }

    _createClass(FileLoader, [{
        key: 'loadByUrl',
        value: function loadByUrl(url) {
            return new Promise(function (resolve, reject) {
                var _this = this;

                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    resolve(request.response);
                };
                request.onerror = function () {
                    reject({
                        status: _this.status,
                        statusText: request.statusText
                    });
                };
                request.send();
            });
        }
    }]);

    return FileLoader;
}();

exports.default = FileLoader;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NumberRecogniser = function () {
    function NumberRecogniser(onNumberRecognised) {
        _classCallCheck(this, NumberRecogniser);

        this.onNumberRecognised = onNumberRecognised;
    }

    _createClass(NumberRecogniser, [{
        key: 'startListening',
        value: function startListening() {
            var _this = this;

            var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            // recognition.continuous = true;
            // TODO: other languages?
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 5;
            recognition.start();

            recognition.onaudioend = function (ev) {
                // start listening again after audio ends
                _this.startListening();
            };

            recognition.onresult = function (ev) {
                var results = ev.results[0];
                for (var i = 0; i < results.length; i++) {
                    var candidateNumber = Number.parseInt(results[i].transcript);
                    if (!Number.isNaN(candidateNumber) && Number.isFinite(candidateNumber)) {
                        _this.onNumberRecognised(candidateNumber);
                        // keep listening for more
                        _this.startListening();
                        break;
                    }
                }
            };
        }
    }], [{
        key: 'checkCompatibility',
        value: function checkCompatibility() {
            if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
                alert('SpeechRecognition is not supported. Please use a compatible browser, eg Chrome.');
                return false;
            }
            var isLocalhost = location.host.startsWith('localhost');
            if (isLocalhost) {
                return true;
            }
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome && location.protocol !== 'https:') {
                alert('Chrome requires https for SpeechRecognition. Redirecting now!');
                location.protocol = 'https:';
                return false;
            }
            return true;
        }
    }]);

    return NumberRecogniser;
}();

exports.default = NumberRecogniser;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SongPlayer = function () {
    function SongPlayer(buffer, bufferRate, bpm, beatsPerBar) {
        _classCallCheck(this, SongPlayer);

        this.buffer = buffer;
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar;
        this.secondsPerBar = this.beatsPerBar * 60 / (bufferRate * bpm);
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    _createClass(SongPlayer, [{
        key: "play",
        value: function play(barNumber) {
            this.stop();
            var source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.context.destination);
            var startTime = this.getStartTimeInSeconds(barNumber || 0);
            source.start(0, startTime);
            this.currentSource = source;
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.currentSource) {
                this.currentSource.stop();
            }
        }
    }, {
        key: "getStartTimeInSeconds",
        value: function getStartTimeInSeconds(barNumber) {
            var startTimeInSeconds = (barNumber - 1) * this.secondsPerBar;
            return Math.max(0, startTimeInSeconds);
        }
    }]);

    return SongPlayer;
}();

exports.default = SongPlayer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!function (e) {
  function t(i) {
    if (r[i]) return r[i].exports;var n = r[i] = { exports: {}, id: i, loaded: !1 };return e[i].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports;
  }var r = {};return t.m = e, t.c = r, t.p = "", t(0);
}([function (e, t, r) {
  e.exports = r(1);
}, function (e, t, r) {
  function i(e) {
    return Math.floor(e);
  }var n = r(2),
      s = function () {
    function e() {
      this.is_initialized = !1, this.sample_rate = 44100, this.channels = 0, this.quick_search = !1, this.factor = 0, this.search = 0, this.segment = 0, this.overlap = 0, this.process_size = 0, this.samples_in = 0, this.samples_out = 0, this.segments_total = 0, this.skip_total = 0;
    }return e;
  }(),
      o = function () {
    function e(e) {
      var t = new s();t.channels = e, t.input_fifo = new n(Float32Array), t.output_fifo = new n(Float32Array), this.t = t;
    }return e.prototype.difference = function (e, t, r) {
      for (var i = 0, n = 0, n = 0; r > n; n++) {
        i += Math.pow(e[n] - t[n], 2);
      }return i;
    }, e.prototype.tempo_best_overlap_position = function (e, t) {
      var r,
          i,
          n,
          s = e.overlap_buf,
          o = e.search + 1 >>> 1,
          a = 64,
          p = i = e.quick_search ? o : 0,
          u = this.difference(t.subarray(e.channels * p), s, e.channels * e.overlap),
          f = 0;if (e.quick_search) {
        do {
          for (f = -1; 1 >= f; f += 2) {
            for (r = 1; (4 > r || 64 == a) && (p = o + f * r * a, !(0 > p || p >= e.search)); r++) {
              n = this.difference(t.subarray(e.channels * p), s, e.channels * e.overlap), u > n && (u = n, i = p);
            }
          }o = i;
        } while (a >>>= 2);
      } else for (p = 1; p < e.search; p++) {
        n = this.difference(t.subarray(e.channels * p), s, e.channels * e.overlap), u > n && (u = n, i = p);
      }return i;
    }, e.prototype.tempo_overlap = function (e, t, r, i) {
      var n = 0,
          s = 0,
          o = 0,
          a = 1 / e.overlap;for (n = 0; n < e.overlap; n++) {
        var p = a * n,
            u = 1 - p;for (s = 0; s < e.channels; s++, o++) {
          i[o] = t[o] * u + r[o] * p;
        }
      }
    }, e.prototype.process = function () {
      for (var e = this.t; e.input_fifo.occupancy() >= e.process_size;) {
        var t, r;e.segments_total ? (r = this.tempo_best_overlap_position(e, e.input_fifo.read_ptr(0)), this.tempo_overlap(e, e.overlap_buf, e.input_fifo.read_ptr(e.channels * r), e.output_fifo.write_ptr(e.overlap))) : (r = e.search / 2, e.output_fifo.write(e.input_fifo.read_ptr(e.channels * r, e.overlap), e.overlap)), e.output_fifo.write(e.input_fifo.read_ptr(e.channels * (r + e.overlap)), e.segment - 2 * e.overlap);var n = e.channels * e.overlap;e.overlap_buf.set(e.input_fifo.read_ptr(e.channels * (r + e.segment - e.overlap)).subarray(0, n)), e.segments_total++, t = i(e.factor * (e.segment - e.overlap) + .5), e.input_fifo.read(null, t);
      }
    }, e.prototype.input = function (e, t, r) {
      void 0 === t && (t = null), void 0 === r && (r = 0), null == t && (t = e.length);var i = this.t;i.samples_in += t, i.input_fifo.write(e, t);
    }, e.prototype.output = function (e) {
      var t = this.t,
          r = Math.min(e.length, t.output_fifo.occupancy());return t.samples_out += r, t.output_fifo.read(e, r), r;
    }, e.prototype.flush = function () {
      var e = this.t,
          t = i(e.samples_in / e.factor + .5),
          r = t > e.samples_out ? t - e.samples_out : 0,
          n = new Float32Array(128 * e.channels);if (r > 0) {
        for (; e.output_fifo.occupancy() < r;) {
          this.input(n, 128), this.process();
        }e.samples_in = 0;
      }
    }, e.prototype.setup = function (t, r, n, s, o, a) {
      void 0 === n && (n = !1), void 0 === s && (s = null), void 0 === o && (o = null), void 0 === a && (a = null);var p = 1,
          u = this.t;u.sample_rate = t, null == s && (s = Math.max(10, e.segments_ms[p] / Math.max(Math.pow(r, e.segments_pow[p]), 1))), null == o && (o = s / e.searches_div[p]), null == a && (a = s / e.overlaps_div[p]);var f;if (u.quick_search = n, u.factor = r, u.segment = i(t * s / 1e3 + .5), u.search = i(t * o / 1e3 + .5), u.overlap = Math.max(i(t * a / 1e3 + 4.5), 16), 2 * u.overlap > u.segment && (u.overlap -= 8), u.is_initialized) {
        var h = new Float32Array(u.overlap * u.channels),
            l = 0;u.overlap * u.channels < u.overlap_buf.length && (l = u.overlap_buf.length - u.overlap * u.channels), h.set(u.overlap_buf.subarray(l, u.overlap_buf.length)), u.overlap_buf = h;
      } else u.overlap_buf = new Float32Array(u.overlap * u.channels);f = i(Math.ceil(r * (u.segment - u.overlap))), u.process_size = Math.max(f + u.overlap, u.segment) + u.search, u.is_initialized || u.input_fifo.reserve(i(u.search / 2)), u.is_initialized = !0;
    }, e.prototype.setTempo = function (e) {
      var t = this.t;this.setup(t.sample_rate, e, t.quick_search);
    }, e.segments_ms = [82, 82, 35, 20], e.segments_pow = [0, 1, .33, 1], e.overlaps_div = [6.833, 7, 2.5, 2], e.searches_div = [5.587, 6, 2.14, 2], e;
  }();window && (window.Kali = o), e.exports = o;
}, function (e, t) {
  var r = function () {
    function e(e) {
      this.begin = 0, this.end = 0, this.typedArrayConstructor = e, this.buffer = new e(16384);
    }return e.prototype.clear = function () {
      this.begin = this.end = 0;
    }, e.prototype.reserve = function (e) {
      for (this.begin == this.end && this.clear();;) {
        if (this.end + e < this.buffer.length) {
          var t = this.end;return this.end += e, t;
        }if (this.begin > 16384) this.buffer.set(this.buffer.subarray(this.begin, this.end)), this.end -= this.begin, this.begin = 0;else {
          var r = new this.typedArrayConstructor(this.buffer.length + e);r.set(this.buffer), this.buffer = r;
        }
      }
    }, e.prototype.write = function (e, t) {
      var r = this.reserve(t);this.buffer.set(e.subarray(0, t), r);
    }, e.prototype.write_ptr = function (e) {
      var t = this.reserve(e);return this.buffer.subarray(t, t + e);
    }, e.prototype.read = function (e, t) {
      t + this.begin > this.end && console.error("Read out of bounds", t, this.end, this.begin), null != e && e.set(this.buffer.subarray(this.begin, this.begin + t)), this.begin += t;
    }, e.prototype.read_ptr = function (e, t) {
      return void 0 === t && (t = -1), t > this.occupancy() && console.error("Read Pointer out of bounds", t), 0 > t && (t = this.occupancy()), this.buffer.subarray(this.begin + e, this.begin + t);
    }, e.prototype.occupancy = function () {
      return this.end - this.begin;
    }, e;
  }();e.exports = r;
}]);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BufferLoader = function () {
    function BufferLoader() {
        _classCallCheck(this, BufferLoader);
    }

    _createClass(BufferLoader, null, [{
        key: 'loadBuffer',
        value: function loadBuffer(fileData) {
            var playbackRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;
            var progressCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            return new Promise(function (resolve, reject) {
                var context = new (window.AudioContext || window.webkitAudioContext)();

                context.decodeAudioData(fileData, function (buffer) {
                    var stretchedBuffer = BufferLoader._stretch(context, buffer, playbackRate, 2, false, progressCallback);
                    resolve(stretchedBuffer);
                }, function (e) {
                    console.error(e);
                    reject();
                });
            });
        }
    }, {
        key: '_stretch',
        value: function _stretch(context, buffer, playbackRate, numChannels, bestQuality, progressCallback) {

            if (playbackRate === 1.0) {
                return buffer;
            }

            var stretchSampleSize = 4096 * numChannels;

            var inputBufferSize = buffer.getChannelData(0).length;
            var outputBufferSize = Math.floor(inputBufferSize / playbackRate) + 1;

            var outputAudioBuffer = context.createBuffer(numChannels, outputBufferSize, context.sampleRate);

            for (var channel = 0; channel < numChannels; channel++) {
                var inputData = buffer.getChannelData(channel);

                var kali = new Kali(1);
                kali.setup(context.sampleRate, playbackRate, !bestQuality);

                var outputData = new Float32Array(outputBufferSize);

                var inputOffset = 0;
                var completedOffset = 0;
                var loopCount = 0;
                var flushed = false;

                while (completedOffset < outputData.length) {
                    if (progressCallback && loopCount % 100 === 0) {
                        progressCallback((completedOffset + outputBufferSize * channel) / (outputBufferSize * numChannels));
                    }

                    // Read stretched samples into outputData array
                    completedOffset += kali.output(outputData.subarray(completedOffset, Math.min(completedOffset + stretchSampleSize, outputData.length)));

                    if (inputOffset < inputData.length) {
                        // If we have more data to write, write it
                        var dataToInput = inputData.subarray(inputOffset, Math.min(inputOffset + stretchSampleSize, inputData.length));
                        inputOffset += dataToInput.length;

                        kali.input(dataToInput);
                        kali.process();
                    } else if (!flushed) {
                        kali.flush();
                        flushed = true;
                    }

                    loopCount++;
                }

                outputAudioBuffer.getChannelData(channel).set(outputData);
            }

            if (progressCallback) {
                // 100%
                progressCallback(1);
            }
            return outputAudioBuffer;
        }
    }]);

    return BufferLoader;
}();

exports.default = BufferLoader;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map