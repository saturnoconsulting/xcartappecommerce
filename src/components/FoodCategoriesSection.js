import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './atoms/CustomText';
import { useNavigation } from '@react-navigation/native';
import { primaryColor } from '../constants/colors';

const FoodCategoriesSection = () => {
  const navigation = useNavigation();

  const handleCategoryPress = (type) => {
    if (type === 'all') {
      // Naviga direttamente a Shop per mostrare tutte le categorie
      navigation.navigate('Shop', {
        screen: 'Shop',
      });
    } else {
      // Mappa i tipi ai nomi delle categorie
      const categoryNames = {
        recommended: 'Consigliati',
        box: 'Box',
        bestsellers: 'Più venduti',
      };
      
      // Naviga alla schermata Shop con i parametri appropriati
      navigation.navigate('Shop', {
        screen: 'CategoryShop',
        params: {
          categoryType: type,
          name: categoryNames[type] || 'Categoria',
          sourceScreen: 'Dashboard',
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Categorie</CustomText>
      <View style={styles.categoriesRow}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryPress('recommended')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Icon name="bulb-outline" size={24} color={primaryColor} />
          </View>
          <CustomText style={styles.categoryText}>Consigliati</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryPress('box')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Icon name="gift-outline" size={24} color={primaryColor} />
          </View>
          <CustomText style={styles.categoryText}>Box</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryPress('bestsellers')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Icon name="star-outline" size={24} color={primaryColor} />
          </View>
          <CustomText style={styles.categoryText}>Più venduti</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => handleCategoryPress('all')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Icon name="chevron-forward-outline" size={24} color={primaryColor} />
          </View>
          <CustomText style={styles.categoryText}>Tutte</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginLeft: 5,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default FoodCategoriesSection;
