import React, { useState } from 'react';
import {
    ScrollView,
    RefreshControl,
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import CustomText from '../components/atoms/CustomText';
import { backgroundcolor, primaryColor } from '../constants/colors';
import formatDate from '../utils/formatDate';
import useFetchReturns from '../hooks/useFetchReturns';
import formatPrice from '../utils/formatPrice';
import { getTextStatus, getReturnMethod, getPaymentLabel } from '../utils/formatStatus';

const ReturnsDetails = ({ route }) => {

    const { idreturnorder } = route.params;
    const [refreshing, setRefreshing] = useState(false);

    const { returns, loading, refreshReturns: refetch } =
        useFetchReturns({ params: { idreturnorder } });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (loading || !returns) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={primaryColor} />
            </View>
        );
    }

    //perchè mi viene restituito un array non un oggetto 
    const returnData = Array.isArray(returns) ? returns[0] : returns;
    if (!returnData) return null;

    const {
        idreturnorder: id,
        orders_idorder,
        return_method,
        refund_total,
        refund_method,
        status,
        requested_at,
        notes,
        items,
        tracking_number,
        refund_cod,
        refund_shipping
    } = returnData;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* TITOLO */}
            <CustomText style={styles.title}>Dettagli reso #{id}</CustomText>

            {/* CARD DETTAGLI */}
            <View style={styles.card}>
                <Row label="Reso dell'ordine num." value={orders_idorder || "—"} />
                <Row label="Metodo di restituzione" value={getReturnMethod(return_method)} />
                {return_method === 'courier' && (
                    <Row label="Numero di tracciamento" value={tracking_number || '-'} />
                )}

                <Row label="Stato" value={getTextStatus(status) || '-'} />
                <Row label="Data richiesta" value={formatDate(requested_at)} />
                <Row label="Metodo rimborso" value={getPaymentLabel(refund_method) || "—"} />
                {refund_cod !== '0.00' && (
                    <Row label="Rimborso in contrassegno" value={formatPrice(refund_cod) || "—"} />
                )}

                <Row label="Rimborso spese di spedizione" value={formatPrice(refund_shipping) || "—"} />
                <Row label="Totale rimborso" value={formatPrice(refund_total)} />
                <Row label="Note" value={notes || "—"} last />
            </View>


            {/* ARTICOLI */}
            {items?.length > 0 && (
                <>
                    <CustomText style={styles.sectionTitle}>Articoli nel reso</CustomText>

                    {items.map(item => (
                        <View key={item.idreturnitem} style={styles.productBox}>
                            <CustomText style={styles.productName}>{item.productname}</CustomText>

                            <Row label="Quantità" value={item.quantity} />
                            <Row label="Prezzo unitario" value={formatPrice(item.unitprice)} />
                            <Row label="Rimborso" value={formatPrice(item.refund_amount)} />

                            {item.reason && (
                                <Row label="Motivo" value={item.reason} />
                            )}
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const Row = ({ label, value, last }) => (
    <View style={[styles.row, last && { marginBottom: 0 }]}>
        <CustomText style={styles.label}>{label}</CustomText>
        <CustomText style={styles.value}>{value}</CustomText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: backgroundcolor,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },

    /* CARD DETTAGLI */
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 25,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },

    row: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },

    /* CARD ARTICOLI */
    productBox: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 20,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
});

export default ReturnsDetails;
