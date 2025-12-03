import { useCallback, useEffect, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";
import { IDSALESPOINT } from "../config";

const useFetchProducts = ({ params: initialParams = {} } = {}) => {
  const [params, setParams] = useState(initialParams);
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(
    async (isRefresh = false, nextPage = 1) => {

      setLoading(true);
      if (!isRefresh && nextPage === 1) setLoading(true);
      if (isRefresh) setRefreshing(true);
      if (nextPage > 1) setIsFetchingMore(true);

      console.log("params in fetchProducts:", params); 

      try {
        const queryParams = {
          idsalespoint: IDSALESPOINT,
          start: (nextPage - 1) * 9,
          limit: 9,
          type: "app",
          tags: params?.tags,
          idsCategory: params.idsCategory || null,
          idsDepartment: params?.idsDepartment || null,
          description: params.description || params?.searchQuery || null,
          barcode: params?.barcode || null,
        };

        const response = await api.post(endpoints.products, queryParams);

        console.log("Fetched products response", response.data);
        if (response?.data?.products) {
          const newProds = response.data.products;
          setTotalCount(response.data.totalCount || 0);
          setProds((prev) =>
            isRefresh || nextPage === 1 ? newProds : [...prev, ...newProds]
          );
        }
      } catch (e) {
        console.error("Errore nel recupero dei prodotti:", e);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [params]
  );

  const refreshProducts = async () => {
    setPage(1);
    return await fetchProducts(true, 1);
  };

  // Scroll infinito
  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    const maxPage = Math.ceil(totalCount / 9);
    if (page < maxPage && !isFetchingMore) {
      fetchProducts(false, nextPage);
      setPage(nextPage);
    }
  }, [page, totalCount, fetchProducts, isFetchingMore]);

  // Aggiorna automaticamente al cambio di params
  useEffect(() => {
    fetchProducts(true, 1);
  }, [params]);

  return {
    prods,
    loading,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage,
    setParams,
  };
};

export default useFetchProducts;
