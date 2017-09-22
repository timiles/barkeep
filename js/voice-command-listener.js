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
                const command = results[i].transcript.split(' ')[0];

                /* eslint-disable no-fallthrough */
                /* eslint-disable indent */
                switch (command) {
                    case 'play': {
                        if (this.onPlayCommand) {
                            this.onPlayCommand(results[i].transcript.substring('play '.length));
                            // allow multiple commands in case the first song name doesn't match
                            break;
                        }
                    }
                    case 'stop': {
                        if (this.onStopCommand) {
                            this.onStopCommand();
                            return;
                        }
                    }
                    case 'bar': {
                        if (this.onBarCommand) {
                            const testBarNumber = Number.parseInt(results[i].transcript.substring('bar '.length));
                            if (!Number.isNaN(testBarNumber) && Number.isFinite(testBarNumber)) {
                                this.onBarCommand(testBarNumber);
                                // stop on first successful bar command
                                return;
                            }
                        }
                    }
                    default: {
                        console.log('Unrecognised command:', results[i].transcript);
                    }
                }
                /* eslint-enable no-fallthrough */
                /* eslint-enable indent */
            }
        };
    }
}