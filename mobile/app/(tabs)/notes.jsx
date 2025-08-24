import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { ACCESS_TOKEN } from '@/tokenConstants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { router } from 'expo-router'

const BASEURL = process.env.EXPO_PUBLIC_API_URL

const notes = () => {
    const [isEmpty, setIsEmpty] = useState(false)
    const [isLoading, setIsLoading] = useState(true) 
    const [notesList, setNotesList] = useState([]) 
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [imageErrors, setImageErrors] = useState(new Set()) // Track image loading errors

    const retrieveNotesList = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true)
        } else {
            setIsLoading(true)
        }
        setError(null)

        try {
            const token = await AsyncStorage.getItem(ACCESS_TOKEN)
            
            if (!token) {
                Alert.alert("Authentication Error", "Please log in again")
                router.push("/(auth)/sign-in")
                return
            }

            console.log("Fetching notes from:", `${BASEURL}/api/notes/`)

            const response = await axios.get(`${BASEURL}/api/notes/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            console.log("Notes response:", response.data)
            console.log("Notes count:", response.data?.length || 0)

            // Response.data should be an array of notes
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setNotesList(response.data)
                setIsEmpty(false)
                console.log("Notes loaded successfully:", response.data.length, "notes")
                
                // Log image URLs for debugging
                response.data.forEach((note, index) => {
                    if (note.skin_image) {
                        const imageUrl = getImageUrl(note.skin_image)
                        console.log(`Note ${index + 1} image URL:`, imageUrl)
                    }
                })
            } else {
                setNotesList([])
                setIsEmpty(true)
                console.log("No notes found or empty array")
            }
            
        } catch (error) {
            console.error("Error fetching notes:", error)
            console.error("Error response:", error.response?.data)
            
            setError(error.response?.data?.detail || error.message)
            setNotesList([])
            setIsEmpty(true)
            
            if (error.response?.status === 401) {
                Alert.alert("Session Expired", "Please log in again")
                await AsyncStorage.removeItem(ACCESS_TOKEN)
                router.push("/(auth)/sign-in")
            }
            
        } finally {
            setIsLoading(false)
            setRefreshing(false)
        }
    }

    // Helper function to construct proper image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) {
            return imagePath
        }
        
        // Remove leading slash if present to avoid double slashes
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
        
        // Construct full URL
        const fullUrl = `${BASEURL}/${cleanPath}`
        
        console.log("Constructed image URL:", fullUrl)
        return fullUrl
    }

    // Handle image loading errors
    const handleImageError = (noteId, imageUrl) => {
        console.error("Image loading error for note:", noteId, "URL:", imageUrl)
        setImageErrors(prev => new Set([...prev, noteId]))
    }

    // Delete a note
    const deleteNote = async (noteId) => {
        try {
            console.log("Attempting to delete note with ID:", noteId)
            
            const token = await AsyncStorage.getItem(ACCESS_TOKEN)
            
            if (!token) {
                Alert.alert("Authentication Error", "Please log in again")
                return
            }

            console.log("Delete URL:", `${BASEURL}/api/notes/delete/${noteId}/`)
            
            const response = await axios.delete(`${BASEURL}/api/notes/delete/${noteId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            console.log("Delete response status:", response.status)

            // Remove from local state
            const updatedNotes = notesList.filter(note => note.id !== noteId)
            setNotesList(updatedNotes)
            
            // Check if list is now empty
            if (updatedNotes.length === 0) {
                setIsEmpty(true)
            }

            Alert.alert("Success", "Note deleted successfully")

        } catch (error) {
            console.error("Error deleting note:", error)
            console.error("Delete error response:", error.response?.data)
            
            if (error.response?.status === 401) {
                Alert.alert("Authentication Error", "Session expired. Please log in again.")
                await AsyncStorage.removeItem(ACCESS_TOKEN)
                router.push("/(auth)/sign-in")
            } else if (error.response?.status === 404) {
                Alert.alert("Error", "Note not found or already deleted")
                // Remove from local state anyway
                const updatedNotes = notesList.filter(note => note.id !== noteId)
                setNotesList(updatedNotes)
                if (updatedNotes.length === 0) {
                    setIsEmpty(true)
                }
            } else {
                Alert.alert("Error", `Failed to delete note: ${error.response?.data?.detail || error.message}`)
            }
        }
    }

    const handleDeletePress = (noteId, title) => {
        Alert.alert(
            "Delete Note",
            `Are you sure you want to delete "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteNote(noteId) }
            ]
        )
    }

    const onRefresh = () => {
        setImageErrors(new Set()) // Clear image errors on refresh
        retrieveNotesList(true)
    }

    useEffect(() => {
        retrieveNotesList()
    }, [])

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView className="bg-primary h-full">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#00fbff" />
                    <Text className="text-white font-lufga-regular mt-4">Loading your notes...</Text>
                </View>
            </SafeAreaView>
        )
    }

    // Error state
    if (error && !refreshing) {
        return (
            <SafeAreaView className="bg-primary h-full">
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-red-400 font-lufga-semibold text-lg text-center mb-4">
                        Error loading notes
                    </Text>
                    <Text className="text-white font-lufga-regular text-center mb-4">
                        {error}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => retrieveNotesList()}
                        className="bg-[#00fbff] px-6 py-3 rounded-lg"
                    >
                        <Text className="text-black font-lufga-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 20,
                    paddingBottom: 20
                }}
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#00fbff"
                        colors={["#00fbff"]}
                    />
                }
            >
                <View className="items-center justify-start w-full pt-4">
                    {/* Header */}
                    <View className="text-center mb-6">
                        <Text className="text-white font-lufga-bold text-4xl text-center mb-2">
                            Track Previous AI Skin Condition Results
                        </Text>
                        <Text className="text-white/60 font-lufga-regular text-center">
                            Pull down to refresh
                        </Text>
                    </View>

                    {isEmpty ? (
                        /* Empty State */
                        <View className="flex-1 justify-center items-center mt-20 px-4">
                            <View className="bg-white/5 rounded-2xl p-8 items-center">
                                <Text className="font-lufga-semibold text-[#00fbff] text-xl text-center mb-4">
                                    No Analysis Results Yet
                                </Text>
                                <Text className="font-lufga-regular text-white/60 text-center mb-6">
                                    Make an AI Skin Condition Submission to view your saved results here
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => router.push("(tabs)/detection")}
                                    className="bg-[#00fbff] px-6 py-3 rounded-lg"
                                >
                                    <Text className="text-black font-lufga-semibold">Start Analysis</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* Notes List */
                        <View className="w-full">
                            <Text className="text-white font-lufga-semibold text-lg mb-4">
                                Your Saved Results ({notesList.length})
                            </Text>
                            
                            {notesList.map((note) => {
                                const imageUrl = getImageUrl(note.skin_image)
                                const hasImageError = imageErrors.has(note.id)
                                
                                return (
                                    <View key={note.id} className="bg-white/10 rounded-lg p-4 mb-4">
                                        {/* Header with title and delete button */}
                                        <View className="flex-row justify-between items-start mb-3">
                                            <Text className="text-white font-lufga-bold text-lg flex-1 mr-2">
                                                {note.title}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => handleDeletePress(note.id, note.title)}
                                                className="bg-red-500/20 px-3 py-1 rounded-md"
                                            >
                                                <Text className="text-red-400 font-lufga-semibold text-sm">Delete</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Description if exists */}
                                        {note.description && note.description.trim() && (
                                            <Text className="text-white/80 font-lufga-regular mb-3">
                                                {note.description}
                                            </Text>
                                        )}

                                        {/* Date */}
                                        <Text className="text-white/50 font-lufga-regular text-sm mb-3">
                                            {formatDate(note.created_at)}
                                        </Text>

                                        {/* Image if exists and no error */}
                                        {imageUrl && !hasImageError && (
                                            <View className="mb-3">
                                                <Image
                                                    source={{ uri: imageUrl }}
                                                    className="w-full h-48 rounded-lg"
                                                    resizeMode="cover"
                                                    onError={() => handleImageError(note.id, imageUrl)}
                                                />
                                            </View>
                                        )}

                                        {/* Image error fallback */}
                                        {imageUrl && hasImageError && (
                                            <View className="mb-3 bg-white/5 rounded-lg p-4 items-center justify-center h-48">
                                                <Text className="text-white/60 font-lufga-regular text-center">
                                                    Image could not be loaded
                                                </Text>
                                                <Text className="text-white/40 font-lufga-regular text-xs text-center mt-1">
                                                    {imageUrl}
                                                </Text>
                                            </View>
                                        )}

                                        {/* AI Analysis Results */}
                                        {note.skin_data?.predictions && Array.isArray(note.skin_data.predictions) && (
                                            <View className="bg-white/5 rounded-lg p-3">
                                                <Text className="text-white font-lufga-semibold mb-2 text-base">
                                                    AI Analysis Results:
                                                </Text>
                                                {note.skin_data.predictions.slice(0, 3).map((pred, index) => (
                                                    <View key={index} className="bg-white/10 p-2 rounded mb-2 last:mb-0">
                                                        <Text className="text-white font-lufga-regular">
                                                            {index + 1}. {pred.class?.replace(/_/g, ' ') || 'Unknown'} 
                                                        </Text>
                                                        <Text className="text-white/70 font-lufga-regular text-sm">
                                                            Confidence: {((pred.probability || 0) * 100).toFixed(1)}%
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default notes
