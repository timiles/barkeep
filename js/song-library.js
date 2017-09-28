import SongInfo from './song-info';

export default class SongLibrary {

    constructor() {
        this.songInfos = this.retrieveFromStorage();
    }

    getSongNameFromInput(input) {
        if (input.trim().length === 0) {
            return null;
        }
        // TODO: account for case sensitivity?
        if (this.songInfos.has(input)) {
            return input;
        }
        // best guess at name?
        input = input.toLowerCase();
        for (const key of this.songInfos.keys()) {
            if (key.toLowerCase().indexOf(input) >= 0) {
                return key;
            }
        }
        // no match :(
        return null;
    }

    getSongInfoByName(name) {
        return this.songInfos.get(name);
    }

    updateSongInfos(songs) {
        for (let i = 0; i < songs.length; i++) {
            // add or update
            this.songInfos.set(songs[i].name, SongInfo.fromObject(songs[i]));
        }
        this.persistToStorage();
    }

    persistToStorage() {
        // can't serialize Map, so use spread operator to convert to Array
        const json = JSON.stringify([... this.songInfos]);
        localStorage.setItem('song-library', json);
    }

    retrieveFromStorage() {
        const jsonFromStorage = localStorage.getItem('song-library');
        return new Map(JSON.parse(jsonFromStorage));
    }

    import(json) {
        const songsToImport = new Map(JSON.parse(json));
        this.songInfos = new Map([... this.songInfos, ...songsToImport]);
        this.persistToStorage();
    }

    export() {
        return localStorage.getItem('song-library');
    }
}