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

    playSongByName(songName) {
        let songInfo = this.songLibrary.getSongInfoByName(songName);
        let bufferPlaybackRate = songInfo.playbackRate / 100;
        let bufferKey = songName + '@' + bufferPlaybackRate;
        if (this.bufferMap.has(bufferKey)) {
            let buffer = this.bufferMap.get(bufferKey);
            this._playBuffer(buffer, songInfo);
        }
        else {
            let fileData = this.fileDataMap.get(songName);
            BufferLoader.loadBuffer(fileData, bufferPlaybackRate, p => { console.log('Stretching...', p); })
                .then(buffer => {
                    this.bufferMap.set(bufferKey, buffer);
                    this._playBuffer(buffer, songInfo);
                });
        }
    }

    jumpToBar(barNumber) {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.play(barNumber);
        }
    }

    _playBuffer(buffer, songInfo) {
        if (this.currentSongPlayer) {
            this.currentSongPlayer.stop();
        }
        let songPlayer = new SongPlayer(this.context, buffer, songInfo.playbackRate / 100, songInfo.bpm, songInfo.beatsPerBar);
        songPlayer.play();
        this.currentSongPlayer = songPlayer;
    }
}