import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

//MANUTENZIONE
const useFetchMessage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFn = useCallback(() => {

    async function fetchMessage() {
      setLoading(true);
      console.log("Fetching message...");
      try {
        const { data } = await api.get(endpoints.message);
        setMessage(data);
        console.log("Message fetched successfully:");
      } catch (e) {
        console.log("Error fetching message", e);
      } finally {
        setLoading(false);
      }
    }

    fetchMessage();
  }, []);

  useFocusEffect(fetchFn);

  return { message, loading, refetch: fetchFn };
};

export default useFetchMessage;
