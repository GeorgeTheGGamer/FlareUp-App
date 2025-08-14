import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProtectedRoute from '@/components/ProtectedRoute'

const TabsLayout = () => {
  return (

    // Can Only Access these Tabs when Authenticated
    <ProtectedRoute>
      <Tabs screenOptions={{
      headerShown: false, 
      tabBarActiveTintColor: 'white', 
      tabBarInactiveTintColor: 'gray', 
      tabBarStyle: {
        backgroundColor: '#05306d', 
        borderTopWidth: 0.5, 
        borderTopColor: 'gray',
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      }
    }}>
      <Tabs.Screen
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
        name='homepage'
      />
      <Tabs.Screen 
        options={{
          title: "Detection",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="camera-alt" size={size} color={color} />
          ),
        }}
        name='detection'
      />
    </Tabs>
    </ProtectedRoute>
    
  )
}

export default TabsLayout