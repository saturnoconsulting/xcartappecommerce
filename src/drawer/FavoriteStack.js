// src/drawer/CartStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';
import Favourite from '../views/Favorite';

const Stack = createStackNavigator();

export default function FavoriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Favorite"
        component={Favourite}
        options={{
          headerShown: true,
          title: "I tuoi preferiti",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen="Favoriti" />
        }}
      />
    </Stack.Navigator>
  );
}
