import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar'

import { Stack } from 'expo-router'

export class AuthLayout extends Component {
  render() {
    return (
      <Stack>
        <Stack.Screen name='register' options={{headerShown: false}}/>
        <Stack.Screen name='login' options={{headerShown: false}} />
        <StatusBar style='light'/>
      </Stack>
    )
  }
}

export default AuthLayout