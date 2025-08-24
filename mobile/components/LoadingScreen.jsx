import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white text-xl font-lufga-semibold mt-4">
        Analyzing Image...
      </Text>
      <Text className="text-white text-sm font-lufga-regular mt-2 text-center px-8">
        Our AI is processing your skin image. This may take a few moments.
      </Text>
    </View>
  )
}

export default LoadingScreen