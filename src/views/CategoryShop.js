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

export default function CategoryShop() {
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const idcat = route.params?.idCategory;

  const namecat = route.params?.name;

  const params = useMemo(() => ({
    idsCategory: [idcat],
    description: searchQuery || null,
  }), [idcat, searchQuery]);

  const {
    prods,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage,

  } = useFetchProducts({
    ids: null,
    params,
  });


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


  useEffect(() => {
    refreshProducts().finally(() => setIsSearching(false));
  }, [idcat]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.productSection}>
        {/*<View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cerca..."
              placeholderTextColor="#aaa"
              style={styles.searchInput}
              underlineColorAndroid="transparent"
            />
          </View>*/}
        {prods && prods.length > 0 ? (
          <>
            <CustomText style={[styles.titleCat, { backgroundColor: backgroundcolor }]}>{namecat}</CustomText>
            <FlatList
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
          </>
        ) : (
        <CustomText style={styles.emptyProds}>
          Nessun prodotto disponibile presente in <CustomText style={[styles.titleCat, { backgroundColor: backgroundcolor }]}>{namecat} </CustomText>
        </CustomText>)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleCat: {
    marginTop:10,
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 15,
    marginBottom: 20,
  },
  emptyProds: {
    textAlign: 'center',
    marginTop: 10
  },
  safeArea: {
    flex: 1,
    backgroundColor: backgroundcolor,
    paddingTop: 10,
  },
  productSection: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
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
