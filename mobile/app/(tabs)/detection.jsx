import { View, Text, ScrollView, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import CustomButton from '@/components/CustomButton'
import makePrediction from '@/skinDetection'
import processImage from '@/imageProcessing'

const detection = () => {
  const [image, setImage] = useState(null)
  const [submittedImage, setsubmittedImage] = useState(false)
  const [imagePredictions, setImagePredictions] = useState([])
  const [skinData, setSkinData] = useState({})
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [saveNote, setSaveNote] = useState(false)

  // Pick Images from camera roll
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // Take image with camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  

  // Choose a Different Image
  const clearImage = () => {
    setImage(null)
    setImagePredictions([])
  }


  // Take the Top 3 Predictions
  const topThreePredictions = (predicitions, classes) => {

    // Index the probabilites
    const indexedPredictions = predicitions.map((prob, index) => ({
      index: index,
      probability: prob,
      class: classes[index]
    }))

    // Sort for the top 3
    const top3 = indexedPredictions
                  .sort((a,b) => b.probability - a.probability)
                  .slice(0,3)


    console.log("Retrieved the Top 3")
    return top3

  }




  // Process and Predict Image Class
  useEffect(() => {
  const handleImageSubmission = async () => {
    if (submittedImage == true) {
      try {
        const processedImage = await processImage(image)
        console.log("hello image processed", processedImage.shape)

        const prediction = await makePrediction(processedImage)
        console.log("Image has been Predicted")
        
        const predictionArray = Array.from(prediction)
        setImagePredictions(predictionArray)
        console.log(predictionArray)

        // Use predictionArray directly, not imagePredictions state
        const skin_classes = ["Acne", "Actinic_Keratosis", "Benign_tumors", "Bullous", "Candidiasis", "DrugEruption", "Eczema", "Infestations_Bites", "Lichen", "Lupus", "Moles", "Psoriasis", "Rosacea", "Seborrh_Keratoses", "SkinCancer", "Sun_Sunlight_Damage", "Tinea", "Unknown_Normal", "Vascular_Tumors", "Vasculitis", "Vitiligo", "Warts"];

        const top3 = topThreePredictions(predictionArray, skin_classes)

        const skinDataObject = {
          predictions: top3.map(pred => ({
            class: pred.class,
            probability: pred.probability
          }))
        }
        
        setSkinData(skinDataObject)
        console.log("Top 3 predictions completed", skinDataObject)
        
      } catch (error) {
        console.error("Error processing image:", error)
      }
    }
  }

  handleImageSubmission()
  setsubmittedImage(false)
}, [submittedImage])
  

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-4xl font-lufga-extrabold">AI Skin Detection</Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <View className="w-[375px] h-[400px] bg-white m-5 rounded-2xl justify-center items-center">
            {image ? (
              <Image
                resizeMode='contain'
                className="w-[300px] h-[300px] rounded-2xl"
                source={{ uri: image }}
              />
            ) : (
              <Text className="text-gray-900 font-lufga-semibold">Take a Picture 😊</Text>
            )}
          </View>

          


          {/* Submit/Clear buttons - only show when image exists */}
          {image ? (
            <View className="items-center mt-5">
              <Text className="text-white font-lufga-semibold mb-4">Do you want to choose this image?</Text>
              <View className="flex-row gap-4">
                <CustomButton title="Submit" pressButton={() => {setsubmittedImage(true)}} />
                <CustomButton title="Clear" pressButton={clearImage} />
              </View>
            </View>
          ) : (
            <View className="flex-row gap-4 mb-4 mt-9">
              <CustomButton title="Take Photo" pressButton={takePhoto} />
              <CustomButton title="Pick Photo" pressButton={pickImage} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

//TODO While image is processing have a loading Screen.
//TODO THen take to another Screen where you can either save the note or go back?
//TODO THis Handles the Call to the Backend API. Send Through the Image and Skin Data Object and handle the Title, Description and Authentication Seperately
export default detection