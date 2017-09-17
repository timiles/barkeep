import BufferLoader from './buffer-loader'
import FileHelpers from './file-helpers'
import PlaylistManager from './playlist-manager'
import SongFile from './song-file'
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
    let importSongLibraryInput = document.getElementById('importSongLibraryInput');
    let exportSongLibraryButton = document.getElementById('exportSongLibraryButton');

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
            playbackSpeedPercent: info.playbackSpeed * 100,
            escapedName: function () { return this('name').replace('\'', '\\\''); }
        };

        playlistManager.addSong(songFile.fileName, songFile.fileData);
        jtmplModel.playlist.push(songModel);
        jtmpl('#songsContainer').trigger('change', 'playlist');
    }

    loadBySongUrlButton.onclick = () => {
        FileHelpers.loadByUrl(songUrlInput.value)
            .then(file => {
                const songFile = new SongFile(file.name.split('.')[0], file.contents);
                addLoadedSong(songFile);
            });
    }

    let loadFiles = (files) => {
        for (var i = 0, f; f = files[i]; i++) {
            FileHelpers.readArrayBufferFromFile(f)
                .then(file => {
                    const songFile = new SongFile(file.name.split('.')[0], file.contents);
                    addLoadedSong(songFile);
                });
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
        try {
            playlistManager.playSongByName(songName);
        }
        catch (e) {
            alert(e);
        }
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
            try {
                playlistManager.playSongByName(songName);
            }
            catch (e) {
                alert(e);
            }
        }
        voiceCommandListener.onStopCommand = () => {
            playlistManager.stop();
        }

        voiceCommandListener.startListening();
    }

    importSongLibraryInput.onchange = (evt) => {
        FileHelpers.readTextFromFile(evt.target.files[0])
            .then(file => {
                songLibrary.import(file.contents);
                alert('imported!');
            });
    }
    exportSongLibraryButton.onclick = () => {
        let json = songLibrary.export();
        FileHelpers.downloadFile('barkeep.json', json);
    }
}