//import { etoken } from "../constants/keys";
import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
//Funzione di login
// SOLO chiamata API, nessun salvataggio token qui
export const login = async (body) => {
    try {
        const { data } = await api.post(endpoints.login, body);
        return data;
    } catch (e) {
        throw e;
    }
};

export const signup = async (body) => {
    try {
        const {data} = await api.post(endpoints.signup, body);
        return data.token;
    } catch (e) {
        if (e.response.data) {
            return e.response.data;
        }
        throw e;
    }
};

export const recover = async (body) => {
    return api.post(endpoints.recover, body);
};

// Funzione per ottenere il profilo utente
export const fetchProfile = async () => {
    try {
        const { data } = await api.get(endpoints.profile);
        return data;
    } catch (e) {
        console.error('Errore nel recupero del profilo:', e);
        throw e;
    }
};

//Funzione per aggiornare il profilo utente
export const updateCustomer = async (customerdata) => {
    try {
        const { data } = await api.patch(endpoints.updateCustomer, customerdata);
       // console.log("data", data);
        return data;
    } catch (e) {
        console.error('Errore durante l’aggiornamento del profilo:', e);
        throw e;
    }
};


//Funzione per il refresh del token
export const refreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
      //  console.log("Tentativo di refresh con il token:", oldToken);
        const refreshUrl = `${endpoints.refreshtoken}?refreshtoken=${encodeURIComponent(refreshToken)}`;
        const { data } = await api.get(refreshUrl);
        if (!data || !data.token) {
            console.error("Nessun nuovo token ricevuto. Effettuando logout...");
            await forceLogout();
            return null;
        }
       // console.log("Token aggiornato con successo:", data.token);
        await SecureStore.setItemAsync('user_token', data.token);
        return data.token;
    } catch (e) {
        console.error("Errore nel refresh del token:", e);
        await forceLogout();
        return null;
    }
};

//Logout
export const logout = async () => {
    try {
        const token = await SecureStore.getItemAsync('user_token'); // Dovrebbe essere null
        if (token) {
            await api.get(endpoints.logout);
        }
        await SecureStore.deleteItemAsync("user_token");// Dovrebbe essere null
        await AsyncStorage.removeItem("cartId");
       // console.log("token logout", token);
    } catch (error) {
        console.error("Errore durante il logout:", error);
    }
};

//Forzare il logout se il refresh fallisce
export const forceLogout = async () => {
  //  console.log("Forzatura del logout...");
  await SecureStore.deleteItemAsync("user_token");
  await SecureStore.deleteItemAsync("refresh_token");
   // console.log("Token rimosso. Logout completato.");
};


export const deleteaccount = async () => {
    try {
        await AsyncStorage.removeItem('cartId');
        await SecureStore.deleteItemAsync('user_email');
        await SecureStore.deleteItemAsync('user_password');
        const response = await api.get(endpoints.accountDelete);
      // console.log("Response:", response); // Log della risposta dell'API
        return response; // Restituisci la risposta se tutto va bene
    } catch (error) {
        console.error("Errore durante la cancellazione dell'account:", error); // Stampa l'errore
        throw error; // Rilancia l'errore per gestirlo altrove
    }
};

export const registerToken = async (body) => {
    console.log("Registrazione del token:", body);
  try {
    return await api.post(endpoints.registerToken, body);
  } catch (e) {
    console.error("Errore durante la registrazione del token:", e);
    throw new Error("Errore durante la registrazione del token.");
  }
};

