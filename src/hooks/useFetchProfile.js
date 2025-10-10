import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

const useFetchProfile = ({ iduser }) => {
  const cT = useRef(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(endpoints.customers);
      if (response?.data) {
        setCustomerDetails(response.data);
      } else {
        console.warn("Dati cliente non trovati nella risposta API");
      }
    } catch (e) {
      if (!axios.isCancel(e)) {
        console.error("Errore richiesta API:", e.response || e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [iduser]);

  return { customerDetails, loading, refetch: fetchProfileDetails }; 
};

export default useFetchProfile;
