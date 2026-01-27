import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logo } from '../constants/images';
import { backgroundcolor } from '../constants/colors';
import CustomText from './atoms/CustomText';

const DashboardHeader = () => {
  const navigation = useNavigation();

  const handleLogoPress = () => {
    // Naviga alla Dashboard quando si preme il logo
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={handleLogoPress}
        activeOpacity={0.8}
        style={styles.logoContainer}
      >
        <CustomText style={styles.logoText} >Logo</CustomText>
       {/*<Image 
          source={logo} 
          style={styles.logo} 
          resizeMode="contain"
        />*/}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    width: '100%',
    //backgroundColor: "#000",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 30,
    resizeMode: 'contain',
  },
});

export default DashboardHeader;
