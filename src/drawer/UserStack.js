import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import User from '../views/User';
import UserDetails from '../views/UserDetails';
import Orders from '../views/Orders';
import OrderDetails from '../views/OrderDetails';
import Subscriptions from '../views/Subscriptions';
import CustomBackButton from '../components/atoms/CustomBackHome';
import { backgroundcolor } from '../constants/colors';
import Tickets from '../views/Tickets';

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
          title: "Dettaglio Utente",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "Ordini",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          title: "Dettaglio ordine",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="Subscriptions"
        component={Subscriptions}
        options={{
          title: "I tuoi abbonamenti",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
      <Stack.Screen
        name="Tickets"
        component={Tickets}
        options={{
          title: "I tuoi biglietti",
          headerLeft: () => <CustomBackButton targetScreen="UserHome" />,
        }}
      />
    </Stack.Navigator>
  );
}
