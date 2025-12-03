import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";

export const handleReturn = async (body) => {
    console.log("return", body);
    try {
        const url = `${endpoints.returns}`;
        const response = await api.post(url, body);
        console.log("return response", response.data);
        return response;
    } catch (error) {
        console.error("Error return", error);
        throw error;
    }
}


