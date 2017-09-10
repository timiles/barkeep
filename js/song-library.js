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
        if (jsonFromStorage) {
            return new Map(JSON.parse(jsonFromStorage));
        }
        else {
            // populate with a default song
            let infos = new Map();
            infos.set('not just jazz', new SongInfo(102));
            return infos;
        }
    }
}