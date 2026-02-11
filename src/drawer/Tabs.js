import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/Ionicons";
import { backgroundcolor, primaryColor, secondaryColor } from '../constants/colors';
import HomeStack from './HomeStack';
import ShopStack from './ShopStack';
import UserStack from './UserStack';
import { useSelector } from 'react-redux';
import { GET_CART_LENGHT } from '../store/selectors/cartSelector';
import CartStack from './CartStack';
import { View, StyleSheet } from 'react-native';
import SearchStack from './SearchStack';
import AutomationStack from './AutomationStack';
import { appMode, enableEcommerce } from '../utils/brandConstants';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const cart_lenght = useSelector(GET_CART_LENGHT);
  const isDomoticaMode = appMode === 'domotica';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: backgroundcolor,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)',
          paddingBottom: 5,
        },
        tabBarActiveTintColor: secondaryColor,
        tabBarInactiveTintColor: 'black',
      }}
    >
      {enableEcommerce && (
        <Tab.Screen
          name="Shop"
          component={ShopStack}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <Icon name="bag-handle-outline" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Shop', { screen: 'Shop' });
              navigation.reset({
                index: 0,
                routes: [{ name: 'Shop' }],
              });
            },
          })}
        />
      )}

      {isDomoticaMode ? (
        // Modalità Domotica: Domotica, Home (centro), Profilo (e opzionalmente Shop se enableEcommerce)
        <>
          <Tab.Screen
            name="Domotica"
            component={AutomationStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="grid-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Domotica', { screen: 'Automation' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Domotica' }],
                });
              },
            })}
          />

          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Home', { screen: 'Dashboard' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              },
            })}
          />

          {enableEcommerce && (
            <>
              <Tab.Screen
                name="Cart"
                component={CartStack}
                options={{
                  tabBarLabel: '',
                  tabBarIcon: ({ color, size }) => (
                    <View>
                      <Icon name="cart-outline" color={color} size={size} />
                      {cart_lenght > 0 && <View style={styles.cartBadge} />}
                    </View>
                  ),
                }}
                listeners={({ navigation }) => ({
                  tabPress: e => {
                    e.preventDefault();
                    navigation.navigate('Cart', { screen: 'Cart' });
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Cart' }],
                    });
                  },
                })}
              />
            </>
          )}

          <Tab.Screen
            name="Profilo"
            component={UserStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="person-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Profilo', { screen: 'UserHome' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Profilo' }],
                });
              },
            })}
          />
        </>
      ) : (
        // Modalità Standard: Shop, Cerca, Home, Cart, Profilo
        <>
          <Tab.Screen
            name="Shop"
            component={ShopStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="bag-handle-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Shop', { screen: 'Shop' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Shop' }],
                });
              },
            })}
          />

          <Tab.Screen
            name="Cerca"
            component={SearchStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="search-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Cerca', { screen: 'Search' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Cerca' }],
                });
              },
            })}
          />

          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Home', { screen: 'Dashboard' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              },
            })}
          />
          <Tab.Screen
            name="Cart"
            component={CartStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <View>
                  <Icon name="cart-outline" color={color} size={size} />
                  {cart_lenght > 0 && <View style={styles.cartBadge} />}
                </View>
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Cart', { screen: 'Cart' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Cart' }],
                });
              },
            })}
          />

          <Tab.Screen
            name="Profilo"
            component={UserStack}
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color, size }) => (
                <Icon name="person-outline" color={color} size={size} />
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Profilo', { screen: 'UserHome' });
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Profilo' }],
                });
              },
            })}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -11,
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor: primaryColor,
  },
});
