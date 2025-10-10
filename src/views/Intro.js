import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { GET_USER } from '../store/selectors/userSelector';
import CustomText from '../components/atoms/CustomText';

const Intro = () => {
  const navigation = useNavigation();
  const user = useSelector(GET_USER);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user && user.token) {
        navigation.replace('MainDrawer');
      } else {
        navigation.replace('Login');
      }
    }, 2000); // mostra lo splash per 2 secondi

    return () => clearTimeout(timeout);
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/logo.png')} // personalizza con il tuo logo
        style={styles.logo}
        resizeMode="contain"
      />
      <CustomText style={styles.text}>Benvenuto in EventMaster!</CustomText>
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
