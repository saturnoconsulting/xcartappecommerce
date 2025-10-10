import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";
import { primaryColor } from '../constants/colors';
import HomeStack from './HomeStack';
import ShopStack from './ShopStack';
import UserStack from './UserStack';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopWidth: 0,
                    position: 'absolute',
                    height: 80,
                    paddingBottom: 20,
                },
                tabBarActiveTintColor: primaryColor,
                tabBarInactiveTintColor: 'white',
            }}
        >

            {/*<Tab.Screen
                name="Shop"
                 component={Shop} 
                options={{
                    tabBarLabel: 'Shop',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bag-handle-outline" color={color} size={size} />
                    ),
                }}
            />*/}
            <Tab.Screen
                name="Shop"
                component={ShopStack}
                options={{
                    tabBarLabel: 'Shop',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bag-handle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            /* listeners={({ navigation }) => ({
                 tabPress: e => {
                     e.preventDefault();
                     navigation.navigate('Home', {
                         screen: 'Dashboard',
                     });
                 },
             })}*/
            />
            <Tab.Screen
                name="Profilo"
                component={UserStack}
                options={{
                    tabBarLabel: 'Profilo',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person-outline" color={color} size={size} />
                    ),
                }}
            />

            {/*<Tab.Screen
                name="Profilo"
                component={User}
                options={{
                    tabBarLabel: 'Profilo',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person-outline" color={color} size={size} />
                    ),
                }}
            />*/}
        </Tab.Navigator>
    );
}
