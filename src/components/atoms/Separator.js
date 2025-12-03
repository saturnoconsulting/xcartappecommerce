import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator = ({ children, style, ...props }) => {
  return (
    <View style={styles.separator} />
  );
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 15,
        marginTop: 20,
    },
});

export default Separator;
