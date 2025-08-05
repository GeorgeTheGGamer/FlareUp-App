import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, pressButton}) => {

  return (
    <TouchableOpacity
    className=" bg-flare rounded-full m-3 w-[120px] h-[70px] items-center justify-center"
    activeOpacity={0.3}
    onPress={pressButton}>
      <Text className="text-2xl text-white font-lufga-bold">{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
