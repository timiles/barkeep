import VoiceCommandHandler from './voice-command-handler';

describe('VoiceCommandHandler', () => {

    let voiceCommandHandler;
    
    beforeEach(() => {
        voiceCommandHandler = new VoiceCommandHandler();
        // register all handlers to be sure the tested handler is indeed invoked first
        voiceCommandHandler.onPlayCommand = () => true;
        voiceCommandHandler.onStopCommand = () => true;
        voiceCommandHandler.onStopListeningCommand = () => true;
        voiceCommandHandler.onBarCommand = () => true;
        voiceCommandHandler.onLoopBarsCommand = () => true;
    });

    it('Play My Test Song', () => {
        voiceCommandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = voiceCommandHandler.handle('Play My Test Song');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBeUndefined();
        expect(result[2]).toBeUndefined();
    });

    it('Play My Test Song at 80%', () => {
        voiceCommandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = voiceCommandHandler.handle('Play My Test Song at 80%');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBeUndefined();
    });

    it('Play My Test Song from bar 42', () => {
        voiceCommandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = voiceCommandHandler.handle('Play My Test Song from bar 42');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(100);
        expect(result[2]).toBe(42);
    });

    it('Play My Test Song at 80% from bar 42', () => {
        voiceCommandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = voiceCommandHandler.handle('Play My Test Song at 80% from bar 42');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBe(42);
    });

    it('Play My Test Song from bar 42 at 80%', () => {
        voiceCommandHandler.onPlayCommand = (input, playbackSpeedPercent, fromBarNumber) => {
            return [input, playbackSpeedPercent, fromBarNumber];
        };

        const result = voiceCommandHandler.handle('Play My Test Song from bar 42 at 80%');
        expect(result[0]).toBe('My Test Song');
        expect(result[1]).toBe(80);
        expect(result[2]).toBe(42);
    });

    it('Bar 42', () => {
        voiceCommandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = voiceCommandHandler.handle('Bar 42');
        expect(result).toBe(42);
    });

    it('Bar42', () => {
        voiceCommandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = voiceCommandHandler.handle('Bar42');
        expect(result).toBe(42);
    });

    it('Baar 42', () => {
        voiceCommandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = voiceCommandHandler.handle('Baar 42');
        expect(result).toBe(42);
    });

    it('BA42', () => {
        voiceCommandHandler.onBarCommand = (barNumber) => { return barNumber; };

        const result = voiceCommandHandler.handle('BA42');
        expect(result).toBe(42);
    });

    it('loop bar 42', () => {
        voiceCommandHandler.onLoopBarCommand = (barNumber) => barNumber;

        const result = voiceCommandHandler.handle('loop bar 42');
        expect(result).toBe(42);
    });

    it('loop from bar 42 through to bar 45', () => {
        voiceCommandHandler.onLoopBarsCommand = (fromBarNumber, toBarNumber) => [fromBarNumber, toBarNumber];

        const result = voiceCommandHandler.handle('loop from bar 42 through to bar 45');
        expect(result[0]).toBe(42);
        expect(result[1]).toBe(45);
    });

    it('stop', () => {
        voiceCommandHandler.onStopCommand = () => { return 'stopped'; };

        const result = voiceCommandHandler.handle('stop');
        expect(result).toBe('stopped');
    });

    it('stop listening', () => {
        voiceCommandHandler.onStopListeningCommand = () => { return 'stopped listening'; };

        const result = voiceCommandHandler.handle('stop listening');
        expect(result).toBe('stopped listening');
    });
});