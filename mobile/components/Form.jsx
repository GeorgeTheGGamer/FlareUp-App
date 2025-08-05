import { View, Text, TextInput } from 'react-native'
import { useState } from 'react'
import React from 'react'


const Form = ({title}) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
  return (
    <View className="flex-1 items-center">
      <Text className=" text-gray-100 font-lufga-extrabold text-4xl " >{title}</Text>
      <View className=" h-16 px-4 border-2 bg-black-100 border-black-500 rounded-2xl focus:border-x-secondary items-center flex-row m-5">
        
        <TextInput
        className="flex-1 text-white font-lufga-regular text-base"f
        onChangeText={() => setUsername()}
        value={username}
        
        />

                
        
        <TextInput 
        onChangeText={() => setPassword()}
        value={password}
        
        />
        

      </View>
    </View>
  )
}

export default Form