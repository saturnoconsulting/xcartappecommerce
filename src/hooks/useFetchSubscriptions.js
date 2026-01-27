import { useCallback, useEffect, useRef, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

const LIMIT = 9;

const useFetchSubscriptions = ({ params = {} } = {}) => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const lastFetchedCount = useRef(0); 

  const canLoadMore = lastFetchedCount.current === LIMIT;

  const fetchSubs = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (loading || refreshing || isFetchingMore) return;

    if (!isRefresh && nextPage === 1) setLoading(true);
    if (isRefresh) setRefreshing(true);
    if (nextPage > 1) setIsFetchingMore(true);

    try {
      const response = await api.get(endpoints.subscriptions, {
        params: {
          ...params,
          start: (nextPage - 1) * LIMIT,
          limit: LIMIT,
        },
      });

      if (response?.data?.subscriptions) {
        const newSubs = response.data.subscriptions;
        lastFetchedCount.current = newSubs.length;

        setSubs((prev) =>
          isRefresh || nextPage === 1 ? newSubs : [...prev, ...newSubs]
        );
      }
    } catch (e) {
      console.error("Errore nel recupero degli abbonamenti:", e);
      if (e.response) {
        console.log("Status:", e.response.status);
        console.log("Headers:", e.response.headers);
        console.log("Data:", e.response.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [params, loading, refreshing, isFetchingMore]);

  // Prima fetch
  useEffect(() => {
    fetchSubs(true, 1);
  }, []);

  const refreshSubs = async () => {
    setPage(1);
    await fetchSubs(true, 1);
  };

  const loadMoreSubs = useCallback(() => {
    if (!canLoadMore || isFetchingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchSubs(false, nextPage);
  }, [canLoadMore, isFetchingMore, fetchSubs, page]);

  return {
    subs,
    loading,
    refreshing,
    refreshSubs,
    loadMoreSubs,
    isFetchingMore,
    canLoadMore,
  };
};

export default useFetchSubscriptions;
