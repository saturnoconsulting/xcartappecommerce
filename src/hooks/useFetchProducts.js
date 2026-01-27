import { useCallback, useEffect, useState, useMemo } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";

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
      
      console.log(JSON.stringify(params, null, 2));

      try {
        const queryParams = {
          start: (nextPage - 1) * 9,
          limit: 9,
          type: "app",
          tags: params?.tags,
          idsCategory: params.idsCategory || null,
          idsDepartment: params?.idsDepartment || null,
          description: params.description || params?.searchQuery || null,
          barcode: params?.barcode || null,
        };

        // Aggiungi filterOptions solo se presente e non vuoto
        if (params?.filterOptions && Array.isArray(params.filterOptions) && params.filterOptions.length > 0) {
          queryParams.filterOptions = params.filterOptions;
        }
        const response = await api.post(endpoints.products, queryParams);

        //console.log("Fetched products response", response.data);
        if (response?.data?.products) {
          const newProds = response.data.products;
          setTotalCount(response.data.totalCount || 0);
          setProds((prev) =>
            isRefresh || nextPage === 1 ? newProds : [...prev, ...newProds]
          );
        }
      } catch (e) {
        console.error("Errore nel recupero dei prodotti:", e);
       
        if (e.response) {
          console.error("Response data:", e.response.data);
          console.error("Response status:", e.response.status);
          console.error("Response headers:", e.response.headers);
        }
        if (e.request) {
          console.error("Request:", e.request);
        }
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

  // Serializza i params per rilevare cambiamenti profondi
  const paramsString = useMemo(() => JSON.stringify(params), [params]);

  // Aggiorna automaticamente al cambio di params
  useEffect(() => {
    // Esegui sempre il fetch quando params cambia, anche se è vuoto (per resettare i filtri)
    setPage(1);
    fetchProducts(true, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]);

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
