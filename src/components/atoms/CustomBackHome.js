import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { primaryColor } from "../../constants/colors";

const CustomBackButton = ({ color, targetScreen, previousScreen }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleBack = () => {
        // Priorità 1: Se è specificato un targetScreen, naviga direttamente lì
        if (targetScreen) {
            navigation.navigate(targetScreen);
            return;
        }

        // Priorità 2: Se è specificato un previousScreen, naviga lì
        if (previousScreen) {
            navigation.navigate(previousScreen);
            return;
        }

        // Priorità 3: Controlla se c'è un sourceScreen nei route params
        const sourceScreen = route.params?.sourceScreen;
        if (sourceScreen) {
            navigation.navigate(sourceScreen);
            return;
        }

        // Priorità 4: Usa goBack() se possibile
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }

        // Fallback: naviga a Dashboard
        navigation.navigate("Dashboard");
    };

    return (
        <TouchableOpacity onPress={handleBack} style={{ paddingBottom: 0, paddingLeft: 10 }}>
            <Icon name="arrow-back" size={28} color={color || primaryColor} />
        </TouchableOpacity>
    );
};

export default CustomBackButton;
