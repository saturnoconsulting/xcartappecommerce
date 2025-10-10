import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './atoms/CustomText';
import { placeholderImage } from '../constants/images';

export default function CategoryRow({ previousScreen, category }) {
    const { navigate } = useNavigation();
    const image = category?.imageUrl != null ? { uri: category.imageUrl } : placeholderImage;

    return (
        <TouchableOpacity onPress={() => navigate("CategoryShop", { idCategory: category.externalid, sourceScreen: "Shop", name: category.description })}>
            <View style={styles.categoryCard}>
                <ImageBackground source={image} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                    <View style={styles.overlay} />
                    <View style={styles.textContainer}>
                        <CustomText style={styles.categoryTitle} numberOfLines={2}>
                            {category.description || category.name}
                        </CustomText>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    categoryCard: {
        height: 206,
        width: width * 0.98,
        alignSelf: 'center',
        marginBottom: 5,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: "lightgrey",
        borderWidth: 0.4,
        elevation: 3,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
