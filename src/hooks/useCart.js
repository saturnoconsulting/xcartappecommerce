import { useCallback, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { fetchCart } from "../api/cart";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cart, setCart] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const storedId = await AsyncStorage.getItem("cartId");
      console.log("Cart ID from AsyncStorage usecart:", storedId);
      if (!storedId) return;

      setLoading(true);
      setRefreshing(true);
      const data = await fetchCart(storedId);
      setCart(data);
    } catch (e) {
      if (e?.response?.data?.error === "Cart not found.") {
        setCart(null);
        resetCart()
        return;
      }
      showMessage({
        message: "Attenzione",
        description: "Non siamo riusciti a caricare il carrello, riprova più tardi!",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetch(); // Carica all'avvio
  }, []);

  const resetCart = async () => {
    await AsyncStorage.removeItem("cartId");
    setCart(null);
  };

  return {
    cartData: cart,
    loading,
    refreshing,
    refetch: fetch,
    resetCart,
  };
};

export default useCart;
