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
import { backgroundcolor, primaryColor } from '../constants/colors';
import { formatTimestamp } from '../utils/formatTimestamp';

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
    <>
      {searchInput}
      <CustomText style={[styles.titleSection, styleTitle]}>{nameCat}</CustomText>
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.idpost}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => onPressPost(item)}>
                <View style={[styleCards, styles.card]}>
                  <View style={styles.cardContent}>
                    <View style={styles.imageCard}>
                      <ImageBackground
                        source={{ uri: item.imagepath }}
                        style={styles.postImage}
                      />
                    </View>
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
          }
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
          contentContainerStyle={{ paddingTop: 10, paddingLeft: 16, paddingRight: 16, paddingBottom: 30 }}
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
    </>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 0,
    marginRight: 10,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    maxHeight: "min-content",
    backgroundColor: backgroundcolor,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 0.1 },
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
    height: 150,
  },
  textContainer: {
    flex: 1,
    maxHeight: 140,
    overflow: 'hidden',
    paddingLeft: 10,
    paddingTop: 10,
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
    position: 'absolute',
    bottom: 0,
    left: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#d2d2d244",
    borderWidth: 0.1,
  },
  textDate: {
    fontSize: 10
  }
});

export default PostListSection;
