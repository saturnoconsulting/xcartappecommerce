import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useWindowDimensions, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const ScreenWrapper = ({ children, style}) => {
    const { height, width } = useWindowDimensions();
    const tabBarHeight = useBottomTabBarHeight();

    return (
        <SafeAreaView
            style={[styles.container, style, { paddingBottom: tabBarHeight}]}
            edges={['left', 'right', 'top'] }>
            {children}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
