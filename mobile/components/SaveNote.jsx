import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useState } from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ACCESS_TOKEN } from '@/tokenConstants'

const BASEURL = process.env.EXPO_PUBLIC_API_URL

const SaveNote = ({ skinData, title, setTitle, description, setDescription, image, setShowResults, clearImage 
}) => {

  const [isSaving, setIsSaving] = useState(false)

  const postApiInfo = async (noteData) => {
    try {
      setIsSaving(true)
      
      // Get token
      const token = await AsyncStorage.getItem(ACCESS_TOKEN)
      
      if (!token) {
        alert("Authentication token missing. Please log in again.")
        return false
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', noteData.title)
      formData.append('description', noteData.description || '')
      formData.append('skin_data', JSON.stringify(noteData.skinData))
      
      // Handle image upload
      if (noteData.image) {
        const uriParts = noteData.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('skin_image', {
          uri: noteData.image,
          name: `skin_image.${fileType}`,
          type: `image/${fileType}`,
        })
      }

      console.log("Making request to:", `${BASEURL}/api/notes/`)
      console.log("FormData contents:", {
        title: noteData.title,
        description: noteData.description,
        hasImage: !!noteData.image,
        skinDataKeys: Object.keys(noteData.skinData || {})
      })
      
      const response = await axios.post(`${BASEURL}/api/notes/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - let axios handle it automatically
        },
        timeout: 30000, // 30 second timeout
      })

      if (response.status === 201 || response.status === 200) {
        console.log("Successfully Posted Note to Backend API")
        alert("Successfully Saved Note")
        
        // Clear form and navigate
        setTitle("")
        setDescription("")
        setShowResults(false)
        clearImage()
        router.push("(tabs)/notes")
        
        return true
      }
      
    } catch (error) {
      console.error("Full error:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      
      if (error.response?.status === 400) {
        console.error("Bad Request Details:", error.response.data)
        alert("Bad Request: " + JSON.stringify(error.response.data))
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.")
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        router.push("/(auth)/sign-in")
      } else {
        alert("Error Saving Note: " + (error.response?.data?.detail || error.message))
      }
      return false
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle saving note
  const handleSaveNote = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your note")
      return
    }

    // Validate required data
    if (!skinData || !skinData.predictions) {
      alert("No skin analysis data found")
      return
    }

    const noteData = {
      title: title.trim(),
      description: description.trim(),
      skinData: skinData,
      image: image
    }

    console.log("Saving note:", {
      title: noteData.title,
      description: noteData.description,
      hasImage: !!noteData.image,
      skinDataPresent: !!noteData.skinData,
      predictionsCount: noteData.skinData?.predictions?.length || 0
    })
    
    // Post to API
    await postApiInfo(noteData)
  }

  // Handle back button
  const handleBack = () => {
    setShowResults(false)
    clearImage()
  }

  return (
    <View className="flex-1">
      {/* Title at top */}
      <View className="pt-4 pb-6">
        <Text className="text-white text-4xl font-lufga-extrabold text-center">Detection Results</Text>
      </View>

      {/* Results */}
      <View className="mx-4 mb-6">
        <Text className="text-white text-xl font-lufga-bold mb-4 text-center">
          AI Analysis Results
        </Text>
        {skinData.predictions?.map((pred, index) => (
          <View key={index} className="bg-white/10 p-4 mb-3 rounded-lg">
            <Text className="text-white font-lufga-semibold text-lg">
              {index + 1}. {pred.class.replace(/_/g, ' ')}
            </Text>
            <Text className="text-white/80 font-lufga-regular text-base">
              Confidence: {(pred.probability * 100).toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>

      {/* Form */}
      <View className="mx-4 mb-6">
        <Text className="text-white text-lg font-lufga-semibold mb-3">Save This Detection</Text>

        {/* Title Input */}
        <TextInput
          className="bg-white p-4 rounded-lg mb-3 font-lufga-regular"
          placeholder="Enter note title..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          editable={!isSaving}
        />

        {/* Description Input */}
        <TextInput
          className="bg-white p-4 rounded-lg mb-4 font-lufga-regular"
          placeholder="Enter description (optional)..."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!isSaving}
        />

        {/* Buttons */}
        <View className="flex-row gap-4 justify-center">
          <CustomButton
            title={isSaving ? "Saving..." : "Save Note"}
            pressButton={handleSaveNote}
            disabled={isSaving}
          />
          <CustomButton
            title="Back"
            pressButton={handleBack}
            disabled={isSaving}
          />
        </View>
      </View>
    </View>
  )
}

export default SaveNote