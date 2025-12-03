import React, { useEffect, useState } from 'react';
import { RefreshControl, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import useFetchOrderDetails from '../hooks/useFetchOrderDetails';
import { useSelector } from 'react-redux';
import { backgroundcolor, primaryColor } from '../constants/colors';
import formatDate from '../utils/formatDate';
import { GET_USER } from '../store/selectors/userSelector';
import CustomText from '../components/atoms/CustomText';
import formatPrice from '../utils/formatPrice';
import * as WebBrowser from 'expo-web-browser';
import { getPaymentLabel, getTextStatus } from '../utils/formatStatus';
import { LICENSE } from '../config';
import ModalComponent from '../components/ModalComponent';
import { placeholderImage } from '../constants/images';
import Separator from '../components/atoms/Separator';

const OrderDetails = ({ route }) => {
    const customer = useSelector(GET_USER);
    const { idorder } = route.params;
    const iduser = customer?.iduser;
    const [refreshing, setRefreshing] = useState(false);
    const { orderDetails, loading, refetch } = useFetchOrderDetails({ iduser, idorder });
    const [modalVisible, setModalVisible] = useState(false);

    const handlePayment = async () => { 
        await WebBrowser.openBrowserAsync("https://app.xcart.ai/api/v1/checkout/" + orderDetails.idorder + '?etoken=' + LICENSE);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
        } catch (error) {
            console.error("Errore durante il refresh:", error);
        } finally {
            setRefreshing(false);
        }
    };

    if (!idorder || !iduser) {
        return <CustomText style={styles.text}>ID ordine o utente non valido.</CustomText>;
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!orderDetails) {
        return <CustomText style={styles.textNotFound}>Ordine non trovato.</CustomText>;
    }

    const { name, surname, total, discount, coupon, status, shippingprice, payment, details } = orderDetails;


    console.log("details", details);

    const renderProductItem = ({ item }) => (
        <>
        <View style={styles.productItem}>
            <Image
                source={ item.image ? { uri: item.image } : placeholderImage }
                style={styles.productImage}
                resizeMode="cover"
            />
            <CustomText style={styles.productName}>{item.productname}</CustomText>
            <CustomText style={styles.text}>Quantità: {item.qnt}</CustomText>
            <CustomText style={styles.text}>Prezzo unitario: {formatPrice(item.unitprice)}</CustomText>
        </View>
       <Separator/>
        </>
    );

    const renderHeader = () => (
        <View>
            <CustomText style={styles.title}>Ordine #{idorder}</CustomText>
            <View style={styles.section}>
                <CustomText style={styles.text}><CustomText style={styles.bold}>Cliente:</CustomText> {name} {surname}</CustomText>
                <CustomText style={styles.text}><CustomText style={styles.bold}>Totale Ordine:</CustomText> {formatPrice(total)} </CustomText>
                <CustomText style={styles.text}><CustomText style={styles.bold}>Spedizione:</CustomText> {formatPrice(shippingprice)} </CustomText>
                <CustomText style={styles.text}><CustomText style={styles.bold}>Metodo di Pagamento: </CustomText>
                    <CustomText style={[
                        styles.text,
                        payment.type === 'cashier' ? styles.cashierPayment :
                            payment.type === 'tap_to_pay' ? styles.tapToPayPayment :
                                payment.type === 'bank' ? styles.bankPayment :
                                    payment.type === 'cod' ? styles.codPayment :
                                        payment.type === 'braintree' ? styles.braintreePayment :
                                            payment.type === 'stripe' ? styles.stripePayment :
                                                payment.type === 'paypal' ? styles.paypalPayment : {}
                    ]}>
                        {getPaymentLabel(payment.type)}
                    </CustomText>
                </CustomText>
                <CustomText style={styles.text}>
                    <CustomText style={styles.bold}>Data ordine: </CustomText>
                    <CustomText style={styles.text}>{formatDate(orderDetails.created_at)}</CustomText>
                </CustomText>
                <CustomText style={styles.text}>
                    <CustomText style={styles.bold}>Stato Ordine: </CustomText>
                    <CustomText style={styles.textStatus}>{getTextStatus(status)} </CustomText>
                </CustomText>
                <CustomText style={styles.text}>
                    <CustomText style={styles.bold}>Coupon utilizzato: </CustomText>
                    <CustomText style={styles.textStatus}>{orderDetails.coupon?.couponcode || '-'} </CustomText>
                </CustomText>
            </View>
            {/*<View style={styles.section}>
                <CustomText style={styles.text}>
                </CustomText>
            </View>*/}
            <Separator/>
            <CustomText style={styles.title}>Indirizzo di spedizione:</CustomText>
            <View style={styles.section}>
                <CustomText style={styles.text}>
                    <CustomText style={styles.bold}>Indirizzo: </CustomText>
                    <CustomText style={styles.text}>{orderDetails.address}, {orderDetails.cap}, {orderDetails.city}, {orderDetails.country}</CustomText>
                </CustomText>
                <CustomText style={styles.text}>
                    <CustomText style={styles.bold}>Metodo di spedizione: </CustomText>
                    <CustomText style={styles.text}>{orderDetails.shippingtype}</CustomText>
                </CustomText>
            </View>
             <Separator/>
            <CustomText style={styles.title}>Prodotti</CustomText>
        </View>
    );

    return (
        <>
            <FlatList
                style={styles.container}
                data={details}
                keyExtractor={(item) => item.idorder_detail.toString()}
                renderItem={renderProductItem}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    <>
                        <View style={styles.totalContainer}>
                            {coupon && <CustomText style={[styles.totalText, styles.discountText]}>Sconto: {formatPrice(discount)}</CustomText>}
                            <CustomText style={styles.totalText}>Totale: {formatPrice(total)}</CustomText>
                        </View>
                        {orderDetails.status === "pending" && (
                            <TouchableOpacity
                                onPress={handlePayment}
                                style={styles.payNow}
                            >
                                <CustomText style={styles.totalText}>Paga Ora</CustomText>
                            </TouchableOpacity>
                        )
                        }
                        {orderDetails.status === "completed" && (
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={styles.payNow}
                            >
                                <CustomText style={styles.totalText}>Effettua reso</CustomText>
                            </TouchableOpacity>
                        )
                        }
                    </>
                }
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
            {modalVisible && orderDetails && (
                <ModalComponent
                    onClose={() => setModalVisible(false)}
                    fromOrderDetails={true}
                    modal={modalVisible}
                    orderDetails={orderDetails}
                />
            )}

        </>
    );
};

const styles = StyleSheet.create({
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: '#eee',
        marginBottom: 10,
    },

    discountText: {
        marginBottom: 10,
        fontSize: 15
    },
    payNow: {
        backgroundColor: primaryColor,
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: backgroundcolor,
        padding: 15,
    },
    section: {
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 8,
        marginBottom: 5,
        //elevation: 2,
    },
    title: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    textNotFound: {
        fontSize: 16,
        color: '#555',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    text: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 14,
    },
    bold: {
        fontWeight: 'bold',
    },
    productItem: {
        backgroundColor: '#fff',
        padding: 1,
        marginVertical: 5,
        borderRadius: 8,
        //elevation: 2,
    },
    productName: {
        paddingBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalContainer: {
        marginTop: 20,
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    textStatus: {
        fontSize: 15,
        paddingTop: 5,
        paddingLeft: 5,
    },
    cashierPayment: {
        color: '#2c3e50', // grigio scuro
        fontWeight: 'bold',
    },
    tapToPayPayment: {
        color: '#27ae60', // verde
        fontWeight: 'bold',
    },
    bankPayment: {
        color: '#2980b9', // blu
        fontWeight: 'bold',
    },
    codPayment: {
        color: '#d35400', // arancio
        fontWeight: 'bold',
    },
    braintreePayment: {
        color: '#8e44ad', // viola
        fontWeight: 'bold',
    },
    stripePayment: {
        color: '#00A7E1', // azzurro
        fontWeight: 'bold',
    },
    paypalPayment: {
        color: '#003087', // blu PayPal
        fontWeight: 'bold',
    },

});

export default OrderDetails;
