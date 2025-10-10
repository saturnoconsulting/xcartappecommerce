import {
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/atoms/CustomText';
import { primaryColor } from '../constants/colors';
import { formatTimestamp } from '../utils/formatTimestamp';
import ScreenWrapper from './layouts/ScreenWrapper';
import { Linking } from 'react-native';


const PostListSection = ({
  posts,
  nameCat,
  onPressPost,
  refreshing,
  onRefresh,
  onLoadMore,
  isFetchingMore,
  canLoadMore,
  searchInput,
  styleTitle,
  styleCards
}) => {


  return (
    <ScreenWrapper style={{ flex: 1, paddingBottom: 40 }}>
      {searchInput}
      <CustomText style={[styles.titleSection, styleTitle]}>{nameCat}</CustomText>
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.idpost}
          renderItem={({ item }) => {
            if (item.type === 'sponsor') {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.excerpt && item.excerpt.startsWith('http')) {
                      Linking.openURL(item.excerpt).catch((err) =>
                        console.error("Errore apertura link sponsor:", err)
                      );
                    }

                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styleCards, styles.cardSponsor]}>
                    <View style={styles.sponsorContainer}>
                      <ImageBackground
                        source={{ uri: item.imagepath }}
                        style={styles.sponsorImage}
                        imageStyle={{ borderRadius: 8 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );

            } else {
              return (
                <TouchableOpacity onPress={() => onPressPost(item)}>
                  <View style={[styleCards, styles.card]}>
                    <View style={styles.cardContent}>
                      <ImageBackground
                        source={{ uri: item.imagepath }}
                        style={styles.postImage}
                      />
                      <View style={styles.textContainer}>
                        <CustomText style={styles.title} numberOfLines={1}>
                          {item.title}
                        </CustomText>
                        <CustomText style={styles.text}>{item.excerpt}</CustomText>
                        <View style={styles.dateContainer}>
                          <CustomText style={styles.textDate}>
                            {formatTimestamp(item.timestamp_local)}
                          </CustomText>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          }}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReached={() => {
            if (canLoadMore && !isFetchingMore) {
              onLoadMore();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator size="small" color={primaryColor} /> : null
          }
          contentContainerStyle={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16, paddingBottom: 30 }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <CustomText style={styles.emptyNews}>Non è presente alcun contenuto.</CustomText>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sponsorContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },

  sponsorImage: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sponsorOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  sponsorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  emptyNews: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  newsSection: {
    flex: 1,

  },
  titleSection: {
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSponsor: {
    maxHeight: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContentSponsor: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  card: {
    maxHeight: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 15,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  postImage: {
    width: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    height: '100%',
  },
  postImageSponsor: {
    width: 300,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    maxHeight: 140,
    overflow: 'hidden',
    paddingLeft: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  dateContainer: {
    marginTop: 5,
    borderRadius: 5,
    width: 70,
    padding: 5,
    backgroundColor: "#d2d2d2",
    borderWidth: 0.1,
  },
  textDate: {
    fontSize: 10
  }
});

export default PostListSection;
