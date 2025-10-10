import React, { useState } from "react";
import { ImageBackground, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import * as api from "../api/user";
import { primaryColor } from "../constants/colors";
import CustomText from '../components/atoms/CustomText';

const ForgotPassword = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    try {
      await api.recover({ email });
      showMessage({
        message: "Ottimo",
        description: "È stata inviata una mail per resettare la password alla mail inserita!",
        type: "success",
      });
      navigate("Login");
    } catch (e) {
      showMessage({
        message: "Attenzione",
        description: "La mail inserita non è stata trovata!",
        type: "warning",
      });
    }
  };

  return (
    <ImageBackground style={styles.bgImg}>
      <View style={styles.container}>
        <CustomText style={{color:"white", textAlign:"center", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Recupera la password</CustomText>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Button mode="contained" onPress={() => submit()} style={styles.button} disabled={loading}>
          Invia
        </Button>
        <TouchableOpacity onPress={() => navigate("Login")} style={styles.bottomLink}>
          <CustomText  style={styles.text}>Torna alla login</CustomText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  text:{
    color: primaryColor,
  },
  bgImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 5,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: primaryColor,
    borderWidth: 0.3,
    marginBottom: 10,
    marginTop: 10
  },
  bottomLink: {
    marginTop: 40,
    alignItems: "center",
  },
});
