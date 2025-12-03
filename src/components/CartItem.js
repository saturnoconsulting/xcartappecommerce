import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { formatCartPrice } from '../utils/formatCartPrice';
import { addToCart, delFromCart } from '../api/cart';
import Icon from "react-native-vector-icons/Ionicons";
import CustomText from './atoms/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { placeholderImage } from '../constants/images';
import { showMessage } from 'react-native-flash-message';
import { primaryColor } from '../constants/colors';
import useFetchProductStock from '../hooks/useFetchProductStock';

export const CartItem = ({ item, refetchCart, qty }) => {
  const [idcart, setIdcart] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [quantity, setQuantity] = useState(qty);
  const prodId = item.idProduct;
  const { stocks, loading: loadingStocks, refetchStocks } = useFetchProductStock(prodId ? { prodId } : { prodId: null });

  console.log("CartItem item:", item);

  let qtyRemaining = 0;
  if (stocks && stocks[0]) {
    const stockData = stocks[0];
    if (stockData?.variants) {
      const variantStock = stockData.variants.find((v) => v.externalid === item.idVariant);
      qtyRemaining = variantStock ? variantStock.qnt : 0;
    } else if (stockData?.compounds) {
      qtyRemaining = stockData.compounds.reduce((min, c) => Math.min(min, c.quantity), Infinity);
    } else if (stockData?.quantity !== undefined) {
      qtyRemaining = stockData.quantity;
    }
  }


  useEffect(() => {
    const getCartId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("cartId");
        if (storedId) setIdcart(storedId);
      } catch (error) {
        console.error("Errore nel recupero del cartId:", error);
      }
    };
    getCartId();
  }, []);

  useEffect(() => {
    setQuantity(qty);
  }, [qty]);

  const onAdd = async () => {
    if (item.type !== "virtual") {
      if (quantity >= qtyRemaining) {
        showMessage({
          message: "Attenzione",
          description: "Hai raggiunto la quantità massima disponibile in magazzino.",
          type: "warning",
        });
        return;
      }
    }
    try {
      await addToCart({
        idproduct: item.idProduct,
        idvariant: item.idVariant ?? null,
        qnt: 1,
        idcart: idcart,
      });
      setQuantity((prev) => prev + 1);
      refetchCart();
    } catch {
      showMessage({
        message: "Errore",
        description: "Non siamo riusciti ad aumentare la quantità del prodotto!",
        type: "danger",
      });
    }
  };

  const onRemove = async () => {
    try {
      await addToCart({
        idproduct: item.idProduct,
        idvariant: item.idVariant,
        qnt: -1,
        idcart: idcart,
      });
      setQuantity((prev) => prev - 1);
      refetchCart();
    } catch {
      showMessage({
        message: "Errore",
        description: "Non siamo riusciti a diminuire la quantità del prodotto!",
        type: "danger",
      });
    }
  };

  const deleteItem = async () => {
    Alert.alert(
      "Conferma",
      `Vuoi eliminare il prodotto dal carrello?`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Sì",
          style: "destructive",
          onPress: async () => {
            try {
              if (!idcart || deleting) return;
              setDeleting(true);
              await delFromCart({
                idVariant: item.idVariant,
                idProduct: item.idProduct,
                idcart: idcart,
              })
              refetchCart();
            } catch (error) {
              console.error("Errore nel deleteItem:", error);
              showMessage({
                message: "Attenzione",
                description: "Qualcosa è andato storto!",
                type: "danger",
              });
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const image = item?.product?.image
    ? { uri: item.product.image.includes("http") ? item.product.image : 'https://app.xcart.ai/' + item.product.image }
    : placeholderImage;

  return (
    <Pressable>
      <View style={styles.itemContainer}>
        <Image source={image} style={styles.productImage} />

        {/* Info prodotto */}
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
            <CustomText style={styles.qntItem}>x{quantity || 1}</CustomText>
          </View>
        </View>

        {/* Controlli quantità e rimozione */}
        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            {quantity > 1 && (
              <TouchableOpacity onPress={onRemove}>
                <Icon name="remove-circle" size={32} color={primaryColor} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onAdd}>
              <Icon name="add-circle" size={32} color={primaryColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionButton, { padding: 6, paddingHorizontal: 10 }]}
            onPress={deleteItem}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              // <Icon name="trash-outline" size={15} color="white" />
              <View><CustomText style={{ color: 'black', fontWeight: 'bold' }}>Rimuovi</CustomText></View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingHorizontal: 5,
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
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 0,
    marginTop: 0,
  },
  productPriceOld: {
    marginRight: 8,
    fontSize: 15,
    color: '#888',
    textDecorationLine: 'line-through',
    fontWeight: 'bold',
  },
  qntItem: {
    marginTop: 0,
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    //height: 25,
    //width: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
