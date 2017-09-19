export default class Beeper {

    constructor(context) {
        this.context = context;
    }

    beep() {
        const oscillator = this.context.createOscillator();
        oscillator.frequency.value = 4000;
        oscillator.connect(this.context.destination);
        oscillator.start();
        oscillator.stop(this.context.currentTime + .1);
    }
}