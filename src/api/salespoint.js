import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";

export const fetchSalespoint = async () => {
    try {
        const response = await api.get(endpoints.salespoint);
        console.log("response.data.salespoints", response.data.salespoints);
        return response.data.salespoints;
    } catch (error) {
        console.error("Error fetch salesPoint", error);
        throw error;
    }
};
