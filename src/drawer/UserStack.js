import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import User from '../views/User';
import UserDetails from '../views/UserDetails';
import Orders from '../views/Orders';
import OrderDetails from '../views/OrderDetails';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';
import Favourite from '../views/Favorite';
import UserDetailsRecap from '../views/UserDetailsRecap';
import Returns from '../views/Returns';
import ReturnsDetails from '../views/ReturnsDetails';
import ProductDetails from '../views/ProductDetails';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true,
        headerStyle: { backgroundColor: backgroundcolor },
      }}
    >
      <Stack.Screen
        name="UserHome"
        component={User}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          headerShown: true,
          title: "Dettaglio Utente",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="UserDetailsRecap"
        component={UserDetailsRecap}
        options={{
          headerShown: true,
          title: "Dettaglio Utente",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({ route }) => ({
          headerShown: true,
          title: "Dettaglio",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen={route.params?.previousScreen || "Shop"} />
        })} />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          headerShown: true,
          title: "Ordini",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="Favorite"
        component={Favourite}
        options={{
          headerShown: true,
          title: "I tuoi preferiti",
          headerStyle: { backgroundColor: backgroundcolor },
          headerLeft: () => <CustomBackButton previousScreen="UserHome" />
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: true,
          title: "Dettaglio ordine",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="Returns"
        component={Returns}
        options={{
          headerShown: true,
          title: "Resi",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="ReturnsDetails"
        component={ReturnsDetails}
        options={{
          headerShown: true,
          title: "Dettaglio",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
    </Stack.Navigator>
  );
}
