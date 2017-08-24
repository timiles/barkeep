export default class NumberRecogniser {

    constructor(onNumberRecognised) {
        this.onNumberRecognised = onNumberRecognised;
    }

    static checkCompatibility() {
        if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
            alert('SpeechRecognition is not supported. Please use a compatible browser, eg Chrome.');
            return false;
        }
        var isLocalhost = location.host.startsWith('localhost');
        if (isLocalhost) {
            return true;
        }
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        if (isChrome && location.protocol !== 'https:') {
            alert('Chrome requires https for SpeechRecognition. Redirecting now!');
            location.protocol = 'https:';
            return false;
        }
        return true;
    }

    startListening() {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        // recognition.continuous = true;
        // TODO: other languages?
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.start();

        recognition.onaudioend = ev => {
            // start listening again after audio ends
            this.startListening();
        };

        recognition.onresult = ev => {
            var results = ev.results[0];
            for (var i = 0; i < results.length; i++) {
                var candidateNumber = Number.parseInt(results[i].transcript);
                if (!Number.isNaN(candidateNumber) && Number.isFinite(candidateNumber)) {
                    this.onNumberRecognised(candidateNumber);
                    // keep listening for more
                    this.startListening();
                    break;
                }
            }
        };
    };

}