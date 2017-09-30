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

    constructor(voiceCommandHandler, logger) {
        this.voiceCommandHandler = voiceCommandHandler;
        this.logger = logger;
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
                const commandResult = this.voiceCommandHandler.handle(speechResult.transcript);
                if (commandResult) {
                    this.logger.log('success', `Command: "${speechResult.transcript}", result: "${commandResult}"`);
                    break;
                }

                this.logger.log('error', `Unrecognised command: "${speechResult.transcript}"`);
            }
        };
    }
}