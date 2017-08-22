import FileLoader from './file-loader'
import SongPlayer from './song-player'

let songUrlInput = document.getElementById('songUrl');
let loadSongButton = document.getElementById('loadSong');

loadSongButton.onclick = () => {
    let fileLoader = new FileLoader();
    fileLoader.loadByUrl(songUrlInput.value)
        .then(fileData => {
            let songPlayer = new SongPlayer(fileData);
            songPlayer.init()
                .then(() => songPlayer.play());
        });
}

