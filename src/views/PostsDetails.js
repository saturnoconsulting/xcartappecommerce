import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import HTMLRender from "react-native-render-html";
import { tagsStyles } from '../constants/tagstyle';
import CustomText from '../components/atoms/CustomText';
import { formatTimestamp } from '../utils/formatTimestamp';

const PostsDetails = () => {
  const route = useRoute();
  const post = route.params?.post || {};
  const { width } = useWindowDimensions();
  const [loadingImage, setLoadingImage] = useState(true);

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {loadingImage && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
          <Image
            source={{ uri: post.imagepath }}
            style={styles.postImage}
            onLoadEnd={() => setLoadingImage(false)}
          />
          
          <CustomText style={styles.title}>{post.title}</CustomText>

          {(post.type === 'list' || post.type === 'slider') && (
            <View style={styles.dateContainer}>
              <CustomText style={styles.textDate}>
                {formatTimestamp(post.timestamp_local)}
              </CustomText>
            </View>)
            }

          <HTMLRender
            contentWidth={width - 32} // considerando padding 16
            source={{ html: post.content }}
            tagsStyles={tagsStyles}
          />
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    marginTop: 10,
    borderRadius: 5,
    width: 70,
    padding: 5,
    backgroundColor: "#d2d2d2",
    borderWidth: 0.1,
    marginBottom: 10,
  },
  textDate: {
    fontSize: 10,
   
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  postImage: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 100
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default PostsDetails;
