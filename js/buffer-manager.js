import '../vendor/kali.min.js'; /* global Kali */

export default class BufferManager {

    constructor(context) {
        this.context = context;
        this.bufferMap = new Map();
    }

    loadBuffer(songName, fileData) {
        return new Promise((resolve, reject) => {
            this.context.decodeAudioData(fileData, (buffer) => {
                // set original buffer @1 x speed
                this.bufferMap.set(songName + '@1', buffer);
                resolve();
            }, (e) => {
                console.error(e);
                reject();
            });
        });
    }

    getBuffer(songName, playbackSpeed = 1, progressIntervalCount = 12, progressCallback = undefined) {
        const bufferKey = songName + '@' + playbackSpeed;
        if (this.bufferMap.has(bufferKey)) {
            return this.bufferMap.get(bufferKey);
        }

        const buffer = BufferManager._stretch(this.context,
            // retrieve original buffer @1 x speed
            this.bufferMap.get(songName + '@1'), playbackSpeed, 2, false, progressIntervalCount, progressCallback);
        this.bufferMap.set(bufferKey, buffer);
        return buffer;
    }

    static _stretch(context, buffer, playbackSpeed, numChannels, bestQuality, progressIntervalCount, progressCallback) {

        if (playbackSpeed === 1.0) {
            return buffer;
        }

        if (progressCallback) {
            progressCallback(0);
        }

        const stretchSampleSize = 4096 * numChannels;
        const inputBufferSize = buffer.getChannelData(0).length;
        const outputBufferSize = Math.floor(inputBufferSize / playbackSpeed) + 1;

        const outputAudioBuffer = context.createBuffer(numChannels, outputBufferSize, context.sampleRate);

        let progressCounter = 0;
        const progressIntervalSize = Math.floor(outputBufferSize * numChannels / progressIntervalCount);

        for (let channel = 0; channel < numChannels; channel++) {
            const inputData = buffer.getChannelData(channel);

            const kali = new Kali(1);
            kali.setup(context.sampleRate, playbackSpeed, !bestQuality);

            const outputData = new Float32Array(outputBufferSize);

            let inputOffset = 0;
            let completedOffset = 0;
            let flushed = false;

            while (completedOffset < outputData.length) {
                while (progressCallback && progressCounter >= progressIntervalSize) {
                    progressCallback((completedOffset + outputBufferSize * channel) / (outputBufferSize * numChannels));
                    progressCounter -= progressIntervalSize;
                }

                // Read stretched samples into outputData array
                const framesCompleted = kali.output(outputData.subarray(completedOffset, Math.min(completedOffset + stretchSampleSize, outputData.length)));
                completedOffset += framesCompleted;
                progressCounter += framesCompleted;

                if (inputOffset < inputData.length) {
                    // If we have more data to write, write it
                    const dataToInput = inputData.subarray(inputOffset, Math.min(inputOffset + stretchSampleSize, inputData.length));
                    inputOffset += dataToInput.length;

                    kali.input(dataToInput);
                    kali.process();
                } else if (!flushed) {
                    kali.flush();
                    flushed = true;
                }
            }

            outputAudioBuffer.getChannelData(channel).set(outputData);
        }

        return outputAudioBuffer;
    }
}