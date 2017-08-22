import FileLoader from './file-loader'
import NumberRecogniser from './number-recogniser'
import SongPlayer from './song-player'

let songUrlInput = document.getElementById('songUrl');
let startBarkeepButton = document.getElementById('startBarkeep');
let recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

startBarkeepButton.onclick = () => {
    let fileLoader = new FileLoader();
    fileLoader.loadByUrl(songUrlInput.value)
        .then(fileData => {
            let songPlayer = new SongPlayer(fileData);
            songPlayer.init()
                .then(() => songPlayer.play());
        });
    
    let onNumberRecognised = (n) => {
        recognisedNumberDisplayElement.innerHTML = n;
    }
    let numberRecogniser = new NumberRecogniser(onNumberRecognised);
    numberRecogniser.startListening();
}