import NoteConverter from './note-converter';

export default class Beeper {

    constructor(context) {
        this.context = context;
    }

    beep(options = {}) {
        const defaults = {
            startSecondsFromNow: 0,
            durationSeconds: .1,
            note: 108
        };
        options = Object.assign({}, defaults, options);

        const gainNode = this.context.createGain();
        gainNode.gain.value = .1;
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = NoteConverter.getFrequencyFromNote(options.note);
        oscillator.connect(gainNode);

        const startWhen = options.startSecondsFromNow + this.context.currentTime;
        oscillator.start(startWhen);
        oscillator.stop(startWhen + options.durationSeconds);
    }

    doubleBeep() {
        this.beep({ startSecondsFromNow: 0, durationSeconds: .05 });
        this.beep({ startSecondsFromNow: .1, durationSeconds: .05 });
    }

    respond() {
        const startFrequency = NoteConverter.getFrequencyFromNote(101);
        const endFrequency = NoteConverter.getFrequencyFromNote(108);
        const durationSeconds = .3;
        const numberOfIntervals = 10;

        const intervalSeconds = durationSeconds / numberOfIntervals;
        const intervalFrequency = (endFrequency - startFrequency) / numberOfIntervals;

        const gainNode = this.context.createGain();
        gainNode.gain.value = .1;
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = startFrequency;
        oscillator.connect(gainNode);

        let intervalNumber = 0;
        oscillator.start();
        const intervalId = setInterval(() => {
            oscillator.frequency.value += intervalFrequency;
            if (intervalNumber++ >= numberOfIntervals) {
                oscillator.stop();
                clearInterval(intervalId);
            }
        }, intervalSeconds * 1000);
    }
}