export default class CommandParser {

    constructor() {
        this.commands = [];
    }

    static _getRegex(command) {
        return '^' + command
            .replace('{words}', '(.*)')
            .replace('{number}', '(.*)');
    }
    static _getType(command) {
        if (command.indexOf('{words}') >= 0) {
            return 'words';
        }
        if (command.indexOf('{number}') >= 0) {
            return 'number';
        }
    }
    addCommand(command, action) {
        this.commands.push({
            regex: CommandParser._getRegex(command),
            type: CommandParser._getType(command),
            action: action
        });
    }

    parse(statement) {
        for (const command of this.commands) {
            const results = statement.match(command.regex);
            if (results) {
                if (!command.type) {
                    return command.action();
                }

                const value = results[1];
                if (command.type === 'words') {
                    return command.action(value);
                }

                if (command.type === 'number') {
                    const valueAsNumber = Number.parseInt(value);
                    if (!Number.isNaN(valueAsNumber) && Number.isFinite(valueAsNumber)) {
                        return command.action(valueAsNumber);
                    }
                }    
            }
        }
    }
}