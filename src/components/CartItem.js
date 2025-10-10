import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { formatCartPrice } from '../utils/formatCartPrice';
import { delFromCart } from '../api/cart';
import Icon from "react-native-vector-icons/Ionicons";
import CustomText from './atoms/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { placeholderImage } from '../constants/images';

export const CartItem = ({ item, refetchCart }) => {
  const [idcart, setIdcart] = useState(null);
  const [deleting, setDeleting] = useState(false); // 👈 stato loading


  useEffect(() => {
    const getCartId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("cartId");
        if (storedId) {
          setIdcart(storedId);
        }
      } catch (error) {
        console.error("Errore nel recupero del cartId:", error);
      }
    };
    getCartId();
  }, []);

  const deleteItem = async () => {
    if (!idcart || deleting) return;
    setDeleting(true); 

    const body = {
      idVariant: item.idVariant,
      idProduct: item.idProduct,
      idcart: idcart,
    };

    try {
      await delFromCart(body);
      refetchCart();
      
    } catch (error) {
      console.error("Errore durante la rimozione del prodotto:", error);
    }finally {
      setDeleting(false); // 👈 termina loading
    }
  };

  // Gestione immagine
  let image;
  if (item?.product?.image) {
    const imageUrl = item.product.image;
    image = { uri: imageUrl.includes("http") ? imageUrl : 'https://app.rugbylaquila.com/' + imageUrl };
  } else {
    image = placeholderImage;
  }

  return (
    <Pressable>
      <View style={styles.itemContainer}>
        <Image source={image} style={styles.productImage} />
        <View style={styles.productInfo}>
          <CustomText style={styles.productName}>
            {item.product?.name || item.product?.description}
          </CustomText>

          <View style={styles.productPriceContainer}>
            {item.product?.discountPrice ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomText style={styles.productPriceOld}>
                  {formatCartPrice(item.product.unitPrice)}
                </CustomText>
                <CustomText style={styles.productPrice}>
                  {formatCartPrice(item.product.discountPrice)}
                </CustomText>
              </View>
            ) : (
              <CustomText style={styles.productPrice}>
                {formatCartPrice(item.product.unitPrice)}
              </CustomText>
            )}
            <CustomText style={styles.qntItem}>x{item.qnt || 1}</CustomText>
          </View>
        </View>

       <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: 'red' }]}
          onPress={deleteItem}
          disabled={deleting} // 👈 disabilita durante loading
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="trash-outline" size={15} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productPriceOld: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    fontWeight: 'bold',
  },
  qntItem: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButton: {
    height: 30,
    width: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
