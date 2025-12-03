import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import useFetchProducts from '../hooks/useFetchProducts';
import { backgroundcolor } from '../constants/colors';
import { useRoute } from '@react-navigation/native';
import ProductRow from '../components/ProductRow';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/atoms/CustomText';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const params = useMemo(() => ({
    description: searchQuery || null,
  }), [searchQuery]);

  const {
    prods,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage,
    setParams
  } = useFetchProducts({
    params,
  });

  useEffect(() => {
      if (searchQuery) {
        setParams({ searchQuery });
      } else {
        setParams({});
      }
    }, [searchQuery]);

  console.log("Search - searchQuery:", searchQuery);
  console.log("Search params", params);

  useEffect(() => {
    setPage(1);
    const timeout = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 3) {
        setIsSearching(true);
        refreshProducts().finally(() => setIsSearching(false));
      }
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <View style={styles.productSection}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Cerca..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          underlineColorAndroid="transparent"
        />
      </View>
      {prods.length > 0 ? (
       <FlatList
        style={{ backgroundColor: backgroundcolor }}
        data={prods}
        keyExtractor={(item) => item.externalid.toString()}
        renderItem={({ item }) => (
          <ProductRow product={item} previousScreen="CategoryShop" />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProducts}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={loadMoreProducts}
        ListFooterComponent={() => (
          isFetchingMore || isSearching ? (
            <ActivityIndicator style={{ marginVertical: 10 }} />
          ) : null
        )}
      />
      ) : (
        <CustomText style={{ textAlign: 'center', marginTop: 20 }}>Nessun prodotto trovato.</CustomText>
      )}
    </View>

  );
}


const styles = StyleSheet.create({
  productSection: {
    flex: 1,
    backgroundColor: backgroundcolor,
  },
  searchContainer: {
    backgroundColor: backgroundcolor,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 15,
    height: 45,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
