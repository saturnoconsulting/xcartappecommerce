import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import formatPrice from '../utils/formatPrice';
import CustomText from './atoms/CustomText';
import { addFavorite, removeFavorite } from '../store/actions/favoriteActions';
import { isFavorite } from '../store/selectors/favoriteSelector';
import { getProductImage } from '../utils/images';

export default function ProductRow({ sourceScreen, product }) {
  const navigation = useNavigation();
  const tabNavigation = navigation.getParent();
  const dispatch = useDispatch();

  // Stato dei preferiti per questo prodotto
  const isFav = useSelector(isFavorite(product.externalid));

  const handlePress = () => {
    tabNavigation.navigate('Shop'); // Vai nel tab Negozio
    navigation.navigate("ProductDetails", { product, sourceScreen });
  };

  const toggleFavorite = () => {
    if (isFav) {
      dispatch(removeFavorite(product.externalid));
    } else {
      dispatch(addFavorite(product.externalid));
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={[styles.productCard, product.stock <= 0 && { backgroundColor: 'rgba(0, 0, 0, 0.04)', }]}>
        <Image source={getProductImage(product)} style={[
          styles.productImage,
          product.stock <= 0 && { opacity: 0.4 } 
        ]} />
        <View style={styles.productDetails}>
          <View style={styles.topRow}>
            {/*{
              product.type !== "virtual" && (
                <CustomText
                  style={{
                    textAlign: "left",
                    marginRight: 10,
                    fontSize: 13,
                    color: product.stock > 0 ? "green" : "#ab2431",
                  }}
                >
                  {product.stock ? "Disponibile" : "Esaurito"}
                </CustomText>
              )
            }*/}
            <CustomText style={styles.productTitle} numberOfLines={2}>
              {product.description || product.name}
            </CustomText>
            <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
              <CustomText style={[styles.heartIcon, isFav && styles.heartActive]}>
                {isFav ? "❤️" : "🤍"}
              </CustomText>
            </TouchableOpacity>
          </View>
          {/* Prezzo */}
          <View style={styles.bottomSection}>
            {product.discountprice ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomText
                  style={[styles.productPrice, { textDecorationLine: "line-through" }]}
                >
                  {formatPrice(product.price)}
                </CustomText>
                <CustomText style={[styles.productPrice, { marginLeft: 8 }]}>
                  {formatPrice(product.discountprice)}
                </CustomText>
              </View>
            ) : (
              <CustomText style={styles.productPrice}>{formatPrice(product.price)}</CustomText>
            )}
            <CustomText style={styles.productCategory} numberOfLines={2}>
              {product.category?.description || product.name}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCategory: {
    color: "black",
    textAlign: "right",
    flexShrink: 1,
    fontSize: 13,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    borderColor: "lightgrey",
    borderWidth: 0.4,
    height: 120,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heartButton: {
    marginBottom: 15,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  heartIcon: {
    fontSize: 20,
    color: "#999",
  },
  heartActive: {
    color: "#e63946", // rosso per i preferiti
  },
  productTitle: {
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    flexShrink: 1,
    marginTop: 0,
    marginBottom: 15,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    color: "black",
  },
});
