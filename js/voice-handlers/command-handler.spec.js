import CommandHandler from './command-handler';

describe('CommandHandler', () => {

    let commandHandler;
    
    beforeEach(() => {
        commandHandler = new CommandHandler();
        // register all handlers to be sure the tested handler is indeed invoked first
        commandHandler.onPlayCommand = () => true;
        commandHandler.onStopCommand = () => true;
        commandHandler.onStopListeningCommand = () => true;
        commandHandler.onBarCommand = () => true;
        commandHandler.onLoopBarsCommand = () => true;
    });

    it('Play My Test Song', () => {
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = commandHandler.handle('Play My Test Song');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBeUndefined();
        expect(result[2]).toBeUndefined();
    });

    it('Play My Test Song at 80%', () => {
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = commandHandler.handle('Play My Test Song at 80%');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBeUndefined();
    });

    it('Play My Test Song from bar 42', () => {
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = commandHandler.handle('Play My Test Song from bar 42');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(100);
        expect(result[2]).toBe(42);
    });

    it('Play My Test Song at 80% from bar 42', () => {
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = commandHandler.handle('Play My Test Song at 80% from bar 42');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBe(42);
    });

    it('Play My Test Song from bar 42 at 80%', () => {
        commandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = commandHandler.handle('Play My Test Song from bar 42 at 80%');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBe(42);
    });

    it('Bar 42', () => {
        commandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = commandHandler.handle('Bar 42');
        expect(result).toBe(42);
    });

    it('Bar42', () => {
        commandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = commandHandler.handle('Bar42');
        expect(result).toBe(42);
    });

    it('Baar 42', () => {
        commandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = commandHandler.handle('Baar 42');
        expect(result).toBe(42);
    });

    it('BA42', () => {
        commandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = commandHandler.handle('BA42');
        expect(result).toBe(42);
    });

    it('loop bar 42', () => {
        commandHandler.onLoopBarCommand = (barNumber) => barNumber;

        const result = commandHandler.handle('loop bar 42');
        expect(result).toBe(42);
    });

    it('loop from bar 42 through to bar 45', () => {
        commandHandler.onLoopBarsCommand = (fromBarNumber, toBarNumber) => [fromBarNumber, toBarNumber];

        const result = commandHandler.handle('loop from bar 42 through to bar 45');
        expect(result[0]).toBe(42);
        expect(result[1]).toBe(45);
    });

    it('stop', () => {
        commandHandler.onStopCommand = () => { return 'stopped'; };

        const result = commandHandler.handle('stop');
        expect(result).toBe('stopped');
    });

    it('stop listening', () => {
        commandHandler.onStopListeningCommand = () => { return 'stopped listening'; };

        const result = commandHandler.handle('stop listening');
        expect(result).toBe('stopped listening');
    });
});