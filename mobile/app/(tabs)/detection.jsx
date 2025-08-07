import { View, Text, ScrollView, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker' // Changed to ImagePicker

const detection = () => {

  const [image, setImage] = useState(null)
  


  // ******************************** Taking and getting pictures ******************************

  // Pick Images from camera roll
  const pickImage = async () => {
    let result = await Imagepicker.launchImageLibraryAsync({
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

      // ******************************** Taking and getting pictures ******************************


    return (
      <SafeAreaView className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-4xl font-lufga-extrabold">AI Skin Detection </Text>
          </View>

          <View>
            <Button title="Take a Picture" onPress={takePhoto}/>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image ? <Image className="w-[100px] h-[100px]" source={{ uri: image }} /> : <Text>loading Image</Text>}

          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
  export default detection