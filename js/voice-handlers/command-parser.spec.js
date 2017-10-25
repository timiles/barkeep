import CommandParser from './command-parser';

describe('CommandParser', () => {

    it('should initialise by constructor', () => {

        let commandActioned = false;
        const commandParser = new CommandParser({
            synonyms: {
                'thing': ['object', 'article', 'item']
            },
            commands: {
                'test [thing]': (o) => { commandActioned = true; return o; }
            }
        });

        const result = commandParser.parse('test object');
        expect(commandActioned).toBe(true);
        expect(result).toBe('object');
    });

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

    it('should not match command if values not extracted', () => {
        const commandParser = new CommandParser({
            commands: {
                'test {number}': () => { return true; }
            }
        });

        const result = commandParser.parse('test not-a-number');
        expect(result).toBeUndefined();
    });

    it('should handle multiple synonyms', () => {
        const commandParser = new CommandParser();
        commandParser.addSynonyms('test', ['foo', 'bar']);
        commandParser.addCommand('[test] [test] [test]', (o0, o1, o2) => { return [o0, o1, o2]; });

        const result = commandParser.parse('foo test bar');
        expect(result[0]).toBe('foo');
        expect(result[1]).toBe('test');
        expect(result[2]).toBe('bar');
    });

    it('should handle synonyms of reserved types', () => {
        const commandParser = new CommandParser();
        commandParser.addSynonyms('words', ['sentence']);
        commandParser.addSynonyms('number', ['amount']);
        commandParser.addCommand('Hamlet: words, [words], {words}! Test [number]: {number}',
            (v0, v1, v2, v3) => { return [v0, v1, v2, v3]; });

        const result = commandParser.parse('Hamlet: words, sentence, more and more words! Test amount: 42');
        expect(result[0]).toBe('sentence');
        expect(result[1]).toBe('more and more words');
        expect(result[2]).toBe('amount');
        expect(result[3]).toBe(42);
    });

    it('should handle whole synonym if possible', () => {
        const commandParser = new CommandParser();
        commandParser.addSynonyms('foo', ['foofoo']);
        commandParser.addCommand('[foo]', (v) => { return v; });

        const result = commandParser.parse('foofoo');
        expect(result).toBe('foofoo');
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

    it('should extract number when part of a word', () => {
        const commandParser = new CommandParser();

        let number;
        commandParser.addCommand('test{number}', (n) => { number = n; return true; });

        const result = commandParser.parse('test42');
        expect(number).toBe(42);
        expect(result).toBe(true);
    });

    it('should extract 2 numbers', () => {
        const commandParser = new CommandParser();

        let number0, number1;
        commandParser.addCommand('test {number} and {number}',
            (n0, n1) => { number0 = n0; number1 = n1; return true; });

        const result = commandParser.parse('test 42 and 81');
        expect(number0).toBe(42);
        expect(number1).toBe(81);
        expect(result).toBe(true);
    });

    it('should extract words and numbers', () => {
        const commandParser = new CommandParser();

        let words, number0, number1;
        commandParser.addCommand('test {number} and {words} and {number}',
            (n0, w, n1) => { number0 = n0; words = w; number1 = n1; return true; });

        const result = commandParser.parse('test 42 and hello world and 81');
        expect(number0).toBe(42);
        expect(words).toBe('hello world');
        expect(number1).toBe(81);
        expect(result).toBe(true);
    });

    it('should extract words and numbers case-insensitive', () => {
        const commandParser = new CommandParser();

        let words, number0, number1;
        commandParser.addCommand('test {number} and {words} and {number}',
            (n0, w, n1) => { number0 = n0; words = w; number1 = n1; return true; });

        const result = commandParser.parse('TEST 42 and Hello World! aNd 81');
        expect(number0).toBe(42);
        expect(words).toBe('Hello World!');
        expect(number1).toBe(81);
        expect(result).toBe(true);
    });

    it('should extract value using optional regex', () => {
        const commandParser = new CommandParser({
            commands: {
                '(foo|bar)': (o) => { return o; }
            }
        });
        expect(commandParser.parse('foo')).toBe('foo');
        expect(commandParser.parse('BAR')).toBe('BAR');
        expect(commandParser.parse('flomdoo')).toBeUndefined();
    });

    it('should extract values from multiple optional regexes', () => {
        const commandParser = new CommandParser({
            commands: {
                'test (foo|bar) (bloop|bleep)':
                (o0, o1) => { return [o0, o1]; }
            }
        });
        const result = commandParser.parse('test foo bleep');
        expect(result[0]).toBe('foo');
        expect(result[1]).toBe('bleep');
    });

    it('should extract values in complicated pattern', () => {
        const commandParser = new CommandParser({
            commands: {
                'test {words} from (foo|bar){number} at {number}%': (w, o, n0, n1) => {
                    return [w, o, n0, n1];
                }
            }
        });

        const result = commandParser.parse('test Hello World! FROM bar 42 at 80%');
        expect(result[0]).toBe('Hello World!');
        expect(result[1]).toBe('bar');
        expect(result[2]).toBe(42);
        expect(result[3]).toBe(80);
    });
});