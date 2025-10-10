import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { primaryColor } from '../../constants/colors';
import CustomText from "./CustomText";
const Button = ({ title, onPress, style, textStyle, disabled }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.button,
                disabled ? styles.disabledButton : {},
                style
            ]}
            onPress={onPress}
        >
            <CustomText style={[styles.text, disabled ? styles.disabledText : {}, textStyle]}>
                {title}
            </CustomText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        backgroundColor: primaryColor,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc', // o un colore neutro tipo grey
    },
    disabledText: {
        color: '#888', // colore del testo disabilitato
    },
});

export default Button;
