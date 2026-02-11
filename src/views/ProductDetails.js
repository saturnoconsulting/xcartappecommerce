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
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { addToCart } from "../api/cart";
import useFetchProductStock from "../hooks/useFetchProductStock";
import formatPrice from "../utils/formatPrice";
import { backgroundcolor, primaryColor } from "../constants/colors";
import { extractTaglia } from "../utils/utils";
import HTMLView from "react-native-htmlview";
import { showMessage } from "react-native-flash-message";
import { setCartLength } from "../store/actions/cartActions";
import CustomText from "../components/atoms/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageViewing from "react-native-image-viewing";
import { placeholderImage } from "../constants/images";
import { isFavorite } from "../store/selectors/favoriteSelector";
import { addFavorite, removeFavorite } from "../store/actions/favoriteActions";
import { normalizeImages } from "../utils/images";


const ProductDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const product = route.params?.product;
  const prodId = product.externalid;
  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { stocks, loading: loadingStocks, refetchStocks } = useFetchProductStock(
    prodId ? { prodId } : { prodId: null }
  );

  const isFav = useSelector(isFavorite(product.externalid));

  const productImages = normalizeImages(product);

  useEffect(() => {
    if (!loadingStocks && stocks) {
      setIsLoading(false);
    }
  }, [loadingStocks, stocks]);

  const onlinePrice = product.onlineprice ? formatPrice(product.onlineprice) : 0;
  const discountPrice = product.discountprice ? formatPrice(product.discountprice) : 0;
  const price = formatPrice(product.price) || formatPrice(product?.product?.unitPrice);
  const showDiscountPrice = discountPrice && discountPrice !== formatPrice(0);

  // Gestione stock
  let qtyRemaining = 0;
  let disable = false;

  if (product.type === "virtual") {
    disable = false;
  } else {
    if (stocks && stocks[0]) {
      const stockData = stocks[0];
      if (stockData?.variants && variantId) {
        // Per prodotti multivariant, cerca la variante selezionata usando l'ID MongoDB
        const selectedVariant = product.variants.find((v) => v.externalid === variantId);
        if (selectedVariant) {
          const variantIdMongo = selectedVariant._id?.$oid || selectedVariant._id;
          const variantStock = stockData.variants.find(
            (stockVar) => {
              const stockVariantIdMongo = stockVar.idvariant?.$oid || stockVar.idvariant;
              return String(variantIdMongo) === String(stockVariantIdMongo);
            }
          );
          qtyRemaining = variantStock ? variantStock.qnt : 0;
        }
      } else if (stockData?.variants && !variantId && product.multivariant) {
        // Se multivariant ma nessuna variante selezionata, mostra 0
        qtyRemaining = 0;
      } else if (stockData?.compounds) {
        qtyRemaining = stockData.compounds.reduce(
          (min, c) => Math.min(min, c.quantity),
          Infinity
        );
      } else if (stockData?.quantity !== undefined) {
        qtyRemaining = stockData.quantity;
      }
      disable = qtyRemaining <= 0;
    }
  }

  const toggleFavorite = () => {
    if (isFav) {
      dispatch(removeFavorite(product.externalid));
    } else {
      dispatch(addFavorite(product.externalid));
    }
  };

  const handleIncreaseQuantity = () => {
    if (product.type !== "virtual") {
      if (qtyRemaining && quantity < qtyRemaining) {
        setQuantity((prev) => prev + 1);
      }
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
        contentContainerStyle={{ paddingBottom: 200, backgroundColor: backgroundcolor }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.prodHeader}>
          <View style={styles.galleryContainer}>

            <View style={styles.imageWrapper}>
              <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
                <CustomText style={[styles.heartIcon, isFav && styles.heartActive]}>
                  {isFav ? "❤️" : "🤍"}
                </CustomText>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <Image
                  source={
                    productImages.length > 0
                      ? { uri: productImages[activeImageIndex].imageUrl }
                      : placeholderImage
                  }
                  onLoadStart={() => setImageLoaded(false)}
                  onLoadEnd={() => setImageLoaded(true)}
                  resizeMode="cover"
                  style={styles.mainImage}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailScroll}
            >
              {productImages.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveImageIndex(index)}
                >
                  <Image
                    source={{ uri: img.imageUrl }}
                    resizeMode="cover"
                    style={[
                      styles.thumbnailImage,
                      index === activeImageIndex && styles.activeThumbnail,
                    ]}
                    onError={(e) => console.warn("Errore immagine:", e.nativeEvent.error)}
                    defaultSource={placeholderImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.topRow}>
            <CustomText style={[styles.productTitle]}>
              {product.description || product.name}
            </CustomText>
            <CustomText
              style={{
                textAlign: "left",
                marginRight: 10,
                fontSize: 13,
                marginTop: 20,
                color: product.stock > 0 ? "green" : "#ab2431",
              }}
            >
              {product.stock ? "" : "Esaurito"}
            </CustomText>
          </View>

          <View style={{ textAlign: "left", fontSize: 15, marginTop: 0, marginBottom: 10 }}>
            {onlinePrice ? (
              <CustomText style={styles.price}>{onlinePrice}</CustomText>
            ) : price ? (
              showDiscountPrice ? (
                <View>
                  <CustomText style={[styles.discountPriceOld, { fontSize: 15 }]}>
                    {price}
                  </CustomText>
                  <CustomText style={styles.discountPrice}>{discountPrice}</CustomText>
                </View>
              ) : (
                <CustomText style={[styles.price, { marginTop: 10 }]}>
                  {price}
                </CustomText>
              )
            ) : null}
          </View>
        </View>

        {product.multivariant && (
          <View style={styles.variantSelectorContainer}>
            <CustomText style={styles.variantTitle}>Seleziona taglia:</CustomText>
            <View style={styles.variantsRow}>
              {product.variants.map((v) => {
                // Match tra variante prodotto e variante stock usando l'ID MongoDB
                const variantIdMongo = v._id?.$oid || v._id;
                const variant = stocks?.[0]?.variants?.find(
                  (stockVar) => {
                    const stockVariantIdMongo = stockVar.idvariant?.$oid || stockVar.idvariant;
                    return String(variantIdMongo) === String(stockVariantIdMongo);
                  }
                );
                const isOutOfStock = !variant || variant.qnt <= 0;
                const isSelected = variantId === v.externalid;
                return (
                  <TouchableOpacity
                    key={v.externalid} 
                    style={[styles.variantBox, isSelected && styles.variantBoxSelected, isOutOfStock && styles.variantBoxDisabled]}
                    onPress={() => setVariantId(v.externalid)}
                    disabled={isOutOfStock}
                  >
                    <CustomText
                      style={[
                        styles.variantText,
                        isSelected && styles.variantTextSelected,
                        isOutOfStock && styles.variantTextDisabled,
                      ]}
                    >
                      {extractTaglia(v.description)}
                    </CustomText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.textContainer}>
          <CustomText style={{ fontSize: 15, fontWeight: "700" }}>Descrizione</CustomText>
          <View style={styles.textDescription}>
            <HTMLView
              value={
                product?.product?.descriptionExtended ??
                product?.descriptionExtended ??
                "Il prodotto non ha una descrizione"
              }
              stylesheet={{ p: { fontSize: 15, color: "#333" } }}
            />
          </View>
        </View>
      </ScrollView>

      <SafeAreaView style={{ marginBottom: 0, backgroundColor: primaryColor }}>
        <View style={styles.topContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: "#ccc" }]}
              onPress={handleDecreaseQuantity}
            >
              <CustomText style={styles.quantityButtonText}>-</CustomText>
            </TouchableOpacity>
            <CustomText style={styles.quantityText}>{quantity}</CustomText>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: "#ccc" }]}
              onPress={handleIncreaseQuantity}
            >
              <CustomText style={styles.quantityButtonText}>+</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={!disable ? styles.addToCartButton : styles.addToCartDisabledButton}
              onPress={handleAddToCart}
              disabled={disable}
            >
              <Icon name="cart" size={24} color={!disable ? "white" : "black"} />
              <CustomText
                style={!disable ? styles.addToCartText : styles.addToCartTextDisabled}
              >
                Aggiungi
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ImageViewing
        images={productImages.map((img) => ({ uri: img.imageUrl }))}
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};


const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  galleryContainer: {
    alignItems: "center",
    margin: 10,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    maxHeight: 470,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  heartButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0)",
    borderRadius: 25,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIcon: {
    fontSize: 26,
    color: "#888",
  },
  heartActive: {
    color: "#e63946",
  },
  variantTitle: {
    marginBottom: 10,
    alignContent: "left",
    fontSize: 16,
  },
  price: {
    textAlign: "left",
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: "700",
    color: primaryColor,
  },
  thumbnailScroll: {
    paddingHorizontal: 10,
    marginTop: 15,
  },
  thumbnailImage: {
    width: 70,
    height: 70,
    marginHorizontal: 6,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    opacity: 0.8,
  },
  activeThumbnail: {
    borderColor: primaryColor,
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  productTitle: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    textAlign: "left",
  },
  discountPriceOld: {
    textDecorationLine: "line-through",
    fontSize: 16,
    color: "#888",
    marginHorizontal: 20,
    marginTop: 5,
  },
  discountPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: primaryColor,
    marginTop: 5,
    marginHorizontal: 20,
  },
  variantSelectorContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  variantsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  variantBox: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  variantBoxSelected: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  },
  variantBoxDisabled: {
    backgroundColor: "#eee",
    borderColor: "#ccc",
  },
  variantText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  variantTextSelected: {
    color: "#fff",
  },
  variantTextDisabled: {
    color: "#aaa",
  },
  textContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  textDescription: {
    marginTop: 10,
  },
  topContainer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 28,
    color: "#333",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  addToCartDisabledButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addToCartTextDisabled: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProductDetails;
