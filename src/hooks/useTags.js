import { useRef, useState, useEffect } from "react";
import axios from "axios";
import * as endpoints from "constants/endpoints";
import api from "../services/api";

const useTags = () => {
  const cT = useRef(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cT.current = axios.CancelToken.source();

    const fetchTags = async () => {
      setLoading(true);
      try {
        const { data } = await api.post(endpoints.tags,null);
        setTags(data.tags);
       // console.log("tags",tags);
      } catch (e) {
        console.log("Error retrieving categories", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
    return () => {
      cT.current?.cancel("Fetch canceled.");
    };
  }, []);

  return {
    tags,
    loading,
  };
};

export default useTags;
