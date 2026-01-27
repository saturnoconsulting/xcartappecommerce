import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import CustomText from './atoms/CustomText';
import { primaryColor, xEventsWidgetLive } from '../utils/brandConstants';

const BoxMatches = ({subActive}) => {
  const navigation = useNavigation();
  const isXEventsWidgetLive = xEventsWidgetLive;

  const handleBoxLive = () => {
    if (subActive) {
      navigation.navigate('VideoMatchLive', {subActive: subActive});
    } else {
      showMessage({
        message: "Attenzione",
        description: "Per accedere alla live devi avere un abbonamento attivo!",
        type: "danger",
      });
    }
  };

  const handleBoxVOD = () => {
    //if (subActive) {
      navigation.navigate('MatchesVOD', {subActive: subActive});
    /*} else {
      showMessage({
        message: "Attenzione",
        description: "Per accedere alle partite devi avere un abbonamento attivo!",
        type: "danger",
      });
    }*/
  };

  return (
    <>
      <CustomText style={styles.title}>Guarda</CustomText>
      {isXEventsWidgetLive && (
        <View style={styles.containerBox}>
          <TouchableOpacity style={styles.box} onPress={handleBoxLive}>
            <CustomText style={styles.boxText}>Ora in diretta</CustomText>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.containerBox}>
        <TouchableOpacity style={styles.box} onPress={handleBoxVOD}>
          <CustomText style={styles.boxText}>Eventi</CustomText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
     marginBottom: 20
  },
  containerBox: {
    marginHorizontal: 20,
    marginVertical: 15,
  },
  box: {
    backgroundColor: primaryColor,
    borderRadius: 12,
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // per Android
  },
  boxText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default BoxMatches;
