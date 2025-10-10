import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import formatPrice from '../utils/formatPrice';
import CustomText from './atoms/CustomText';
import { placeholderImage } from '../constants/images';

export default function ProductRow({ sourceScreen, product }) {
    const navigation = useNavigation();
    const tabNavigation = navigation.getParent(); 
    
    const handlePress = () => {
        // Recupera il parent (Tab)
        tabNavigation.navigate('Shop'); // Vai nel tab Negozio
        navigation.navigate("ProductDetails", { product, sourceScreen });
    };

    const image = product?.images?.length > 0 ? { uri: product.images[0].imageUrl } : placeholderImage;

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.productCard}>
                <Image source={image} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <View style={{ marginBottom: 15, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                        <CustomText style={{ textAlign: "left", marginRight: 10, fontSize: 13, color: product.stock > 0 ? "green" : "#ab2431" }}>
                            {product.stock ? "Disponibile" : "Esaurito"}
                        </CustomText>
                        <CustomText style={styles.productCategory} numberOfLines={2}>{product.category.description || product.name}</CustomText>
                    </View>

                    <CustomText style={styles.productTitle} numberOfLines={2}>{product.description || product.name}</CustomText>

                    <View style={styles.bottomSection}>
                        {product.discountprice ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <CustomText style={[styles.productPrice, { textDecorationLine: "line-through" }]}>
                                    {formatPrice(product.price)}
                                </CustomText>
                                <CustomText style={styles.productPrice}>{formatPrice(product.discountprice)}</CustomText>
                            </View>
                        ) :
                            <CustomText style={styles.productPrice}>{formatPrice(product.price)}</CustomText>
                        }
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5
    },
    productCategory: {
        color: "black",
        textAlign: "right",
        flexShrink: 1,
        fontSize: 13
    },
    productCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
        borderColor: "lightgrey",
        borderWidth: 0.4,
        height: 120,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
        justifyContent: "space-between",
    },
    productTitle: {
        fontWeight: "bold",
        color: "black",
        textAlign: "left",
        flexShrink: 1,
        marginTop: 5,
        marginBottom: 15
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
