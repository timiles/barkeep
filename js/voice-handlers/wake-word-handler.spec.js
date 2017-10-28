import WakeWordHandler from './wake-word-handler';

describe('WakeWordHandler', () => {

    let wakeWordHandler;

    beforeEach(() => {
        wakeWordHandler = new WakeWordHandler();
        wakeWordHandler.onWakeWord = () => { return true; };
    });

    it('random words', () => {
        const result = wakeWordHandler.handle('random words');
        expect(result).toBeUndefined();
    });

    it('Barkeep', () => {
        const result = wakeWordHandler.handle('barkeep');
        expect(result).toBeTruthy();
    });

    it('Bar keep', () => {
        const result = wakeWordHandler.handle('bar keep');
        expect(result).toBeTruthy();
    });

    it('random words Barkeep', () => {
        const result = wakeWordHandler.handle('random words bar keep');
        expect(result).toBeTruthy();
    });
    
    it('Barkeep flom doo', () => {
        const result = wakeWordHandler.handle('bar keep flom doo');
        expect(result).toBeTruthy();
    });
    
    it('random words Barkeep flom doo', () => {
        const result = wakeWordHandler.handle('random words bar keep flom doo');
        expect(result).toBeTruthy();
    });
});