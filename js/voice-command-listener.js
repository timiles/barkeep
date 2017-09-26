import CommandParser from './command-parser';

export default class VoiceCommandListener {

    static checkCompatibility() {
        if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
            alert('SpeechRecognition is not supported. Please use a compatible browser, eg Chrome.');
            return false;
        }
        const isLocalhost = location.host.startsWith('localhost');
        if (isLocalhost) {
            return true;
        }
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome && location.protocol !== 'https:') {
            alert('Chrome requires https for SpeechRecognition. Redirecting now!');
            location.protocol = 'https:';
            return false;
        }
        return true;
    }

    constructor() {
        const commandParser = new CommandParser();
        commandParser.addCommand('play {words}', (w) => this.onPlayCommand(w));
        commandParser.addCommand('stop', () => this.onStopCommand());
        commandParser.addCommand('bar {number}', (n) => this.onBarCommand(n));
        // sometimes comes through as eg "bar2"
        commandParser.addCommand('bar{number}', (n) => this.onBarCommand(n));
        this.commandParser = commandParser;
    }

    startListening() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        // recognition.continuous = true;
        // TODO: other languages?
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.start();

        recognition.onaudioend = () => {
            // start listening again after audio ends
            this.startListening();
        };

        recognition.onresult = ev => {
            const results = ev.results[0];
            for (let i = 0; i < results.length; i++) {
                if (this.commandParser.parse(results[i].transcript)) {
                    break;
                }
                console.log('Unrecognised command:', results[i].transcript);
            }
        };
    }
}