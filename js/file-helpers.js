export default class FileHelpers {

    static loadByUrl(url) {
        return new Promise(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.open('GET', url);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                const urlParts = url.split('/');
                const fileNamePart = urlParts[urlParts.length - 1];
                resolve({ name: fileNamePart, contents: request.response });
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

    static readArrayBufferFromFile(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                resolve({ name: file.name, contents: evt.target.result });
            };
            reader.onerror = () => reject();
            reader.readAsArrayBuffer(file);
        });
    }

    static readTextFromFile(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                resolve({ name: file.name, contents: evt.target.result });
            };
            reader.onerror = () => reject();
            reader.readAsText(file);
        });
    }

    static downloadFile(name, contents) {
        const link = document.createElement('a');
        link.download = name;
        link.href = URL.createObjectURL(new Blob([contents]));
        link.click();
    }
}