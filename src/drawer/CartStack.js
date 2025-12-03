// src/drawer/CartStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cart from '../views/Cart';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';
import UserDetails from '../views/UserDetails';

const Stack = createStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          title: "Carrello",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen="Shop" />
        }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          headerShown: true,
          title: "Dettaglio Utente",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen="Cart" />
        }} />
    </Stack.Navigator>
  );
}
