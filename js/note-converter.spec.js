import NoteConverter from './note-converter';

describe('NoteConverter', () => {

    it('should convert note 69 to 440Hz', () => {
        expect(NoteConverter.getFrequencyFromNote(69)).toBe(440);
    });

    it('should convert 440Hz to note 69', () => {
        expect(NoteConverter.getNoteFromFrequency(440)).toBe(69);
    });
});