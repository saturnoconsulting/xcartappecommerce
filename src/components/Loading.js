import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = () => {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
    overlay: {
        position: "absolute", // Overlay sopra tutto
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
});
