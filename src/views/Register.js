import React, { useCallback, useEffect, useState } from "react";
import { 
  Keyboard, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View, 
  ImageBackground 
} from "react-native";
import Button from "../components/atoms/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { backgroundcolor, primaryColor } from "../constants/colors";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";
import { signup } from "../api/user";
import CustomText from '../components/atoms/CustomText';

export default function Register({ navigation }) {
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName(null);
      setSurname(null);
      setEmail(null);
      setPassword(null);
      setNewPassword(null);
      setErrorMessage("");
    }, [])
  );

  const handleCreate = async () => {
    if(name === null || surname === null || email === null || password === null || newPassword === null){
      setErrorMessage("Devono essere compilati tutti i campi");
      return;
    }
    if (!password || password.length < 5 || !newPassword || newPassword.length < 5) {
      setErrorMessage("La password deve contenere almeno 5 caratteri");
      return;
    } else if (password !== newPassword) {
      setErrorMessage("Le password devono essere uguali");
      return;
    } else if (email.length === 0 || surname.length === 0 || name.length === 0) {
      setErrorMessage("Devono essere compilati tutti i campi");
      return;
    }

    try {
      setLoading(true);
      const data = { name, surname, email, password };
      const newuser = await signup(data);
     // console.log("data", newuser);
      showMessage({
        message: "",
        description: "Cliente registrato con successo!",
        type: "success",
      });
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage(error?.message || "Errore durante l'aggiornamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <ImageBackground style={styles.bgImg}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <CustomText style={styles.title}>Registrati</CustomText>
            {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
            <TextInput
              placeholderTextColor="grey"
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholderTextColor="grey"
              style={styles.input}
              placeholder="Cognome"
              value={surname}
              onChangeText={setSurname}
            />
            <TextInput
              placeholderTextColor="grey"
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholderTextColor="grey"
                style={[styles.inputPassword, { flex: 1 }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowPassword(prev => !prev)}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                placeholderTextColor="grey"
                style={[styles.inputPassword, { flex: 1 }]}
                placeholder="Conferma password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowConfirmPassword(prev => !prev)}
              >
                <Icon
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleCreate}
              title="Salva"
              style={styles.buttonSave}
              disabled={loading}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <CustomText style={styles.text}>Torna alla login</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  text:{
    textAlign: "center",
    marginTop: 20,
    color: primaryColor,
  },
  bgImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  container: {
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",  // leggero sfondo bianco trasparente
    borderRadius: 10,
    padding: 20,
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 50,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 12,
    backgroundColor: "white",
  },
  inputPassword: {
    backgroundColor: "white",
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    borderTopEndRadius: 0,
    borderBottomEndRadius: 0
  },
  buttonSave: {
    width: '100%',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});
