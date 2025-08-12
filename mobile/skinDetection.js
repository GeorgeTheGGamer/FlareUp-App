import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
//import '@tensorflow/tfjs-platform-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native'

let cachedModel = null

const loadModel = async () => {
  if (cachedModel) {
    return cachedModel
  }

  try {
    await tf.ready()
    console.log("Loading Model from bundled assets")

    const modelUrl = bundleResourceIO(
      require('./assets/models/model.json'),
      [
        require('./assets/models/group1-shard1of12.bin'),
        require('./assets/models/group1-shard2of12.bin'),
        require('./assets/models/group1-shard3of12.bin'),
        require('./assets/models/group1-shard4of12.bin'),
        require('./assets/models/group1-shard5of12.bin'),
        require('./assets/models/group1-shard6of12.bin'),
        require('./assets/models/group1-shard7of12.bin'),
        require('./assets/models/group1-shard8of12.bin'),
        require('./assets/models/group1-shard9of12.bin'),
        require('./assets/models/group1-shard10of12.bin'),
        require('./assets/models/group1-shard11of12.bin'),
        require('./assets/models/group1-shard12of12.bin')
      ]
    );

    const model = await tf.loadGraphModel(modelUrl);
    console.log("Model has loaded successfully");
    console.log("Model input shape:", model.inputs[0].shape);
    console.log("Model output shape:", model.outputs[0].shape);

    cachedModel = model;
    return model;
  } catch (error) {
    console.error("Model loading error:", error);
    throw error;
  }
};

const makePrediction = async (processedImage) => {
  try {
    const model = await loadModel();

    if (!model) {
      throw new Error("Model failed to load")
    }

    console.log("Making Prediction")
    console.log("Input tensor shape:", processedImage.shape)
    
    const prediction = model.predict(processedImage)
    console.log("Prediction tensor shape:", prediction.shape)

    const results = await prediction.data()
    console.log("Raw prediction results:", results)

    prediction.dispose()

    return results
    
  } catch (error) {
    console.error("Prediction error:", error)
    throw error
  }
};

export default makePrediction