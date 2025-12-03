import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import CustomText from './atoms/CustomText';
import { Dropdown } from 'react-native-element-dropdown';
import { InputField } from './atoms/InputField';
import { fetchSalespoint } from '../api/salespoint';
import Icon from "react-native-vector-icons/Ionicons";
import { primaryColor } from '../constants/colors';
import formatPrice from '../utils/formatPrice';
import { handleReturn } from '../api/returns';
import { showMessage } from 'react-native-flash-message';

const ReturnsModal = ({ onClose, orderDetails }) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [return_method, setReturnMethod] = useState(null);
    const [arrivalStore, setArrivalStore] = useState("ONLINE");
    const [onlineSalespointId, setOnlineSalespointId] = useState(null);

    const [refund_method, setRefundMethod] = useState(null);
    const [iban, setIban] = useState("");
    const [salespoints, setSalespoints] = useState([]);
    const [idsalespoint, setSalespoint] = useState(null);
    const [notes, setNotes] = useState("");

    // Prodotti per reso
    const [refundItems, setRefundItems] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [refundsAmount, setRefundsAmount] = useState([]);

    // Fetch salespoint + imposta di default quello ONLINE
    useEffect(() => {
        const initSalespoints = async () => {
            try {
                const sp = await fetchSalespoint();
                setSalespoints(sp);

                // Trova il punto vendita ONLINE
                const onlineSp = sp.find(
                    (s) => s.externalid === "ONLINE" || s.name?.toUpperCase() === "ONLINE"
                );
                    setOnlineSalespointId(onlineSp.externalid);
                    // Imposto anche come default per idsalespoint
                    setSalespoint(onlineSp.externalid);
                    // E come testo visualizzato
                    setArrivalStore(onlineSp.name || "ONLINE");
               
            } catch (e) {
                console.log("Errore fetchSalespoint:", e);
                setArrivalStore("ONLINE");
            }
        };

        initSalespoints();
    }, []);


    // Precarica prodotti dell’ordine
    useEffect(() => {
        if (!orderDetails) return;

        const items = orderDetails.details.map((d) => ({
            idorder_detail: d.idorder_detail,
            productname: d.productname,
            qnt: d.qnt,
            unitprice: parseFloat(d.unitprice),
        }));

        setRefundItems(items);

        // inizializza gli array in base a quanti elementi sono presenti nell'ordine 
        setQuantities(items.map(() => 0));
        setReasons(items.map(() => ""));
        setRefundsAmount(items.map(() => "0.00"));

    }, [orderDetails]);


    const increaseQty = (index) => {
        setQuantities(prev => {
            const updated = [...prev];
            if (updated[index] < refundItems[index].qnt) {
                updated[index] += 1;
            }

            // aggiorna rimborso
            setRefundsAmount(prevRefunds => {
                const updatedRefunds = [...prevRefunds];
                updatedRefunds[index] = (updated[index] * refundItems[index].unitprice).toFixed(2);
                return updatedRefunds;
            });

            return updated;
        });
    };

    const decreaseQty = (index) => {
        setQuantities(prev => {
            const updated = [...prev];
            if (updated[index] > 0) {
                updated[index] -= 1;
            }

            // aggiorna rimborso correttamente
            setRefundsAmount(prevRefunds => {
                const updatedRefunds = [...prevRefunds];
                updatedRefunds[index] = (updated[index] * refundItems[index].unitprice).toFixed(2);
                return updatedRefunds;
            });

            return updated;
        });
    };


    // Imposta motivo del reso per il singolo item
    const updateReason = (id, selectedReason, index) => {
        setReasons(prev => {
            const updated = [...prev];
            updated[index] = selectedReason;
            return updated;
        });
        //per la visualizzazione
        setRefundItems(prev =>
            prev.map(item =>
                item.idorder_detail === id
                    ? { ...item, reason: selectedReason }
                    : item
            )
        );
    };


    const handleRefund = async () => {

        try {
            // Validazione campi obbligatori
            if (!return_method || !refund_method || !iban) {
                setErrorMessage("Per favore compila tutti i campi obbligatori.");
                return;
            }

            // almeno un prodotto deve avere quantità > 0
            const hasQuantity = quantities.some(q => q > 0);
            if (!hasQuantity) {
                setErrorMessage("Seleziona almeno un prodotto da rendere.");
                return;
            }

            // tutti i prodotti con quantità > 0 devono avere un motivo
            for (let i = 0; i < quantities.length; i++) {
                if (quantities[i] > 0 && (!reasons[i] || reasons[i].trim() === "")) {
                    setErrorMessage("Inserisci un motivo per ogni articolo selezionato.");
                    return;
                }
            }

            setErrorMessage("");

            // Payload finale
            const refundData = {
                //refund_cod = contrassegno se il pagamento è stato fatto in contrassegno
                idorder: orderDetails.idorder,
                idreceipt: orderDetails.ereceiptID || null,
                idusers: orderDetails.users_iduser,
                status: "pending",
                source: "app",
                return_method,
                refund_method,
                iban,
                notes,
                idsalespoint:
                    return_method === "store"
                        ? idsalespoint
                        : onlineSalespointId,

                quantities,
                reasons,
                refunds_amount: refundsAmount,
                refund_shipping: orderDetails.shippingprice,
            };

            const response = await handleReturn(refundData);

            if (response?.status === 200 || response?.data?.success) {
                showMessage({
                    message: "Reso inviato",
                    description: "La richiesta è stata inviata correttamente.",
                    type: "success",
                });

                onClose(true);
                return;
            }

            // Se la risposta è diversa da 200
            showMessage({
                message: "Errore",
                description: "La richiesta non è stata accettata dal server.",
                type: "danger",
            });

        } catch (error) {
            console.log("ERRORE handleRefund:", error);

            // Se c'è risposta del server
            if (error.response) {
                console.log("Error Response:", error.response.data.error);

                const message = error?.response?.data?.error ?? "Si è verificato un errore imprevisto.";
                setErrorMessage(`Errore: ${message}`);
                return;
            }

            // Errore generico
            showMessage({
                message: "Errore imprevisto",
                description: error.message,
                type: "danger",
            });
        }
    };



    return (
        <ScrollView style={{ flex: 1, width: "96%", padding: 10 }}>

            <CustomText style={styles.title}>Effettua reso</CustomText>
            {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
            {/* METODO RESO */}
            <CustomText style={styles.subtitle}>Come vuoi restituire l'articolo?</CustomText>
            <Dropdown
                style={styles.input}
                data={[
                    { label: "Ritiro a domicilio con corriere", value: "courier" },
                    { label: "Punto vendita", value: "store" },
                    { label: "Punto di raccolta", value: "dropoff" }, //tipo Locker o altro 
                ]}
                labelField="label"
                valueField="value"
                placeholder="Metodo di reso"
                value={return_method}
                onChange={(item) => setReturnMethod(item.value)}
            />

            {/* PUNTO VENDITA */}
            {return_method === "courier" || !return_method ? (
                <InputField value={arrivalStore} editable={false} />
            ) : (
                <>
                    <CustomText style={styles.subtitle}>Scegli il punto vendita per la restituzione</CustomText>
                    <Dropdown
                        style={styles.dropdown}
                        data={salespoints.map((sp) => ({
                            value: sp.externalid,
                            label: sp.name
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Scegli un punto vendita"
                        value={idsalespoint}
                        onChange={(item) => {
                            setSalespoint(item.value);
                        }}
                    />
                </>
            )}

            <CustomText style={styles.subtitle}>Metodo di rimborso</CustomText>
            {/* METODO RIMBORSO */}
            <Dropdown
                style={styles.input}
                data={[
                    { label: "Bonifico", value: "bank" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Metodo di rimborso"
                value={refund_method}
                onChange={(item) => setRefundMethod(item.value)}
            />

            {/* IBAN */}
            {refund_method === "bank" && (
                <InputField label="IBAN rimborso" value={iban} onChangeText={setIban} />
            )}

            {/* NOTE */}
            <TextInput
                style={styles.note}
                multiline
                placeholder="Note reso"
                value={notes}
                onChangeText={setNotes}
            />

            {/* PRODOTTI */}
            <CustomText style={styles.sectionTitle}>Dettagli reso</CustomText>

            {refundItems.map((item, index) => (
                <View key={item.idorder_detail} style={styles.productBox}>

                    <CustomText style={styles.productName}>{item.productname}</CustomText>
                    <CustomText>Quantità acquistata: {item.qnt}</CustomText>
                    <CustomText>Prezzo unitario: {formatPrice(item.unitprice)} €</CustomText>

                    {/* QUANTITÀ */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

                        <TouchableOpacity
                            onPress={() => decreaseQty(index)}
                            disabled={item.quantity <= 0}
                        >
                            <Icon
                                name="remove-circle"
                                size={40}
                                color={item.quantity <= 0 ? "#ccc" : primaryColor}
                            />
                        </TouchableOpacity>

                        <CustomText style={{ marginHorizontal: 15, fontSize: 18 }}>
                            x {quantities[index]}
                        </CustomText>

                        <TouchableOpacity
                            onPress={() => increaseQty(index)}
                            disabled={item.quantity >= item.qnt}
                        >
                            <Icon
                                name="add-circle"
                                size={40}
                                color={item.quantity >= item.qnt ? "#ccc" : primaryColor}
                            />
                        </TouchableOpacity>

                    </View>

                    {/* IMPORTO */}
                    {quantities[index] > 0 && (
                        <CustomText style={{ marginTop: 10 }}>
                            Rimborso: {formatPrice(refundsAmount[index])} €
                        </CustomText>
                    )}


                    {/* MOTIVO PER SINGOLO PRODOTTO */}
                    <Dropdown
                        style={[styles.input, styles.dropdownReasons]}
                        data={[
                            { label: "Prodotto difettoso", value: "Prodotto difettoso" },
                            { label: "Prodotto danneggiato", value: "Prodotto danneggiato" },
                            { label: "Parti mancanti", value: "Parti mancanti" },
                            { label: "Prodotto errato", value: "Prodotto errato" },
                            { label: "Non piace", value: "Non piace" },
                            { label: "Cambio idea", value: "Cambio idea" },
                            { label: "Errore ordine", value: "Errore ordine" },
                            { label: "Taglia grande", value: "Taglia grande" },
                            { label: "Taglia piccola", value: "Taglia piccola" },
                            { label: "Consegna in ritardo", value: "Consegna in ritardo" },
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Motivo del reso"
                        value={item.reason}
                        onChange={(selected) =>
                            updateReason(item.idorder_detail, selected.value, index)
                        }
                    />

                </View>
            ))}

            {/* BOTTONE RESO */}
            <TouchableOpacity
                onPress={handleRefund}
                style={styles.refundButton}
            >
                <CustomText style={styles.buttonText}>Effettua reso</CustomText>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default ReturnsModal;

const styles = StyleSheet.create({
    subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
    note: {
        minHeight: 80,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    sectionTitle: { marginTop: 25, fontWeight: 'bold', fontSize: 18, marginBottom: 10 },
    productBox: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 20,
    },
    productName: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
    dropdownReasons: { marginTop: 15 },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    refundButton: {
        backgroundColor: primaryColor,
        marginTop: 20,
        marginBottom: 30,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { fontSize: 20, color: 'white', fontWeight: 'bold' },
    error: {
        marginBottom: 10,
        textAlign: "center",
        color: "red"
    },
});
