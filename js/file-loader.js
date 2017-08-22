export default class FileLoader {

    loadByUrl(url) {
        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                resolve(request.response);
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