import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomText from './atoms/CustomText';

const CarouselImage = ({ uri, title, index, totalDots, excerpt, screenWidth }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={{ flex: 1, height: 644, width: screenWidth }}>
      {!loaded && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <ImageBackground
        source={{ uri }}
        style={{ flex: 1, justifyContent: 'flex-end' }}
        imageStyle={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          opacity: loaded ? 1 : 0,
        }}
        onLoadEnd={() => setLoaded(true)}
      >
        {loaded && (
          <View style={styles.overlay}>
            <CustomText style={styles.title} numberOfLines={1}>{title}</CustomText>
            <CustomText style={styles.textEcerpt}>{excerpt}</CustomText>
            <View style={styles.dotContainer}>
              {[...Array(totalDots)].map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, index === i && styles.activeDot]}
                />
              ))}
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const ManualCarousel = ({ data, onSlidePress, screenWidth }) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, height: 640 }}
    >
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() => onSlidePress(item)}
        >
          <CarouselImage
            screenWidth={screenWidth}
            excerpt={item.excerpt}
            uri={item.imagepath}
            title={item.title}
            description={item.excerpt}
            index={index}
            totalDots={data.length}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textEcerpt: {
    fontSize: 14,
    color: '#ccc',
    paddingTop: 10
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 10,
    height: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default ManualCarousel;
