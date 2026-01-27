import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import useFetchProducts from '../hooks/useFetchProducts';
import { backgroundcolor, primaryColor } from '../constants/colors';
import ProductRow from '../components/ProductRow';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/atoms/CustomText';
import Button from '../components/atoms/Button';
import Loading from '../components/Loading';
import { getOptions } from '../api/options';
import { IDSALESPOINT } from '../config';
import useTags from '../hooks/useTags';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const { tags, loading: loadingTags } = useTags();

  const tagOptions = useMemo(
    () => [
      { label: 'Tutti', value: null },
      ...(Array.isArray(tags)
        ? tags.map((tag) => ({
            label: tag.slug || String(tag.slug || ''),
            value: tag.slug,
          }))
        : []),
    ],
    [tags],
  );

  const params = useMemo(() => ({
    description: searchQuery || null,
  }), [searchQuery]);

  const {
    loading,
    prods,
    refreshing,
    refreshProducts,
    loadMoreProducts,
    isFetchingMore,
    setPage,
    setParams,
  } = useFetchProducts({
    params,
  });

  useEffect(() => {
    if (searchQuery) {
      setParams({ description: searchQuery });
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

  const handleSearch = () => {
    setPage(1);
    if (searchQuery) {
      setParams({ description: searchQuery });
    } else {
      setParams({});
    }
    setIsSearching(true);
    refreshProducts().finally(() => setIsSearching(false));
  };

  const resetFilters = () => {
    setSelectedTag(null);
    setSelectedOptions([]);
    // Crea un nuovo oggetto per forzare il rilevamento del cambiamento
    const newParams = searchQuery ? { description: searchQuery } : {};
    setPage(1);
    setParams(newParams);
    // Il refreshProducts verrà chiamato automaticamente dal useEffect quando params cambia
    setModalVisible(false);
  };

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await getOptions({ idsalespoint: IDSALESPOINT });
      if (response?.options && Array.isArray(response.options)) {
        setOptions(response.options);
      } else if (Array.isArray(response)) {
        setOptions(response);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error("Errore nel recupero delle opzioni:", error);
      setOptions([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      fetchOptions();
    }
  }, [modalVisible]);

  const toggleOption = (optionValue) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionValue)) {
        return prev.filter(v => v !== optionValue);
      } else {
        return [...prev, optionValue];
      }
    });
  };

  const applyFilters = (tag) => {
    const newParams = {};
    
    if (searchQuery) {
      newParams.description = searchQuery;
    }
    
    if (tag) {
      newParams.tags = [tag];
    }
    console.log("selectedOptions", selectedOptions);
    if (selectedOptions.length > 0) {
      newParams.filterOptions = selectedOptions;
    }
    console.log("Applying filters with tag:", tag);
    console.log("Applying filters with options:", selectedOptions);
    console.log("newParams", newParams);
    
    setPage(1);
    setParams(newParams);
    // Il refreshProducts verrà chiamato automaticamente dal useEffect quando params cambia
    setModalVisible(false);
  };

  return (
    <>
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
          <Button
            title="Filtra"
            onPress={() => setModalVisible(true)}
            style={styles.searchButton}
            textStyle={styles.searchButtonText}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {loading && <Loading />}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={40} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Filtri</Text>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.filterTitle}>Tag</Text>

              {loadingTags ? (
                <ActivityIndicator size="small" color={primaryColor} style={{ marginVertical: 10 }} />
              ) : (
                tagOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tagOption,
                      selectedTag === option.value && styles.tagOptionSelected,
                    ]}
                    onPress={() => setSelectedTag(option.value)}
                  >
                    <Text style={styles.tagOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))
              )}

              {loadingOptions ? (
                <ActivityIndicator size="small" color={primaryColor} style={{ marginVertical: 10 }} />
              ) : options.length > 0 ? (
                options.map((optionGroup, groupIndex) => {
                  const optionDescription = optionGroup.description || 'Opzione';
                  const optionValues = optionGroup.values || [];
                  
                  return (
                    <View key={groupIndex} style={{ marginTop: 20 }}>
                      <Text style={styles.filterTitle}>{optionDescription}</Text>
                      {optionValues.length > 0 ? (
                        <View style={styles.optionsContainer}>
                          {optionValues.map((value, valueIndex) => {
                            const valueString = String(value);
                            const isSelected = selectedOptions.includes(valueString);
                            
                            return (
                              <TouchableOpacity
                                key={valueIndex}
                                style={[
                                  styles.optionChip,
                                  isSelected && styles.optionChipSelected,
                                ]}
                                onPress={() => toggleOption(valueString)}
                              >
                                <Text style={styles.optionChipText}>{valueString}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  );
                })
              ) : (
                <CustomText style={{ marginVertical: 10, color: '#888' }}>Nessuna opzione disponibile</CustomText>
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button title="Applica" style={styles.buttonModal} onPress={() => applyFilters(selectedTag)} />

              <Button title="Ripristina" style={[styles.buttonModal, styles.buttonReset]} onPress={resetFilters} />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    paddingLeft: 12,
    marginVertical: 15,
    height: 45,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0.1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 8,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButton: {
    height: "100%",
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalScrollView: {
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  filterTitle: {
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "stretch",
    marginBottom: 5,
    fontSize: 16,
  },
  tagOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  tagOptionSelected: {
    borderColor: primaryColor,
    backgroundColor: "#e6f0ff",
  },
  tagOptionText: {
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipSelected: {
    borderColor: primaryColor,
    backgroundColor: "#e6f0ff",
  },
  optionChipText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonModal: {
    marginBottom: 10,
    marginTop: 5,
  },
  buttonReset: {
    backgroundColor: "#000",
  },
});
