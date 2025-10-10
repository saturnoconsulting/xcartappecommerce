//import { etoken } from "../constants/keys";
import { api, isLoggingOut } from "../services/api";
import * as endpoints from "../constants/endpoints";
// Funzione per ottenere il profilo utente
export const getSubActive = async () => {
    try {
        const { data } = await api.get(endpoints.subactive);
        //console.log("sub Active ", data);
        return data.active;
    } catch (e) {
        throw e;
    }
};