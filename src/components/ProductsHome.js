import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import formatPrice from '../utils/formatPrice';
import { useNavigation } from '@react-navigation/native';
import CustomText from './atoms/CustomText';
import { placeholderImage } from '../constants/images';

const ProductsHome = ({ products }) => {
   const { navigate } = useNavigation();
   

  //console.log("ProductsHome tickets", tickets);
  return (
    <>
      <View style={{ marginTop: 40, marginBottom: 20 }}>
        <CustomText style={styles.title}>Biglietteria</CustomText>
        {tickets.length > 0 ? (  
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {tickets.map((product) => (
            <TouchableOpacity key={product.externalid} onPress={() => navigate("ProductDetails", { product, sourceScreen: "Dashboard" })}>
              <ImageBackground
                source={product?.images?.length > 0 ? { uri: product.images[0].imageUrl } : placeholderImage}
                style={styles.box}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.textContainer}>
                  <CustomText style={styles.boxText}>{product.description}</CustomText>
                  </View>
                  <View style={styles.textPriceContainer}>
                  <CustomText style={styles.priceText}>{formatPrice(product.price)}</CustomText>
                  <CustomText style={styles.stocksText}>{!product.stock ? 'Esaurito' : ''}</CustomText>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>) : (
          <CustomText style={{ marginLeft: 20, color: 'black' }}>Nessun biglietto disponibile</CustomText>
        )}
    
      </View>

     <View style={{ marginBottom: 40 }}>
        <CustomText style={styles.title}>Abbonamenti</CustomText>
        {products.length > 0 ? (
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {products.map((product) => (
            <TouchableOpacity key={product.externalid} onPress={() => navigate("ProductDetails", { product, sourceScreen: "Dashboard" })}>
              <ImageBackground
                source={product?.images?.length > 0 ? { uri: product.images[0].imageUrl } : placeholderImage}
                style={styles.box}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.textContainer}>
                  <CustomText style={styles.boxText}>{product.description}</CustomText>
                  </View>
                  <View style={styles.textPriceContainer}>
                  <CustomText style={styles.priceText}>{formatPrice(product.price)}</CustomText>
                  <CustomText style={[styles.stocksText]}>{!product.stock ? 'Esaurito' : ''}</CustomText>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>):(
          <CustomText style={{ marginLeft: 20, color: 'black' }}>Nessun abbonamento disponibile</CustomText>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  stocksText: {
    color: '#fff',
    fontSize: 14,
   //fontWeight: 'bold',
  },
  textPriceContainer:{ //#1a6941
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(26, 105, 66)',
    padding: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
    paddingVertical: 10
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  box: {
    width: 170,
    height: 215,
    marginRight: 10,
    justifyContent: 'flex-end',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  boxText: {
    color: '#fff',
    fontSize: 14,
    //fontWeight: 'bold',
  },
  priceText: {
    //textAlign:"right",
   // marginTop: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ProductsHome;
