import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import CustomText from '../components/atoms/CustomText';

const User = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);

    const goToHomeStack = async (screenName) => {
        try {
            setLoading(true);
            const tabNavigation = navigation.getParent();
            tabNavigation.navigate('User');
            navigation.navigate(screenName);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <Loading />
            )}

            <CustomText style={styles.titleSection}>Area Utente</CustomText>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => goToHomeStack('UserDetails')}>
                    <CustomText style={styles.menuText}>Profilo</CustomText>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={styles.menuItem} onPress={() => goToHomeStack('Orders')}>
                    <CustomText style={styles.menuText}>Ordini</CustomText>
                </TouchableOpacity>

                <View style={styles.separator} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    separator: { height: 1, backgroundColor: '#ccc', marginBottom: 20 },
    titleSection: { color: 'black', fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
    menuContainer: { marginTop: 30, paddingHorizontal: 20 },
    menuItem: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 8, marginBottom: 12 },
    menuText: { fontSize: 16, color: '#333' }
});

export default User;
