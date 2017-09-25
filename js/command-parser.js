export default class CommandParser {

    constructor() {
        this.commands = [];
    }

    static _getRegex(command) {
        return '^' + command
            .replace(/{number}/g, '(.*)')
            .replace(/{words}/g, '(.*)');
    }
    static _getTypes(command) {
        const indexedTypes = new Map();
        const indexType = (type) => {
            let index = command.indexOf(type);
            while (index >= 0) {
                indexedTypes.set(index, type);
                index = command.indexOf(type, index + 1);
            }
        };
        indexType('{number}');
        indexType('{words}');

        return [...indexedTypes.entries()]
            .sort((a, b) => a[0] - b[0]) // order by index
            .map(a => a[1]); // select values
    }

    addCommand(command, action) {
        this.commands.push({
            regex: CommandParser._getRegex(command),
            types: CommandParser._getTypes(command),
            action: action
        });
    }

    parse(statement) {
        for (const command of this.commands) {
            const results = statement.match(command.regex);
            if (results) {
                const args = [];
                for (let i = 0; i < command.types.length; i++) {
                    const type = command.types[i];
                    const value = results[i + 1];

                    switch (type) {
                        case '{words}': {
                            args.push(value);
                            break;
                        }
                        case '{number}': {
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