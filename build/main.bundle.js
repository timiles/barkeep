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
    var startBarkeepButton = document.getElementById('startBarkeep');
    var recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

    startBarkeepButton.onclick = function () {
        var songPlayer = void 0;
        var fileLoader = new _fileLoader2.default();
        fileLoader.loadByUrl(songUrlInput.value).then(function (fileData) {
            songPlayer = new _songPlayer2.default(fileData, beatsPerMinuteInput.value, beatsPerBarInput.value);
            songPlayer.init().then(function () {
                songPlayer.play();
            });
        });

        var onNumberRecognised = function onNumberRecognised(n) {
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
    function SongPlayer(fileData, bpm, beatsPerBar) {
        var _this = this;

        _classCallCheck(this, SongPlayer);

        this.fileData = fileData;
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar;
        this.secondsPerBar = this.beatsPerBar * 60 / this.bpm;

        this.init = function () {
            return new Promise(function (resolve, reject) {
                _this.context = new (window.AudioContext || window.webkitAudioContext)();

                var self = _this;
                _this.context.decodeAudioData(_this.fileData, function (buffer) {
                    self.buffer = buffer;
                    resolve();
                }, function (e) {
                    console.error(e);
                    reject();
                });
            });
        };
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

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map