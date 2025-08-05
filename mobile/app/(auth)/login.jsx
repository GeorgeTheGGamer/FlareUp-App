import { Text, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Form from '@/components/Form'

export class login extends Component {
  render() {
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View>
            <Form title="Login"/>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default login