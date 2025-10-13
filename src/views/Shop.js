import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Modal, FlatList, TextInput,
  TouchableOpacity, RefreshControl
} from 'react-native';
import Loading from '../components/Loading';
import { backgroundcolor, primaryColor } from '../constants/colors';
import useCategories from '../hooks/useCategories';
import CategoryRow from '../components/CategoryRow';
import ScreenWrapper from '../components/layouts/ScreenWrapper';
import CustomText from '../components/atoms/CustomText';
import { useNavigation } from '@react-navigation/native';

export default function Shop() {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const navigation = useNavigation();

  const {
    cats,
    loading: loadingCategories,
    refreshCategories,
  } = useCategories({
    ids: null,
    params,
  });

console.log("Categories in Shop:", cats);
  return (
    <ScreenWrapper>
      {loading && <Loading />}
      <View style={styles.productSection}>
        <FlatList
          data={cats}
          keyExtractor={(item) => item.externalid.toString()}
          renderItem={({ item }) => (
            <CategoryRow Screenfrom="Shop" category={item} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loadingCategories}
              onRefresh={refreshCategories}
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReachedThreshold={0.5}
        />
        {/*} <TouchableOpacity style={styles.subscriptionButton} onPress={handleSubs}>
  <CustomText style={styles.subscriptionButtonText}>Abbonamenti</CustomText>
</TouchableOpacity>*/}

      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  subscriptionButton: {
    backgroundColor: primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  subscriptionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  productSection: {
    flex: 1,
    backgroundColor: backgroundcolor,
    paddingTop: 5,
    marginBottom: 5
  },
  menuItem: {
    borderWidth: 0.1,
    borderColor: '#000',
    borderRadius: 0
  },
  filterButton: {
    borderRadius: 0,
    height: 40,
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
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: 20,
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
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
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 30,
    marginBottom: 20,
  },
  buttonModal: {
    marginBottom: 20,
  },
});
