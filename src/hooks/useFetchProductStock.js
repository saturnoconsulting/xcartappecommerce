import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";
import { IDSALESPOINT, LICENSE } from "../config";

const useFetchProductStock = ({ prodId }) => {
    const cT = useRef(null);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStocks = useCallback(async () => {
        if ( !prodId) return;

        cT.current = axios.CancelToken.source();
        setLoading(true);
       // console.log("Stocks product ID:", prodId);
        try {
            const queryParams = {
                start: 0,
                limit: 100,
                idProducts: [prodId],
                idsalespoint: IDSALESPOINT
            };
            const response = await api.post(
                endpoints.stocks,
                queryParams,
                {
                    cancelToken: cT.current.token,
                }
            );
            //console.log("Response fetch stocks", response);
            setStocks(response.data.stocks);
        } catch (e) {
            if (axios.isCancel(e)) {
                console.log("Fetch stocks cancelled");
            } else {
                console.log("Error fetching stocks", e);
                console.log("Status:", e.response.status);
                console.log("Headers:", e.response.headers);
                console.log("Data:", e.response.data);
            }
        } finally {
            setLoading(false);
        }
    }, [prodId]);

    useEffect(() => {
        fetchStocks();
        return () => {
            cT.current?.cancel("Fetch canceled.");
        };
    }, [fetchStocks]);

    return { stocks, loading, refetchStocks: fetchStocks };
};

export default useFetchProductStock;
