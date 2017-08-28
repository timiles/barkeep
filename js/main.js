import BufferLoader from './buffer-loader'
import FileLoader from './file-loader'
import NumberRecogniser from './number-recogniser'
import SongPlayer from './song-player'

if (NumberRecogniser.checkCompatibility()) {
    init();
}

function init() {
    let songUrlInput = document.getElementById('songUrl');
    let beatsPerMinuteInput = document.getElementById('beatsPerMinute');
    let beatsPerBarInput = document.getElementById('beatsPerBar');
    let playbackRateInput = document.getElementById('playbackRate');
    let startBarkeepButton = document.getElementById('startBarkeep');
    let loadingSampleProgressBar = document.getElementById('loadingSampleProgressBar');
    let jumpToBarNumberInput = document.getElementById('jumpToBarNumber');
    let jumpToBarButton = document.getElementById('jumpToBarButton');
    let recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

    startBarkeepButton.onclick = () => {
        let songPlayer;
        let fileLoader = new FileLoader();
        let playbackRate = Number.parseInt(playbackRateInput.value) / 100;
        fileLoader.loadByUrl(songUrlInput.value)
            .then(fileData => {
                return BufferLoader.loadBuffer(fileData, playbackRate, p => { console.log(p); });
            })
            .then(buffer => {
                songPlayer = new SongPlayer(buffer, playbackRate, beatsPerMinuteInput.value, beatsPerBarInput.value);
                songPlayer.play();
            });

        jumpToBarButton.onclick = (e) => {
            songPlayer.play(Number.parseInt(jumpToBarNumberInput.value));
        };
        let onNumberRecognised = (n) => {
            recognisedNumberDisplayElement.innerHTML = n;
            recognisedNumberDisplayElement.innerHTML = n;
            recognisedNumberDisplayElement.innerHTML = n;
            songPlayer.play(n);
        }
        let numberRecogniser = new NumberRecogniser(onNumberRecognised);
        numberRecogniser.startListening();
    }
}