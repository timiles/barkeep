import Beeper from './beeper';
import BufferManager from './buffer-manager';
import SongPlayer from './song-player';

export default class PlaylistManager {

    constructor(context, songLibrary) {
        this.context = context;
        this.beeper = new Beeper(context);
        this.songLibrary = songLibrary;
        this.bufferManager = new BufferManager(context);
        this.loadedSongNames = new Array();
    }

    addSong(name, fileData) {
        this.bufferManager.loadBuffer(name, fileData)
            .then(() => {
                this.loadedSongNames.push(name);
            });
    }

    _getSongNameFromInput(input) {
        if (input.trim().length === 0) {
            return null;
        }
        if (this.loadedSongNames.indexOf(input) >= 0) {
            return input;
        }
        // best guess at name?
        input = input.toLowerCase();
        for (const key of this.loadedSongNames) {
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

        let noteNumber = 96;
        const buffer = this.bufferManager.getBuffer(songName, playbackSpeed, 12, p => {
            console.log('Stretching...', p);
            this.beeper.beep({ note: noteNumber++ });
        });
        this._playBuffer(buffer, playbackSpeed, songInfo.bpm, songInfo.beatsPerBar);

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