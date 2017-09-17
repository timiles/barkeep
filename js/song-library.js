import SongInfo from './song-info'

export default class SongLibrary {

    constructor() {
        this.songInfos = this.retrieveFromStorage();
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
        let jsonFromStorage = localStorage.getItem('song-library');
        return new Map(JSON.parse(jsonFromStorage));
    }

    import(json) {
        console.log(json);
        const songsToImport = new Map(JSON.parse(json));
        console.log(songsToImport);
        this.songInfos = new Map([... this.songInfos, ...songsToImport]);
        this.persistToStorage();
    }

    export() {
        return localStorage.getItem('song-library');
    }
}