export default class NoteConverter {
    static getFrequencyFromNote(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    static getNoteFromFrequency(frequency) {
        return Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
    }
}