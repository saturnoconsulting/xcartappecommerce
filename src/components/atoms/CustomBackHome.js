import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { primaryColor } from "../../constants/colors";

const CustomBackButton = ({ color }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleBack = () => {
        const sourceScreen = route.params?.sourceScreen;

        if (sourceScreen) {
            navigation.navigate(sourceScreen);
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate("Dashboard");
        }
    };

    return (
        <TouchableOpacity onPress={handleBack} style={{ paddingBottom: 0, paddingLeft: 10 }}>
            <Icon name="arrow-back" size={28} color={color || primaryColor} />
        </TouchableOpacity>
    );
};

export default CustomBackButton;
