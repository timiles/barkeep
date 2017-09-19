export default class Beeper {

    constructor(context) {
        this.context = context;
    }

    beep(startSecondsFromNow = 0, durationSeconds = .1) {
        const gainNode = this.context.createGain();
        gainNode.gain.value = .1;
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = 4000;
        oscillator.connect(gainNode);

        let startWhen = startSecondsFromNow + this.context.currentTime;
        oscillator.start(startWhen);
        oscillator.stop(startWhen + durationSeconds);
    }

    doubleBeep() {
        this.beep(0, .05);
        this.beep(.1, .05);
    }
}