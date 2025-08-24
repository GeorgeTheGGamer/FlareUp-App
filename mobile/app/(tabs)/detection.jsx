import { View, Text, ScrollView, Button, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import CustomButton from '@/components/CustomButton'
import SaveNote from '@/components/SaveNote'
import LoadingScreen from '@/components/LoadingScreen'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ACCESS_TOKEN } from '@/tokenConstants'


const BASEURL = process.env.EXPO_PUBLIC_API_URL


const detection = () => {
  const [image, setImage] = useState(null)
  const [submittedImage, setsubmittedImage] = useState(false)
  const [imagePredictions, setImagePredictions] = useState([])
  const [skinData, setSkinData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false) 
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // API call to get predictions from Django backend
  const getPredictionsFromAPI = async (imageUri) => {
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN)
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Create FormData to send image file
      const formData = new FormData()
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // or 'image/png' depending on your image
        name: 'image.jpg',
      })

      const response = await axios.post(`${BASEURL}/api/classify-skin-condition/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for model inference
      })

      console.log("Successfully predicted from API", response.data.probabilities)
      return response.data.probabilities
      
    } catch (error) {
      console.error("Error getting AI predictions:", error)
      if (error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }
      throw error
    }
  }

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
    setSkinData({})
    setShowResults(false)
    setTitle("")
    setDescription("")
  }

  // Take the Top 3 Predictions
  const topThreePredictions = (predictions, classes) => {
    // Index the probabilities
    const indexedPredictions = predictions.map((prob, index) => ({
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

  // Handle image submission and API call
  useEffect(() => {
    const handleImageSubmission = async () => {
      if (submittedImage == true) {
        setIsLoading(true)
        try {
          // Call Django API instead of local processing
          const predictionArray = await getPredictionsFromAPI(image)
          
          setImagePredictions(predictionArray)
          console.log("Predictions from API:", predictionArray)

          // Same class labels as your Django API
          const skin_classes = [
            "Acne", "Actinic_Keratosis", "Benign_tumors", "Bullous", 
            "Candidiasis", "DrugEruption", "Eczema", "Infestations_Bites", 
            "Lichen", "Lupus", "Moles", "Psoriasis", "Rosacea", 
            "Seborrh_Keratoses", "SkinCancer", "Sun_Sunlight_Damage", 
            "Tinea", "Unknown_Normal", "Vascular_Tumors", "Vasculitis", 
            "Vitiligo", "Warts"
          ];

          const top3 = topThreePredictions(predictionArray, skin_classes)

          const skinDataObject = {
            predictions: top3.map(pred => ({
              class: pred.class,
              probability: pred.probability
            }))
          }
          
          setSkinData(skinDataObject)
          console.log("Top 3 predictions completed", skinDataObject)
          setShowResults(true)
          
        } catch (error) {
          console.error("Error processing image:", error)
          // Show user-friendly error message
          alert("Failed to analyze image. Please try again or check your connection.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    handleImageSubmission()
    setsubmittedImage(false)
  }, [submittedImage])

  // Show results screen after processing
  if (showResults && skinData.predictions) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <SaveNote 
            skinData={skinData} 
            imagePredictions={imagePredictions} 
            title={title} 
            setTitle={setTitle} 
            description={description} 
            setDescription={setDescription} 
            image={image} 
            setShowResults={setShowResults} 
            clearImage={clearImage}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <LoadingScreen />
      </SafeAreaView>
    )
  }
  
  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Title at top of page */}
        <View className="pt-4 pb-6">
          <Text className="text-white text-4xl font-lufga-extrabold text-center">AI Skin Detection</Text>
        </View>

        {/* Main content area */}
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

export default detection
