export default class SongPlayer {

    constructor(fileData) {
        this.fileData = fileData;

        this.init = () => new Promise((resolve, reject) => {
            this.context = new (window.AudioContext || window.webkitAudioContext)();

            var self = this;
            this.context.decodeAudioData(this.fileData, (buffer) => {
                self.buffer = buffer;
                resolve();
            }, (e) => {
                console.error(e);
                reject();
            });
        });
    }

    play() {
        let source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.start(0);
    }
}