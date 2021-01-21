import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from './App/Screens/Feed';
import Upload from './App/Screens/Upload';
import Profile from './App/Screens/Profile';
import Comment from './App/Screens/Comment';
import UserProfile from './App/Screens/UserProfile'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const TabStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" mode="modal" headerMode="none">
      <Stack.Screen name="Home" component={TabStack} />
      <Stack.Screen name="User" component={UserProfile} />
      <Stack.Screen name="Comments" component={Comment} />
    </Stack.Navigator>
  )
}

export default function App() {

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

