export default class SongInfo {
    constructor(bpm, beatsPerBar, playbackRate) {
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar || 4;
        this.playbackRate = playbackRate || 100;
    }

    static fromObject(song) {
        return new SongInfo(song.bpm, song.beatsPerBar, song.playbackRate);
    }
}