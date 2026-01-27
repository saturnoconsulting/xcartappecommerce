import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, text, style, ...props }) => {
  return (
    <Text {...props} style={[styles.text, style]}>
      {text || children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto_400Regular', 
  },
});

export default CustomText;
