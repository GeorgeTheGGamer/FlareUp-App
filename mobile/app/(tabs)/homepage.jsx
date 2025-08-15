import { View, Text, Image, TouchableOpacity, Linking, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'
import { ACCESS_TOKEN } from '@/tokenConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Utilise the NHS Website Content API v2
// Currently Using the Sandbox since this is a development build 
// But Can Easily upgrade for production ready 


const BASEURL = process.env.EXPO_PUBLIC_API_URL

const homepage = () => {

  const [skinCondition, setSkinCondition] = useState("")
  const [skinData, setSkinData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState("")

  // Delay the inputted skin condition for reduced API calls 
  const [debouncedSearchTerm] = useDebounce(skinCondition, 1000)

  // Required when using the NHS API
  const NHSAttribution = ({ originalUrl }) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(originalUrl || 'https://www.nhs.uk')}
    >
      <Image
        source={{ uri: 'https://assets.nhs.uk/nhsuk-cms/images/nhs-attribution.width-510.png' }}
        style={{ width: 120, height: 40 }}
        resizeMode="contain"
      />
    </TouchableOpacity>
    
  )


  const retrieveUsername = async () => {
    try {

      const token = await AsyncStorage.getItem(ACCESS_TOKEN)

      const response = await axios.get(`${BASEURL}/api/user/details/`, {
        headers : {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setUsername(response.data.username)

      
    } catch (error) {
      
    }
  }

  const retrieveApiInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get Access Token stored in Async Storge
      const token = await AsyncStorage.getItem(ACCESS_TOKEN)

      // Format the search term (lowercase, replace spaces with hyphens)
      const formattedTerm = debouncedSearchTerm.toLowerCase().trim().replace(/\s+/g, '-')

      // Now call the Django API Endpoint
      const response = await axios.get(`${BASEURL}/api/nhs-data/${formattedTerm}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log("request sent to the NHS API")
      setSkinData(response.data.nhs_data)

    } catch (error) {
      setError(error)
      setSkinData({})
    } finally {
      setLoading(false)
    }
  }

  // Retrieve the Users Username on page start up
  useEffect(() => {
    retrieveUsername()
    
  }, [])
  

  // Call the Api Once the skincondition changes and is not empty
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
      // Everytime the debounced search term changes the retrieve the skinData
      setError(null)
      setSkinData({})
      retrieveApiInfo()
    }
  }, [debouncedSearchTerm])

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'start',
          alignItems: 'center',
          paddingHorizontal: 20
        }}
        className="flex-1"
      >
        <View className="items-center justify-center w-full">

          {/* Header */}
          <View className="mb-8">
            <Text className="text-white mt-5 text-4xl font-lufga-bold text-center">
              Welcome <Text className="text-flare">{username}</Text>
            </Text>
            <Text className="text-white text-xl font-lufga-semibold text-center mt-5">
              Learn more about your Skin Condition... 🤔
            </Text>
          </View>

          <View className="bg-white w-[43vh] h-[65vh] justify-start items-center rounded-xl p-2 ">

            {/* Search Bar */}
            <View className="mt-5 w-[40vh]">
              <View className="bg-white h-16 px-4 border-2 bg-black-100 border-black-500 rounded-2xl items-start">
                <TextInput
                  placeholder='Search up a Skin Condition'
                  autoCorrect={true}
                  className="flex-1 text-black font-lufga-semibold text-base"
                  value={skinCondition}
                  onChangeText={setSkinCondition}
                />
              </View>
            </View>



            {/* Displaying NHS Data */}
            <View>
              {!skinCondition ? (
                <Text className="text-gray-400 font-lufga text-[15px] text-center justify-center">Find out information about a skin condition anywhere on the go </Text>
              ) : loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : error ? (
                <Text>{error.message}</Text>
              ) : skinData && skinData.name ? (
                <View className="p-4">
                  {/* Title row with NHS attribution */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text className="text-2xl font-lufga-bold" style={{ flex: 1 }}>
                      {skinData.name}
                    </Text>
                    <NHSAttribution originalUrl={skinData.url} />
                  </View>

                  <Text className="text-gray-700 font-lufga text-lg">{skinData.description}</Text>
                </View>
              ) : null
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default homepage