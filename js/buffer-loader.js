import './kali.min.js'

export default class BufferLoader {

    static loadBuffer(context, fileData, playbackRate = 1.0, progressCallback = undefined) {
        return new Promise((resolve, reject) => {
            context.decodeAudioData(fileData, (buffer) => {
                let stretchedBuffer = BufferLoader._stretch(context, buffer, playbackRate, 2, false, progressCallback);
                resolve(stretchedBuffer);
            }, (e) => {
                console.error(e);
                reject();
            });
        });
    }

    static _stretch(context, buffer, playbackRate, numChannels, bestQuality, progressCallback) {

        if (playbackRate === 1.0) {
            return buffer;
        }

        let stretchSampleSize = 4096 * numChannels;

        let inputBufferSize = buffer.getChannelData(0).length;
        let outputBufferSize = Math.floor(inputBufferSize / playbackRate) + 1;

        let outputAudioBuffer = context.createBuffer(numChannels, outputBufferSize, context.sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            let inputData = buffer.getChannelData(channel);

            let kali = new Kali(1);
            kali.setup(context.sampleRate, playbackRate, !bestQuality);

            let outputData = new Float32Array(outputBufferSize);

            let inputOffset = 0;
            let completedOffset = 0;
            let loopCount = 0;
            let flushed = false;

            while (completedOffset < outputData.length) {
                if (progressCallback && loopCount % 100 === 0) {
                    progressCallback((completedOffset + outputBufferSize * channel) / (outputBufferSize * numChannels));
                }

                // Read stretched samples into outputData array
                completedOffset += kali.output(outputData.subarray(completedOffset, Math.min(completedOffset + stretchSampleSize, outputData.length)));

                if (inputOffset < inputData.length) {
                    // If we have more data to write, write it
                    let dataToInput = inputData.subarray(inputOffset, Math.min(inputOffset + stretchSampleSize, inputData.length));
                    inputOffset += dataToInput.length;

                    kali.input(dataToInput);
                    kali.process();
                } else if (!flushed) {
                    kali.flush();
                    flushed = true;
                }

                loopCount++;
            }

            outputAudioBuffer.getChannelData(channel).set(outputData);
        }

        if (progressCallback) {
            // 100%
            progressCallback(1);
        }
        return outputAudioBuffer;
    }
}