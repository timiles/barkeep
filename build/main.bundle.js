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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SongInfo = function () {
    function SongInfo(bpm, beatsPerBar, playbackSpeed) {
        _classCallCheck(this, SongInfo);

        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar || 4;
        this.playbackSpeed = playbackSpeed || 1.0;
    }

    _createClass(SongInfo, null, [{
        key: "fromObject",
        value: function fromObject(song) {
            return new SongInfo(song.bpm, song.beatsPerBar, song.playbackSpeedPercent / 100);
        }
    }]);

    return SongInfo;
}();

exports.default = SongInfo;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fileHelpers = __webpack_require__(2);

var _fileHelpers2 = _interopRequireDefault(_fileHelpers);

var _playlistManager = __webpack_require__(3);

var _playlistManager2 = _interopRequireDefault(_playlistManager);

var _songFile = __webpack_require__(9);

var _songFile2 = _interopRequireDefault(_songFile);

var _songInfo = __webpack_require__(0);

var _songInfo2 = _interopRequireDefault(_songInfo);

var _songLibrary = __webpack_require__(10);

var _songLibrary2 = _interopRequireDefault(_songLibrary);

var _tabControl = __webpack_require__(11);

var _tabControl2 = _interopRequireDefault(_tabControl);

var _voiceCommandListener = __webpack_require__(12);

var _voiceCommandListener2 = _interopRequireDefault(_voiceCommandListener);

__webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global jtmpl */

if (_voiceCommandListener2.default.checkCompatibility()) {
    init();
}

function init() {
    var enableMicButton = document.getElementById('enableMicButton');
    var loadDemoSongButton = document.getElementById('loadDemoSongButton');
    var filesInput = document.getElementById('files');
    var filesDropArea = document.body;

    var noSongsContainer = document.getElementById('noSongsContainer');
    var someSongsContainer = document.getElementById('someSongsContainer');
    var sampleVoiceCommandSongName = document.getElementById('sampleVoiceCommandSongName');
    var jumpToBarNumberInput = document.getElementById('jumpToBarNumber');
    var jumpToBarButton = document.getElementById('jumpToBarButton');
    var recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

    var importSongLibraryInput = document.getElementById('importSongLibraryInput');
    var exportSongLibraryButton = document.getElementById('exportSongLibraryButton');

    var tabControl = new _tabControl2.default(document);
    tabControl.openTab('loadSongs');

    var context = new (window.AudioContext || window.webkitAudioContext)();

    var songLibrary = new _songLibrary2.default();
    var playlistManager = new _playlistManager2.default(context, songLibrary);
    var jtmplModel = { playlist: [] };
    jtmpl('#songsContainer', '#songTemplate', jtmplModel);

    var jtmplSongs = jtmpl('#songsContainer');
    jtmplSongs.on('update', function (prop) {
        if (prop === 'playlist') {
            songLibrary.updateSongInfos(jtmplModel.playlist);
        }
    });

    var anySongsLoaded = false;
    var addLoadedSong = function addLoadedSong(songFile) {
        var info = songLibrary.getSongInfoByName(songFile.fileName) || new _songInfo2.default();
        var songModel = {
            name: songFile.fileName,
            bpm: info.bpm,
            beatsPerBar: info.beatsPerBar,
            playbackSpeedPercent: info.playbackSpeed * 100,
            escapedName: function escapedName() {
                return this('name').replace('\'', '\\\'');
            }
        };

        playlistManager.addSong(songFile.fileName, songFile.fileData);
        jtmplModel.playlist.push(songModel);
        jtmpl('#songsContainer').trigger('change', 'playlist');

        if (!anySongsLoaded) {
            noSongsContainer.classList.add('hidden');
            someSongsContainer.classList.remove('hidden');
            sampleVoiceCommandSongName.innerText = songModel.name;
            tabControl.openTab('playlist');
            anySongsLoaded = true;
        }
    };

    var loadFileByUrl = function loadFileByUrl(url) {
        _fileHelpers2.default.loadByUrl(url).then(function (file) {
            var songFile = new _songFile2.default(file.name.split('.')[0], file.contents);
            addLoadedSong(songFile);
        });
    };
    loadDemoSongButton.onclick = function () {
        if (!songLibrary.getSongInfoByName('not just jazz')) {
            songLibrary.updateSongInfos([{ name: 'not just jazz', bpm: 102 }]);
        }
        loadFileByUrl('audio/not just jazz.mp3');
    };

    var loadFiles = function loadFiles(files) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var f = _step.value;

                _fileHelpers2.default.readArrayBufferFromFile(f).then(function (file) {
                    var songFile = new _songFile2.default(file.name.split('.')[0], file.contents);
                    addLoadedSong(songFile);
                });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
    filesInput.onchange = function (evt) {
        loadFiles(evt.target.files);
    };

    filesDropArea.ondragover = function (evt) {
        evt.dataTransfer.dropEffect = 'copy';
        filesDropArea.classList.add('droppable');
        return false;
    };
    filesDropArea.ondragleave = function () {
        filesDropArea.classList.remove('droppable');
    };
    filesDropArea.ondrop = function (evt) {
        filesDropArea.classList.remove('droppable');
        loadFiles(evt.dataTransfer.files);
        return false;
    };

    // wire up manual controls
    window.barkeep_play = function (songName) {
        try {
            playlistManager.playSongByName(songName);
        } catch (e) {
            alert(e);
        }
    };
    jumpToBarButton.onclick = function () {
        playlistManager.jumpToBar(Number.parseInt(jumpToBarNumberInput.value));
    };

    enableMicButton.onclick = function () {
        var voiceCommandListener = new _voiceCommandListener2.default();
        voiceCommandListener.onBarCommand = function (barNumber) {
            recognisedNumberDisplayElement.innerHTML = barNumber;
            recognisedNumberDisplayElement.classList.add('highlight');
            setTimeout(function () {
                recognisedNumberDisplayElement.classList.remove('highlight');
            }, 1000);
            playlistManager.jumpToBar(barNumber);
        };
        voiceCommandListener.onPlayCommand = function (songName) {
            try {
                return playlistManager.playSongByName(songName);
            } catch (e) {
                alert(e);
            }
        };
        voiceCommandListener.onStopCommand = function () {
            playlistManager.stop();
        };

        voiceCommandListener.startListening();
    };

    importSongLibraryInput.onchange = function (evt) {
        _fileHelpers2.default.readTextFromFile(evt.target.files[0]).then(function (file) {
            songLibrary.import(file.contents);
            alert('imported!');
        });
    };
    exportSongLibraryButton.onclick = function () {
        var json = songLibrary.export();
        _fileHelpers2.default.downloadFile('barkeep.json', json);
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileHelpers = function () {
    function FileHelpers() {
        _classCallCheck(this, FileHelpers);
    }

    _createClass(FileHelpers, null, [{
        key: 'loadByUrl',
        value: function loadByUrl(url) {
            return new Promise(function (resolve, reject) {
                var _this = this;

                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    var urlParts = url.split('/');
                    var fileNamePart = urlParts[urlParts.length - 1];
                    resolve({ name: fileNamePart, contents: request.response });
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
    }, {
        key: 'readArrayBufferFromFile',
        value: function readArrayBufferFromFile(file) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    resolve({ name: file.name, contents: evt.target.result });
                };
                reader.onerror = function () {
                    return reject();
                };
                reader.readAsArrayBuffer(file);
            });
        }
    }, {
        key: 'readTextFromFile',
        value: function readTextFromFile(file) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    resolve({ name: file.name, contents: evt.target.result });
                };
                reader.onerror = function () {
                    return reject();
                };
                reader.readAsText(file);
            });
        }
    }, {
        key: 'downloadFile',
        value: function downloadFile(name, contents) {
            var link = document.createElement('a');
            link.download = name;
            link.href = URL.createObjectURL(new Blob([contents]));
            link.click();
        }
    }]);

    return FileHelpers;
}();

exports.default = FileHelpers;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beeper = __webpack_require__(4);

var _beeper2 = _interopRequireDefault(_beeper);

var _bufferLoader = __webpack_require__(6);

var _bufferLoader2 = _interopRequireDefault(_bufferLoader);

var _songPlayer = __webpack_require__(8);

var _songPlayer2 = _interopRequireDefault(_songPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlaylistManager = function () {
    function PlaylistManager(context, songLibrary) {
        _classCallCheck(this, PlaylistManager);

        this.context = context;
        this.beeper = new _beeper2.default(context);
        this.songLibrary = songLibrary;
        this.fileDataMap = new Map();
        this.bufferMap = new Map();
    }

    _createClass(PlaylistManager, [{
        key: 'addSong',
        value: function addSong(name, fileData) {
            this.fileDataMap.set(name, fileData);
        }
    }, {
        key: '_getSongNameFromInput',
        value: function _getSongNameFromInput(input) {
            if (input.trim().length === 0) {
                return null;
            }
            if (this.fileDataMap.has(input)) {
                return input;
            }
            // best guess at name?
            input = input.toLowerCase();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.fileDataMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (key.toLowerCase().indexOf(input) >= 0) {
                        return key;
                    }
                }
                // no match :(
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return null;
        }
    }, {
        key: 'playSongByName',
        value: function playSongByName(input) {
            var _this = this;

            var songName = this._getSongNameFromInput(input);
            if (!songName) {
                console.log('Unrecognised song:', input);
                return false;
            }

            var songInfo = this.songLibrary.getSongInfoByName(songName);
            if (!songInfo.bpm) {
                throw 'Please set BPM for ' + songName;
            }

            var bufferKey = songName + '@' + songInfo.playbackSpeed;
            if (this.bufferMap.has(bufferKey)) {
                var buffer = this.bufferMap.get(bufferKey);
                this._playBuffer(buffer, songInfo);
            } else {
                var fileData = this.fileDataMap.get(songName);
                var noteNumber = 96;
                this.beeper.beep({ note: noteNumber });
                _bufferLoader2.default.loadBuffer(this.context, fileData, songInfo.playbackSpeed, 12, function (p) {
                    console.log('Stretching...', p);
                    _this.beeper.beep({ note: ++noteNumber });
                }).then(function (buffer) {
                    _this.bufferMap.set(bufferKey, buffer);
                    _this._playBuffer(buffer, songInfo);
                });
            }
            return true;
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.currentSongPlayer) {
                this.currentSongPlayer.stop();
            }
        }
    }, {
        key: 'jumpToBar',
        value: function jumpToBar(barNumber) {
            if (this.currentSongPlayer) {
                this.beeper.doubleBeep();
                this.currentSongPlayer.play(barNumber);
            }
        }
    }, {
        key: '_playBuffer',
        value: function _playBuffer(buffer, songInfo) {
            if (this.currentSongPlayer) {
                this.currentSongPlayer.stop();
            }
            this.beeper.beep();
            var songPlayer = new _songPlayer2.default(this.context, buffer, songInfo.playbackSpeed, songInfo.bpm, songInfo.beatsPerBar);
            songPlayer.play();
            this.currentSongPlayer = songPlayer;
        }
    }]);

    return PlaylistManager;
}();

exports.default = PlaylistManager;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _noteConverter = __webpack_require__(5);

var _noteConverter2 = _interopRequireDefault(_noteConverter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Beeper = function () {
    function Beeper(context) {
        _classCallCheck(this, Beeper);

        this.context = context;
    }

    _createClass(Beeper, [{
        key: 'beep',
        value: function beep() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var defaults = {
                startSecondsFromNow: 0,
                durationSeconds: .1,
                note: 108
            };
            options = Object.assign({}, defaults, options);

            var gainNode = this.context.createGain();
            gainNode.gain.value = .1;
            gainNode.connect(this.context.destination);

            var oscillator = this.context.createOscillator();
            oscillator.frequency.value = _noteConverter2.default.getFrequencyFromNote(options.note);
            oscillator.connect(gainNode);

            var startWhen = options.startSecondsFromNow + this.context.currentTime;
            oscillator.start(startWhen);
            oscillator.stop(startWhen + options.durationSeconds);
        }
    }, {
        key: 'doubleBeep',
        value: function doubleBeep() {
            this.beep({ startSecondsFromNow: 0, durationSeconds: .05 });
            this.beep({ startSecondsFromNow: .1, durationSeconds: .05 });
        }
    }]);

    return Beeper;
}();

exports.default = Beeper;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NoteConverter = function () {
    function NoteConverter() {
        _classCallCheck(this, NoteConverter);
    }

    _createClass(NoteConverter, null, [{
        key: "getFrequencyFromNote",
        value: function getFrequencyFromNote(note) {
            return 440 * Math.pow(2, (note - 69) / 12);
        }
    }, {
        key: "getNoteFromFrequency",
        value: function getNoteFromFrequency(frequency) {
            return Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
        }
    }]);

    return NoteConverter;
}();

exports.default = NoteConverter;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Kali */

var BufferLoader = function () {
    function BufferLoader() {
        _classCallCheck(this, BufferLoader);
    }

    _createClass(BufferLoader, null, [{
        key: 'loadBuffer',
        value: function loadBuffer(context, fileData) {
            var playbackSpeed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
            var progressIntervalCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 12;
            var progressCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return new Promise(function (resolve, reject) {
                context.decodeAudioData(fileData, function (buffer) {
                    var stretchedBuffer = BufferLoader._stretch(context, buffer, playbackSpeed, 2, false, progressIntervalCount, progressCallback);
                    resolve(stretchedBuffer);
                }, function (e) {
                    console.error(e);
                    reject();
                });
            });
        }
    }, {
        key: '_stretch',
        value: function _stretch(context, buffer, playbackSpeed, numChannels, bestQuality, progressIntervalCount, progressCallback) {

            if (playbackSpeed === 1.0) {
                return buffer;
            }

            var stretchSampleSize = 4096 * numChannels;
            var inputBufferSize = buffer.getChannelData(0).length;
            var outputBufferSize = Math.floor(inputBufferSize / playbackSpeed) + 1;

            var outputAudioBuffer = context.createBuffer(numChannels, outputBufferSize, context.sampleRate);

            var progressCounter = 0;
            var progressIntervalSize = Math.floor(outputBufferSize * numChannels / progressIntervalCount);

            for (var channel = 0; channel < numChannels; channel++) {
                var inputData = buffer.getChannelData(channel);

                var kali = new Kali(1);
                kali.setup(context.sampleRate, playbackSpeed, !bestQuality);

                var outputData = new Float32Array(outputBufferSize);

                var inputOffset = 0;
                var completedOffset = 0;
                var flushed = false;

                while (completedOffset < outputData.length) {
                    while (progressCallback && progressCounter >= progressIntervalSize) {
                        progressCallback((completedOffset + outputBufferSize * channel) / (outputBufferSize * numChannels));
                        progressCounter -= progressIntervalSize;
                    }

                    // Read stretched samples into outputData array
                    var framesCompleted = kali.output(outputData.subarray(completedOffset, Math.min(completedOffset + stretchSampleSize, outputData.length)));
                    completedOffset += framesCompleted;
                    progressCounter += framesCompleted;

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
                }

                outputAudioBuffer.getChannelData(channel).set(outputData);
            }

            return outputAudioBuffer;
        }
    }]);

    return BufferLoader;
}();

exports.default = BufferLoader;

/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SongPlayer = function () {
    function SongPlayer(context, buffer, bufferRate, bpm, beatsPerBar) {
        _classCallCheck(this, SongPlayer);

        this.context = context;
        this.buffer = buffer;
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar;
        this.secondsPerBar = this.beatsPerBar * 60 / (bufferRate * bpm);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SongFile = function SongFile(fileName, fileData) {
    _classCallCheck(this, SongFile);

    this.fileName = fileName;
    this.fileData = fileData;
};

exports.default = SongFile;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _songInfo = __webpack_require__(0);

var _songInfo2 = _interopRequireDefault(_songInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SongLibrary = function () {
    function SongLibrary() {
        _classCallCheck(this, SongLibrary);

        this.songInfos = this.retrieveFromStorage();
    }

    _createClass(SongLibrary, [{
        key: 'getSongInfoByName',
        value: function getSongInfoByName(name) {
            return this.songInfos.get(name);
        }
    }, {
        key: 'updateSongInfos',
        value: function updateSongInfos(songs) {
            for (var i = 0; i < songs.length; i++) {
                // add or update
                this.songInfos.set(songs[i].name, _songInfo2.default.fromObject(songs[i]));
            }
            this.persistToStorage();
        }
    }, {
        key: 'persistToStorage',
        value: function persistToStorage() {
            // can't serialize Map, so use spread operator to convert to Array
            var json = JSON.stringify([].concat(_toConsumableArray(this.songInfos)));
            localStorage.setItem('song-library', json);
        }
    }, {
        key: 'retrieveFromStorage',
        value: function retrieveFromStorage() {
            var jsonFromStorage = localStorage.getItem('song-library');
            return new Map(JSON.parse(jsonFromStorage));
        }
    }, {
        key: 'import',
        value: function _import(json) {
            var songsToImport = new Map(JSON.parse(json));
            this.songInfos = new Map([].concat(_toConsumableArray(this.songInfos), _toConsumableArray(songsToImport)));
            this.persistToStorage();
        }
    }, {
        key: 'export',
        value: function _export() {
            return localStorage.getItem('song-library');
        }
    }]);

    return SongLibrary;
}();

exports.default = SongLibrary;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabControl = function () {
    function TabControl(document) {
        var _this = this;

        _classCallCheck(this, TabControl);

        this.tabLinks = Array.from(document.getElementsByClassName('tab-link'));
        this.tabPanes = Array.from(document.getElementsByClassName('tab-pane'));

        this.tabLinks.forEach(function (tabLink) {
            tabLink.onclick = function () {
                _this.openTab(TabControl._getTargetTabId(tabLink));
            };
        });
    }

    _createClass(TabControl, [{
        key: 'openTab',
        value: function openTab(targetTabId) {
            var toggleActive = function toggleActive(tabId, el) {
                if (tabId === targetTabId) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            };
            this.tabLinks.forEach(function (tabLink) {
                toggleActive(TabControl._getTargetTabId(tabLink), tabLink);
            });
            this.tabPanes.forEach(function (tabContents) {
                toggleActive(tabContents.id, tabContents);
            });
        }
    }], [{
        key: '_getTargetTabId',
        value: function _getTargetTabId(tabLink) {
            return tabLink.getAttribute('href').substring(1);
        }
    }]);

    return TabControl;
}();

exports.default = TabControl;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _commandParser = __webpack_require__(13);

var _commandParser2 = _interopRequireDefault(_commandParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VoiceCommandListener = function () {
    _createClass(VoiceCommandListener, null, [{
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

    function VoiceCommandListener() {
        var _this = this;

        _classCallCheck(this, VoiceCommandListener);

        var commandParser = new _commandParser2.default();
        commandParser.addCommand('play {words}', function (w) {
            return _this.onPlayCommand(w);
        });
        commandParser.addCommand('stop', function () {
            return _this.onStopCommand();
        });
        commandParser.addCommand('bar {number}', function (n) {
            return _this.onBarCommand(n);
        });
        this.commandParser = commandParser;
    }

    _createClass(VoiceCommandListener, [{
        key: 'startListening',
        value: function startListening() {
            var _this2 = this;

            var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            // recognition.continuous = true;
            // TODO: other languages?
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 5;
            recognition.start();

            recognition.onaudioend = function () {
                // start listening again after audio ends
                _this2.startListening();
            };

            recognition.onresult = function (ev) {
                var results = ev.results[0];
                for (var i = 0; i < results.length; i++) {
                    if (_this2.commandParser.parse(results[i].transcript)) {
                        break;
                    }
                    console.log('Unrecognised command:', results[i].transcript);
                }
            };
        }
    }]);

    return VoiceCommandListener;
}();

exports.default = VoiceCommandListener;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandParser = function () {
    function CommandParser() {
        _classCallCheck(this, CommandParser);

        this.commands = [];
    }

    _createClass(CommandParser, [{
        key: 'addCommand',
        value: function addCommand(command, action) {
            this.commands.push({
                regex: CommandParser._getRegex(command),
                type: CommandParser._getType(command),
                action: action
            });
        }
    }, {
        key: 'parse',
        value: function parse(statement) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var command = _step.value;

                    var results = statement.match(command.regex);
                    if (results) {
                        if (!command.type) {
                            return command.action();
                        }

                        var value = results[1];
                        if (command.type === 'words') {
                            return command.action(value);
                        }

                        if (command.type === 'number') {
                            var valueAsNumber = Number.parseInt(value);
                            if (!Number.isNaN(valueAsNumber) && Number.isFinite(valueAsNumber)) {
                                return command.action(valueAsNumber);
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }], [{
        key: '_getRegex',
        value: function _getRegex(command) {
            return '^' + command.replace('{words}', '(.*)').replace('{number}', '(.*)');
        }
    }, {
        key: '_getType',
        value: function _getType(command) {
            if (command.indexOf('{words}') >= 0) {
                return 'words';
            }
            if (command.indexOf('{number}') >= 0) {
                return 'number';
            }
        }
    }]);

    return CommandParser;
}();

exports.default = CommandParser;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e) {
  if ("object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {
    var t;"undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.jtmpl = e();
  }
}(function () {
  var define, module, exports;return function e(t, n, r) {
    function o(i, l) {
      if (!n[i]) {
        if (!t[i]) {
          var c = "function" == typeof require && require;if (!l && c) return require(i, !0);if (a) return a(i, !0);throw new Error("Cannot find module '" + i + "'");
        }var d = n[i] = { exports: {} };t[i][0].call(d.exports, function (e) {
          var n = t[i][1][e];return o(n ? n : e);
        }, d, d.exports, e, t, n, r);
      }return n[i].exports;
    }for (var a = "function" == typeof require && require, i = 0; i < r.length; i++) {
      o(r[i]);
    }return o;
  }({ 1: [function (e, t) {
      "use strict";
      function n(e, t, r, o) {
        function a(e, t) {
          if (!e) throw t || "assertion failed";
        }function i(e, t) {
          for (var n = 0, r = Object.getOwnPropertyNames(t), o = r.length; o > n; n++) {
            e[r[n]] = t[r[n]];
          }
        }function l(e, t) {
          if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && null !== t) {
            if (Object.keys(e).length !== Object.keys(t).length) return !1;for (var n in e) {
              if (e.hasOwnProperty(n)) {
                if (!t.hasOwnProperty(n)) return !1;if (!l(e[n], t[n])) return !1;
              }
            }return !0;
          }return e !== t ? !1 : !0;
        }function c() {
          var e = arguments[0],
              t = ["string", "number"].indexOf(_typeof(arguments[1])) > -1 ? arguments[1] : null,
              n = "function" == typeof arguments[1] ? arguments[1] : "function" == typeof arguments[2] ? arguments[2] : null;a(["change", "update", "insert", "delete"].indexOf(e) > -1), a(["change"].indexOf(e) > -1 && null !== t || ["insert", "delete", "update"].indexOf(e) > -1 && null === t), N[e][t] || (N[e][t] = []), -1 === N[e][t].indexOf(n) && N[e][t].push(n);
        }function d() {
          var e,
              t = arguments[0],
              n = "string" == typeof arguments[1] ? arguments[1] : null,
              r = "function" == typeof arguments[1] ? arguments[1] : "function" == typeof arguments[2] ? arguments[2] : null;N[t][n] && (r ? (e = N[t][n].indexOf(r), e > -1 && N[t][n].splice(e, 1)) : N[t][n] = []);
        }function u(e, t, n) {
          var r,
              o = N[e][["change"].indexOf(e) > -1 ? t : null] || [],
              a = o.length;for (r = 0; a > r; r++) {
            o[r].call(C, t, n);
          }
        }function p() {
          function t(e) {
            var n,
                r = Array.isArray(e) ? [] : {};for (n in e) {
              "object" == _typeof(e[n]) ? r[n] = t(e[n]) : "function" != typeof e[n] && "_" !== n[0] && (r[n] = e[n]);
            }return r;
          }return JSON.stringify(t(e));
        }function s(t) {
          var n;"string" == typeof t && (t = JSON.parse(t));for (n in t) {
            C(n, t[n]), u("update", n);
          }C.len = e.length;
        }function f(e) {
          l(b[e], h(e, function () {}, !0)) || u("change", e);for (var t = 0, n = x[e] || [], r = n.length; r > t; t++) {
            delete S[n[t]], O[e][t].trigger("update", n[t]);
          }C.parent && C.parent.trigger("update", C.prop);
        }function m(e) {
          function n(t) {
            return function (n, r) {
              return t._dependentProps[n] || (t._dependentProps[n] = [], t._dependentContexts[n] = []), -1 === t._dependentProps[n].indexOf(e) && (t._dependentProps[n].push(e), t._dependentContexts[n].push(C)), t(n, r, !0);
            };
          }var o = n(C);return j(o), r && (o.parent = n(r)), o.root = n(t || C), o;
        }function g(e) {
          var t, n;if (e && "object" == (typeof e === "undefined" ? "undefined" : _typeof(e))) {
            n = {};for (t in e) {
              n[t] = e[t];
            }
          } else n = e;return n;
        }function h(t, n, r) {
          var o = e[t];return "function" == typeof o ? (o = o.call(m(t), n), r || (b[t] = void 0 === o ? o : g(o))) : r || (b[t] = o), o;
        }function v(e, r, o) {
          var a = h(e, r, o);return a && "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? S[e] ? S[e] : S[e] = n(a, t || C, C, e) : a;
        }function y(t, n) {
          var r = h(t);"function" == typeof e[t] ? e[t].call(m(t), n) : (e[t] = n, n && "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && (delete b[t], delete S[t])), r !== n && u("update", t);
        }function _(e, t, n) {
          return (void 0 === t || "function" == typeof t ? v : y)(e, t, n);
        }function j(n) {
          function a(t, r) {
            return function () {
              var o = [][t].apply(e, arguments);return this.len = this.values.length, b = {}, S = {}, r.apply(this, arguments), n.parent.trigger("update", n.prop), o;
            };
          }i(n, { values: e, parent: r || null, root: t || n, prop: void 0 === o ? null : o, on: c, off: d, trigger: u, toJSON: p, fromJSON: s, _dependentProps: x, _dependentContexts: O }), Array.isArray(e) && i(n, { len: e.length, pop: a("pop", function () {
              u("delete", this.len, 1);
            }), push: a("push", function () {
              u("insert", this.len - 1, 1);
            }), reverse: a("reverse", function () {
              u("delete", 0, this.len), u("insert", 0, this.len);
            }), shift: a("shift", function () {
              u("delete", 0, 1);
            }), unshift: a("unshift", function () {
              u("insert", 0, 1);
            }), sort: a("sort", function () {
              u("delete", 0, this.len), u("insert", 0, this.len);
            }), splice: a("splice", function () {
              arguments[1] && u("delete", arguments[0], arguments[1]), arguments.length > 2 && u("insert", arguments[0], arguments.length - 2);
            }) });
        }var N = { change: {}, update: {}, insert: {}, "delete": {} },
            x = {},
            O = {},
            b = {},
            S = {};c("update", f);var C = function C() {
          return _.apply(null, arguments);
        };return j(C), C;
      }"object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && (t.exports = n);
    }, {}], 2: [function (e, t) {
      var n = /^\{\{([\w\.\-]+)\}\}$/;t.exports = [function (e, t) {
        var r = e.getAttribute(t).match(n);return "value" === t && r ? { prop: r[1], rule: function rule(e, t, n, r) {
            function o() {
              var o = jtmpl._get(n, r);e[t] !== o && (e[t] = o || "");
            }var a = ["text", "password"].indexOf(e.type) > -1 ? "keyup" : "change";e.addEventListener(a, function () {
              n(r, e[t]);
            }), n.on("change", r, o), o();
          } } : void 0;
      }, function (e, t) {
        var r = e.getAttribute(t).match(n);return "jtmpl-selected" === t && r ? { prop: r[1], rule: function rule(e, t, n, r) {
            function o() {
              if ("OPTION" === e.nodeName) {
                var t = selects.indexOf(e.parentNode);if (selectsUpdating[t]) return;for (var o = 0, a = selectOptions[t].length; a > o; o++) {
                  selectOptions[t][o].selected = selectOptionsContexts[t][o](r);
                }
              } else e.selected = n(r);
            }"OPTION" === e.nodeName ? setTimeout(function () {
              var t = selects.indexOf(e.parentNode);-1 === t && (t = selects.push(e.parentNode) - 1, selectOptions.push([]), selectOptionsContexts.push([]), e.parentNode.addEventListener("change", function () {
                selectsUpdating[t] = !0;for (var e = 0, n = selectOptions[t].length; n > e; e++) {
                  selectOptionsContexts[t][e](r, selectOptions[t][e].selected);
                }selectsUpdating[t] = !1;
              })), selectOptions[t].push(e), selectOptionsContexts[t].push(n);
            }, 0) : e.addEventListener("change", function () {
              n(r, this.selected);
            }), n.on("change", r, o), setTimeout(o);
          } } : void 0;
      }, function (e, t) {
        var r = e.getAttribute(t).match(n);return "jtmpl-checked" === t && r ? { prop: r[1], rule: function rule(e, t, n, r) {
            function o() {
              if (e.name) {
                if (radioGroupsUpdating[e.name]) return;for (var t = 0, o = radioGroups[e.name][0].length; o > t; t++) {
                  radioGroups[e.name][0][t].checked = radioGroups[e.name][1][t](r);
                }
              } else e.checked = n(r);
            }function a() {
              "radio" === e.type && e.name && (radioGroups[e.name] || (radioGroups[e.name] = [[], []]), radioGroups[e.name][0].push(e), radioGroups[e.name][1].push(n)), e.addEventListener("click", function () {
                if ("radio" === e.type && e.name) {
                  radioGroupsUpdating[e.name] = !0;for (var t = 0, o = radioGroups[e.name][0].length; o > t; t++) {
                    radioGroups[e.name][1][t](r, radioGroups[e.name][0][t].checked);
                  }radioGroupsUpdating[e.name] = !1;
                } else n(r, e.checked);
              }), n.on("change", r, o), setTimeout(o);
            }setTimeout(a);
          } } : void 0;
      }, function (e, t) {
        var r = e.getAttribute(t).match(n);return r ? { prop: r[1], rule: function rule(e, t, n, r) {
            function o() {
              var o = jtmpl._get(n, r);return o ? e.setAttribute(t, o) : e.removeAttribute(t);
            }n.on("change", r, o), o();
          } } : void 0;
      }, function (e, t) {
        return { prop: e.getAttribute(t), rule: function rule(e, t, n, r) {
            function o() {
              e.setAttribute(a, jtmpl.utemplate(r, n, o));
            }var a = t.replace("jtmpl-", "");o();
          } };
      }];
    }, {}], 3: [function (_dereq_, module, exports) {
      module.exports = [function (e) {
        return e.innerHTML.match(/^[\w\.\-]+$/) ? { prop: e.innerHTML, rule: function rule(e, t, n) {
            var r = document.createTextNode(jtmpl._get(t, n) || "");e.appendChild(r), t.on("change", n, function () {
              r.data = jtmpl._get(t, n) || "";
            });
          } } : void 0;
      }, function (e) {
        var t = e.innerHTML.match(/^&([\w\.\-]+)$/);return t ? { prop: t[1], rule: function rule(e, t, n) {
            function r() {
              for (var e, r = document.createDocumentFragment(), i = document.createElement("body"); a;) {
                o.parentNode.removeChild(o.previousSibling), a--;
              }for (i.innerHTML = t(n) || "", a = i.childNodes.length, e = 0; a > e; e++) {
                r.appendChild(i.childNodes[0]);
              }o.parentNode.insertBefore(r, o);
            }var o = document.createComment(""),
                a = 0;e.appendChild(o), t.on("change", n, r), r();
          } } : void 0;
      }, function (e) {
        var t = e.innerHTML.match(/>([\w\.\-]+)|'([^\']*)\'|"([^"]*)"/);return t ? { prop: t, rule: function rule(e, t, n) {
            function r() {
              o || (o = a.parentNode), jtmpl.loader(o, n[1] ? t(n[1]) : n[2] || n[3], t);
            }var o,
                a = document.createComment("");n[1] && t.on("change", n[1], r), e.appendChild(a), setTimeout(r);
          } } : void 0;
      }, function (node) {
        var match = node.innerHTML.match(/^#([\w\.\-]+)$/);return match ? { block: match[1], rule: function rule(fragment, model, prop, template) {
            function update(i) {
              return function () {
                for (var parent = anchor.parentNode, anchorIndex = [].indexOf.call(parent.childNodes, anchor), pos = anchorIndex - length + i * chunkSize, size = chunkSize, arr = "." === prop ? model : model(prop); size--;) {
                  parent.removeChild(parent.childNodes[pos]);
                }parent.insertBefore(eval(template + "(arr(i))"), parent.childNodes[pos]);
              };
            }function insert(index, count) {
              var parent = anchor.parentNode,
                  anchorIndex = [].indexOf.call(parent.childNodes, anchor),
                  pos = anchorIndex - length + index * chunkSize,
                  size = count * chunkSize,
                  i,
                  fragment,
                  arr = "." === prop ? model : model(prop);for (i = 0, fragment = document.createDocumentFragment(); count > i; i++) {
                fragment.appendChild(eval(template + "(arr(index + i))"));
              }parent.insertBefore(fragment, parent.childNodes[pos]), length += size;
            }function del(e, t) {
              var n = anchor.parentNode,
                  r = [].indexOf.call(n.childNodes, anchor),
                  o = r - length + e * chunkSize,
                  a = t * chunkSize;for (length -= a; a--;) {
                n.removeChild(n.childNodes[o]);
              }
            }function change() {
              for (var val = "." === prop ? model : model(prop), i, len, render; length;) {
                anchor.parentNode.removeChild(anchor.previousSibling), length--;
              }if ("function" == typeof val && void 0 !== val.len) {
                val.on("insert", insert), val.on("delete", del), render = document.createDocumentFragment();var func = eval(template),
                    child,
                    childModel;for (i = 0, len = val.values.length; len > i; i++) {
                  val.on("change", i, update(i)), childModel = val(i), child = func(childModel), child.__jtmpl__ = childModel, render.appendChild(child);
                }length = render.childNodes.length, chunkSize = ~~(length / len), anchor.parentNode.insertBefore(render, anchor);
              } else "function" == typeof val && void 0 === val.len ? (render = eval(template + "(val)"), length = render.childNodes.length, chunkSize = length, anchor.parentNode.insertBefore(render, anchor), anchor.parentNode.__jtmpl__ = model) : val && (render = eval(template + "(model)"), length = render.childNodes.length, chunkSize = length, anchor.parentNode.insertBefore(render, anchor));
            }var anchor = document.createComment(""),
                length = 0,
                chunkSize;fragment.appendChild(anchor), change(), model.on("change", prop, change);
          } } : void 0;
      }, function (node) {
        var match = node.innerHTML.match(/^\^([\w\.\-]+)$/);return match ? { block: match[1], rule: function rule(fragment, model, prop, template) {
            function change() {
              for (var val = "." === prop ? model : model(prop), i, len, render; length;) {
                anchor.parentNode.removeChild(anchor.previousSibling), length--;
              }"function" == typeof val && void 0 !== val.len ? (val.on("insert", change), val.on("delete", change), render = document.createDocumentFragment(), 0 === val.len && render.appendChild(eval(template + "(val(i))")), length = render.childNodes.length, anchor.parentNode.insertBefore(render, anchor)) : val || (render = eval(template + "(model)"), length = render.childNodes.length, anchor.parentNode.insertBefore(render, anchor));
            }var anchor = document.createComment(""),
                length = 0;fragment.appendChild(anchor), change(), model.on("change", prop, change);
          } } : void 0;
      }, function () {
        return { rule: function rule(e) {
            e.appendChild(document.createTextNode("REMOVEMELATER"));
          } };
      }];
    }, {}], 4: [function (e, t) {
      function n(t, o, a) {
        var i,
            l,
            c,
            d,
            u,
            p = "(function(model) {\nvar frag = document.createDocumentFragment(), node;\n\n";a || (p += "var radioGroups = {};\nvar radioGroupsUpdating = {};\nvar selects = [];\nvar selectsUpdating = [];\nvar selectOptions = [];\nvar selectOptionsContexts = [];\n\n"), p += 'model = typeof model === "function" ?model : typeof model === "object" ?jtmpl(model) :jtmpl({".": model});\n\n';for (var s, f = 0, m = t.childNodes, g = m.length; g > f; f++) {
          switch (s = m[f], s.nodeType) {case 1:
              if ("SCRIPT" === s.nodeName && "text/jtmpl-tag" === s.type) {
                for (i = 0, l = e("./compile-rules-node"), c = l.length; c > i; i++) {
                  if (d = l[i](s)) {
                    if (d.block) {
                      for (u = document.createDocumentFragment(), f++; g > f && !r(d.block, m[f].innerHTML || ""); f++) {
                        u.appendChild(m[f].cloneNode(!0));
                      }if (f === g) throw "jtmpl: Unclosed " + d.block;p += "(" + d.rule.toString() + ")(frag, model, " + JSON.stringify(d.block) + ", " + JSON.stringify(n(u, o && o + "-" + s.innerHTML + "[" + f + "]", (a || 0) + 1)) + ");";
                    } else p += "(" + d.rule.toString() + ")(frag, model, " + JSON.stringify(d.prop) + ");\n";break;
                  }
                }
              } else {
                p += 'node = document.createElement("' + s.nodeName + '");\n';for (var h = 0, v = s.attributes, y = v.length; y > h; h++) {
                  for (i = 0, l = e("./compile-rules-attr"), c = l.length; c > i; i++) {
                    if (d = l[i](s, v[h].name.toLowerCase())) {
                      p += "(" + d.rule.toString() + ")(node, " + JSON.stringify(v[h].name) + ", model, " + JSON.stringify(d.prop) + ");\n";break;
                    }
                  }
                }"INPUT" !== s.nodeName && (p += "node.appendChild(" + n(s, o && o + "-" + s.nodeName + "[" + f + "]", (a || 0) + 1) + "(model));\n"), p += "frag.appendChild(node);\n";
              }break;case 3:
              p += "frag.appendChild(document.createTextNode(" + JSON.stringify(s.data) + "));\n";break;case 8:
              p += "frag.appendChild(document.createComment(" + JSON.stringify(s.data) + "));\n";}
        }return p += "return frag; })", p += o ? "\n//@ sourceURL=" + o + "\n//# sourceURL=" + o + "\n" : "";
      }function r(e, t) {
        var n = t.match(/^\/([\w\.\-]+)?$/);return n ? "" === e || !n[1] || n[1] === e : !1;
      }t.exports = n;
    }, { "./compile-rules-attr": 2, "./compile-rules-node": 3 }], 5: [function (_dereq_, module, exports) {
      function jtmpl() {
        var args = [].slice.call(arguments),
            target,
            t,
            template,
            model;return ["GET", "POST"].indexOf(args[0]) > -1 ? _dereq_("./xhr").apply(null, args) : 1 === args.length && "object" == _typeof(args[0]) ? _dereq_("freak")(args[0]) : 1 === args.length && "string" == typeof args[0] ? document.querySelector(args[0]).__jtmpl__ : void ((args[0] && args[0].nodeType || "string" == typeof args[0]) && (args[1] && "function" == typeof args[1].appendChild || "string" == typeof args[1]) && void 0 !== args[2] && (target = args[0] && args[0].nodeType ? args[0] : document.querySelector(args[0]), template = args[1].match(jtmpl.RE_NODE_ID) ? document.querySelector(args[1]).innerHTML : args[1], model = "function" == typeof args[2] ? args[2] : jtmpl("object" == _typeof(args[2]) ? args[2] : "string" == typeof args[2] && args[2].match(jtmpl.RE_NODE_ID) ? _dereq_("./loader")(document.querySelector(args[2]).innerHTML) : { ".": args[2] }), "SCRIPT" === target.nodeName && (t = document.createElement("div"), t.id = target.id, target.parentNode.replaceChild(t, target), target = t), target.__jtmpl__ = model, target.innerHTML = "", target.appendChild(eval(jtmpl.compile(jtmpl.parse(template), target.getAttribute("data-jtmpl")) + "(model)"))));
      }window.addEventListener("DOMContentLoaded", function () {
        for (var e = _dereq_("./loader"), t = document.querySelectorAll("[data-jtmpl]"), n = 0, r = t.length; r > n; n++) {
          e(t[n], t[n].getAttribute("data-jtmpl"));
        }
      }), jtmpl.RE_NODE_ID = /^#[\w\.\-]+$/, jtmpl.RE_ENDS_WITH_NODE_ID = /.+(#[\w\.\-]+)$/, jtmpl.parse = _dereq_("./parse"), jtmpl.compile = _dereq_("./compile"), jtmpl.loader = _dereq_("./loader"), jtmpl.utemplate = _dereq_("./utemplate"), jtmpl._get = function (e, t) {
        var n = e(t);return "function" == typeof n ? JSON.stringify(n.values) : n;
      }, _dereq_("./polyfills/matches"), jtmpl.plugins = _dereq_("./plugins"), module.exports = jtmpl, "undefined" != typeof window && (window.jtmpl = jtmpl);
    }, { "./compile": 4, "./loader": 6, "./parse": 7, "./plugins": 8, "./polyfills/matches": 12, "./utemplate": 13, "./xhr": 14, freak: 1 }], 6: [function (_dereq_, module, exports) {
      module.exports = function (target, src, model) {
        function mixin(e, t) {
          for (var n in t) {
            0 === n.indexOf("__") && n.lastIndexOf("__") === n.length - 2 || "function" == typeof t[n] ? void 0 === e.values[n] && (e.values[n] = t[n]) : void 0 === e(n) && e(n, t[n]);
          }
        }function applyPlugins() {
          var e, t;for (e in jtmpl.plugins) {
            plugin = jtmpl.plugins[e], t = model.values["__" + e + "__"], "function" == typeof plugin && void 0 !== t && plugin.call(model, t, target);
          }
        }function evalObject(body, src) {
          var result,
              module = { exports: {} };return src = src ? "\n//@ sourceURL=" + src + "\n//# sourceURL=" + src : "", body.match(/^\s*{[\S\s]*}\s*$/) ? eval("result=" + body + src) : (eval(body + src), module.exports);
        }function loadModel(e, t, n) {
          var r;if (e) {
            if (e.match(jtmpl.RE_NODE_ID)) {
              var o = n.querySelector(e);mixin(model, evalObject(o.innerHTML, e)), applyPlugins(), jtmpl(target, t, model);
            } else r = e.indexOf("#"), jtmpl("GET", r > -1 ? e.substring(0, r) : e, function (n) {
              var r = e.match(jtmpl.RE_ENDS_WITH_NODE_ID),
                  o = r && new DOMParser().parseFromString(n, "text/html").querySelector(r[1]);mixin(model, evalObject(r ? o.innerHTML : n, e)), applyPlugins(), jtmpl(target, t, model);
            });
          } else jtmpl(target, t, model);
        }function loadTemplate() {
          var e;if (src) if (src.match(jtmpl.RE_NODE_ID)) {
            var t = document.querySelector(src);loadModel(t.getAttribute("data-model"), t.innerHTML, document);
          } else e = src.indexOf("#"), jtmpl("GET", e > -1 ? src.substring(0, e) : src, function (e) {
            var t,
                n,
                r = src.match(jtmpl.RE_ENDS_WITH_NODE_ID);r ? (t = document.createElement("iframe"), t.style.display = "none", document.body.appendChild(t), n = t.contentDocument, n.writeln(e), document.body.removeChild(t)) : n = document;var o = r && n.querySelector(r[1]);loadModel(r ? o.getAttribute("data-model") : "", r ? o.innerHTML : e, n);
          });
        }model = model || {}, "function" != typeof model && (model = jtmpl(model)), loadTemplate();
      };
    }, {}], 7: [function (e, t) {
      function n(e) {
        function t(e) {
          return e = e.replace(/\{\{\{([\S\s]*?)\}\}\}/g, "{{&$1}}"), e = e.replace(/\{\{([\S\s]*?)\}\}/g, function (t, n, r) {
            var o = e.slice(0, r),
                a = !!o.match(/<[\w\-]+[^>]*?$/),
                i = o.match(/<(script|SCRIPT)/g),
                l = o.match(/<\/(script|SCRIPT)/g),
                c = (i && i.length || 0) > (l && l.length || 0),
                d = !!o.match(/<!--\s*$/),
                u = 0 === n.indexOf("!");return a || d ? u ? "" : t : c ? t : '<script type="text/jtmpl-tag">' + n.trim() + "</script>";
          }), e = e.replace(/(<(?:option|OPTION)[^>]*?)(?:selected|SELECTED)=/g, "$1jtmpl-selected="), e = e.replace(/(<(?:input|INPUT)[^>]*?)(?:checked|CHECKED)=/g, "$1jtmpl-checked=");
        }var n, r;return e = t(e), n = document.createElement("iframe"), n.style.display = "none", document.body.appendChild(n), n.contentDocument.writeln("<!doctype html>\n<html><body>" + e + "</body></html>"), r = n.contentDocument.body, document.body.removeChild(n), r;
      }t.exports = n;
    }, {}], 8: [function (e, t) {
      t.exports = { init: e("./plugins/init"), on: e("./plugins/on"), routes: e("./plugins/routes") };
    }, { "./plugins/init": 9, "./plugins/on": 10, "./plugins/routes": 11 }], 9: [function (e, t) {
      t.exports = function (e) {
        if ("function" == typeof e) {
          var t = this;setTimeout(function () {
            e.call(t);
          });
        }
      };
    }, {}], 10: [function (e, t) {
      t.exports = function (e, t) {
        function n(n) {
          t.addEventListener(n, function (t) {
            for (var r in e[n]) {
              if (t.target.matches(r)) {
                for (var o = t.target; !o.__jtmpl__ && o.parentNode;) {
                  o = o.parentNode;
                }e[n][r].call(o.__jtmpl__, t);
              }
            }
          });
        }for (var r in e) {
          n(r);
        }
      };
    }, {}], 11: [function (e, t) {
      t.exports = function () {};
    }, {}], 12: [function () {
      "undefined" != typeof Element && function (e) {
        e.matches = e.matches || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector || e.webkitMatchesSelector || function (e) {
          for (var t = this, n = (t.parentNode || t.document).querySelectorAll(e), r = -1; n[++r] && n[r] != t;) {}return !!n[r];
        };
      }(Element.prototype);
    }, {}], 13: [function (e, t) {
      function n(e, t, r) {
        return e.replace(/\{\{#([\w\.\-]+)\}\}(.+?)\{\{\/([\w\.\-]*?)\}\}/g, function (e, o, a, i) {
          if ("" !== i && i !== o) throw "jtmpl: Unclosed " + o;"function" == typeof r && t.on("change", o, r);var l = "." === o ? t : t(o);return "function" == typeof l && void 0 !== l.len ? l.len > 0 ? l.values.map(function (e, t) {
            return n(a.replace(/\{\{\.\}\}/g, "{{" + t + "}}"), l, r);
          }).join("") : "" : "function" == typeof l && void 0 === l.len ? n(a, l, r) : l ? n(a, t, r) : "";
        }).replace(/\{\{\^([\w\.\-]+)\}\}(.+?)\{\{\/([\w\.\-]*?)\}\}/g, function (e, o, a, i) {
          if ("" !== i && i !== o) throw "jtmpl: Unclosed " + o;"function" == typeof r && t.on("change", o, r);var l = "." === o ? t : t(o);return "function" == typeof l && void 0 !== l.len ? 0 === l.len ? n(a, t, r) : "" : l ? "" : n(a, t, r);
        }).replace(/\{\{([\w\.\-]+)\}\}/g, function (e, n) {
          return "function" == typeof r && t.on("change", n, r), void 0 === t(n) ? "" : t(n) + "";
        });
      }t.exports = n;
    }, {}], 14: [function (e, t) {
      t.exports = function () {
        var e,
            t,
            n,
            r,
            o,
            a = [].slice.call(arguments),
            i = new XMLHttpRequest(),
            l = a.reduce(function (e, t) {
          return "function" == typeof t ? t : e;
        }, null),
            c = a[a.length - 1];for ("object" != (typeof c === "undefined" ? "undefined" : _typeof(c)) && (c = {}), e = 0, r = Object.getOwnPropertyNames(c), t = r.length; t > e; e++) {
          n = r[e], i[n] = c[n];
        }o = "string" == typeof a[2] ? a[2] : "object" == _typeof(a[2]) ? Object.keys(a[2]).map(function (e) {
          return e + "=" + encodeURIComponent(a[2][e]);
        }).join("&") : "";var d = function d(e) {
          var t;if (l) {
            try {
              t = JSON.parse(this.responseText);
            } catch (n) {
              t = this.responseText;
            }l.call(this, t, e);
          }
        };return i.onreadystatechange = function () {
          4 === i.readyState && (i.status >= 200 && i.status < 300 ? d.call(this, "done") : console.log("jtmpl XHR error: " + this.responseText));
        }, i.open(a[0], a[1], void 0 !== c.async ? c.async : !0, c.user, c.password), i.send(o), i;
      };
    }, {}] }, {}, [5])(5);
});

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map