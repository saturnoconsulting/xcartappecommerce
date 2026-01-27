import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";


export const getOptions = async (body) => {
    try {
        const { data } = await api.post(endpoints.options, body);
        console.log("options", data);
        return data;
    } catch (e) {
        console.error("Error options", e);
        throw e;
    }
};
