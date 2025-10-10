import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import CustomText from '../components/atoms/CustomText';
//TODO: NON VIENE USATO MA NON VA ELIMINATO 

const VideoMatchLive = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => { 
    setIsPlaying(true);
    await videoRef.current.playAsync();
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Video Match</CustomText>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: 'https://rugbylaquila.b-cdn.net/live/streams/Em9zaFL6cVpiZvp7295247053559726.mp4' }}
          useNativeControls
          resizeMode="contain"
          style={styles.video}
          onError={(e) => console.log('Video error:', e)}
          onLoadStart={() => console.log('Loading video...')}
          onLoad={() => console.log('Video loaded')}
          onPlaybackStatusUpdate={(status) => console.log(status)}
        />
        {!isPlaying && (
          <TouchableOpacity style={styles.posterOverlay} onPress={handlePlay}>
            <Image
              source={{ uri: 'https://t3.ftcdn.net/jpg/02/01/15/74/360_F_201157456_QwzTmohTtySWRhZxo6hDWevgn4h6tlCA.jpg' }} // <-- cambia con la tua immagine
              style={styles.poster}
              resizeMode="cover"
            />
            <CustomText style={styles.playText}>▶</CustomText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 250,
  },
  posterOverlay: {
    position: 'absolute',
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  poster: {
    position: 'absolute',
    width: '100%',
    height: 250,
    opacity: 0.7,
  },
  playText: {
    fontSize: 50,
    color: 'white',
    zIndex: 2,
  },
});

export default VideoMatchLive;
