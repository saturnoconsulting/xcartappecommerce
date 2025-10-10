import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as endpoints from "../constants/endpoints";
import { showMessage } from "react-native-flash-message";
import * as SecureStore from "expo-secure-store";
import { API_URL, LICENSE, IDSALESPOINT } from '../config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const rawApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    console.log("LICENSE", LICENSE )
    const token = await SecureStore.getItemAsync('user_token');
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['e-token'] = LICENSE;
      config.headers['idsalespoint'] = IDSALESPOINT;
    return config;
  } catch (error) {
    console.error("Errore nel recupero del token:", error);
    return Promise.reject(error);
  }
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error("Errore di rete o timeout:", error.message);
      showMessage({
        message: "Errore di connessione",
        description: "Impossibile connettersi al server. Controlla la tua connessione.",
        type: "danger",
      });
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config;

    // Refresh token solo su 401
    if (status === 401 && !originalRequest._retry && originalRequest.url !== endpoints.refreshtoken) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          await forceLogout();
          return Promise.reject(error);
        }
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await forceLogout();
        return Promise.reject(refreshError);
      }
    }

    // Gestione errori standard
    let errorMessage = "Errore imprevisto.";
    switch (status) {
      case 400:
        console.log("error.response.data.error;",error.response.data.error)
        errorMessage = error.response.data.error;
        break;
      case 401:
        errorMessage = "Non autorizzato.";
        break;
      case 403:
        errorMessage = "Accesso negato.";
        break;
      case 404:
        // Se è la rotta del carrello, non mostrare messaggio
        if (originalRequest.url.includes(endpoints.getCart)) {
          // Silenzioso per /getCart
          await AsyncStorage.removeItem("cartId");
          return Promise.reject(error);
        }
        errorMessage = "Risorsa non trovata.";
        break;
      case 500:
        errorMessage = "Errore server.";
        break;
      case 503:
        errorMessage = "Servizio non disponibile.";
        break;
      default:
        errorMessage = "Errore di accesso.";
    }
    showMessage({ message: "Errore", description: errorMessage, type: "danger" });
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    console.log("Tentativo di refresh con il token:", refreshToken);
    const refreshUrl = `${endpoints.refreshtoken}?refreshtoken=${encodeURIComponent(refreshToken)}`;

    const { data } = await rawApi.get(refreshUrl);

    if (!data || !data.token) {
      console.error("Nessun nuovo token ricevuto. Effettuando logout...");
      await forceLogout();
      return null;
    }

    //console.log("Token aggiornato con successo:", data.token);
    await SecureStore.setItemAsync('user_token', data.token);
    return data.token;
  } catch (e) {
    console.error("Errore durante il refresh del token:", e);
    await forceLogout();
    return null;
  }
};

// 🔧 Funzione di logout forzato
export const forceLogout = async () => {
  console.log("Forzatura logout...");
  await SecureStore.deleteItemAsync('user_token');
  await SecureStore.deleteItemAsync('refresh_token');
};

export { api };
