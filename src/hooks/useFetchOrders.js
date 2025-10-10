import { useCallback, useEffect, useRef, useState } from "react";
import { showMessage } from 'react-native-flash-message';
import { getOrders } from "../api/order";

const LIMIT = 9;

const useFetchOrders = ({ iduser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const lastFetchedCount = useRef(0);

  const canLoadMore = lastFetchedCount.current === LIMIT;
 
  const fetchOrders = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (!iduser || loading || refreshing || isFetchingMore) return;

    if (isRefresh) setRefreshing(true);
    else if (nextPage > 1) setIsFetchingMore(true);
    else setLoading(true);

    try {
     const queryParams = {
        iduser,
        start: (nextPage - 1) * LIMIT,
        limit: LIMIT,
      };

      const data = await getOrders(queryParams);

      const newOrders = data.orders || [];
      lastFetchedCount.current = newOrders.length;

      setOrders((prev) =>
        isRefresh || nextPage === 1 ? newOrders : [...prev, ...newOrders]
      );
    } catch (e) {
      if (e?.response?.data?.error === "orders not found.") {
        setOrders([]);
      } else {
        showMessage({
          message: "Attenzione",
          description: "Non siamo riusciti a caricare gli ordini, riprova più tardi!",
          type: "danger",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [iduser, loading, refreshing, isFetchingMore]);

  useEffect(() => {
    fetchOrders(true, 1);
  }, []);

  const refreshOrders = async () => {
    setPage(1);
    await fetchOrders(true, 1);
  };

  const loadMoreOrders = useCallback(() => {
    if (!canLoadMore || isFetchingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(false, nextPage);
  }, [canLoadMore, isFetchingMore, fetchOrders, page]);

  return {
    orders,
    loading,
    refreshing,
    isFetchingMore,
    canLoadMore,
    refreshOrders,
    loadMoreOrders,
  };
};

export default useFetchOrders;
