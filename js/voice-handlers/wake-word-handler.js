import CommandParser from './command-parser';

export default class WakeWordHandler {

    constructor() {
        this.commandParser = new CommandParser({
            synonyms: {
                'barkeep': ['bar keep', 'party', 'barking', 'barky', 'barbie', 'turkey', 'perky', 'marquee', 'martin', 'body']
            },
            commands: {
                '[barkeep]': () => this.onWakeWord(true),
                '{words} [barkeep]': () => this.onWakeWord(true)
            }
        });
    }

    handle(statement) {
        return this.commandParser.parse(statement);
    }
}