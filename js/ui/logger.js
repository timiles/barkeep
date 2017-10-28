export default class Logger {

    constructor(outputElement) {
        this.outputElement = outputElement;
    }

    log(level, message) {
        const el = document.createElement('p');
        el.classList.add('log');
        el.classList.add('log-' + level);
        el.innerText = message;
        // prepend so latest message is always on top. better way?
        this.outputElement.prepend(el);
    }
}