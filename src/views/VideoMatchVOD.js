import React, { useState, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/atoms/CustomText';

// URL fittizio
const POSTER_URI = 'https://t3.ftcdn.net/jpg/02/01/15/74/360_F_201157456_QwzTmohTtySWRhZxo6hDWevgn4h6tlCA.jpg';

export default function VideoMatchVOD({ route }) {
  const { game } = route.params;
  const { subActive } = route.params;

  return (
    <View style={styles.container}>
      <VideoPlayerSection game={game} subActive={subActive} />
      <BottomInfoSection game={game} />
    </View>
  );
}

function VideoPlayerSection({ game, subActive }) {
  const [coverVisible, setCoverVisible] = useState(true);
  const player = useVideoPlayer(game?.sourcevod ?? null);

  const handlePlay = () => {
    player.play();
    setCoverVisible(false);
  };

  return (
    <View style={styles.videoContainer}>
      {subActive ? (
        <>
        <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      {coverVisible && (
        <TouchableOpacity style={styles.posterOverlay} onPress={handlePlay}>
          <Image source={{ uri: POSTER_URI }} style={styles.poster} resizeMode="cover" />
          <CustomText style={styles.playText}>▶</CustomText>
        </TouchableOpacity>
      )}
      </>) : (<CustomText style={styles.textPlaceholder}>Se vuoi vedere la partita acquista un abbonamento nel nostro shop </CustomText>) }
  
    </View>
  );
}
function BottomInfoSection({ game }) {
  if (!game) {
    return (
      <View style={styles.bottomContainer}>
        <CustomText style={styles.bottomText}>Nessuna partita live disponibile</CustomText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.bottomContainer}>
        <View style={styles.infoBox}>
          <CustomText style={styles.champText}>{game.championship || '-' }</CustomText>
          <CustomText style={styles.placeText}>{game.place || '-' }</CustomText>

          {/* BLOCCO PARTITA */}
          <View style={styles.matchContainer}>
            <View style={styles.teamBlock}>
              <Image source={{ uri: game.imagepath1 }} style={styles.logo} />
              <CustomText style={styles.teamText}>{game.team1 || '-' }</CustomText>
              <CustomText style={styles.resultTeamText}>{game.result_team1 || '-' }</CustomText>
            </View>
            <CustomText style={styles.vsText}>VS</CustomText>
            <View style={styles.teamBlock}>
              <Image source={{ uri: game.imagepath2 }} style={styles.logo} />
              <CustomText style={styles.teamText}>{game.team2 || '-' }</CustomText>
              <CustomText style={styles.resultTeamText}>{game.result_team2 || '-' }</CustomText>
            </View>
          </View>

          {/* INFO EXTRA */}
          <CustomText style={styles.infoTitle}>Dettaglio</CustomText>
          <CustomText style={styles.extraInfoText}>Stagione: {game.season || '-' }</CustomText>
          <CustomText style={styles.extraInfoText}>Giornata: {game.round || '-' }</CustomText>
          <CustomText style={styles.extraInfoText}>Arbitro: {game.referee || '-' }</CustomText>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  textPlaceholder:{
   fontSize: 20,
    color: 'white',
    zIndex: 2,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerScroll: {
    flex: 1,
    backgroundColor: '#000',
    marginBottom: 80,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  playText: {
    fontSize: 50,
    color: 'white',
    zIndex: 2,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90,
  },
  bottomText: {
    color: '#fff',
    fontSize: 18,
  },
  infoBox: {
    flex: 1,
    width: '100%',
  },
  champText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007B3A',
    marginBottom: 5,
    marginTop: 10,
  },
  placeText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  teamBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  teamText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTeamText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    width: 60,  // larghezza fissa per allineamento
    textAlign: 'center',
  },
  vsText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  extraInfoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});

