import { api } from "../services/api";
import * as endpoints from "../constants/endpoints";
import { idsalespoint } from "../constants/licence";
import { IDSALESPOINT } from "../config";

export const emptyCart = async (idcart) => {
    try {
      const response = await api.delete(`${endpoints.emptyCart}?idcart=${idcart}`);
      return response;
    } catch (error) {
      console.error("Errore nello svuotamento del carrello:", error);
      throw error;
    }
  };

export const addToCart = async (body) => {
    try {
        console.log("body add to cart",body)
        const response = await api.post(endpoints.addToCart, body);
        console.log("add to cart",response.data.cart);
        return response.data.cart;
    } catch (error) {
        console.error("Error adding to cart", error);
     console.log("🔸 Status:", error.response.status);
      console.log("🔸 Headers:", error.response.headers);
      console.log("🔸 Data (dal server):", error.response.data);
        throw error;
    }
}

export const delFromCart = async (body) => {
    //body del from cart",body);
    console.log("body del from cart", body);
    try {
        const response = await api.delete(endpoints.delFromCart, {
            data: body,
        });
        console.log("response del from cart", response.data.cart);
        return response.data.cart;
    } catch (error) {
           console.log("Error deleting from cart", error);
                console.log("Status:", error.response.status);
                console.log("Headers:", error.response.headers);
                console.log("Data:", error.response.data);
            
        throw error;
    }
};

export const fetchCart = async (cartID) => {
    try {
        console.log("cartID fetch cart", cartID);
        const response = await api.get(endpoints.getCart, {
            params: {
                idcart: cartID,
                idsalespoint: IDSALESPOINT,
                type: "app"
            },
        });
       //console.log("response fetch cart", response.data.cart.lineItems);
       return response.data.cart; 
    } catch (error) {
        return;
        console.error("Error fetching cart", error);
        //throw error;
    }
}