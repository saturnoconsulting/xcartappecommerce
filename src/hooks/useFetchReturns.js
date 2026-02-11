import { useCallback, useEffect, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

const PAGE_SIZE = 9;

const useFetchReturns = (params) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReturns = useCallback(
    async (isRefresh = false, nextPage = 1) => {
      if (!isRefresh && nextPage === 1) setLoading(true);
      if (isRefresh) setRefreshing(true);
      if (nextPage > 1) setIsFetchingMore(true);

      try {
        const queryParams = {
          start: (nextPage - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
          idreturnorder: params?.idreturnorder || null,
          type: "app",
          status: params?.status || null,
        };

        const response = await api.get(endpoints.returns, { params: queryParams });

        if (response?.data?.returns) {
          const newReturns = response.data.returns;
          setTotalCount(response.data.totalcount || 0);

          setReturns(prev => {
            if (isRefresh || nextPage === 1) {
              return newReturns;
            }
            // Deduplicate: filter out items that already exist based on idreturnorder
            const existingIds = new Set(prev.map(item => item.idreturnorder));
            const uniqueNewReturns = newReturns.filter(
              item => !existingIds.has(item.idreturnorder)
            );
            return [...prev, ...uniqueNewReturns];
          });
        }

      } finally {
        setLoading(false);
        setRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [params] // ← OK perché non c'è più uno state interno params
  );

  const refreshReturns = useCallback(async () => {
    setPage(1);
    await fetchReturns(true, 1);
  }, [fetchReturns]);

  const loadMoreReturns = useCallback(() => {
    const nextPage = page + 1;
    const maxPage = Math.ceil(totalCount / PAGE_SIZE);

    if (page < maxPage && !isFetchingMore) {
      fetchReturns(false, nextPage);
      setPage(nextPage);
    }
  }, [page, totalCount, fetchReturns, isFetchingMore]);

  useEffect(() => {
    setPage(1);
    fetchReturns(true, 1);
  }, [params, fetchReturns]);

  const canLoadMore = page < Math.ceil(totalCount / PAGE_SIZE);

  return {
    returns,
    loading,
    refreshing,
    refreshReturns,
    loadMoreReturns,
    isFetchingMore,
    canLoadMore,
    setPage,
  };
};

export default useFetchReturns;
