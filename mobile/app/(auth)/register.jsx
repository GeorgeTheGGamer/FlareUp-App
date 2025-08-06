import { Text, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Form from '@/components/Form'

export class Register extends Component {
  render() {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 justify-center">
            <Form title="Register" message="Have an account?" link="Login" route="/login"/>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Register