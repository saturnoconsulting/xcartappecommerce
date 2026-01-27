import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import CustomText from '../components/atoms/CustomText';
import { backgroundcolor } from '../constants/colors';

const VideoMatchLive = () => {
  const route = useRoute();
  const subActive = route.params?.subActive ?? false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <CustomText style={styles.title}>Ora in Diretta</CustomText>
        <CustomText style={styles.text}>
          {subActive 
            ? 'Qui puoi vedere le partite in diretta.' 
            : 'Per accedere alla live devi avere un abbonamento attivo!'}
        </CustomText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default VideoMatchLive;
