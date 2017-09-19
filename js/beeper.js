export default class Beeper {

    constructor(context) {
        this.context = context;
    }

    beep() {
        const gainNode = this.context.createGain();
        gainNode.gain.value = .1;
        gainNode.connect(this.context.destination);

        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = 4000;
        oscillator.connect(gainNode);
        oscillator.start();
        oscillator.stop(this.context.currentTime + .1);
    }
}