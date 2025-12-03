import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectFavorites } from "../store/selectors/favoriteSelector";
import CustomText from "../components/atoms/CustomText";
import ProductRow from "../components/ProductRow";
import useFetchProducts from "../hooks/useFetchProducts";
import { backgroundcolor } from "../constants/colors";

const Favourite = () => {
  const ids = useSelector(selectFavorites);
  const { prods, loading, setParams, refreshProducts } = useFetchProducts();
  const [refreshing, setRefreshing] = useState(false);

  const favouriteProducts = prods.filter((p) => ids.includes(p.externalid));

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProducts();
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (ids && ids.length > 0) {
      setParams({ ids });
    } else {
      setParams({ ids: [] });
    }
  }, [ids]);

  console.log("ids" , ids);

  if (favouriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <CustomText
          lineHeight={20}
          size={16}
          style={styles.emptyList}
          color="rgba(0, 0, 0, 0.7)"
          text="Non hai aggiunto prodotti preferiti"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favouriteProducts.length > 0 && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={favouriteProducts}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <ProductRow product={item} />}
          keyExtractor={(item) => item.externalid.toString()}
          ListFooterComponent={
            loading && (
              <CustomText
                lineHeight={20}
                size={16}
                style={styles.emptyList}
                color="rgba(0, 0, 0, 0.7)"
                text="Caricamento in corso..."
              />
            )
          }
        />
      )
      }
    </View>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    margin: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyList: {
    marginHorizontal: 24,
    marginTop: 20,
    textAlign: "center",
  },
});
