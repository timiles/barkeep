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

        const gainNode = this.context.createGain();
        gainNode.gain.value = 1;
        gainNode.connect(this.context.destination);
        this.gainNode = gainNode;

        const source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(gainNode);

        const startTime = this.getStartTimeInSeconds(barNumber || 0);
        source.start(0, startTime);
        this.currentSource = source;
    }

    loopBars(fromBarNumber, toBarNumber) {
        this.stop();
        const source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.loop = true;
        source.loopStart = this.getStartTimeInSeconds(fromBarNumber);
        // toBarNumber is inclusive, so add 1 to it
        source.loopEnd = this.getStartTimeInSeconds(toBarNumber + 1);
        source.start(0, source.loopStart);
        this.currentSource = source;
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }

    stop() {
        if (this.currentSource) {
            this.currentSource.stop();
        }
    }

    getStartTimeInSeconds(barNumber) {
        const startTimeInSeconds = ((barNumber - 1) * this.secondsPerBar);
        return Math.max(0, startTimeInSeconds);
    }
}