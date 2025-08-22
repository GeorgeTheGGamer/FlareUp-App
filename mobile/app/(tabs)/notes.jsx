import { View, Text, Image, TouchableOpacity, Linking, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { ACCESS_TOKEN } from '@/tokenConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const BASEURL = process.env.EXPO_PUBLIC_API_URL             // Retrieve the Backend API


const notes = () => {

    //TODO Retrieve all Available notes for the Current User
    //TODO Could Try out caching the notes so we don't need to call the API all the Time
    //TODO If the notes List is Empty then Have a Disclaimer

    //! Change to false when ready to map all notes to show 
    const [isEmpty, setIsEmpty] = useState(true)       // Track when there are no Notes
    const [isLoading, setIsLoading] = useState(false)
    const [noteData, setNoteData] = useState({})
    const [error, setError] = useState(null)

    const retrieveNotesList = async () => {

        setIsLoading(true)

        try {
            const token = await AsyncStorage.getItem(ACCESS_TOKEN)

            const response = await axios.get(`${BASEURL}/api/notes/`, {
                headers : {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            // Used to manage the display of Data 
            //! Change to proper object name!!!
            if (response.data) {
                setNoteData(response.data)
                setIsEmpty(false)
                console.log("a")
            }
            else {
                setIsEmpty(true)
                console.log("b")
            }
            
            
        } catch (error) {
            setError(error)
            setNoteData({})
            
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
      retrieveNotesList()
    }, [])
    



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

                    <View className="text-center">
                        <Text className="text-white font-lufga-bold text-4xl text-center">Track Previous AI Skin Condition results</Text>

                    </View>
                    <View>
                        {isEmpty ? (
                            <View className=" flex-1 justify-center text-center shadow-black"><Text className="font-lufga-semibold text-[#00fbff] text-xl text-center">Make an AI Skin Condition Submission to view here</Text></View>
                        ) : (<Text>{/* Add Mapping of all the Notes */}</Text>)}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default notes

