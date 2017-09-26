import Beeper from './beeper';
import BufferLoader from './buffer-loader';
import SongPlayer from './song-player';

export default class PlaylistManager {

    constructor(context, songLibrary) {
        this.context = context;
        this.beeper = new Beeper(context);
        this.songLibrary = songLibrary;
        this.fileDataMap = new Map();
        this.bufferMap = new Map();
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
        for (const key of this.fileDataMap.keys()) {
            if (key.toLowerCase().indexOf(input) >= 0) {
                return key;
            }
        }
        // no match :(
        return null;
    }

    playSongByName(input, overridePlaybackSpeed) {
        const songName = this._getSongNameFromInput(input);
        if (!songName) {
            console.log('Unrecognised song:', input);
            return false;
        }

        const songInfo = this.songLibrary.getSongInfoByName(songName);
        if (!songInfo.bpm) {
            throw 'Please set BPM for ' + songName;
        }

        const playbackSpeed = overridePlaybackSpeed || songInfo.playbackSpeed;
        const bufferKey = songName + '@' + playbackSpeed;
        if (this.bufferMap.has(bufferKey)) {
            const buffer = this.bufferMap.get(bufferKey);
            this._playBuffer(buffer, playbackSpeed, songInfo.bpm, songInfo.beatsPerBar);
        }
        else {
            const fileData = this.fileDataMap.get(songName);
            let noteNumber = 96;
            this.beeper.beep({ note: noteNumber });
            BufferLoader.loadBuffer(this.context, fileData, playbackSpeed, 12, p => {
                console.log('Stretching...', p);
                this.beeper.beep({ note: ++noteNumber });
            })
                .then(buffer => {
                    this.bufferMap.set(bufferKey, buffer);
                    this._playBuffer(buffer, playbackSpeed, songInfo.bpm, songInfo.beatsPerBar);
                });
        }
        return true;
    }

    stop() {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.stop();
        }
    }

    jumpToBar(barNumber) {
        if (this.currentSongPlayer) {
            this.beeper.doubleBeep();
            this.currentSongPlayer.play(barNumber);
        }
    }

    _playBuffer(buffer, playbackSpeed, bpm, beatsPerBar) {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.stop();
        }
        this.beeper.beep();
        const songPlayer = new SongPlayer(this.context, buffer, playbackSpeed, bpm, beatsPerBar);
        songPlayer.play();
        this.currentSongPlayer = songPlayer;
    }
}