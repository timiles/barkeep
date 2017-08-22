export default class SongPlayer {

    constructor(fileData, bpm, beatsPerBar) {
        this.fileData = fileData;
        this.bpm = bpm;
        this.beatsPerBar = beatsPerBar;
        this.secondsPerBar = this.beatsPerBar * 60 / this.bpm;

        this.init = () => new Promise((resolve, reject) => {
            this.context = new (window.AudioContext || window.webkitAudioContext)();

            var self = this;
            this.context.decodeAudioData(this.fileData, (buffer) => {
                self.buffer = buffer;
                resolve();
            }, (e) => {
                console.error(e);
                reject();
            });
        });
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