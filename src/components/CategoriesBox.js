import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './atoms/CustomText';
import { placeholderImage } from '../constants/images';

const { width } = Dimensions.get('window');
const CATEGORY_BOX_WIDTH = (width - 45) / 2; // 2 colonne con margini

const CategoriesBox = ({ categories, loading }) => {
  const navigation = useNavigation();

  if (loading || !categories || categories.length === 0) {
    return null;
  }

  // Mostra solo le prime 4 categorie per non occupare troppo spazio
  const displayedCategories = categories.slice(0, 4);

  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category);
    // Naviga al tab Shop e poi alla schermata CategoryShop
    navigation.navigate('Shop', {
      screen: 'CategoryShop',
      params: {
        idCategory: category.externalid,
        sourceScreen: 'Dashboard',
        name: category.description,
      },
    });
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}></CustomText>
      <View style={styles.gridContainer}>
        {displayedCategories.map((category) => {
          const image = category?.imageUrl ? { uri: category.imageUrl } : placeholderImage;

          return (
            <TouchableOpacity
              key={category.externalid}
              onPress={() => handleCategoryPress(category)}
              style={styles.categoryBox}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={image}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                  <CustomText style={styles.categoryTitle} numberOfLines={2}>
                    {category.description || category.name}
                  </CustomText>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: CATEGORY_BOX_WIDTH,
    height: 180,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default CategoriesBox;
