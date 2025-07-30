import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { InputScreen } from './src/screens/InputScreen';
import { AnswerScreen } from './src/screens/AnswerScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Input"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
      </Stack.Navigator>
      <StatusBar style="dark" />
      {/* 流式输出版本 */}
    </NavigationContainer>
  );
}
