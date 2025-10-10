import React, { useState, useEffect, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import useFetchGames from '../hooks/useFetchGames';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/atoms/CustomText';

// URL fittizi
const POSTER_URI = 'https://t3.ftcdn.net/jpg/02/01/15/74/360_F_201157456_QwzTmohTtySWRhZxo6hDWevgn4h6tlCA.jpg';

export default function VideoMatchLive({ route }) {
  const { games } = useFetchGames();

  const liveGame = useMemo(() => {
    return games?.filter(
      (game) =>
        game.status === 'live' || game.status === 'waiting'
    );
  }, [games]);


  return (
    <View style={styles.container}>
      <VideoPlayerSection liveGame={liveGame[0]} />
      <BottomInfoSection liveGame={liveGame[0]} />
    </View>
  );
}

// LIVE
function VideoPlayerSection({ liveGame }) {
  const [coverVisible, setCoverVisible] = useState(true);

  const player = useVideoPlayer(liveGame?.sourcelive ?? null);

  const handlePlay = () => {
    player.play();
    setCoverVisible(false);
  };

  if (!liveGame) {
    return null; 
  }

  return (
    <View style={styles.videoContainer}>
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
    </View>
  );
}


// PUNTEGGIO
function BottomInfoSection({ liveGame }) {
  const [data, setData] = useState("Caricamento dati...");
  const [scores, setScores] = useState({ result_team1: '-', result_team2: '-' });
  const { games, refreshGames } = useFetchGames();  // <-- importante: avere accesso a refreshGames
  const [status, setStatus] = useState(liveGame?.status ?? 'waiting');

  const fetchData = async () => {
    const now = new Date().toLocaleTimeString();
    setData(`Ultimo aggiornamento: ${now}`);

    await refreshGames();

    if (games && liveGame) {
      const updatedGame = games.find(game => game.externalid === liveGame.id);
      if (updatedGame) {
        setScores({
          result_team1: updatedGame.result_team1,
          result_team2: updatedGame.result_team2,
        });
        setStatus(updatedGame.status);  // <-- aggiorniamo lo stato
      }
    }
  };


  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // ogni 10 sec
    return () => clearInterval(interval);
  }, [games, liveGame]);

  if (!liveGame || !liveGame.externalid) {
    return (
      <View style={styles.bottomContainer}>
        <CustomText style={styles.bottomText}>Nessuna partita live in onda al momento</CustomText>
      </View>
    );
  }

  if (status === 'waiting') {
    return (
      <>
        <ScrollView style={styles.containerScroll}>
          <View style={styles.bottomContainer}>

            <CustomText style={styles.bottomText}>La partita sta per iniziare</CustomText>

            <View style={styles.infoBox}>

              {/* BLOCCO PARTITA */}
              <View style={styles.matchContainer}>
                <View style={styles.teamBlock}>
                  <Image source={{ uri: liveGame.imagepath1 }} style={styles.logo} />
                  <CustomText style={styles.teamText}>{liveGame.team1}</CustomText>

                </View>
                <CustomText style={styles.vsText}>VS</CustomText>
                <View style={styles.teamBlock}>
                  <Image source={{ uri: liveGame.imagepath2 }} style={styles.logo} />
                  <CustomText style={styles.teamText}>{liveGame.team2}</CustomText>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </>

    );
  }


  return (
    <ScrollView style={styles.containerScroll}>
      <View style={styles.bottomContainer}>
        <View style={styles.infoBox}>
          <CustomText style={styles.champText}>{liveGame.championship || '-'}</CustomText>
          <CustomText style={styles.placeText}>{liveGame.place || '-'}</CustomText>

          {/* BLOCCO PARTITA */}
          <View style={styles.matchContainer}>
            <View style={styles.teamBlock}>
              <Image source={{ uri: liveGame.imagepath1 }} style={styles.logo} />
              <CustomText style={styles.teamText}>{liveGame.team1 || '-'}</CustomText>
              <CustomText style={styles.resultTeamText}>{scores.result_team1 || '-'}</CustomText>
            </View>
            <CustomText style={styles.vsText}>VS</CustomText>
            <View style={styles.teamBlock}>
              <Image source={{ uri: liveGame.imagepath2 }} style={styles.logo} />
              <CustomText style={styles.teamText}>{liveGame.team2 || '-'}</CustomText>
              <CustomText style={styles.resultTeamText}>{scores.result_team2 || '-'}</CustomText>
            </View>
          </View>

          {/* INFO EXTRA */}
          <CustomText style={styles.infoTitle}>INFO</CustomText>
          <CustomText style={styles.extraInfoText}>Stagione: {liveGame.season || '-'}</CustomText>
          <CustomText style={styles.extraInfoText}>Giornata: {liveGame.round || '-'}</CustomText>
          <CustomText style={styles.extraInfoText}>Arbitro: {liveGame.referee || '-'}</CustomText>
        </View>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerScroll: {
    flex: 1,
    backgroundColor: '#000',
    marginBottom: 100,
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
  },
  bottomText: {
    marginTop: 20,
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

