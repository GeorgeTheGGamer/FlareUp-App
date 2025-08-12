import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
//import '@tensorflow/tfjs-platform-react-native'; 
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

const processImage = async (imageUri) => {
    await tf.ready()

    try {
        console.log('Processing image:', imageUri)
        
        const response = await fetch(imageUri, {}, { isBinary: true })
        
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`)
        }
        
        const imageData = await response.arrayBuffer();
        console.log('Image data size:', imageData.byteLength, 'bytes')

        // Decode image to tensor 
        const imageTensor = decodeJpeg(new Uint8Array(imageData), 3)
        console.log('Original image shape:', imageTensor.shape)

        // Resize to 300 by 300
        const resized = tf.image.resizeBilinear(imageTensor, [300, 300])
        console.log('Resized image shape:', resized.shape)

        // EfficientNet Format
        const float32Image = resized.toFloat()
        const normalized = float32Image.div(255.0)
        const mean = tf.tensor([0.485, 0.456, 0.406])
        const std = tf.tensor([0.229, 0.224, 0.225])
        
        const preprocessed = normalized.sub(mean).div(std)

        // Add batch dimension
        const batched = preprocessed.expandDims(0)
        console.log('Final tensor shape:', batched.shape)

        // Clean up intermediate tensors
        imageTensor.dispose()
        resized.dispose()
        float32Image.dispose()
        normalized.dispose()
        preprocessed.dispose()
        mean.dispose()
        std.dispose()

        return batched;
        
    } catch (error) {
        console.error('Image processing error:', error)
        throw error
    }
};

export default processImage