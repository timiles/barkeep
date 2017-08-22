import FileLoader from './file-loader'
import NumberRecogniser from './number-recogniser'
import SongPlayer from './song-player'

let songUrlInput = document.getElementById('songUrl');
let beatsPerMinuteInput = document.getElementById('beatsPerMinute');
let beatsPerBarInput = document.getElementById('beatsPerBar');
let startBarkeepButton = document.getElementById('startBarkeep');
let recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

startBarkeepButton.onclick = () => {
    let songPlayer;
    let fileLoader = new FileLoader();
    fileLoader.loadByUrl(songUrlInput.value)
        .then(fileData => {
            songPlayer = new SongPlayer(fileData, beatsPerMinuteInput.value, beatsPerBarInput.value);
            songPlayer.init()
                .then(() => {
                    songPlayer.play();
                });
        });

    let onNumberRecognised = (n) => {
        recognisedNumberDisplayElement.innerHTML = n;
        songPlayer.play(n);
    }
    let numberRecogniser = new NumberRecogniser(onNumberRecognised);
    numberRecogniser.startListening();
}