import { useCallback, useEffect, useRef, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

const LIMIT = 10;

const useFetchGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const lastFetchedCount = useRef(0);

  const canLoadMore = lastFetchedCount.current === LIMIT;

  const fetchGames = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (loading || refreshing || isFetchingMore) return;

    if (isRefresh) setRefreshing(true);
    else if (nextPage > 1) setIsFetchingMore(true);
    else setLoading(true);

    try {
      const response = await api.get(endpoints.games, {
        params: {
          start: (nextPage - 1) * LIMIT,
          limit: LIMIT,
        },
      });

      const newGames = response?.data?.games || [];
      lastFetchedCount.current = newGames.length;

      setGames((prev) =>
        isRefresh || nextPage === 1 ? newGames : [...prev, ...newGames]
      );
    } catch (e) {
      console.error("Errore nel recupero delle partite", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [loading, refreshing, isFetchingMore]);

  useEffect(() => {
    fetchGames(true, 1);
  }, []);

  const refreshGames = async () => {
    setPage(1);
    await fetchGames(true, 1);
  };

  const loadMoreGames = useCallback(() => {
    if (!canLoadMore || isFetchingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchGames(false, nextPage);
  }, [canLoadMore, isFetchingMore, fetchGames, page]);

  return {
    games,
    loading,
    refreshing,
    refreshGames,
    loadMoreGames,
    isFetchingMore,
    canLoadMore,
  };
};

export default useFetchGames;
