import { useState } from 'react';
import {
  ScrollView,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import useFetchOrders from '../hooks/useFetchOrders';
import { useSelector } from 'react-redux';
import formatPrice from '../utils/formatPrice';
import { backgroundcolor, primaryColor } from '../constants/colors';
import { GET_USER } from '../store/selectors/userSelector';
import Loading from '../components/Loading';
import CustomText from '../components/atoms/CustomText';
import ScreenWrapper from '../components/layouts/ScreenWrapper';
import formatDate from '../utils/formatDate';
import { getPaymentLabel, getStatusStyle, getTextStatus } from '../utils/formatStatus';

const Orders = ({ navigation }) => {
  const customer = useSelector(GET_USER);
  const {
    orders,
    loading,
    refreshing,
    isFetchingMore,
    canLoadMore,
    refreshOrders,
    loadMoreOrders,
  } = useFetchOrders({ iduser: customer?.iduser });

  const handleEndReached = () => {
    if (canLoadMore && !isFetchingMore) loadMoreOrders();
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.emptyOrders}>Caricamento cliente in corso...</CustomText>
      </View>
    );
  }

  return (
    <>
      {loading && orders.length === 0 && <Loading />}
        <View style={styles.container}>
          {orders.length > 0 ? (
            <>
              {/*<CustomText style={styles.title}>Ordini</CustomText>*/}
              <FlatList
                data={orders}
                keyExtractor={(item) => item.idorder.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.orderItem}
                    onPress={() => navigation.navigate('OrderDetails', { idorder: item.idorder })}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <CustomText style={styles.orderNumberText}>Ordine: #{item.idorder}</CustomText>
                      <CustomText style={styles.orderPriceText}>{formatPrice(item.total)}</CustomText>
                    </View>
                    <CustomText style={styles.dataText}>{formatDate(item.created_at)}</CustomText>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <CustomText style={styles.dataText}>{getPaymentLabel(item.payment.type)}</CustomText>
                      <CustomText style={[styles.orderStatusText, getStatusStyle(item.status, styles)]}>
                        {getTextStatus(item.status)}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                )}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={refreshOrders} />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={
                  isFetchingMore ? (
                    <ActivityIndicator size="small" color={primaryColor} />
                  ) : null
                }
                contentContainerStyle={{ paddingBottom: 30 }}
              />
            </>
          ) : (
            <ScrollView
              contentContainerStyle={styles.container}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refreshOrders} />
              }
            >
              <CustomText style={styles.emptyOrders}>Non ci sono ordini</CustomText>
            </ScrollView>
          )}
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyOrders: {
    textAlign: 'center',
  },
  orderNumberText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
    padding: 15,
  },
  dataText: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
    marginBottom: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  orderItem: {
    borderBlockColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 8,
    elevation: 1,
  },
  orderPriceText:{
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  orderStatusText: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pendingPayment: {
    borderColor: '#FFA500',
    color: '#FFA500',
  },
  canceledPayment: {
    borderColor: '#FF0000',
    color: '#FF0000',
    textDecorationLine: 'line-through',
  },
  paidPayment: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
  },
  refundedPayment: {
    borderColor: '#2196F3',
    color: '#2196F3',
    fontStyle: 'italic',
  },
  suspendedPayment: {
    borderColor: '#9E9E9E',
    color: '#9E9E9E',
  },
  shippedPayment: {
    borderColor: '#3F51B5',
    color: '#3F51B5',
  },
  completedPayment: {
    borderColor: '#2E7D32',
    color: '#2E7D32',
    fontWeight: '600',
  },
});

export default Orders;
