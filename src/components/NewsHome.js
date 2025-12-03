import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostListSection from './PostListSection';

const NewsHome = ({ styleCards,styleTitle,listPosts, loadingPosts, refreshPosts, loadMorePosts, isFetchingMore }) => {
  const navigation = useNavigation();

  const handlePress = (post) => {
    navigation.navigate('PostsDetails', { post });
  };

  return (
    <>
        <PostListSection
          styleCards={styleCards}
          styleTitle={styleTitle}
          posts={listPosts}
          nameCat={"Ultime News"}
          onPressPost={handlePress}
          refreshing={loadingPosts}
          onRefresh={refreshPosts}
          onLoadMore={loadMorePosts}
          isFetchingMore={isFetchingMore}
        />
    </>
  );
};

const styles = StyleSheet.create({
  newsSection: {
    paddingBottom: 0,
    marginTop:20
  },
});


export default NewsHome;
