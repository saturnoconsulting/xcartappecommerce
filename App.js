import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ReduxProvider } from './src/store';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Login from './src/views/Login';
import MainDrawer from './src/drawer/MainDrawer';
import Register from './src/views/Register';
import ForgotPassword from './src/views/ForgotPassword';
import { backgroundcolor } from './src/constants/colors';

const Stack = createStackNavigator();

function AppContent() {
  return (
    <NavigationContainer>
       <SafeAreaView style={{ flex: 1, backgroundColor: backgroundcolor }} edges={['top', 'left', 'right']}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Recover" component={ForgotPassword} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ReduxProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
