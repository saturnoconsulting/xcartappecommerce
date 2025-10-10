import React, { useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Dimensions, RefreshControl, ActivityIndicator
} from 'react-native';
import useFetchGames from '../hooks/useFetchGames';
import { useNavigation, useRoute } from '@react-navigation/native';
import { parseDateGames } from '../utils/parseDateGames';
import CustomText from '../components/atoms/CustomText';
import ScreenWrapper from '../components/layouts/ScreenWrapper';

export default function MatchesVOD() {
  const {
    games,
    refreshGames,
    loadMoreGames,
    isFetchingMore,
    canLoadMore,
  } = useFetchGames();


  const route = useRoute();
  const subActive = route.params?.params?.subActive; 

  const navigation = useNavigation();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const VODGames = useMemo(() => {
    return games?.filter(
      (game) =>
        game.status === 'vod' ||
        game.status === 'scheduled'
    );
  }, [games]);

  const numColumns = 1;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth - 20;

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshGames();
    setIsRefreshing(false);
  }, [refreshGames]);

  const renderItem = ({ item }) => {
    const { day, month, time } = parseDateGames(item.localdatetime);

    return (
      <TouchableOpacity
        style={[styles.itemContainer, { width: itemWidth }]}
        onPress={() =>navigation.navigate('VideoMatchVOD', { game: item, subActive: subActive })}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.dateBox,
              { backgroundColor: item.status === "scheduled" ? "#fea501" : "#007B3A" }
            ]}
          >
            <CustomText style={styles.dayText}>{day}</CustomText>
            <CustomText style={styles.monthText}>{month}</CustomText>
            <CustomText style={styles.timeText}>{time}</CustomText>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.teamRow}>
              <View style={styles.teamColumn}>
                <CustomText style={styles.champText}>{item.championship}</CustomText>
                <View style={styles.contentCardInfo}>
                  <CustomText style={styles.placeText}>{item.place}</CustomText>
                </View>
              </View>
            </View>
            <View style={styles.teamRow}>
              <View style={styles.teamColumn}>
                <Image source={{ uri: item.imagepath1 }} style={styles.logo} />
                <CustomText style={styles.teamText}>{item.team1}</CustomText>
              </View>
              <CustomText style={styles.vsText}>VS</CustomText>
              <View style={styles.teamColumn}>
                <Image source={{ uri: item.imagepath2 }} style={styles.logo} />
                <CustomText style={styles.teamText}>{item.team2}</CustomText>
              </View>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return <ActivityIndicator size="small" color="#007B3A" style={{ margin: 10 }} />;
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={VODGames}
          renderItem={renderItem}
          keyExtractor={(item) => item.externalid}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            if (canLoadMore && !isFetchingMore) {
              loadMoreGames();
            }
          }}

          onEndReachedThreshold={0.2} // scatta quando manca il 20% alla fine
          ListFooterComponent={renderFooter}
        />
      </View>
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 0,
  },

  teamColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20},
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    alignItems: 'center',  // CENTRA gli item orizzontalmente
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateBox: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    alignSelf: 'stretch', // la banda occupa tutta l'altezza della card
  },
  dayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  infoBox: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  timeText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  champText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#007B3A',
    marginBottom: 5,
  },
  contentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between', // distribuisce gli elementi alle estremità
    alignItems: 'center',
    marginBottom: 10,
    //paddingHorizontal: 20,
  },
  contentCardInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vsText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamsAbbrev: {
    flexDirection: 'row',
    justifyContent: 'space-between', // distribuisce gli elementi alle estremità
    alignItems: 'center',
    marginBottom: 10,
  },
  teamText: {
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 'bold',
  },
});
