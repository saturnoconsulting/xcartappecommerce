import React, { use, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { InputField } from './atoms/InputField';
import { Dropdown } from 'react-native-element-dropdown';
import Button from './atoms/Button';
import { countries } from '../constants/countries';
import { primaryColor } from '../constants/colors';
import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView } from 'react-native-gesture-handler';
import { cashierCheckout, checkCAP, checkout, fetchShippingPrice } from '../api/order';
import { formatCartPrice } from '../utils/formatCartPrice';
import { showMessage } from 'react-native-flash-message';
import formatPrice from '../utils/formatPrice';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { GET_CARTID } from '../store/selectors/cartSelector';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCart } from '../api/cart';
import { resetCartId, setCartId, setCartLength } from '../store/actions/cartActions';
import * as WebBrowser from 'expo-web-browser';
import CustomText from '../components/atoms/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenWrapper from './layouts/ScreenWrapper';
import { LICENSE } from '../config';
import useFetchProfile from '../hooks/useFetchProfile';

const CheckoutWeb = ({ couponType, couponCode, customer, cartdata, onClose, total, couponAmount, refetchCart, resetCart }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const [isSelectedShipping, setIsSelectedShipping] = useState(false);
    const [isSelectedPayment, setIsSelectedPayment] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [billing, setBilling] = useState("");
    const [shippingType, setShippingType] = useState("");
    const [paymentType, setPaymentType] = useState();
    const [openTapToPayDetails, setOpenTapToPayDetails] = useState(false);
    const [checkoutButton, setCheckoutButton] = useState(true);
    const [checkoutResp, setCheckoutResp] = useState(null);
    //const cartId = useSelector(GET_CARTID);

    const [finalTotalNew, setFinalTotalNew] = useState(0);

    const {
        customerDetails,
        refetch,
        loading: loadingProfile,
    } = useFetchProfile({ iduser: customer.iduser });

    const [storedCartId, setStoredCartId] = useState(null);
    const [shouldFetchCart, setShouldFetchCart] = useState(false);
    const [flagBilling, setFlagBilling] = useState(false);

    const [orderData, setOrderData] = useState({
        paymentType: "",
        discountCode: couponCode,
        email: customer?.email ?? "",
        shippingType: shippingType,
        shipping: {
            name: "",
            surname: "",
            address: "",
            numciv: "",
            cap: "",
            city: "",
            prov: "",
            cpf: "",
            phone: "",
            country: ""
        },
        billing: {
            company: "",
            vatnumber: "",
            sdicode: "",
            pec: "",
            address: "",
            numciv: "",
            cap: "",
            city: "",
            prov: "",
            country: "",
            phone: "",
        },
        notes: "",
        idcart: storedCartId ?? "",
        iduser: customer?.iduser ?? null,
        type: "app"
    });
    const [cap, setCap] = useState("");
    const [shippingPriceResp, setShippingPriceResp] = useState(null);
    const scrollRef = useRef();

    //popola i campi di orderdata con i dati ereditati da customer
    useEffect(() => {
        if (customerDetails) {
            const user = customerDetails;
            setOrderData((prev) => ({
                ...prev,
                idcart: storedCartId ?? prev.idcart,
                iduser: customer.iduser ?? prev.iduser,
                shipping: {
                    name: user.name || "",
                    surname: user.surname || "",
                    address: user.address || "",
                    numciv: user.numciv || "",
                    cap: user.cap || "",
                    city: user.city || "",
                    prov: user.prov || "",
                    phone: user.phone || "",
                    country: user.country || "",
                    cpf: user.cpf || ""
                }
            }));
        }
    }, [customerDetails]);
    /* useEffect(() => {
         //gestisce la visualizzazione del one hour shipping in base al cap
         const fetchCapInfo = async () => {
             if (cap.length >= 5) {
                 try {
                     const res = await checkCAP(cap);
                     if (res?.data?.code) {
                         setOneHourShipping(true);
                     } else {
                         setOneHourShipping(false);
                     }
                 } catch (err) {
                     console.error("Errore in checkCAP:", err);
                     setOneHourShipping(false);
                 }
             } else {
                 setOneHourShipping(false);
             }
         };
         fetchCapInfo();
     }, [cap]);*/

    useEffect(() => {
        updateShippingPrice();
    }, [
        orderData.shipping.cap,
        orderData.shipping.country,
        orderData.shippingType
    ]);

    useEffect(() => {
        const getCartId = async () => {
            const id = await AsyncStorage.getItem('cartId');
            //console.log('Cart ID from AsyncStorage:', id);
            if (id && id !== 'null' && id !== '') {
                setStoredCartId(id);
                setShouldFetchCart(true);
            }
        };
        getCartId();
    }, []);

    //console.log("countries",countries)

    useEffect(() => {
        if (storedCartId) {
            setOrderData(prev => ({
                ...prev,
                idcart: storedCartId
            }));
        }
    }, [storedCartId]);


    const handleCheckout = async () => {
        try {
            //console.log("orderData");
            const response = await checkout(orderData);
            // console.log("orderData", orderData);
            // console.log("response", response);
            await WebBrowser.openBrowserAsync("https://app.xcart.ai/api/v1/checkout/" + response.data.idorder + "?etoken=" + LICENSE);
            onClose(true);
            if (response?.success || response?.status === 200) {
                await emptyCart(storedCartId);
                /// dispatch(resetCartId());
                const id = await AsyncStorage.getItem('cartId');
                await AsyncStorage.removeItem('cartId');
                await resetCart();
                //console.log("id dopo checkout storage", id)
                dispatch(setCartLength(0));
                await refetchCart();
                onClose(true);
                showMessage({ message: 'Successo', description: 'Ordine andato a buon fine, lo puoi trovare nella sezione Ordini del tuo profilo', type: 'success' });
            } else {
                showMessage({ message: 'Attenzione', description: 'Qualcosa è andato storto!', type: 'danger' });
            }
        } catch (err) {
            showMessage({ message: 'Errore', description: 'Si è verificato un problema!', type: 'danger' });
        }
    };



    const updateShippingPrice = async () => {
        const { shipping } = orderData;
        if (shipping.cap?.length >= 5 && shipping.country && orderData.shippingType) {
            try {
                const body = {
                    address: shipping,
                    total: cartdata?.totals?.total ?? 0,
                    shippingType: orderData.shippingType,
                };
                const resp = await fetchShippingPrice(body);
                let tot = resp.data + cartdata?.totals?.total - (couponAmount * 100);
                setFinalTotalNew(tot);
                setShippingPriceResp(resp.data);
            } catch (err) {
                console.error("Errore nel calcolo spese di spedizione:", err);
                setShippingPriceResp(null);
            }
        } else {
            setShippingPriceResp(null);
        }
    };


    const handleNext = () => {
        if (step === 1) {
            // Campi obbligatori
            const { name, surname, address, city, cap, phone, country } = orderData.shipping;
            if (!name || !surname || !address || !city || !cap || !phone || !country) {
                setErrorMessage("Per favore compila tutti i campi.");
                return;
            }
            setErrorMessage("");
            if (flagBilling) {

            } else {
                setStep((prev) => Math.min(prev + 1, totalSteps));
            }
        }

        if (step === 3) {
            if (!isSelectedShipping) {
                setErrorMessage("Seleziona un metodo di spedizione.");
                return;
            }
            if (!isSelectedPayment) {
                setErrorMessage("Seleziona un metodo di pagamento.");
                return;
            }
            setErrorMessage("");
        }
        setStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handlePrevious = () => {
        if (step === 3 && !flagBilling) {
            setStep((prev) => Math.max(prev - 2, 1))
        } else {
            setStep((prev) => Math.max(prev - 1, 1))
        }
    };

    const renderStepIndicator = () => {
        return (
            <View style={styles.indicatorContainer}>
                {[...Array(totalSteps)].map((_, i) => (
                    <View key={i + 1} style={styles.stepContainer}>
                        <View style={[styles.stepIndicator, i + 1 <= step && styles.activeStep]}>
                            <CustomText style={[styles.stepText, i + 1 <= step && styles.activeStepText]}>{i + 1}</CustomText>
                        </View>
                        {i + 1 < totalSteps && <View style={[styles.line, i + 1 < step && styles.activeLine]} />}
                    </View>
                ))}
            </View>
        );
    };

    const getPaymentLabel = (type) => {
        switch (type) {
            case "stripe":
                return "Carta";
            default:
                return type;
        }
    };

    const finalTotal = shippingPriceResp != null
        ? (parseFloat(total) || 0) + parseFloat(shippingPriceResp)
        : parseFloat(total) || 0;

    const billingStep = () => {
        setFlagBilling(!flagBilling);
    }

    const handleGoToUserDetails = () => {
        // Chiude la modale
        if (onClose) {
            onClose(true);
        }
        navigation.getParent()?.navigate("UserDetails");
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <CustomText style={styles.modalTitle}>Checkout</CustomText>
                    <TouchableOpacity style={styles.closeButton} onPress={() => onClose(true)}>
                        <Icon name="close" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                {renderStepIndicator()}
                <View style={styles.contentContainer}>
                    {/**TODO: SHIPPING */}
                    {step === 1 && (
                        <>
                            <CustomText style={{ textAlign: "center", marginBottom: 15 }}>Dati del cliente</CustomText>
                            <ScrollView
                                ref={scrollRef}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
                            >
                                <View style={{ flex: 1 }}>
                                    {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
                                    <CustomText style={styles.label}>Nome: </CustomText><CustomText style={styles.text}>{orderData.shipping.name} {orderData.shipping.surname}</CustomText>
                                    <CustomText style={styles.label}>Email: </CustomText><CustomText style={styles.text}>{orderData.email}</CustomText>
                                    <CustomText style={styles.label}>Indirizzo: </CustomText><CustomText style={styles.text}>{orderData.shipping.address} {orderData.shipping.numciv} {orderData.shipping.city} {orderData.shipping.prov} {orderData.shipping.cap} {orderData.shipping.country} </CustomText>
                                    <CustomText style={styles.label}>Telefono: </CustomText><CustomText style={styles.text}>{orderData.shipping.phone}</CustomText>

                                    <TouchableOpacity
                                        style={styles.buttonEdit}
                                        onPress={() => handleGoToUserDetails()}
                                    >
                                        <CustomText style={styles.buttonText}>Modifica</CustomText>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={billingStep} style={styles.checkboxWrapper} activeOpacity={0.7}>
                                        <View style={[styles.box, flagBilling && styles.boxChecked]}>
                                            {flagBilling && <Icon name="checkmark" size={18} color="#fff" />}
                                        </View>
                                        <CustomText style={styles.checkboxLabel}>
                                            Vuoi utilizzare anche i dati di fatturazione?
                                        </CustomText>
                                    </TouchableOpacity>


                                </View>
                            </ScrollView>
                        </>
                    )}
                    {/**TODO: BILLING */}
                    {step === 2 && (
                        <>
                            <CustomText style={{ textAlign: "center", marginBottom: 15 }}>I dati di fatturazione sono opzionali</CustomText>
                            {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
                            <KeyboardAvoidingView
                                style={{ flex: 1 }}
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={Platform.OS === 'ios' ? 170 : 0}
                            >
                                <ScrollView
                                    ref={scrollRef}
                                    keyboardShouldPersistTaps="handled"
                                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
                                >
                                    <View style={{ flex: 1 }}>
                                        {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
                                        <InputField
                                            label="Azienda"
                                            placeholder="Inserisci Azienda"
                                            value={orderData.billing.company}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, company: text } }))
                                            }
                                        />
                                        <InputField
                                            label="VAT"
                                            placeholder="Inserisci codice SDI"
                                            value={orderData.billing.vatnumber}
                                            onChangeText={(text) => {
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, vatnumber: text } }))
                                            }}
                                        />
                                        <InputField
                                            label="SDI"
                                            placeholder="Inserisci SDI"
                                            value={orderData.billing.sdicode}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, sdicode: text } }))
                                            }
                                        />
                                        <InputField
                                            label="Pec"
                                            placeholder="Inserisci Pec"
                                            value={orderData.billing.pec}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, pec: text } }))
                                            }
                                        />
                                        <InputField
                                            label="Telefono"
                                            placeholder="Inserisci telefono"
                                            value={orderData.billing.phone}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, phone: text } }))
                                            }
                                        />
                                        <CustomText style={styles.label}>Paese</CustomText>
                                        <Dropdown
                                            style={styles.dropdown}
                                            data={countries.map((ct) => ({ label: ct, value: ct }))}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Inserisci Scegli un Paese"
                                            value={orderData.billing.country}
                                            onChange={(item) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, country: item.label } }))
                                            }
                                        />
                                        <InputField
                                            label="Indirizzo"
                                            placeholder="Inserisci indirizzo"
                                            value={orderData.billing.address}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, address: text } }))
                                            }
                                        />
                                        <InputField
                                            label="Num. Civico"
                                            placeholder="Inserisci Num. Civico"
                                            value={orderData.billing.numciv}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, numciv: text } }))
                                            }
                                        />
                                        <InputField
                                            label="Città"
                                            placeholder="Inserisci Città"
                                            value={orderData.billing.city}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, city: text } }))
                                            }
                                        />
                                        <InputField
                                            label="Provincia"
                                            placeholder="Inserisci Provincia"
                                            value={orderData.billing.prov}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, prov: text } }))
                                            }
                                            maxLength={2}
                                        />
                                        <InputField
                                            label="Cap"
                                            placeholder="Inserisci Cap"
                                            value={orderData.billing.cap}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, billing: { ...prev.billing, cap: text } }))
                                            }
                                            maxLength={5}
                                        />
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </>
                    )}
                    {/*TODO: SHIPPING TYPE*/}
                    {step === 3 && (
                        <>
                            {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
                            <View style={styles.paymentOptionsContainer}>
                                <CustomText style={styles.label}>Scegli il metodo di spedizione</CustomText>
                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 30 }}
                                >


                                    <>
                                        <TouchableOpacity
                                            style={[
                                                styles.paymentButton,
                                                orderData.shippingType === "localpickup" && { borderColor: primaryColor, borderWidth: 2 }
                                            ]}
                                            onPress={() => {
                                                setOrderData((prev) => ({ ...prev, shippingType: "localpickup" }));
                                                setIsSelectedShipping(true);
                                            }}
                                        >
                                            <Icon name="storefront-outline" size={22} color="#333" style={styles.paymentIcon} />
                                            <View style={{ flexDirection: 'column', flexShrink: 1 }}>
                                                <Text style={styles.paymentText}>Ritiro in Sede</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.paymentButton,
                                                orderData.shippingType === "standard" && { borderColor: primaryColor, borderWidth: 2 }
                                            ]}
                                            onPress={() => {
                                                setOrderData((prev) => ({ ...prev, shippingType: "standard" }));
                                                setIsSelectedShipping(true);
                                            }}
                                        >
                                            <Icon name="home-outline" size={22} color="#333" style={styles.paymentIcon} />
                                            <CustomText style={styles.paymentText}>Corriere</CustomText>
                                        </TouchableOpacity>
                                    </>


                                    <View style={styles.paymentOptionsContainer}>
                                        <CustomText style={styles.label}>Scegli il metodo di pagamento</CustomText>
                                        <TouchableOpacity
                                            style={[
                                                styles.paymentButton,
                                                orderData.paymentType === "stripe" && { borderColor: primaryColor, borderWidth: 2 }
                                            ]}
                                            onPress={() => {
                                                setOrderData((prev) => ({ ...prev, paymentType: "stripe" }));
                                                setIsSelectedPayment(true);
                                                setOpenTapToPayDetails(false);
                                                setCheckoutButton(true);
                                            }}
                                        >
                                            <Icon name="card-sharp" size={22} color="#333" style={styles.paymentIcon} />
                                            <CustomText style={styles.paymentText}>Carta</CustomText>
                                        </TouchableOpacity>

                                        <InputField
                                            label="Note (opzionale)"
                                            placeholderTextColor="grey"
                                            style={styles.textArea}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Inserisci Note per l'ordine"
                                            value={orderData.notes}
                                            onChangeText={(text) =>
                                                setOrderData((prev) => ({ ...prev, shipping: { ...prev, notes: text } }))
                                            }
                                        />
                                    </View>
                                </ScrollView>

                            </View>
                        </>
                    )}
                    {/*TODO: PAYMENT TYPE*/}
                    {step === 4 && (
                        <>
                            <ScrollView contentContainerStyle={{}}>
                                {successMessage ? <CustomText style={styles.success}>{successMessage}</CustomText> : null}
                                <View style={styles.summaryContainer}>
                                    <CustomText style={styles.summaryTitle}>Conferma i dati:</CustomText>
                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Nome:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.name}</CustomText>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Cognome:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.surname}</CustomText>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Indirizzo:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.address}</CustomText>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Città:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.city}</CustomText>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>CAP:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.cap}</CustomText>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Paese:</CustomText>
                                        <CustomText style={styles.value}>{orderData.shipping.country}</CustomText>
                                    </View>
                                    <View style={styles.summaryItem}>
                                        <CustomText style={styles.label}>Metodo di pagamento:</CustomText>
                                        <CustomText style={[styles.value, { textTransform: 'uppercase' }]}>
                                            {getPaymentLabel(orderData.paymentType)}
                                        </CustomText>
                                    </View>
                                    {/* Totali - Sconto, Subtotale, Spedizione, Totale */}
                                    <View style={styles.summaryTotals}>
                                        <View style={styles.summaryItem}>
                                            <CustomText style={styles.label}>Sconto: <CustomText style={styles.value}>{couponCode || '-'}</CustomText></CustomText>
                                        </View>
                                        <View style={styles.summaryItem}>
                                            <CustomText style={styles.label}>Valore sconto: <CustomText style={styles.value}>{couponAmount != null ? (couponType === "amount" ? formatPrice(couponAmount) : couponAmount + '%') : '-'}</CustomText></CustomText>
                                        </View>

                                        <View style={styles.summaryItem}>
                                            <CustomText style={styles.label}>Spedizione:</CustomText>
                                            <CustomText style={styles.value}>
                                                {shippingPriceResp != null ? formatCartPrice(shippingPriceResp) : "—"}
                                            </CustomText>
                                        </View>

                                        <View style={styles.summaryItem}>
                                            <CustomText style={styles.label}>Sub totale:</CustomText>
                                            <CustomText style={styles.value}>
                                                {cartdata?.totals?.subtotal ? formatCartPrice(cartdata.totals.subtotal) : "—"}
                                            </CustomText>
                                        </View>
                                        <View style={styles.summaryItem}>
                                            <CustomText style={styles.label}>TOTALE:</CustomText>
                                            <CustomText style={styles.value}>
                                                {/*isNaN(finalTotal) ? "—" : formatCartPrice(finalTotal)*/}
                                                {
                                                    finalTotalNew != null ? formatCartPrice(finalTotalNew) : (isNaN(finalTotal) ? "—" : formatCartPrice(finalTotal))

                                                }
                                            </CustomText>
                                        </View>
                                    </View>
                                </View>
                                {openTapToPayDetails && (
                                    <View>
                                        <CustomText style={[styles.label, { textAlign: "center" }]}>
                                            {message ? <CustomText style={styles.success}>{message + '\n'}</CustomText> : null}
                                            Dati da inserire nell'app di Stripe:</CustomText>
                                        <View style={styles.copyBox}>
                                            <CustomText style={styles.label}>Numero ordine:</CustomText>
                                            <CustomText selectable={true} style={styles.copyValue}>#{checkoutResp.idorder}</CustomText>
                                        </View>
                                        <View style={styles.copyBox}>
                                            <CustomText style={styles.label}>Importo:</CustomText>
                                            <CustomText selectable={true} style={styles.copyValue}>{formatPrice(checkoutResp.total)}</CustomText>
                                        </View>
                                        <Button title="Apri Stripe" style={styles.checkoutButton} onPress={handleOpenStripeApp} />
                                    </View>
                                )}
                            </ScrollView>
                            {
                                checkoutButton && (<Button
                                    title="Conferma e Checkout"
                                    onPress={handleCheckout}
                                    style={{ marginTop: 20 }}
                                />)
                            }
                        </>
                    )}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                {step > 1 && (
                    <Button onPress={handlePrevious} style={styles.backButton} title="Indietro" />
                )}
                {step < totalSteps && (
                    <Button onPress={handleNext} style={styles.buttonNext} title="Prosegui" />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    modalTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        alignSelf: 'flex-start',
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },

    box: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    boxChecked: {
        backgroundColor: primaryColor,
        borderColor: primaryColor,
    },
    buttonEdit: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: primaryColor,
        padding: 5,
        borderRadius: 5,
        marginTop: 40,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    textLocalPickup: {
        fontSize: 13, color: '#666', marginTop: 2
    },
    checkoutButton: {
        marginBottom: 10,
        marginTop: 10
    },
    copyValue: {
        fontSize: 16,
        color: "#222",
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    copyBox: {
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    textArea: {
        height: 120,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',
        borderRadius: 8,
        width: 320,
    },
    success: {
        marginBottom: 10,
        textAlign: "center",
        color: "green"
    },
    error: {
        marginBottom: 10,
        textAlign: "center",
        color: "red"
    },
    container: {
        flex: 1,
        paddingTop: 5,
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
    containerButton: {
        flex: 1,
        paddingTop: 5,
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepIndicator: {
        width: 45,
        height: 35,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: primaryColor,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStep: {
        backgroundColor: primaryColor,
    },
    stepText: {
        color: primaryColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeStepText: {
        color: 'white',
    },
    line: {
        width: 20,
        height: 2,
        backgroundColor: primaryColor,
        marginHorizontal: 10,
    },
    activeLine: {
        backgroundColor: primaryColor,
    },
    contentContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    dropdown: {
        marginBottom: 10,
        width: 320,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
    },
    paymentOptionsContainer: {
        width: "100%",
        maxWidth: 500,
        marginBottom: 20
    },
    paymentButton: {
        width: 320,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        backgroundColor: '#fdfdfd',
    },
    paymentIcon: {
        marginRight: 10,
    },
    paymentText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    summaryTotals: {
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginVertical: 20,
        width: "100%",
        maxWidth: 340
    },
    value: {
        paddingTop: 9,
        paddingBottom: 3,
        marginLeft: 10
    },
    summaryTitle: {
        marginTop: 7,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 7,
        alignSelf: "center",
    },
    summaryItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    summaryContainer: {
        width: 340
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 20,
    },
    buttonNext: {
        width: 100,
    },
    backButton: {
        backgroundColor: primaryColor,
        marginRight: 10,
        width: 100,
    },
});

export default CheckoutWeb;
