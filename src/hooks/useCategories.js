import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";
import { IDSALESPOINT } from "../config";

const useCategories = () => {
  const cT = useRef(null);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    cT.current = axios.CancelToken.source();
    setLoading(true);
    try {
      const params = {
        idsalespoint: IDSALESPOINT,
        start: 0,
        limit: 100,
        type: "app"
      };

      const { data } = await api.get(endpoints.categories, {
        params,
        cancelToken: cT.current.token
      });
      setCats(data.categories);
    } catch (e) {
      if (!axios.isCancel(e)) {
        console.log("Error retrieving categories", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    return () => {
      cT.current?.cancel("Fetch canceled.");
    };
  }, [fetchCategories]);

  return {
    cats,
    loading,
    refreshCategories: fetchCategories,
  };
};

export default useCategories;
