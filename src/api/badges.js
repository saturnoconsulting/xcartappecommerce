import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";

export const getBadges = async () => {
    try {
        const response = await api.get(endpoints.badges);
        console.log("response fetch badges", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching badges", error);
        throw error;
    }
}

