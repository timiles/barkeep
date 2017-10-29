import CommandParser from './command-parser';

export default class CommandHandler {

    constructor() {
        this.commandParser = new CommandParser({
            synonyms: {
                'bar': ['ba', 'baar'],
                'loop': ['Luke', 'loot', 'loupe']
            },
            commands: {
                'play {words} at {number}% from [bar] {number}':
                (songName, playbackSpeedPercent, o, barNumber) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar] {number} at {number}%':
                (songName, o, barNumber, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent, barNumber),
                'play {words} from [bar] {number}':
                (songName, o, barNumber) => this.onPlayCommand(songName, 100, barNumber),
                'play {words} at {number}%':
                (songName, playbackSpeedPercent) => this.onPlayCommand(songName, playbackSpeedPercent),
                'play {words}':
                (songName) => this.onPlayCommand(songName),
                'stop listening':
                () => this.onStopListeningCommand(),
                'stop':
                () => this.onStopCommand(),
                '[bar] {number}':
                (barSynonym, barNumber) => this.onBarCommand(barNumber),
                '[loop] from [bar] {number} through to [bar] {number}':
                (loopSynonym, barSynonym1, fromBarNumber, barSynonym2, toBarNumber) => this.onLoopBarsCommand(fromBarNumber, toBarNumber),
                '[loop] [bar] {number}':
                (loopSynonym, barSynonym, barNumber) => this.onLoopBarCommand(barNumber),
                'nothing':
                () => this.onNothingCommand()
            }
        });
    }

    handle(statement) {
        // split "words" like "bar2" into "bar 2"
        statement = statement.replace(/(\d+)/g, ' $1').trim();
        // fix "110 percent" -> "110%"
        statement = statement.replace(/( percent)/g, '%').trim();
        return this.commandParser.parse(statement);
    }
}