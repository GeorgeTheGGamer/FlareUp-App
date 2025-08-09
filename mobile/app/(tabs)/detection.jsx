import { View, Text, ScrollView, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'
import CustomButton from '@/components/CustomButton'
import loadModel from '@/skinDetection'

const detection = () => {
  const [image, setImage] = useState(null)
  const [submittedImage, setsubmittedImage] = useState(false)

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
  

  const clearImage = () => {
    setImage(null)
  }


  useEffect(() => {
    if (submittedImage == true) {

      // Add In API Logic


      // Add in model logic
      const model = loadModel()
      
    }
    
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

export default detection