import * as tf from '@tensorflow/tfjs';

const loadModel = async () => {
  try {
    // Host your model on a server or use expo-asset
    const modelUrl = '/Users/george_mahabir/GitHub_Repos/FlareUp-App/FlareUp-App/notebooks/tfjs_model/model.json';
    const model = await tf.loadLayersModel(modelUrl);
    return model;
  } catch (error) {
    console.log(error);
  }
};

export default loadModel