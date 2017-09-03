import SongFile from './song-file'

export default class FileLoader {

    static loadByUrl(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                let urlParts = url.split('/');
                let fileNamePart = urlParts[urlParts.length - 1];
                let fileNameWithoutExtension = fileNamePart.split('.')[0];
                let songFile = new SongFile(fileNameWithoutExtension, request.response);
                resolve(songFile);
            };
            request.onerror = () => {
                reject({
                    status: this.status,
                    statusText: request.statusText
                });
            };
            request.send();
        });
    }
}