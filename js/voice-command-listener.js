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

    constructor(logger) {
        this.logger = logger;
        // Regarding [bar] synonym, no space before {number}: sometimes comes through as eg "bar2" or "bar 2" or "BA2"
        const commandParser = new CommandParser({
            synonyms: {
                'bar': ['ba', 'baar']
            },
            commands: {
                'play {words} at {number}% from [bar]{number}':
                (songName, playbackSpeedPercent, o, barNumber) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar]{number} at {number}%':
                (songName, o, barNumber, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar]{number}':
                (songName, o, barNumber) => this.onPlayCommand(songName, 100, barNumber),
                'play {words} at {number}%':
                (songName, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent),
                'play {words}':
                (songName) => this.onPlayCommand(songName),
                'stop':
                () => this.onStopCommand(),
                '[bar]{number}':
                (o, barNumber) => this.onBarCommand(barNumber)
            }
        });
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
            const speechResults = ev.results[0];
            for (const speechResult of speechResults) {
                const commandResult = this.commandParser.parse(speechResult.transcript);
                if (commandResult) {
                    this.logger.log('success', `Command: "${speechResult.transcript}", result: "${commandResult}"`);
                    break;
                }

                this.logger.log('error', `Unrecognised command: "${speechResult.transcript}"`);
            }
        };
    }
}