import { useCallback, useEffect, useState } from "react";
import * as endpoints from "../constants/endpoints";
import { api } from "../services/api";
import { IDSALESPOINT } from "../config";

const useFetchProducts = ({ ids, params }) => {
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProducts = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (!isRefresh && nextPage === 1) setLoading(true);
    if (isRefresh) setRefreshing(true);
    if (nextPage > 1) setIsFetchingMore(true);

    try {
      const queryParams = {
        idsalespoint: IDSALESPOINT,
        start: (nextPage - 1) * 9,
        limit: 9,
        type: "app",
        ...(ids?.length > 0 && { ids }),
        tags: params.tags ,
        idsCategory: params.idsCategory ,
        idsDepartment: params.idsDepartment ,
        description: params.description ,
        barcode: params.barcode || null,
      };

      const response = await api.post(endpoints.products, queryParams);

      if (response?.data?.products) {
        const newProds = response.data.products;
        setTotalCount(response.data.totalCount || 0);

        setProds((prev) =>
          isRefresh || nextPage === 1 ? newProds : [...prev, ...newProds]
        );
      }
    } catch (e) {
      console.error("Errore nel recupero dei prodotti:", e);
      console.log("🔸 Status:", e.response.status);
      console.log("🔸 Headers:", e.response.headers);
      //console.log("🔸 Data (dal server):", e.response.data);
    
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [ids, params]);

  const refreshProducts = async () => {
    setPage(1);
    return await fetchProducts(true, 1); 
  };
  
  //scroll infinito
  const loadMoreProducts = useCallback(() => {
    const nextPage = page + 1;
    const maxPage = Math.ceil(totalCount / 9);
    if (page < maxPage && !isFetchingMore) {
      fetchProducts(false, nextPage);
      setPage(nextPage);
    }
  }, [page, totalCount, fetchProducts, isFetchingMore]);

  return {
    prods,
    loading,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage, // esporta setPage per usarlo esternamente
  };
};

export default useFetchProducts;
