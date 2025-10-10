import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ReduxProvider } from './src/store';
import FlashMessage from 'react-native-flash-message';
import Login from './src/views/Login';
import MainDrawer from './src/drawer/MainDrawer';
import Register from './src/views/Register';
import ForgotPassword from './src/views/ForgotPassword';
//import * as ScreenOrientation from 'expo-screen-orientation';
//import DeviceInfo from 'react-native-device-info';

const Stack = createStackNavigator();

function AppContent() {

  // Lock orientamento
  /*useEffect(() => {
    async function lockOrientation() {
      const isTablet = await DeviceInfo.isTablet();
      if (isTablet) {
        await ScreenOrientation.unlockAsync();
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    }
    lockOrientation();
  }, []);*/

 /* useEffect(() => {
    async function checkForOTAUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Aggiornamento disponibile',
            'Riavviare l’app per applicare l’aggiornamento?',
            [
              { text: 'Più tardi', style: 'cancel' },
              { text: 'Aggiorna ora', onPress: () => Updates.reloadAsync() },
            ]
          );
        }
      } catch (e) {
        console.log('Errore OTA:', e);
      }
    }
    checkForOTAUpdate();
  }, []);*/

  //useNotifications(token); 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Recover" component={ForgotPassword} />
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ReduxProvider>
      <AppContent />
    </ReduxProvider>
  );
}
