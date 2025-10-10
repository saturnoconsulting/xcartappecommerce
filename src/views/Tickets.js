import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { primaryColor } from '../constants/colors';
import useFetchTickets from "../hooks/useFetchTickets";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import QRCodeModal from "../components/QRCodeModal";
import Icon from "react-native-vector-icons/Ionicons";
import Loading from "../components/Loading";
import CustomText from '../components/atoms/CustomText';
import { ScrollView } from "react-native-gesture-handler";
import ScreenWrapper from "../components/layouts/ScreenWrapper";
import { getBorderColor, getTextColor, getTextStatus } from "../utils/formatStatus";

const Tickets = () => {
  const {  canLoadMore, tickets, loading: loadingTickets, refreshing, refreshTickets, loadMoreTickets, isFetchingMore } = useFetchTickets();
  const { navigate } = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const openQRCode = (sub) => {
    setSelectedTicket(sub);
    setIsModalVisible(true);
  };

  const closeQRCode = () => {
    setIsModalVisible(false);
    setSelectedTicket(null);
  };

  const onEndReached = () => {
  if (canLoadMore && !isFetchingMore) {
    loadMoreTickets();
  }
};

  const renderItem = ({ item, index }) => {
    const startDate = new Date(item.localtimestamp * 1000).toLocaleDateString();
    const borderColor = getBorderColor(item.status);
    const textColor = getTextColor(item.status);
    const textStatus = getTextStatus(item.status);

    return (
      <View key={item.externalid ?? index} style={[styles.card, { borderLeftColor: borderColor }]}>
        <CustomText style={styles.cardTitle}>{item.name}</CustomText>
        <CustomText style={styles.cardExpiry}>Acquisto: {startDate}</CustomText>
       
        <View style={styles.bottomRow}>
          {item.status === "expired" && (
            <Button
              mode="outlined"
              compact
              onPress={() => navigate("Shop")}
              style={[styles.renewButton, { borderColor: 'black' }]}
              textColor="black"
            >
              Rinnova
            </Button>
          )}

          {item.status === "active" && (
            <TouchableOpacity style={styles.qrcodeContainer} onPress={() => openQRCode(item)}>
              <Icon name="qr-code-outline" size={40} color="black" />
            </TouchableOpacity>
          )}

          {(item.status !== "expired" && item.status !== "active") && (
            <View style={{ width: 80 }} />
          )}

          <CustomText style={[styles.statusText, { color: textColor }]}>
            {textStatus.toUpperCase()}
          </CustomText>
        </View>
      </View>
    );
  };

  if (loadingTickets && tickets.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <>
      {loadingTickets && <Loading />}
      <ScreenWrapper>
      <View style={styles.container}>
        {tickets && tickets.length > 0 ? (
          <>
            <FlatList
              data={tickets}
              renderItem={renderItem}
              keyExtractor={(item, index) => (item.externalid ?? index).toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refreshTickets} />
              }
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color={primaryColor} /> : null}
              contentContainerStyle={styles.listContainer}
            />
            <QRCodeModal visible={isModalVisible} onClose={closeQRCode} subscription={selectedTicket} />
          </>
        ) : (
          <ScrollView
            contentContainerStyle={styles.containerEmpty}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshTickets} />
            }
          >
            <CustomText style={styles.emptyTickets}>
              Non ci sono biglietti
            </CustomText>
          </ScrollView>
        )}
      </View>
      </ScreenWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  containerEmpty:{
    marginTop:30
  },
  emptyTickets: {
    textAlign: 'center',
  },
  qrcodeContainer: { borderBlockColor: "black", borderWidth: 1, padding: 5, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, backgroundColor: "#f5f5f5"},
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardExpiry: { color: "#999", marginBottom: 10 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  statusText: { fontWeight: "bold", fontSize: 16 },
  renewButton: { paddingVertical: 0, paddingHorizontal: 10 },
});

export default Tickets;
