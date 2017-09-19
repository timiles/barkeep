import BufferLoader from './buffer-loader'
import SongLibrary from './song-library'
import SongPlayer from './song-player'

export default class PlaylistManager {

    constructor(songLibrary) {
        this.songLibrary = songLibrary;
        this.fileDataMap = new Map();
        this.bufferMap = new Map();
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    addSong(name, fileData) {
        this.fileDataMap.set(name, fileData);
    }

    _getSongNameFromInput(input) {
        if (input.trim().length === 0) {
            return null;
        }
        if (this.fileDataMap.has(input)) {
            return input;
        }
        // best guess at name?
        input = input.toLowerCase();
        for (let key of this.fileDataMap.keys()) {
            if (key.toLowerCase().indexOf(input) >= 0) {
                return key;
            }
        }
        // no match :(
        return null;
    }

    playSongByName(input) {
        let songName = this._getSongNameFromInput(input);
        if (!songName) {
            console.log('Unrecognised song:', input);
            return;
        }

        let songInfo = this.songLibrary.getSongInfoByName(songName);
        if (!songInfo.bpm) {
            throw 'Please set BPM for ' + songName;
        }

        let bufferKey = songName + '@' + songInfo.playbackSpeed;
        if (this.bufferMap.has(bufferKey)) {
            let buffer = this.bufferMap.get(bufferKey);
            this._playBuffer(buffer, songInfo);
        }
        else {
            let fileData = this.fileDataMap.get(songName);
            BufferLoader.loadBuffer(this.context, fileData, songInfo.playbackSpeed, p => { console.log('Stretching...', p); })
                .then(buffer => {
                    this.bufferMap.set(bufferKey, buffer);
                    this._playBuffer(buffer, songInfo);
                });
        }
    }

    stop() {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.stop();
        }
    }

    jumpToBar(barNumber) {
        if (this.currentSongPlayer) {
            this._beep();
            this.currentSongPlayer.play(barNumber);
        }
    }

    _beep() {
        var oscillator = this.context.createOscillator();
        oscillator.frequency.value = 4000;
        oscillator.connect(this.context.destination);
        oscillator.start();
        oscillator.stop(this.context.currentTime + .1);
    }

    _playBuffer(buffer, songInfo) {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.stop();
        }
        let songPlayer = new SongPlayer(this.context, buffer, songInfo.playbackSpeed, songInfo.bpm, songInfo.beatsPerBar);
        songPlayer.play();
        this.currentSongPlayer = songPlayer;
    }
}