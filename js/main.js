import BufferLoader from './buffer-loader'
import FileLoader from './file-loader'
import NumberRecogniser from './number-recogniser'
import SongPlayer from './song-player'

if (NumberRecogniser.checkCompatibility()) {
    init();
}

function init() {
    let songUrlInput = document.getElementById('songUrl');
    let loadBySongUrlButton = document.getElementById('loadBySongUrl');
    let filesInput = document.getElementById('files');
    let startBarkeepButton = document.getElementById('startBarkeep');
    let loadingSampleProgressBar = document.getElementById('loadingSampleProgressBar');
    let jumpToBarNumberInput = document.getElementById('jumpToBarNumber');
    let jumpToBarButton = document.getElementById('jumpToBarButton');
    let recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');

    let songLibrary = [{
        name: 'not just jazz',
        bpm: 102,
        beatsPerBar: 4,
        playbackRate: 100
    }];

    let jtmplModel = {
        loadedSongs: []
    };
    jtmpl('#songsContainer', '#songTemplate', jtmplModel);

    let addLoadedSong = (songFile) => {
        let song = songLibrary.filter(s => s.name === songFile.fileName)[0];
        if (!song) {
            // TODO: add to library?
            song = {
                name: songFile.fileName,
                beatsPerBar: 4,
                playbackRate: 100
            };
        }
        song.fileData = songFile.fileData;
        jtmplModel.loadedSongs.push(song);
        jtmpl('#songsContainer').trigger('change', 'loadedSongs');
    }
    
    loadBySongUrlButton.onclick = () => {
        FileLoader.loadByUrl(songUrlInput.value)
            .then(songFile => { addLoadedSong(songFile); });
    }
    
    filesInput.onchange = (evt) => {
        for (var i = 0, f; f = evt.target.files[i]; i++) {
            FileLoader.loadByFileInput(f)
                .then(songFile => { addLoadedSong(songFile); });
        }
    }

    startBarkeepButton.onclick = () => {
        let songPlayer;
        let selectedSong = jtmplModel.loadedSongs.filter(s => s.selected)[0];
        if (!selectedSong) {
            alert('Please select a song!');
            return false;
        }
        let playbackRate = selectedSong.playbackRate / 100;
        BufferLoader.loadBuffer(selectedSong.fileData, playbackRate, p => { console.log(p); })
            .then(buffer => {
                songPlayer = new SongPlayer(buffer, playbackRate, selectedSong.bpm, selectedSong.beatsPerBar);
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