import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Automation from '../views/Automation';
import RoomDevices from '../views/RoomDevices';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';

const Stack = createStackNavigator();

export default function AutomationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        headerStyle: { backgroundColor: backgroundcolor },
      }}
    >
      <Stack.Screen
        name="Automation"
        component={Automation}
        options={{
          headerShown: true,
          title: "Domotica",
        }}
      />
      <Stack.Screen
        name="RoomDevices"
        component={RoomDevices}
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.roomName || "Dispositivi",
          headerLeft: () => <CustomBackButton targetScreen="Automation" />,
        })}
      />
    </Stack.Navigator>
  );
}
