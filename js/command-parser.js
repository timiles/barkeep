export default class CommandParser {

    constructor(initialCommands) {
        this.commands = [];

        for (const command in initialCommands) {
            this.addCommand(command, initialCommands[command]);
        }
    }

    static _getRegExp(command) {
        const pattern = '^' + command
            .replace(/{number}/g, '(.*)')
            .replace(/{words}/g, '(.*)');
        return new RegExp(pattern, 'i');
    }
    static _getTypes(command) {
        const indexedTypes = new Map();
        const indexType = (type, regexp) => {
            let index = 0;
            let res = regexp.exec(command);
            while (res) {
                index += res.index;
                indexedTypes.set(index, type);
                // skip over the matched result
                index += res[0].length;
                res = regexp.exec(command.substring(index));
            }
        };
        indexType('option', /\(.+?\)/);
        indexType('number', /{number}/);
        indexType('words', /{words}/);

        return [...indexedTypes.entries()]
            .sort((a, b) => a[0] - b[0]) // order by index
            .map(a => a[1]); // select values
    }

    addCommand(command, action) {
        this.commands.push({
            regexp: CommandParser._getRegExp(command),
            types: CommandParser._getTypes(command),
            action: action
        });
    }

    parse(statement) {
        for (const command of this.commands) {
            const results = command.regexp.exec(statement);
            if (results) {
                const args = [];
                for (let i = 0; i < command.types.length; i++) {
                    const type = command.types[i];
                    const value = results[i + 1];

                    switch (type) {
                        case 'option': {
                            args.push(value);
                            break;
                        }
                        case 'words': {
                            args.push(value);
                            break;
                        }
                        case 'number': {
                            const valueAsNumber = Number.parseInt(value);
                            if (!Number.isNaN(valueAsNumber) && Number.isFinite(valueAsNumber)) {
                                args.push(valueAsNumber);
                            }
                            break;
                        }
                        default: {
                            throw 'Unknown command type: ' + type;
                        }
                    }
                }
                return command.action(...args);
            }
        }
    }
}