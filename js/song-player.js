export default class SongPlayer {

    constructor(context, buffer, bufferRate, bpm, beatsPerBar) {
        this.context = context;
        this.buffer = buffer;
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar;
        this.secondsPerBar = this.beatsPerBar * 60 / (bufferRate * bpm);
    }

    play(barNumber) {
        this.stop();
        let source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        let startTime = this.getStartTimeInSeconds(barNumber || 0);
        source.start(0, startTime);
        this.currentSource = source;
    }

    stop() {
        if (this.currentSource) {
            this.currentSource.stop();
        }
    }

    getStartTimeInSeconds(barNumber) {
        let startTimeInSeconds = ((barNumber - 1) * this.secondsPerBar);
        return Math.max(0, startTimeInSeconds);
    }
}