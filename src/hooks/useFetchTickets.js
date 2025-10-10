import { useCallback, useEffect, useRef, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

const LIMIT = 9;

const useFetchTickets = ({ params = {} } = {}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const lastFetchedCount = useRef(0);

  const canLoadMore = lastFetchedCount.current === LIMIT;

  const fetchTickets = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (loading || refreshing || isFetchingMore) return;

    if (!isRefresh && nextPage === 1) setLoading(true);
    if (isRefresh) setRefreshing(true);
    if (nextPage > 1) setIsFetchingMore(true);

    try {
      const response = await api.get(endpoints.tickets, {
        params: {
          ...params,
          start: (nextPage - 1) * LIMIT,
          limit: LIMIT,
        },
      });

      if (response?.data?.tickets) {
        const newTickets = response.data.tickets;
        lastFetchedCount.current = newTickets.length;

        setTickets((prev) =>
          isRefresh || nextPage === 1 ? newTickets : [...prev, ...newTickets]
        );
      }
    } catch (e) {
      console.error("Errore nel recupero dei biglietti:", e);
      if (e.response) {
        console.log("🔸 Status:", e.response.status);
        console.log("🔸 Headers:", e.response.headers);
        console.log("🔸 Data:", e.response.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [params, loading, refreshing, isFetchingMore]);

  // Fetch iniziale
  useEffect(() => {
    fetchTickets(true, 1);
  }, []);

  const refreshTickets = async () => {
    setPage(1);
    await fetchTickets(true, 1);
  };

  const loadMoreTickets = useCallback(() => {
    if (!canLoadMore || isFetchingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchTickets(false, nextPage);
  }, [canLoadMore, isFetchingMore, fetchTickets, page]);

  return {
    tickets,
    loading,
    refreshing,
    refreshTickets,
    loadMoreTickets,
    isFetchingMore,
    canLoadMore,
  };
};

export default useFetchTickets;
