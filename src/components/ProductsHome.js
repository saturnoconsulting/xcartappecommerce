import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import formatPrice from '../utils/formatPrice';
import { useNavigation } from '@react-navigation/native';
import CustomText from './atoms/CustomText';
import { placeholderImage } from '../constants/images';
import { useSelector, useDispatch } from 'react-redux';
import { isFavorite, selectFavorites } from '../store/selectors/favoriteSelector';
import { addFavorite, removeFavorite } from '../store/actions/favoriteActions';
import { primaryColor } from '../constants/colors';
import { getProductImage } from '../utils/images';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;

const ProductsHome = ({ products }) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  // prendiamo tutti i preferiti una sola volta
  const favorites = useSelector(selectFavorites);

  const toggleFavorite = (product) => {
    const fav = favorites.includes(product.externalid);
    if (fav) {
      dispatch(removeFavorite(product.externalid));
    } else {
      dispatch(addFavorite(product.externalid));
    }
  };

  const renderItem = ({ item }) => {
    const fav = favorites.includes(item.externalid);

    //console.log("item", item)

    return (
      <TouchableOpacity
        key={item.externalid}
        onPress={() =>
          navigate('ProductDetails', {
            product: item,
            sourceScreen: 'Dashboard',
          })
        }
        style={styles.card}
        activeOpacity={0.9}
      >
        {/* Pulsante preferito */}
        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={styles.heartButton}
        >
          <CustomText style={[styles.heartIcon, fav && styles.heartActive]}>
            {fav ? '❤️' : '🤍'}
          </CustomText>
        </TouchableOpacity>
        {/* Immagine prodotto */}
        <Image
          source={getProductImage(item)}
          style={styles.image}
          resizeMode="cover"
        />


        {/* Info prodotto */}
        <View style={styles.infoContainer}>
          <CustomText numberOfLines={2} style={styles.name}>
            {item.description || item.name}
          </CustomText>
          <CustomText style={styles.price}>
            {formatPrice(item.price)}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Prodotti in evidenza</CustomText>
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.externalid.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-around' }}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <CustomText style={{ marginLeft: 20, color: 'black' }}>
          Nessun prodotto presente al momento
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 40,
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: CARD_WIDTH,
    marginBottom: 20,
    borderWidth: 0.7,
    borderColor: '#e0e0e0ff',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  heartIcon: {
    fontSize: 22,
  },
  heartActive: {
    color: 'red',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  infoContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: '600',
    color: '#000',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 4,
  },
  price: {
    color: primaryColor,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProductsHome;
