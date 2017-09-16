export default class SongInfo {
    constructor(bpm, beatsPerBar, playbackSpeed) {
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar || 4;
        this.playbackSpeed = playbackSpeed || 1.0;
    }

    static fromObject(song) {
        return new SongInfo(song.bpm, song.beatsPerBar, song.playbackSpeedPercent / 100);
    }
}