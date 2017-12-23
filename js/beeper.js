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
        gainNode.gain.setValueAtTime(.1, this.context.currentTime);
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        const frequency = NoteConverter.getFrequencyFromNote(options.note);
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
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

        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(.1, this.context.currentTime);
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        oscillator.connect(gainNode);

        oscillator.frequency.setValueAtTime(startFrequency, this.context.currentTime);
        oscillator.frequency.setTargetAtTime(endFrequency, this.context.currentTime, durationSeconds);
        oscillator.start();
        oscillator.stop(this.context.currentTime + durationSeconds);
    }
}