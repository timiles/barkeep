import CommandParser from './command-parser';

export default class VoiceCommandHandler {

    constructor() {
        // Regarding [bar] synonym, no space before {number}: sometimes comes through as eg "bar2" or "bar 2" or "BA2"
        this.commandParser = new CommandParser({
            synonyms: {
                'bar': ['ba', 'baar']
            },
            commands: {
                'play {words} at {number}% from [bar]{number}':
                (songName, playbackSpeedPercent, o, barNumber) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar]{number} at {number}%':
                (songName, o, barNumber, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar]{number}':
                (songName, o, barNumber) => this.onPlayCommand(songName, 100, barNumber),
                'play {words} at {number}%':
                (songName, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent),
                'play {words}':
                (songName) => this.onPlayCommand(songName),
                'stop':
                () => this.onStopCommand(),
                '[bar]{number}':
                (o, barNumber) => this.onBarCommand(barNumber)
            }
        });
    }

    handle(statement) {
        return this.commandParser.parse(statement);
    }
}