import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ACCESS_TOKEN } from "./constants"

// Store token in memory for synchronous access
let currentToken = null

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL 
})

// Initialize token from AsyncStorage
export const initializeToken = async () => {
    try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN)
        currentToken = token
    } catch (error) {
        console.log('Error loading token:', error)
    }
}

// Update token in both memory and AsyncStorage
export const setToken = async (token) => {
    currentToken = token
    if (token) {
        await AsyncStorage.setItem(ACCESS_TOKEN, token)
    } else {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
    }
}

api.interceptors.request.use(
    (config) => {
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api