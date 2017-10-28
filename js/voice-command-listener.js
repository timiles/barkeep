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

    constructor(wakeWordHandler, commandHandler, logger) {
        this.wakeWordHandler = wakeWordHandler;
        this.commandHandler = commandHandler;
        this.logger = logger;
        this.stopped = false;
    }

    setWakeWordActive(active) {
        if (active) {
            this.logger.log('info', 'Wake word activated');            
            this.wakeWordActive = true;
            this.wakeWordActivatedAt = new Date();
        } else {
            this.logger.log('info', 'Wake word deactivated');
            this.wakeWordActive = false;
            this.wakeWordHandler.onWakeWord(false);
        }    
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
            if (!this.stopped) {
                this.startListening();
            }
        };

        recognition.onresult = ev => {
            const speechResults = ev.results[0];
            for (const speechResult of speechResults) {

                if (!this.wakeWordActive) {
                    if (this.wakeWordHandler.handle(speechResult.transcript)) {
                        this.setWakeWordActive(true);
                        recognition.stop();
                        this.startListening();
                        break;
                    }
                } else {
                    const commandResult = this.commandHandler.handle(speechResult.transcript);
                    if (commandResult) {
                        this.logger.log('success', `Command: "${speechResult.transcript}", result: "${commandResult}"`);
                        this.setWakeWordActive(false);
                        break;
                    }

                    this.logger.log('error', `Unrecognised command: "${speechResult.transcript}"`);
                }
            }
        };

        this.currentSpeechRecognition = recognition;
    }

    stopListening() {
        this.stopped = true;
        if (this.currentSpeechRecognition) {
            this.currentSpeechRecognition.stop();
        }
    }
}