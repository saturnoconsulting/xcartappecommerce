import React, { useState, useEffect, useCallback } from "react";
import { Switch, Image, TouchableOpacity, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { login } from "../api/user";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { setUser } from "../store/actions/userActions";
import { primaryColor } from "../constants/colors";
import { showMessage } from "react-native-flash-message";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { InputField } from "../components/atoms/InputField";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import CustomText from "../components/atoms/CustomText";
import { logo } from "../constants/images";


const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const { navigate } = useNavigation();

  useEffect(() => {
    const init = async () => {
      setErrorMessage("");

      const savedBiometricPref = await SecureStore.getItemAsync("biometric_enabled");
      const savedEmail = await SecureStore.getItemAsync("user_email");
      const savedPassword = await SecureStore.getItemAsync("user_password");

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
      }

      if (savedBiometricPref === "true") {
        setBiometricEnabled(true);
        await handleBiometricLogin();
      }
    };
    init();
  }, []);


  useFocusEffect(
    useCallback(() => {
      setErrorMessage("");
    }, [])
  );

  const handleBiometricLogin = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync("user_email");
      const savedPassword = await SecureStore.getItemAsync("user_password");

      if (savedEmail && savedPassword) {
        const hasBiometrics = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasBiometrics && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Autenticati con Face ID",
            fallbackLabel: "Inserisci manualmente",
          });

          if (result.success) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            handleLogin(savedEmail, savedPassword, true); // Esegue il login automatico
          } else {
            setErrorMessage("Autenticazione biometrica fallita." + "\n" + "Inserisci manualmente le credenziali.");
          }

        }
      }
    } catch (error) {
      console.error("Errore durante l'autenticazione biometrica:", error);
    }
  };


  const handleLogin = async (emailParam, passwordParam, isAuto = false) => {
    setLoading(true);
    setErrorMessage("");

    const emailToUse = emailParam || email;
    const passwordToUse = passwordParam || password;

    if (emailToUse === "" || passwordToUse === "") {
      setErrorMessage("Email e password sono obbligatori");
      setLoading(false);
      return;
    }

    try {
      const body = {
        email: emailToUse,
        password: passwordToUse,
      };

      const response = await login(body);
      //console.log("response", response);

      if (response?.token) {
        // SALVI SOLO QUI
        /*await AsyncStorage.setItem('user_token', response.token);
        await AsyncStorage.setItem('refresh_token', response.refreshtoken);*/
        await SecureStore.setItemAsync('user_token', response.token);
        await SecureStore.setItemAsync('refresh_token', response.refreshtoken);
        let cartID =  await AsyncStorage.getItem("cartId");
        console.log("cartID login", cartID)
        if (response.idcart != null) {
          await AsyncStorage.setItem("cartId", response.idcart);
        }
        dispatch(setUser(response.user));
        if (!isAuto) {
          await SecureStore.setItemAsync("user_email", emailToUse);
          await SecureStore.setItemAsync("user_password", passwordToUse);
        }
        navigation.replace("MainDrawer");
      } else {
        setErrorMessage("Token non ricevuto");
      }

    } catch (error) {
      setErrorMessage("Errore di accesso! Controlla le tue credenziali.");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ImageBackground style={styles.bgImg}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Image
              source={logo}
              style={{ width: 350, height: 150, marginBottom: 10, alignContent: "center", alignSelf: "center" }}
              resizeMode="contain"
            />
            <View style={styles.innerContainer}>
              {/*<Text style={styles.title}>Login</Text>*/}
              {errorMessage ? <CustomText style={styles.error}>{errorMessage}</CustomText> : null}
              <InputField
                placeholderTextColor="grey"
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              <View style={styles.containerPass}>
                <TextInput
                  placeholderTextColor="grey"
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="black" />
                </TouchableOpacity>
              </View>
              <Button mode="contained" onPress={() => handleLogin()} style={styles.button} disabled={loading}>
                Accedi
              </Button>
              <TouchableOpacity onPress={() => navigation.navigate("Recover")}>
                <Text style={styles.text}>Non ricordi la password? Recuperala</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.textRegister}>Non hai l'account? Registrati</Text>
              </TouchableOpacity>
              <View style={styles.switchContainer}>
                <Text style={{ color: "white", fontSize:12, marginRight:10}}>Face ID o impronta per un accesso rapido</Text>
                <Switch
                  value={biometricEnabled}
                  onValueChange={async (value) => {
                    setBiometricEnabled(value);
                    await SecureStore.setItemAsync("biometric_enabled", value.toString());
                    if (value) {
                      showMessage({
                        message: "Face ID abilitato",
                        type: "success",
                      });
                    } else {
                      showMessage({
                        message: "Face ID disabilitato",
                        type: "info",
                      });
                    }
                  }}
                  disabled={loading}
                />
              </View>
              {biometricEnabled && (
                <Button mode="contained" onPress={handleBiometricLogin} style={styles.button} disabled={loading}>
                  Accedi con Face ID
                </Button>
              )}


            </View>
            {loading && <Loading />}
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 10,
  },

  textRegister: {
    marginTop: 20,
    marginBottom: 20,
    color: primaryColor,
  },
  text: {
    marginTop: 20,
    color: primaryColor,
  },
  containerPass: {
    position: 'relative',
    width: '100%',
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  toggleText: {
    color: 'blue',
  },
  bgImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 34,
   // marginBottom: 30,
    fontWeight: "bold",
    color: "#fff",
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
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Login;
