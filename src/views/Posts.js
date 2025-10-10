import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import useFetchPosts from '../hooks/useFetchPosts';
import { primaryColor } from '../constants/colors';
import Loading from '../components/Loading';
import CustomText from '../components/atoms/CustomText';
import PostListSection from '../components/PostListSection';
import ScreenWrapper from '../components/layouts/ScreenWrapper';
import Icon from 'react-native-vector-icons/Ionicons';

const Posts = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const nameCat = route.params?.nameCat || '';
  const idCat = route.params?.idCat || '';
  const type = route.params?.type || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 800);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const {
    posts,
    refreshPosts,
    loading: loadingPosts,
    loadMorePosts,
    isFetchingMore,
    canLoadMore,
  } = useFetchPosts({
    params: {
      idCategory: idCat,
      description: debouncedQuery || null,
      ...(debouncedQuery && idCat === 1 ? { types: ['list'] } : {}),
      ...(debouncedQuery && idCat === 2 ? { types: ['list'] } : {}),
      ...(debouncedQuery && idCat === 3 ? { types: ['list'] } : {}),
      ...(debouncedQuery && idCat === 6 ? { types: ['list'] } : {}),
    },
  });

  useEffect(() => {
    setIsCategoryLoading(true);
    refreshPosts().finally(() => setIsCategoryLoading(false));
  }, [idCat, debouncedQuery]);

  const handlePress = (post) => {
    navigation.navigate('PostsDetails', { post });
  };

  const renderSearchInput = () => (
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
    </View>
  );

  if (loadingPosts || isCategoryLoading) {
    return <Loading />;
  }


  return (
    <>
      {posts.length > 0 ? (
        (type === 'player' || type === 'staff') ? (
          <ScreenWrapper style={{ flex: 1, paddingBottom: 40 }}>
            {renderSearchInput()}
            <CustomText style={styles.titleSectionPlayer}>{nameCat}</CustomText>
            <FlatList
              data={posts}
              keyExtractor={(item) => item.idpost.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item)}>
                  <View style={styles.shadowWrapper}>
                    <LinearGradient
                      colors={[primaryColor, 'black']}
                      style={styles.cardPlayer}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <Image source={{ uri: item.imagepath }} style={styles.postImagePlayer} />
                      <View style={styles.textContainerPlayer}>
                        <CustomText style={styles.titlePlayer}>{item.title}</CustomText>
                        <View style={styles.contentPlayer}>
                          <CustomText style={styles.titlePlayer}>{item.excerpt}</CustomText>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={loadingPosts} onRefresh={refreshPosts} />
              }
              onEndReached={() => {
                if (canLoadMore && !isFetchingMore) loadMorePosts();
              }}
              onEndReachedThreshold={0.01}
              initialNumToRender={5}
              ListFooterComponent={
                isFetchingMore ? <ActivityIndicator size="small" color={primaryColor} /> : null
              }
              contentContainerStyle={{
                paddingTop: 16,
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 40,
              }}
            />
          </ScreenWrapper>
        ) : (
          <PostListSection
            styleTitle={{ textAlign: "center" }}
            searchInput={renderSearchInput()}
            posts={posts}
            nameCat={nameCat}
            onPressPost={handlePress}
            refreshing={loadingPosts}
            onRefresh={refreshPosts}
            onLoadMore={loadMorePosts}
            isFetchingMore={isFetchingMore}
            canLoadMore={canLoadMore}
          />
        )
      ) : (
        <ScreenWrapper style={{ flex: 1, paddingBottom: 40 }}>
          {renderSearchInput()}
          <CustomText style={{ fontSize: 18, color: '#555', marginTop: 20, alignItems: "center", textAlign: "center" }}>
            Nessun elemento trovato.
          </CustomText>
        </ScreenWrapper>)}
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 0.1,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  titleSectionPlayer: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center"
  },
  shadowWrapper: {
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    backgroundColor: '#000',
  },
  cardPlayer: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  postImagePlayer: {
    marginTop: 33,
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  textContainerPlayer: {
    marginTop: 20,
    flex: 1,
    maxHeight: 140,
    overflow: 'hidden',
  },
  titlePlayer: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentPlayer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
});

export default Posts;
