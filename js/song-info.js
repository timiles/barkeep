export default class SongInfo {
    constructor(bpm, beatsPerBar, playbackSpeedPercent) {
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar || 4;
        this.playbackSpeedPercent = playbackSpeedPercent || 100;
    }

    static fromObject(song) {
        return new SongInfo(song.bpm, song.beatsPerBar, song.playbackSpeedPercent);
    }
}