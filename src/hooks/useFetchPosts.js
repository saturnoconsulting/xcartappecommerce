import { useCallback, useState, useRef } from "react";
import axios from "axios";

const useFetchPosts = ({ params }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const lastFetchedCount = useRef(0);

  const canLoadMore = lastFetchedCount.current === limit;

  const fetchPosts = useCallback(async (isRefresh = false, nextPage = 1) => {
    if (loading || refreshing || isFetchingMore) return;

    if (!isRefresh && nextPage === 1) setLoading(true);
    if (isRefresh) setRefreshing(true);
    if (nextPage > 1) setIsFetchingMore(true);
    //params?.types",params?.types);
    try {
      const queryParams = {
        idCategory: params?.idCategory || null,
        start: (nextPage - 1) * limit, 
        limit,
        types: params?.types,
        description: params?.description
      };
      
      const response = await axios.get("https://app.xcart.ai/api/cms/v1/posts", {
        params: queryParams,
      }, 
    );

      if (response?.data?.posts) {
        const newPosts = response.data.posts;
        lastFetchedCount.current = newPosts.length;
        setPosts((prev) =>
          isRefresh || nextPage === 1 ? newPosts : [...prev, ...newPosts]
        );
      }

    } catch (e) {
      console.error("Errore nel recupero dei post:", e);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [params, loading, refreshing, isFetchingMore]);

  const refreshPosts = async () => {
    setPage(1);
    await fetchPosts(true, 1);
  };

  const loadMorePosts = useCallback(() => {
    if (!canLoadMore || isFetchingMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(false, nextPage);
  }, [canLoadMore, isFetchingMore, fetchPosts, page]);

  return {
    posts,
    loading,
    refreshing,
    refreshPosts,
    loadMorePosts,
    isFetchingMore,
    canLoadMore,
  };
};

export default useFetchPosts;
