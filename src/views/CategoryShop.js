import React, { useEffect, useState, useRef } from 'react';
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
  const prevIdcatRef = useRef(null);
  const prevCategoryTypeRef = useRef(null);
  const prevSearchQueryRef = useRef('');

  const idcat = route.params?.idCategory;
  const namecat = route.params?.name;
  const categoryType = route.params?.categoryType;

  // Mappa i categoryType ai tag per l'API
  const getTagFromCategoryType = (type) => {
    const tagMap = {
      recommended: 'recommended',
      box: 'box',
      bestsellers: 'bestsellers',
    };
    return tagMap[type] || null;
  };

  const {
    prods,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage,
    setParams,
  } = useFetchProducts({
    ids: null,
    params: {
      idsCategory: idcat ? [idcat] : null,
      tags: categoryType ? [getTagFromCategoryType(categoryType)] : null,
      description: null,
    },
  });

  // Aggiorna i params solo quando idcat, categoryType o searchQuery cambiano effettivamente
  useEffect(() => {
    const idcatChanged = idcat !== prevIdcatRef.current;
    const categoryTypeChanged = categoryType !== prevCategoryTypeRef.current;
    const searchQueryChanged = searchQuery !== prevSearchQueryRef.current;
    
    // Esegui l'aggiornamento se c'è almeno idcat o categoryType
    if ((idcat || categoryType) && (idcatChanged || categoryTypeChanged || searchQueryChanged)) {
      if (idcatChanged) {
        prevIdcatRef.current = idcat;
      }
      if (categoryTypeChanged) {
        prevCategoryTypeRef.current = categoryType;
      }
      if (searchQueryChanged) {
        prevSearchQueryRef.current = searchQuery;
      }
      
      const newParams = {
        description: searchQuery || null,
      };
      
      if (idcat) {
        newParams.idsCategory = [idcat];
      }
      
      if (categoryType) {
        const tag = getTagFromCategoryType(categoryType);
        if (tag) {
          newParams.tags = [tag];
        }
      }
      
      setParams(newParams);
      if (idcatChanged || categoryTypeChanged) {
        setPage(1);
      }
    }
  }, [idcat, categoryType, searchQuery, setParams, setPage]);

  console.log("prods category shop", prods);

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
