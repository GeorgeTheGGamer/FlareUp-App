import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../tokenConstants'
import { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { ActivityIndicator, View } from 'react-native'

const ProtectedRoute = ({children}) => {

   const [isAuthorized, setisAuthorized] = useState(null)

   // On initialisation this block is run. Run authentication and if there is an error then set to false 
   useEffect(() => {
       auth().catch(() => setisAuthorized(false))
   }, [])

   // Navigate to login when not authorized
   useEffect(() => {
       if (isAuthorized === false) {
           router.push("/login")
       }
   }, [isAuthorized])

   const retrieveToken = async (token) => {
       try {
           const outputToken = await AsyncStorage.getItem(token)
           return outputToken
       } catch (error) {
           console.log('Error loading access token: ', error)
           return null
       }
   }


   const refreshToken = async () => {
       const refreshToken = await retrieveToken(REFRESH_TOKEN)
       
       if (!refreshToken) {
           setisAuthorized(false)
           return
       }

       try {
           // Create new refresh token and assign it as the one in local storage 
           const response = await api.post("/api/token/refresh/", {refresh: refreshToken})
           
           // If there is a success 
           if (response.status === 200) {
               // Set the access token from the response 
               await AsyncStorage.setItem(ACCESS_TOKEN, response.data.access)
               setisAuthorized(true)
           } else {
               setisAuthorized(false)
           }
           
       } catch (error) {
           setisAuthorized(false)
           console.log('Refresh token error:', error)
       }
   }

   const auth = async () => {
       const token = await retrieveToken(ACCESS_TOKEN)

       // Ensure there is a token in local storage 
       if (!token) {
           setisAuthorized(false)
           return 
       }

       try {
           // Decode the jwt token, expiration of token and the current time (both in seconds)
           const decoded = jwtDecode(token)
           const tokenExpiration = decoded.exp
           const now = Date.now() / 1000

           // If the token is expired then refresh the token 
           if (tokenExpiration < now) {
               await refreshToken()
           } else {
               // Then there is a token and it has not expired
               setisAuthorized(true)
           }
       } catch (error) {
           console.log('Token decode error:', error)
           setisAuthorized(false)
       }
   }

   // Loading until the authorization has been decided
   if (isAuthorized === null) {
       return (
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               <ActivityIndicator size="large" color="#0000ff" />
           </View>
       )
   }
 
   // If not authorized, return loading while navigation happens
   if (isAuthorized === false) {
       return (
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
               <ActivityIndicator size="large" color="#0000ff" />
           </View>
       )
   }

   // If authorized, show the protected content
   return children
}

export default ProtectedRoute