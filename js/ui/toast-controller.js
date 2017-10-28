export default class ToastController {

    constructor(document) {
        const toastElement = document.createElement('div');
        toastElement.classList.add('toast');
        document.body.appendChild(toastElement);
        this.toastElement = toastElement;
    }

    show(message, durationMilliseconds = 3000) {
        this.toastElement.innerHTML = message;
        this.toastElement.classList.add('show');
        setTimeout(() => { this.toastElement.classList.remove('show'); }, durationMilliseconds);
    }
}