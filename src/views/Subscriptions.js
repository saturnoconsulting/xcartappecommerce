import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { primaryColor } from '../constants/colors';
import useFetchSubscriptions from "../hooks/useFetchSubscriptions";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import QRCodeModal from "../components/QRCodeModal";
import Icon from "react-native-vector-icons/Ionicons";
import Loading from "../components/Loading";
import CustomText from '../components/atoms/CustomText';
import { ScrollView } from "react-native-gesture-handler";
import ScreenWrapper from "../components/layouts/ScreenWrapper";
import { getBorderColor, getTextColor, getTextStatus } from "../utils/formatStatus";

const Subscriptions = () => {
  const {
  subs,
  loading: loadingSubs,
  refreshing,
  refreshSubs,
  loadMoreSubs,
  isFetchingMore,
  totalCount,
  canLoadMore,
} = useFetchSubscriptions();

const { navigate } = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const openQRCode = (sub) => {
    setSelectedSub(sub);
    setIsModalVisible(true);
  };

  const closeQRCode = () => {
    setIsModalVisible(false);
    setSelectedSub(null);
  };

const onEndReached = () => {
  if (canLoadMore && !isFetchingMore) {
    loadMoreSubs();
  }
};


  const renderItem = ({ item, index }) => {
    const startDate = new Date(item.start_timestamp * 1000).toLocaleDateString();
    const expiryDate = new Date(item.end_timestamp * 1000).toLocaleDateString();
    const borderColor = getBorderColor(item.status);
    const textColor = getTextColor(item.status);
    const textStatus = getTextStatus(item.status);

    return (
      <View key={item.externalid ?? index} style={[styles.card, { borderLeftColor: borderColor }]}>
        <CustomText style={styles.cardTitle}>{item.name}</CustomText>
        <CustomText style={styles.cardExpiry}>Acquisto: {startDate}</CustomText>
        <CustomText style={styles.cardExpiry}>Scadenza: {expiryDate}</CustomText>

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

  if (loadingSubs && subs.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <>
      {loadingSubs && <Loading />}
      <ScreenWrapper>
      <View style={styles.container}>
        {subs && subs.length > 0 ? (
          <>
            <FlatList
              data={subs}
              renderItem={renderItem}
              keyExtractor={(item, index) => (item.externalid ?? index).toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refreshSubs} />
              }
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color={primaryColor} /> : null}
              contentContainerStyle={styles.listContainer}
            />
            <QRCodeModal visible={isModalVisible} onClose={closeQRCode} subscription={selectedSub} />
          </>
        ) : (
          <ScrollView
            contentContainerStyle={styles.containerEmpty}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshSubs} />
            }
          >

            <CustomText style={styles.emptySubs}>
              Non ci sono abbonamenti
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
  emptySubs: {
    textAlign: 'center',
  },
  qrcodeContainer: { borderBlockColor: "black", borderWidth: 1, padding: 5, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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

export default Subscriptions;
