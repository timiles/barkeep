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
        commandParser.addCommand('play {words} at {number}% from bar{number}',
            (songName, playbackSpeedPercent, barNumber) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber));
        commandParser.addCommand('play {words} at {number}% from BA{number}',
            (songName, playbackSpeedPercent, barNumber) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber));
        commandParser.addCommand('play {words} from bar{number} at {number}%',
            (songName, barNumber, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber));
        commandParser.addCommand('play {words} from BA{number} at {number}%',
            (songName, barNumber, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber));
        commandParser.addCommand('play {words} from bar{number}',
            (songName, barNumber) => this.onPlayCommand(songName, 100, barNumber));
        commandParser.addCommand('play {words} from BA{number}',
            (songName, barNumber) => this.onPlayCommand(songName, 100, barNumber));
        commandParser.addCommand('play {words} at {number}%',
            (songName, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent));
        commandParser.addCommand('play {words}',
            (songName) => this.onPlayCommand(songName));
        commandParser.addCommand('stop',
            () => this.onStopCommand());
        // sometimes comes through as eg "bar2" or "bar 2"
        commandParser.addCommand('bar{number}',
            (barNumber) => this.onBarCommand(barNumber));
        // or BA17
        commandParser.addCommand('BA{number}',
            (barNumber) => this.onBarCommand(barNumber));
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