import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    View
} from 'react-native';
import { backgroundcolor } from '../constants/colors';
import { formatCartPrice } from '../utils/formatCartPrice';
import Button from '../components/atoms/Button';
import useCart from '../hooks/useCart';
import { CartItem } from '../components/CartItem';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { checkCoupon } from '../api/order';
import { ModalComponent } from '../components/ModalComponent';
import CustomText from '../components/atoms/CustomText';
import formatNewTotalCoupon from '../utils/formatNewTotalCoupon';
import { showMessage } from 'react-native-flash-message';
import Loading from '../components/Loading';
import { useDispatch } from 'react-redux';
import { setCartLength } from '../store/actions/cartActions';
import useFetchMessage from '../hooks/useFetchMessage';


const Cart = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [coupon, setCoupon] = useState('');
    const [couponType, setCouponType] = useState('');
    const [couponAmount, setCouponAmount] = useState(null);
    const [total, setTotal] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshingEmpty, setRefreshingEmpty] = useState(false);

    // Usa hook che già gestisce AsyncStorage per cartId
    const { cartData, refetch, loading, refreshing, resetCart } = useCart();
    const { message } = useFetchMessage();
 
    useEffect(() => {
        if (cartData?.totals?.total && !couponAmount) {
            setTotal(cartData.totals.total);
        }
    }, [cartData, couponAmount]);

    useEffect(() => {
        if (!modalVisible) {
            refetch();
        }
    }, [modalVisible]);

    useEffect(() => {
        if (cartData?.lineItems) {
            dispatch(setCartLength(cartData.lineItems.length));
        }
    }, [cartData?.lineItems]);

    
    useFocusEffect(
        useCallback(() => {
            refetch(); // forza sempre il caricamento quando entri
        }, [])
    );


    useFocusEffect(
        useCallback(() => {
            if (cartData?.externalid) {
                refetch();
            }
        }, [cartData?.externalid])
    );


    const onRefresh = async () => {
        setRefreshingEmpty(true);
        await refetch();
        setRefreshingEmpty(false);
    };

    const handleResetCoupon = () => {
        setCoupon('');
        setCouponAmount(null);
        setCouponType('');
        if (cartData?.totals?.total) {
            setTotal(formatCartPrice(cartData.totals.total));
        }
        showMessage({ message: 'Coupon rimosso', type: 'success' });
    };

    const handleCoupon = async () => {
        try {
            const total = cartData?.totals?.total;
            const couponresp = await checkCoupon({ coupon, total });

            if (couponresp?.newtotal) {
                setTotal(formatNewTotalCoupon(couponresp.newtotal));
                setCouponAmount(couponresp?.coupon?.value);
                setCouponType(couponresp?.coupon?.type);
                showMessage({ message: 'Sconto applicato!', type: 'success' });
            } else {
                showMessage({ message: 'Coupon non valido', type: 'warning' });
            }
        } catch (error) {
            console.error('Errore durante il controllo del coupon:', error);
            showMessage({
                message: 'Errore',
                description: 'Si è verificato un problema durante la verifica del coupon.',
                type: 'danger',
            });
        }
    };

    if (loading && !cartData) {
        return (
            <Loading />
        );
    }

    if (message.active) {
        return (
            <View style={styles.containerMessage}>
                <View style={styles.message}>
                    <CustomText style={{ fontWeight: '600', fontSize: 20, marginBottom: 16, textAlign: 'center' }}>
                        {message.title}
                    </CustomText>
                    <CustomText style={{ lineHeight: 20, fontSize: 16, textAlign: 'center' }}>
                        {message.text}
                    </CustomText>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            {cartData?.lineItems?.length > 0 ? (
                <View style={styles.container}>
                    <FlatList
                        onRefresh={refetch}
                        refreshing={refreshing}
                        data={cartData?.lineItems}
                        keyExtractor={(item) => item.idProduct.toString()}
                        renderItem={({ item }) => (
                            <CartItem item={item} refetchCart={refetch} />
                        )}
                    />
                    <View style={[styles.totalContainer, couponAmount ? styles.totalContainerWithCoupon : styles.totalContainerFull]}>
                        <View style={styles.couponContainer}>
                            <TextInput
                                placeholder="Codice sconto"
                                value={coupon}
                                onChangeText={setCoupon}
                                style={styles.searchInput}
                            />
                            <Button
                                title="Applica"
                                onPress={handleCoupon}
                                style={[styles.buttonCoupon, couponAmount ? styles.buttonCouponWithReset : styles.buttonCouponWithoutReset]}
                            />
                            {couponAmount && (
                                <Button
                                    title="Reset"
                                    onPress={handleResetCoupon}
                                    style={styles.buttonResetCoupon}
                                />
                            )}
                        </View>
                        <CustomText style={styles.totalText}>Totale: {formatCartPrice(total)}</CustomText>
                        <View style={styles.buttonsContainer}>
                            <Button title="Checkout" onPress={() => setModalVisible(true)} style={styles.button} />
                        </View>
                    </View>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={refreshingEmpty} onRefresh={onRefresh} />}
                >
                    <CustomText style={styles.emptyText}>Il carrello è vuoto.</CustomText>
                    <View style={styles.buttonsContainer}>
                        <Button
                            title="Raggiungi il negozio"
                            onPress={() => {
                                const drawerNavigation = navigation.getParent();
                                if (drawerNavigation) {
                                    drawerNavigation.navigate('Tabs', { screen: 'Shop' });
                                }
                            }}
                            style={styles.button}
                        />
                    </View>
                </ScrollView>
            )}
            <ModalComponent
                resetCart={resetCart}
                total={total}
                couponAmount={couponAmount}
                couponCode={coupon}
                modal={modalVisible}
                onClose={() => setModalVisible(false)}
                paymentMethod={paymentMethod}
                cartdata={cartData}
                refetchCart={refetch}
                couponType={couponType}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    containerMessage:{
        marginHorizontal:10,
        marginVertical:50,
    },
    buttonCouponWithReset: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    buttonCoupon: {
        marginTop: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
    },
    buttonResetCoupon: {
        marginLeft: 0,
        backgroundColor: 'red',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    couponContainer: {
        flexDirection: 'row',
        padding: 35,
    },
    searchInput: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 12,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    button: {
        marginTop: 30,
        width: '100%',
    },
    buttonsContainer: {
        marginBottom: 70,
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: backgroundcolor,
    },
    totalContainerFull: {
        width: '100%',
    },
    totalContainerWithCoupon: {
        width: '89%',
        marginLeft: 20,
        marginRight: 20,
    },
    totalContainer: {
        paddingVertical: 5,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 5,
    },
    totalText: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});

export default Cart;
