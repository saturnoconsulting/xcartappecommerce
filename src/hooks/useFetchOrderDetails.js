import { useEffect, useState, useCallback } from "react";
import { showMessage } from 'react-native-flash-message';
import { getOrderDetails } from "../api/order";

const useFetchOrderDetails = ({ iduser, idorder }) => {
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    const fetchOrderDetails = useCallback(async () => {
        try {
            //console.log("iduser", iduser);
            //console.log("orderId", idorder);
            setLoading(true);
            const data = await getOrderDetails({ iduser, idorder });
            //console.log("orders details use fetch", data.order);

            setOrderDetails(data.order); // salva i dettagli ordine
        } catch (e) {
            if (e?.response?.data?.error === "orders not found.") {
                setOrderDetails(null);
            }
            showMessage({
                message: "Attenzione",
                description: "Non siamo riusciti a caricare il dettaglio degli ordini, riprova più tardi!",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    }, [iduser, idorder]);

    useEffect(() => {
        if (idorder && iduser) {
            fetchOrderDetails();
        }
    }, [fetchOrderDetails]);

    return { orderDetails, loading, refetch: fetchOrderDetails };
};

export default useFetchOrderDetails;
