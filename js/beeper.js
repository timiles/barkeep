import NoteConverter from './note-converter'

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

        let startWhen = options.startSecondsFromNow + this.context.currentTime;
        oscillator.start(startWhen);
        oscillator.stop(startWhen + options.durationSeconds);
    }

    doubleBeep() {
        this.beep({ startSecondsFromNow: 0, durationSeconds: .05 });
        this.beep({ startSecondsFromNow: .1, durationSeconds: .05 });
    }
}