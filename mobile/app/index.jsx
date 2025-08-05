import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text, View, Image } from 'react-native'
import { icons } from '../constants'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router'


const index = () => {
  return (
    // Allows for View on any device Screen 
    <SafeAreaView className="h-full bg-primary">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="flex-1 items-center mt-10">
          <Image resizeMode='contain' className="w-[300px] h-[180px]" source={icons.FlareUpLogo} />
          <Text className="text-5xl font-lufga-bold text-flare">Flare<Text className="text-up">Up</Text></Text>
          <Text className="mt-9 text-[30px] font-lufga-semibold text-white text-center">
            Determine Skin Conditions on the Go {''}
            <Text className="font-lufga-extrabold text-up">Anywhere</Text>
          </Text>
          <View className="flex-row flex-wrap justify-center px-6 mt-8">
            {['Acne', 'Actinic Keratosis', 'Benign Tumors', 'Bullous', 'Candidiasis', 'Drug Eruption', 'Eczema', 'Infestations & Bites', 'Lichen', 'Lupus', 'Moles', 'Psoriasis', 'Rosacea', 'Seborrheic Keratoses', 'Skin Cancer', 'Sun & Sunlight Damage', 'Tinea', 'Unknown Normal', 'Vascular Tumors', 'Vasculitis', 'Vitiligo', 'Warts'].map((condition, index) => (
              <View key={index} className="bg-white/20 rounded-full px-3 py-1 m-1">
                <Text className="text-white text-xs font-lufga-medium">{condition}</Text>
              </View>
            ))}
          </View>
          <View className="flex-1 flex-row justify-evenly items-center gap-8">
            <CustomButton title="Register" pressButton={() => {router.push("/register")}} />
            <CustomButton title="Login" pressButton={() => {router.push("/login")}} />
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default index