import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";

// Funzione per ottenere il profilo utente
export const getOrders = async (params) => {
    try {
        const { data } = await api.get(endpoints.orders, {
            params
        });
        return data;
    } catch (e) {
        console.error('Errore nel recupero degli ordini:', e);
        throw e;
    }
};

export const getOrderDetails = async ({ idorder }) => {
    try {
        const { data } = await api.get(endpoints.orders + '/' + idorder);
        return data;
    } catch (e) {
            // Se è un errore Axios, stampa la response
            if (e?.response) {
                console.error("Response data:", e.response.data); 
            }
        
            // Notifica utente
            showMessage({
                message: "Attenzione",
                description: "Non siamo riusciti a caricare il dettaglio degli ordini, riprova più tardi!",
                type: "danger",
            });
        };
    }

//Funzione per aggiornare il profilo utente
export const update = async (updatedData) => {
    try {
        const { data } = await api.post(endpoints.update, updatedData);
        return data;
    } catch (e) {
        console.error('Errore durante l’aggiornamento del profilo:', e);
        throw e;
    }
};

export const checkout = async (body) => {
    console.log("checkout", body);
    try {
        const url = `${endpoints.checkout}`;
        const response = await api.post(url, body);
        console.log("checkout response", response.data);
        return response;
    } catch (error) {
        console.error("Error checkout", error);
        throw error;
    }
}


export const checkCoupon = async ({ coupon, total }) => {
    try {
        const url = `${endpoints.checkCoupon}?code=${coupon}&totalcart=${total}`;
        const response = await api.post(url, null);
        //console.log("checkCoupon", response.data);
        return response.data; // o response se ti serve l'intero oggetto
    } catch (error) {
        console.log("Error checkCoupon", error);
        throw error;
    }
};


export const cashierCheckout = async (body) => {
    try {
       // console.log("cashierCheckout", body);
        const response = await api.post(endpoints.cashiercheckout, body);
       // console.log("cashierCheckout response", response.data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const checkCAP = async (body) => {
    try {
        const response = await api.get(`${endpoints.checkCAP}/${body}`);
       // console.log("checkcap  response", response.data);
        return response;
    } catch (error) {
        console.error("Error checkcap ", error);
        throw error;
    }
};

export const fetchShippingPrice = async (body) => {
    //console.log("body shipping", body);
    try {
        const response = await api.post(endpoints.shippingPrice, body);
       // console.log("shipping price response", response.data);
        return response;
    } catch (error) {
        console.error("Error fetching shipping price", error);
        throw error;
    }
};
