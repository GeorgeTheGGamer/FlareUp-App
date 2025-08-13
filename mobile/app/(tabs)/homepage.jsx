import { View, Text, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'


const BASEURL = process.env.EXPO_PUBLIC_SKINCONDITION_API_KEY

const homepage = () => {
  const [skinCondition, setSkinCondition] = useState("")
  const [skinData, setSkinData] = useState({})

  // Delay the inputted skin condition for reduced API calls 
  const [debouncedSearchTerm] = useDebounce(skinCondition, 500)

  const retrieveApiInfo = () => {
    axios
      .get(`${BASEURL}/${debouncedSearchTerm}`)
      .then((response) => {
        // Set Skin data 
        setSkinData(response.data)
      })

  }

  // Call the Api Once the skincondition changes and is not empty
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
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
          <View className="mb-8">
            <Text className="text-white mt-5 text-5xl font-lufga-bold text-center">
              Welcome <Text className="text-flare">User</Text>
            </Text>
            <Text className="text-white text-xl font-lufga-semibold text-center mt-5">
              Learn more about your Skin Condition... 🤔
            </Text>
          </View>

          <View className="bg-white w-[43vh] h-[65vh] justify-start items-center rounded-xl ">
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





          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default homepage