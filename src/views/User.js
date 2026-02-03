import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Loading from '../components/Loading';
import CustomText from '../components/atoms/CustomText';
import { logout } from '../api/user';
import { backgroundcolor, primaryColor } from '../constants/colors';
import Separator from '../components/atoms/Separator';
import { xEventsWidget, xEventsWidgetSubscriptions, xEventsWidgetTickets, xLivingWidget } from '../utils/brandConstants';
import { ScrollView } from 'react-native-gesture-handler';

const User = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);

  const goToHomeStack = async (screenName) => {
    try {
      setLoading(true);
      const tabNavigation = navigation.getParent();
      //tabNavigation.navigate('User');
      navigation.navigate(screenName);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      console.error('Errore durante il logout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
      {loading && <Loading />}

      <CustomText style={styles.titleSection}>Area Utente</CustomText>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
        <View style={styles.menuContainer}>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goToHomeStack('UserDetailsRecap')}
          >
            <CustomText style={styles.menuText}>Profilo</CustomText>
          </TouchableOpacity>

          <Separator />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goToHomeStack('Orders')}
          >
            <CustomText style={styles.menuText}>Ordini</CustomText>
          </TouchableOpacity>

          <Separator />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goToHomeStack('Returns')}
          >
            <CustomText style={styles.menuText}>Resi</CustomText>

          </TouchableOpacity>

          <Separator />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => goToHomeStack('Favorite')}
          >
            <CustomText style={styles.menuText}>Preferiti</CustomText>
          </TouchableOpacity>

          {xEventsWidget && xEventsWidgetSubscriptions && (
            <>
            <Separator />
              <TouchableOpacity style={styles.menuItem} onPress={() => goToHomeStack('Subscriptions')}>
                <CustomText style={styles.menuText}>Abbonamenti</CustomText>
              </TouchableOpacity>
            </>
          )}

          {xEventsWidgetTickets && (
            <>
              <Separator />
              <TouchableOpacity style={styles.menuItem} onPress={() => goToHomeStack('Subscriptions')}>
                <CustomText style={styles.menuText}>Biglietti</CustomText>
              </TouchableOpacity>
            </>
          )}

          {xLivingWidget && (
            <>
            <Separator />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => goToHomeStack('Automation')}
            >
              <CustomText style={styles.menuText}>Domotica</CustomText>
            </TouchableOpacity>
          </>
        )}

          <Separator />

          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="log-out-outline" size={22} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: backgroundcolor,
  },
  menuItem: {
    marginTop: 10,
    backgroundColor: backgroundcolor,
    padding: 16,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default User;
