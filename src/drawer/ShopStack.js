// src/drawer/ShopStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Shop from '../views/Shop';
import ProductDetails from '../views/ProductDetails';
import CategoryShop from '../views/CategoryShop';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';

const Stack = createStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={({ route }) => ({
          headerShown: true,
          title: "Dettaglio",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
        })}/>
      <Stack.Screen name="CategoryShop" component={CategoryShop} options={{ headerShown: true, title: "Negozio", headerStyle: { backgroundColor: backgroundcolor }, headerLeft: () => <CustomBackButton targetScreen="Shop" /> }} />
    </Stack.Navigator>
  );
}
