import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";

import { addToCart } from "../api/cart";
import useFetchProductStock from "../hooks/useFetchProductStock";
import formatPrice from "../utils/formatPrice";
import { primaryColor } from "../constants/colors";
import { Picker } from "@react-native-picker/picker";
import { extractTaglia } from "../utils/utils";
import HTMLView from "react-native-htmlview";
import { showMessage } from "react-native-flash-message";
import { setCartLength } from "../store/actions/cartActions";
import CustomText from '../components/atoms/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewing from 'react-native-image-viewing';
import { ActivityIndicator } from "react-native-paper";
import { placeholderImage } from "../constants/images";

const ProductDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const product = route.params?.product;
  const prodId = product.externalid;
  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [moresub, setMoresub] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { stocks, loading: loadingStocks, refetchStocks } = useFetchProductStock(prodId ? { prodId } : { prodId: null });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!loadingStocks && stocks) {
      setIsLoading(false);
    }
  }, [loadingStocks, stocks]);

  const onlinePrice = product.onlineprice ? formatPrice(product.onlineprice) : 0;
  const discountPrice = product.discountprice ? formatPrice(product.discountprice) : 0;
  const price = formatPrice(product.price) || formatPrice(product?.product?.unitPrice);
  const showDiscountPrice = discountPrice && discountPrice !== formatPrice(0);

  // Stock logica
  let qtyRemaining = 0;
  let disable = false;

  if (stocks && stocks[0]) {
    const stockData = stocks[0];
    if (stockData?.variants) {
      const variantStock = stockData.variants.find((v) => v.externalid === variantId);
      qtyRemaining = variantStock ? variantStock.qnt : 0;
    } else if (stockData?.compounds) {
      qtyRemaining = stockData.compounds.reduce((min, c) => Math.min(min, c.quantity), Infinity);
    } else if (stockData?.quantity !== undefined) {
      qtyRemaining = stockData.quantity;
    }
    disable = qtyRemaining <= 0;
  }

  console.log("stocks",stocks)

  const handleIncreaseQuantity = () => {
    if (qtyRemaining && quantity < qtyRemaining) {
      setQuantity(prev => prev + 1);
    }

    if (!moresub && (product.type === "year_subscription" || product.type === "month_subscription") && quantity > 0) {
      const tipo = product.type === "year_subscription" ? "anno" : "mese";
      Alert.alert(
        "Conferma",
        `Stai acquistando più di un ${tipo} di abbonamento, premi OK per continuare`,
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "OK",
            style: "destructive",
            onPress: () => setMoresub(true)
          }
        ],
        { cancelable: false }
      );
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchStocks();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      const storedCartId = await AsyncStorage.getItem("cartId");

      const cartItem = {
        idcart: storedCartId || null,
        idproduct: product?.externalid || null,
        qnt: quantity,
        idvariant: variantId || null,
      };

      const data = await addToCart(cartItem);

      // Salva nuovo cartId se non esisteva
      if (!storedCartId && data.externalid) {
        await AsyncStorage.setItem("cartId", data.externalid);
      }

      dispatch(setCartLength(data.lineItems.length));

      showMessage({
        message: "",
        description: "Prodotto aggiunto al carrello",
        type: "success",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText style={{ fontSize: 18 }}>Caricamento prodotto...</CustomText>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <View style={styles.prodHeader}>
            <CustomText style={[{ textTransform: "uppercase" }, styles.productTitle]}>
              {product.description || product.name}
            </CustomText>
            <CustomText style={{ marginBottom: 20, marginTop: 10, textAlign: "center", fontSize: 15, color: disable ? "#ab2431" : "green" }}>
              {disable ? "Esaurito" : "Disponibile"}
            </CustomText>

            <View style={styles.galleryContainer}>
              {/* Immagine principale */}
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                {!imageLoaded && (
                  <View style={[styles.mainImage, styles.loadingOverlay]}>
                    <ActivityIndicator size="medium" color={primaryColor} />
                  </View>
                )}
                <Image
                  source={product.images.length > 0 ? { uri: product.images[activeImageIndex].imageUrl} : placeholderImage}
                  onLoadStart={() => setImageLoaded(false)}
                  onLoadEnd={() => setImageLoaded(true)}
                  resizeMode="contain"
                  style={styles.mainImage}
                />
              </TouchableOpacity>

              {/* Miniature gallery */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailScroll}
              >
                {product?.images?.map((img, index) => (
                  <TouchableOpacity key={index} onPress={() => setActiveImageIndex(index)}>
                    <Image
                      source={{ uri: img.imageUrl }}
                      resizeMode="cover"
                      style={[
                        styles.thumbnailImage,
                        index === activeImageIndex && styles.activeThumbnail,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>


            <View style={{ textAlign: "center", fontSize: 15, marginTop: 20 }}>
              {onlinePrice ? (
                <CustomText style={{ textAlign: "center", fontSize: 25, fontWeight: "600", }}>{onlinePrice}</CustomText>
              ) : price ? (
                showDiscountPrice ? (
                  <View>
                    <CustomText style={[styles.price, { fontSize: 15 }]}>{price}</CustomText>
                    <CustomText style={{ textAlign: "center", fontSize: 25, fontWeight: "600" }}>{discountPrice}</CustomText>
                  </View>
                ) : (
                  <CustomText style={{ textAlign: "center", fontSize: 25, fontWeight: "600", marginTop: 20 }}>{price}</CustomText>
                )
              ) : null}
            </View>
          </View>

          <View style={styles.textContainer}>
            <CustomText style={{ fontSize: 15, fontWeight: "700" }}>Descrizione</CustomText>
            <View style={styles.textDescription}>
              <HTMLView
                value={product?.product?.descriptionExtended ?? product?.descriptionExtended ?? "Il prodotto non ha una descrizione"}
                stylesheet={{ p: { fontSize: 15, color: "#333" } }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView style={{ marginBottom: 60, backgroundColor: primaryColor }}>
        <View style={styles.topContainer}>
          {product.multivariant && (
            <View style={styles.topContainerVariants}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setShowPicker(prev => !prev)} style={styles.button}>
                  <CustomText style={styles.buttonText}>{showPicker ? "Chiudi" : "Seleziona taglia"}</CustomText>
                </TouchableOpacity>
              </View>
              {showPicker && (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={variantId}
                    onValueChange={itemValue => setVariantId(itemValue)}
                    style={{ color: "#fff", backgroundColor: "#376e47", height: 150 }}
                  >
                    {product.variants.map((v) => {
                      const variant = stocks?.[0]?.variants?.find((stockVar) => stockVar.externalid === v.externalid);
                      const isOutOfStock = variant?.qnt <= 0;
                      return (
                        <Picker.Item
                          label={`${extractTaglia(v.description)}${isOutOfStock ? " (esaurito)" : ""}`}
                          value={v.externalid}
                          key={v.externalid}
                          color={isOutOfStock ? "#000" : Platform.OS === "android" ? "#000" : "#fff"}
                        />
                      );
                    })}
                  </Picker>
                </View>
              )}
            </View>
          )}

          <View style={styles.quantityContainer}>
            <TouchableOpacity style={[styles.quantityButton, { backgroundColor: "#ccc" }]} onPress={handleDecreaseQuantity}>
              <CustomText style={styles.quantityButtonText}>-</CustomText>
            </TouchableOpacity>
            <CustomText style={styles.quantityText}>{quantity}</CustomText>
            <TouchableOpacity style={[styles.quantityButton, { backgroundColor: "#ccc" }]} onPress={handleIncreaseQuantity}>
              <CustomText style={styles.quantityButtonText}>+</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={!disable ? styles.addToCartButton : styles.addToCartDisabledButton}
              onPress={handleAddToCart}
              disabled={disable}
            >
              <Icon name="cart" size={24} color={!disable ? "white" : "black"} />
              <CustomText style={!disable ? styles.addToCartText : styles.addToCartTextDisabled}>Aggiungi</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {/* Mostra le immagini quando si effettua il click su una di esse  */}
      <ImageViewing
        images={product?.images?.map(img => ({ uri: img.imageUrl }))}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    margin: 10,
  },
  galleryContainer: {
    alignItems: "center",
  },
  mainImage: {
    width: 370,
    height: 350,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  thumbnailScroll: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  thumbnailImage: {
    width: 70,
    height: 70,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: primaryColor,
    transform: [{ scale: 1.1 }],
    marginBottom: 5,
  },


  container: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    paddingBottom: 100,
  },
  category: {
    color: "#ab2431",
    textTransform: "uppercase",
    fontSize: 17,
    fontWeight: "600",
  },
  dropdown: {
    marginBottom: 20,
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  categoryStocks: {
    flexDirection: "row",
    //justifyContent: "space-between",
    marginBottom: 20,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  prodHeader: {
    marginHorizontal: 24,
    flexDirection: "column",
  },
  productImage: {
    width: "100%",
    height: "100%",
    marginVertical: 20,
  },

  productTitle: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  price: {
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    textDecorationLine: "line-through",
  },
  textContainer: {
    marginHorizontal: 15,
    marginTop: 25,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  textDescription: {
    marginHorizontal: 15,
    marginTop: 15,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  topContainerVariants: {
  },
  topContainer: {
    backgroundColor: "#376e47",
    paddingTop: 14,
    paddingBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "#376e47",
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#376e47",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  pickerContainer: {
    marginBottom: 20,
    width: "100%",
    marginTop: 2,
  },
  quantityContainer: {
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#334e38",
    borderBottomWidth: 1,
    backgroundColor: "#376e47",
  },
  quantityButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 40,
    color: "black",
    paddingBottom: 10,
  },
  quantityText: {
    fontSize: 30,
    marginHorizontal: 20,
    color: "#fff",
  },
  addToCartButton: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderColor: primaryColor,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  addToCartDisabledButton: {
    marginLeft: 10,
    backgroundColor: "lightgrey",
    color: primaryColor,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  addToCartTextDisabled: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  }
});

export default ProductDetails;
