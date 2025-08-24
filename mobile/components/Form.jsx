import { View, Text, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { Link } from 'expo-router'
import api from '@/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/tokenConstants'

const Form = ({ title, message, link, route, apiRoute}) => {

    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        if (submit === true) {
            setSubmit(false)
            handleSubmit()
        }
    }, [submit])



    const handleSubmit = async () => {


        try {
            // Post User Information to the backend API
            const response = await api.post(apiRoute, {
                username: Username,
                password: Password
            })

            if (title === "Login") {
                await AsyncStorage.setItem(ACCESS_TOKEN, response.data.access)
                await AsyncStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                // Encaptualted by a Protected Route
                router.push(route)          // If Login then go to the homepage
            } else {
                router.push(route)          // If Register then go to the login page
            }
      
        } catch (error) {
            alert("Login failed: " + error.message)
            
        }
    }

    return (
        <View className="px-5"> 
            <Text className="mt-3 text-gray font-lufga-extrabold text-[45px] text-center  mb-8">{title}</Text>

            {/* Username Field */}
            <View className="mb-4">
                <Text className="text-xl font-lufga-semibold mb-2 text-left">Username</Text>
                <View className="bg-white h-16 px-4 border-2 bg-black-100 border-black-500 rounded-2xl items-center flex-row">
                    <TextInput
                        placeholder='Username'
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="flex-1 text-gray-900 font-lufga-semibold text-base"
                        onChangeText={(text) => setUsername(text)}
                        value={Username}
                    />
                </View>
            </View>


            {/* Password Field */}
            <View className="mb-4">
                <Text className="text-xl font-lufga-semibold mb-2 text-left">Password</Text>
                <View className="bg-white h-16 px-4 border-2 bg-black-100 border-black-500 rounded-2xl items-center flex-row">
                    <TextInput
                        placeholder='Password'
                        autoComplete='password'
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        className="flex-1 text-gray-900 font-lufga-semibold text-base"
                        onChangeText={(text) => setPassword(text)}
                        value={Password}
                    />
                </View>
            </View>

            {/* Registeration */}
            <View className="mt-4 items-center justify-center">
                <CustomButton title="Submit" pressButton={() => { setSubmit(true) }} />
                <View className="mt-4 flex-row items-center">
                    <Text className="text-lg font-lufga-regular">{message}</Text>
                    <Link className="text-white italic font-lufga-regular text-lg" href={title == "Login" ? "/register" : "/login"}>{link}</Link>
                </View>
            </View>
        </View>
    )

}

export default Form









//Todo 
// Finish Login and Register Authentication
// Use NHS API In the backend
// Display the Users name for the Welcome
// Save the Users Detection Data in the Backend
// Save the Users Taken Image in the Backend
// New Tab where you can view Previous Scans and output the Data with the Image
//* Then Finally Have the model in the Backend API
//* Fix the Model
//* Make the Database a postgres 

//! Finished
//! Do a leetcode for the fun of the game