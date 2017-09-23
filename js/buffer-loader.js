import '../vendor/kali.min.js'; /* global Kali */

export default class BufferLoader {

    static loadBuffer(context, fileData, playbackSpeed = 1.0, progressIntervalCount = 12, progressCallback = undefined) {
        return new Promise((resolve, reject) => {
            context.decodeAudioData(fileData, (buffer) => {
                const stretchedBuffer = BufferLoader._stretch(context, buffer, playbackSpeed, 2, false, progressIntervalCount, progressCallback);
                resolve(stretchedBuffer);
            }, (e) => {
                console.error(e);
                reject();
            });
        });
    }

    static _stretch(context, buffer, playbackSpeed, numChannels, bestQuality, progressIntervalCount, progressCallback) {

        if (playbackSpeed === 1.0) {
            return buffer;
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