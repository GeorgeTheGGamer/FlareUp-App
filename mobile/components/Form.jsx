import { View, Text, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { Link } from 'expo-router'


const Form = ({ title, message, link, route }) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submit, setSubmit] = useState(false)

    useEffect(() => {
        if (submit === true) {
            setSubmit(false)
            router.push(route)
        }
    }, [submit])


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
                        value={username}
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
                        value={password}
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