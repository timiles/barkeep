import FileHelpers from './file-helpers';
import Logger from './logger';
import PlaylistManager from './playlist-manager';
import SongFile from './song-file';
import SongInfo from './song-info';
import SongLibrary from './song-library';
import TabControl from './tab-control';
import CommandHandler from './voice-handlers/command-handler';
import WakeWordHandler from './voice-handlers/wake-word-handler';
import VoiceCommandListener from './voice-command-listener';
import '../vendor/jtmpl-1.1.0.min.js'; /* global jtmpl */

if (VoiceCommandListener.checkCompatibility()) {
    init();
}

function setElementClass(el, klass, isSet) {
    if (isSet) {
        el.classList.add(klass);
    } else {
        el.classList.remove(klass);
    }
}

function init() {
    const enableMicButton = document.getElementById('enableMicButton');
    const loadDemoSongButton = document.getElementById('loadDemoSongButton');
    const filesInput = document.getElementById('files');
    const filesDropArea = document.body;

    const noSongsContainer = document.getElementById('noSongsContainer');
    const someSongsContainer = document.getElementById('someSongsContainer');
    const sampleVoiceCommandSongName = document.getElementsByClassName('sampleVoiceCommandSongName');
    const jumpToBarNumberInput = document.getElementById('jumpToBarNumber');
    const jumpToBarButton = document.getElementById('jumpToBarButton');
    const recognisedNumberDisplayElement = document.getElementById('recognisedNumberDisplay');
    const fromBarNumberInput = document.getElementById('fromBarNumber');
    const toBarNumberInput = document.getElementById('toBarNumber');
    const loopBarsButton = document.getElementById('loopBarsButton');
    
    const importSongLibraryInput = document.getElementById('importSongLibraryInput');
    const exportSongLibraryButton = document.getElementById('exportSongLibraryButton');

    const loggerOutput = document.getElementById('loggerOutput');

    const tabControl = new TabControl(document);
    tabControl.openTab('loadSongs');

    const context = new (window.AudioContext || window.webkitAudioContext)();

    const songLibrary = new SongLibrary();
    const playlistManager = new PlaylistManager(context);
    const jtmplModel = { playlist: [] };
    jtmpl('#songsContainer', '#songTemplate', jtmplModel);

    const jtmplSongs = jtmpl('#songsContainer');
    jtmplSongs.on('update', (prop) => {
        if (prop === 'playlist') {
            songLibrary.updateSongInfos(jtmplModel.playlist);
        }
    });

    let anySongsLoaded = false;
    const addLoadedSong = (songFile) => {
        const info = songLibrary.getSongInfoByName(songFile.fileName) || new SongInfo();
        const songModel = {
            name: songFile.fileName,
            bpm: info.bpm,
            beatsPerBar: info.beatsPerBar,
            playbackSpeedPercent: info.playbackSpeed * 100,
            escapedName: function () { return this('name').replace('\'', '\\\''); }
        };

        playlistManager.addSong(songFile.fileName, songFile.fileData);
        jtmplModel.playlist.push(songModel);
        jtmpl('#songsContainer').trigger('change', 'playlist');

        if (!anySongsLoaded) {
            noSongsContainer.classList.add('hidden');
            someSongsContainer.classList.remove('hidden');
            Array.from(sampleVoiceCommandSongName).forEach(el => el.innerText = songModel.name);
            tabControl.openTab('playlist');
            anySongsLoaded = true;
        }
    };

    const loadFileByUrl = (url) => {
        FileHelpers.loadByUrl(url)
            .then(file => {
                const songFile = new SongFile(file.name.split('.')[0], file.contents);
                addLoadedSong(songFile);
            });
    };
    loadDemoSongButton.onclick = () => {
        if (!songLibrary.getSongInfoByName('not just jazz')) {
            songLibrary.updateSongInfos([{ name: 'not just jazz', bpm: 102 }]);
        }
        loadFileByUrl('audio/not just jazz.mp3');
    };

    const loadFiles = (files) => {
        for (const f of files) {
            FileHelpers.readArrayBufferFromFile(f)
                .then(file => {
                    const songFile = new SongFile(file.name.split('.')[0], file.contents);
                    addLoadedSong(songFile);
                });
        }
    };
    filesInput.onchange = (evt) => {
        loadFiles(evt.target.files);
    };

    filesDropArea.ondragover = (evt) => {
        evt.dataTransfer.dropEffect = 'copy';
        filesDropArea.classList.add('droppable');
        return false;
    };
    filesDropArea.ondragleave = () => {
        filesDropArea.classList.remove('droppable');
    };
    filesDropArea.ondrop = (evt) => {
        filesDropArea.classList.remove('droppable');
        loadFiles(evt.dataTransfer.files);
        return false;
    };

    // wire up manual controls
    window.barkeep_play = songName => {
        try {
            const songInfo = songLibrary.getSongInfoByName(songName);
            playlistManager.playSong(songName, songInfo.bpm, songInfo.beatsPerBar, songInfo.playbackSpeed);
        }
        catch (e) {
            alert(e);
        }
    };
    jumpToBarButton.onclick = () => {
        playlistManager.jumpToBar(Number.parseInt(jumpToBarNumberInput.value));
    };
    loopBarsButton.onclick = () => {
        playlistManager.loopBars(Number.parseInt(fromBarNumberInput.value), Number.parseInt(toBarNumberInput.value));
    };

    enableMicButton.onclick = () => {
        const wakeWordHandler = new WakeWordHandler();
        wakeWordHandler.onWakeWord = (activated) => {
            Array.from(document.getElementsByClassName('wake-word-indicator'))
                .forEach(el => setElementClass(el, 'wake-word-indicator-on', activated));
            return true;
        };

        const commandHandler = new CommandHandler();
        commandHandler.onBarCommand = (barNumber) => {
            recognisedNumberDisplayElement.innerHTML = barNumber;
            recognisedNumberDisplayElement.classList.add('highlight');
            setTimeout(() => { recognisedNumberDisplayElement.classList.remove('highlight'); }, 1000);
            playlistManager.jumpToBar(barNumber);
            return `Invoked Bar command with barNumber=${barNumber}`;
        };
        commandHandler.onLoopBarCommand = (barNumber) => {
            playlistManager.loopBars(barNumber, barNumber);
            return `Invoked LoopBar command with barNumber=${barNumber}`;
        };
        commandHandler.onLoopBarsCommand = (fromBarNumber, toBarNumber) => {
            playlistManager.loopBars(fromBarNumber, toBarNumber);
            return `Invoked LoopBars command with fromBarNumber=${fromBarNumber}, toBarNumber=${toBarNumber}`;
        };
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            try {
                const songName = songLibrary.getSongNameFromInput(input);
                if (!songName) {
                    return false;
                }

                const songInfo = songLibrary.getSongInfoByName(songName);
                if (!songInfo.bpm) {
                    throw 'Please set BPM for ' + songName;
                }

                const playbackSpeed = (playbackSpeedPercent / 100) || songInfo.playbackSpeed;
                playlistManager.playSong(songName, songInfo.bpm, songInfo.beatsPerBar, playbackSpeed, fromBarNumber);
                return `Invoked Play command with input=${input}, playbackSpeedPercent=${playbackSpeedPercent}, fromBarNumber=${fromBarNumber}`;
            }
            catch (e) {
                alert(e);
                return false;
            }
        };
        commandHandler.onStopCommand = () => {
            playlistManager.stop();
            return 'Invoked Stop command';
        };

        const logger = new Logger(loggerOutput);
        const voiceCommandListener = new VoiceCommandListener(wakeWordHandler, commandHandler, logger);
        voiceCommandListener.startListening();

        commandHandler.onStopListeningCommand = () => {
            voiceCommandListener.stopListening();
            return 'Invoked StopListening command';
        };
    };

    importSongLibraryInput.onchange = (evt) => {
        FileHelpers.readTextFromFile(evt.target.files[0])
            .then(file => {
                songLibrary.import(file.contents);
                alert('imported!');
            });
    };
    exportSongLibraryButton.onclick = () => {
        const json = songLibrary.export();
        FileHelpers.downloadFile('barkeep.json', json);
    };
}
