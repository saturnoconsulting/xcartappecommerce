import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import CustomText from "./CustomText";



export const InputField = ({maxLength, label, ...props }) => {
  const screenWidth = Dimensions.get("window").width;
  const inputWidth = Math.min(screenWidth - 40, 320);

  return (
    <View style={styles.inputContainer}>
      {label &&
        (<CustomText style={styles.label}>{label}</CustomText>)
      }
      <TextInput
        style={[styles.inputStyle, { width: inputWidth }]}
        placeholderTextColor="grey"
        {...props}
        maxLength={maxLength || 100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "left",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 9
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
  }
})