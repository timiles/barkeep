import BufferLoader from './buffer-loader'
import FileLoader from './file-loader'
import PlaylistManager from './playlist-manager'
import SongInfo from './song-info'
import SongLibrary from './song-library'
import SongPlayer from './song-player'
import VoiceCommandListener from './voice-command-listener'

if (VoiceCommandListener.checkCompatibility()) {
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
    let filesDropArea = document.body;

    let songLibrary = new SongLibrary();
    let playlistManager = new PlaylistManager(songLibrary);
    let jtmplModel = { playlist: [] };
    jtmpl('#songsContainer', '#songTemplate', jtmplModel);

    var jtmplSongs = jtmpl('#songsContainer');
    jtmplSongs.on('update', (prop) => {
        if (prop === 'playlist') {
            songLibrary.updateSongInfos(jtmplModel.playlist);
        }
    });

    let addLoadedSong = (songFile) => {
        let info = songLibrary.getSongInfoByName(songFile.fileName) || new SongInfo();
        let songModel = {
            name: songFile.fileName,
            bpm: info.bpm,
            beatsPerBar: info.beatsPerBar,
            playbackRate: info.playbackRate
        };

        playlistManager.addSong(songFile.fileName, songFile.fileData);
        jtmplModel.playlist.push(songModel);
        jtmpl('#songsContainer').trigger('change', 'playlist');
    }

    loadBySongUrlButton.onclick = () => {
        FileLoader.loadByUrl(songUrlInput.value)
            .then(songFile => { addLoadedSong(songFile); });
    }

    let loadFiles = (files) => {
        for (var i = 0, f; f = files[i]; i++) {
            FileLoader.loadByFileReader(f)
                .then(songFile => { addLoadedSong(songFile); });
        }
    }
    filesInput.onchange = (evt) => {
        loadFiles(evt.target.files);
    }

    filesDropArea.ondragover = (evt) => {
        evt.dataTransfer.dropEffect = 'copy';
        filesDropArea.classList.add('droppable');
        return false;
    }
    filesDropArea.ondragleave = () => {
        filesDropArea.classList.remove('droppable');
    }
    filesDropArea.ondrop = (evt) => {
        filesDropArea.classList.remove('droppable');
        loadFiles(evt.dataTransfer.files);
        return false;
    }

    // wire up manual controls
    window.barkeep_play = songName => {
        playlistManager.playSongByName(songName);        
    }
    jumpToBarButton.onclick = (e) => {
        playlistManager.jumpToBar(Number.parseInt(jumpToBarNumberInput.value));
    };

    startBarkeepButton.onclick = () => {
        let voiceCommandListener = new VoiceCommandListener();
        voiceCommandListener.onBarCommand = (barNumber) => {
            recognisedNumberDisplayElement.innerHTML = barNumber;
            recognisedNumberDisplayElement.classList.add('highlight');
            setTimeout(() => { recognisedNumberDisplayElement.classList.remove('highlight'); }, 1000);
            playlistManager.jumpToBar(barNumber);
        }
        voiceCommandListener.onPlayCommand = (songName) => {
            playlistManager.playSongByName(songName);
        }
        voiceCommandListener.onStopCommand = () => {
            playlistManager.stop();
        }

        voiceCommandListener.startListening();
    }
}