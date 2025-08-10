import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

const processImage = async (image) => {
    await tf.ready();

    try {
        const response = await fetch(image, {}, { isBinary: true });
        const imageData = await response.arrayBuffer();

        // Decode image to tensor 
        const imageTensor = decodeJpeg(new Uint8Array(imageData), 3);

        // Resize to 300 by 300
        const resized = tf.image.resizeBilinear(imageTensor, [300, 300]);

        // Normalise pixel from 0-255 to 0-1
        const normalized = resized.div(255.0);

        const batched = normalized.expandDims(0);

        console.log('Tensor Shape: ', batched.shape);

        // Clean up intermediate tensors
        imageTensor.dispose();
        resized.dispose();
        normalized.dispose();

        return batched;
        
    } catch (error) {
        alert(error);
        console.log(error);
    }
};

export default processImage;