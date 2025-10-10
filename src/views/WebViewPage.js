import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/layouts/ScreenWrapper';

const WebViewPage = () => {
  const route = useRoute();
  const slug = route.params?.slug;
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef(null);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [showWebView, setShowWebView] = useState(true);

  useFocusEffect(() => {
    // Monta WebView quando è attiva
    setShowWebView(true);
    return () => {
      // Smonta WebView appena si naviga via
      setShowWebView(false);
    };
  });

  const handleReload = () => {
    setManualRefreshing(true);
    if (webviewRef.current) {
      webviewRef.current.reload();
      setManualRefreshing(false);
    }
  };

  return (
    <ScreenWrapper>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
      {showWebView && (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={manualRefreshing} onRefresh={handleReload} />
          } >
          <WebView
            ref={webviewRef}
            source={{ uri: `https://app.rugbylaquila.com/cms/pages/${slug}` }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            incognito={true}
            originWhitelist={['*']}
          />
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding:0,
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  reloadButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default WebViewPage;
