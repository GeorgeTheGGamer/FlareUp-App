import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
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
        
        // Resize to 240x240 (correct for EfficientNet-B1)
        const resized = tf.image.resizeBilinear(imageTensor, [240, 240])
        console.log('Resized image shape:', resized.shape)
        
        // EfficientNet preprocessing (NOT ImageNet normalization)
        const float32Image = resized.toFloat()
        
        // EfficientNet preprocessing: scale to [-1, 1] range
        const normalized = float32Image.div(255.0)  // First to [0, 1]
        const preprocessed = normalized.mul(2.0).sub(1.0)  // Then to [-1, 1]
        
        // Add batch dimension
        const batched = preprocessed.expandDims(0)
        console.log('Final tensor shape:', batched.shape)
        
        // Clean up intermediate tensors
        imageTensor.dispose()
        resized.dispose()
        float32Image.dispose()
        normalized.dispose()
        preprocessed.dispose()
        
        return batched;
        
    } catch (error) {
        console.error('Image processing error:', error)
        throw error
    }
};

export default processImage