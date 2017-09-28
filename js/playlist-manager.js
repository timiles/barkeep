import Beeper from './beeper';
import BufferManager from './buffer-manager';
import SongPlayer from './song-player';

export default class PlaylistManager {

    constructor(context) {
        this.context = context;
        this.beeper = new Beeper(context);
        this.bufferManager = new BufferManager(context);
    }

    addSong(name, fileData) {
        this.bufferManager.loadBuffer(name, fileData)
            .then(() => {
                // mark as loaded?
            });
    }

    playSong(name, bpm, beatsPerBar, playbackSpeed = 1) {
        let noteNumber = 96;
        const buffer = this.bufferManager.getBuffer(name, playbackSpeed, 12, p => {
            console.log('Stretching...', p);
            this.beeper.beep({ note: noteNumber++ });
        });
        this._playBuffer(buffer, playbackSpeed, bpm, beatsPerBar);
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