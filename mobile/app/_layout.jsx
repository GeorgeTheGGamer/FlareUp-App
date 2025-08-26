import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import "../global.css"
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

SplashScreen.preventAutoHideAsync();  // Loading override

// Stack determines the main screens
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    // Lufga fonts
    "LufgaBlack": require("../assets/fonts/LufgaBlack.ttf"),
    "LufgaBold": require("../assets/fonts/LufgaBold.ttf"),
    "LufgaExtraBold": require("../assets/fonts/LufgaExtraBold.ttf"),
    "LufgaExtraLight": require("../assets/fonts/LufgaExtraLight.ttf"),
    "LufgaLight": require("../assets/fonts/LufgaLight.ttf"),
    "LufgaMedium": require("../assets/fonts/LufgaMedium.ttf"),
    "LufgaRegular": require("../assets/fonts/LufgaRegular.ttf"),
    "LufgaSemiBold": require("../assets/fonts/LufgaSemiBold.ttf"),
    "LufgaThin": require("../assets/fonts/LufgaThin.ttf"),
    
    // Luga fonts
    "luga": require("../assets/fonts/luga.ttf"),
    "luga_bold": require("../assets/fonts/luga_bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='(auth)' options={{headerShown: false}} />
      <Stack.Screen name='(tabs)' options={{headerShown: false}} />
      <StatusBar style='light'/>
    </Stack>
  )
}

export default RootLayout