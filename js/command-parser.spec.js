import CommandParser from './command-parser';

describe('CommandParser', () => {

    it('should match command', () => {
        const commandParser = new CommandParser();

        let commandActioned = false;
        commandParser.addCommand('test', () => { commandActioned = true; return true; });

        const result = commandParser.parse('test');
        expect(commandActioned).toBe(true);
        expect(result).toBe(true);
    });

    it('should not match different command', () => {
        const commandParser = new CommandParser();

        let commandActioned = false;
        commandParser.addCommand('test', () => { commandActioned = true; return true; });

        const result = commandParser.parse('nottest');
        expect(commandActioned).toBe(false);
        expect(result).not.toBeDefined();
    });

    it('should extract words', () => {
        const commandParser = new CommandParser();

        let phrase;
        commandParser.addCommand('test {words}', (s) => { phrase = s; return true; });

        const result = commandParser.parse('test hello world');
        expect(phrase).toBe('hello world');
        expect(result).toBe(true);
    });

    it('should extract number', () => {
        const commandParser = new CommandParser();

        let number;
        commandParser.addCommand('test {number}', (n) => { number = n; return true; });

        const result = commandParser.parse('test 42');
        expect(number).toBe(42);
        expect(result).toBe(true);
    });
});