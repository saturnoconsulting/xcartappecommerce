import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Text,
} from 'react-native';
import CustomText from '../components/atoms/CustomText';
import Loading from '../components/Loading';
import { backgroundcolor, primaryColor } from '../constants/colors';
import formatPrice from '../utils/formatPrice';
import formatDate from '../utils/formatDate';
import useFetchReturns from '../hooks/useFetchReturns';
import { getTextStatus } from '../utils/formatStatus';
import Button from '../components/atoms/Button';
import { useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";

const Returns = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [params, setParams] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    { label: "Tutti", value: null },
    { label: "Bozza", value: "draft" },
    { label: "Completato", value: "completed" },
    { label: "In attesa", value: "pending" },
    { label: "Cancellato", value: "canceled" },
  ];

  const {
    returns,
    loading,
    refreshing,
    refreshReturns,
    loadMoreReturns,
    isFetchingMore,
    canLoadMore,
    setPage,
  } = useFetchReturns(params);

  const handleEndReached = () => {
    if (canLoadMore && !isFetchingMore) loadMoreReturns();
  };

  const applyFilters = (status) => {
    const newParams = {};

    console.log("Applying filter with status:", status);
    if (status) {
      newParams.status = status;
    }
    console.log("newParams", newParams);

    setParams(newParams);
    setPage(1);
    refreshReturns(newParams);
    setModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedStatus(null);
    setParams({});
    setPage(1);
    refreshReturns();
    setModalVisible(false);
  };


  return (
    <>
      {loading && returns.length === 0 && <Loading />}

      <View style={styles.container}>
        <Button style={styles.filterButton} title="Filtra" onPress={() => setModalVisible(true)} />
        {returns.length > 0 ? (
          <FlatList
            data={returns}
            keyExtractor={(item) => item.idreturnorder.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.returnItem}
                onPress={() =>
                  navigation.navigate('ReturnsDetails', {
                    idreturnorder: item.idreturnorder,
                  })
                }
              >
                <View style={styles.rowSpace}>
                  <CustomText style={styles.returnNumber}>
                    Reso: #{item.idreturnorder}
                  </CustomText>
                  <CustomText style={styles.returnAmount}>
                    {formatPrice(item.refund_total)}
                  </CustomText>
                </View>

                <CustomText style={styles.dateText}>
                  {formatDate(item.requested_at)}
                </CustomText>

                <View style={styles.rowSpace}>
                  <CustomText style={styles.methodText}>
                    Metodo: {item.return_method === 'courier' ? 'Corriere' : 'Negozio'}
                  </CustomText>

                  <CustomText style={[styles.statusText, styles[item.status]]}>
                    {getTextStatus(item.status)}
                  </CustomText>
                </View>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshReturns} />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.25}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshReturns} />
            }
          >
            <CustomText style={styles.emptyText}>Non ci sono resi</CustomText>
          </ScrollView>
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

            <Text style={styles.filterTitle}>Stato</Text>

            {loading ? (
              <ActivityIndicator size="small" color={primaryColor} style={{ marginVertical: 10 }} />
            ) : (
              statusOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.statusOption,
                    selectedStatus === option.value && styles.statusOptionSelected,
                  ]}
                  onPress={() => setSelectedStatus(option.value)}
                >
                  <Text>{option.label}</Text>
                </TouchableOpacity>
              ))
            )}

            <View style={styles.buttonContainer}>
              <Button title="Applica" style={styles.buttonModal} onPress={() => applyFilters(selectedStatus)} />

              <Button title="Ripristina" style={[styles.buttonModal, styles.buttonReset]} onPress={resetFilters} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Returns;

const styles = StyleSheet.create({
  buttonReset:{
    backgroundColor: "#000",
  },
  buttonModal:{
    marginBottom:10,
    marginTop:5,
  },
  statusOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  statusOptionSelected: {
    borderColor: primaryColor,
    backgroundColor: "#e6f0ff",
  },
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
  },
  returnItem: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  returnNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  returnAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  dateText: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    color: '#666',
  },
  methodText: {
    fontSize: 12,
    color: '#555',
  },
  statusText: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  // STATUS COLORI
  draft: { borderColor: '#999', color: '#999' },
  received: { borderColor: '#4CAF50', color: '#4CAF50' },
  refunded: { borderColor: '#2196F3', color: '#2196F3' },
  canceled: { borderColor: '#FF0000', color: '#FF0000' },
  filterButton: {
    borderRadius: 8,
    height: 40,
    marginBottom: 15,
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
});
