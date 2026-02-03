import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";

export const getAutomation = async () => {
    try {
        const response = await api.get(endpoints.automation);
        console.log("response fetch automation", response.data.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching automation", error);
        return;
        //throw error;
    }
}


export const updateDevice = async (type, idreader, value) => {
    try {
        const response = await api.post(endpoints.automation, {
            type: type,
            idreader: idreader,
            value: value.toString()
        });
        console.log("response update device", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating device", error);
        throw error;
    }
}
