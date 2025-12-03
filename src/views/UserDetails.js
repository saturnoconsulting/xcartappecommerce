import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { backgroundcolor, primaryColor } from '../constants/colors';
import { countries } from '../constants/countries';
import { Dropdown } from 'react-native-element-dropdown';
import Button from '../components/atoms/Button';
import { useSelector } from 'react-redux';
import { GET_USER } from '../store/selectors/userSelector';
import useFetchProfile from '../hooks/useFetchProfile';
import { useFocusEffect } from '@react-navigation/native';
import { deleteaccount, updateCustomer } from '../api/user';
import Loading from '../components/Loading';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../components/atoms/CustomText';

export default function UserDetails({ route }) {
  const customer = useSelector(GET_USER);
  const navigation = useNavigation();
  const {
    customerDetails,
    refetch,
    loading: loadingProfile,
  } = useFetchProfile({ iduser: customer.iduser });

  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fieldLabels = {
    name: 'Nome',
    surname: 'Cognome',
    email: 'Email',
    codfis: 'Codice fiscale',
    address: 'Indirizzo',
    numciv: 'Numero civico',
    cap: 'CAP',
    city: 'Città',
    prov: 'Provincia',
    phone: 'Telefono',
    country: 'Paese',
  };

  const [dataCustomer, setDataCustomer] = useState({
    name: '',
    surname: '',
    email: '',
    codfis: '',
    address: '',
    country: '',
    numciv: '',
    cap: '',
    city: '',
    prov: '',
    phone: '',
  });


  useEffect(() => {
    if (customerDetails) {
      setDataCustomer((prev) => ({
        ...prev,
        iduser: customer.iduser,
        name: customerDetails.name || '',
        surname: customerDetails.surname || '',
        email: customerDetails.email ?? prev.email,
        codfis: customerDetails.codfis ?? prev.codfis,
        address: customerDetails.address || '',
        numciv: customerDetails.numciv || '',
        cap: customerDetails.cap || '',
        city: customerDetails.city || '',
        prov: customerDetails.prov || '',
        phone: customerDetails.phone || '',
        country: customerDetails.country || '',
      }));
    }
  }, [customerDetails, customer.iduser]);


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await deleteaccount();
              showMessage({
                message: 'Account eliminato con successo',
                type: 'success',
              });
            } catch (error) {
              showMessage({
                message: 'Errore durante l’eliminazione dell’account',
                type: 'danger',
              });
            } finally {
              setSaving(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }

        },
      ]
    );
  };


  const validateForm = () => {
    const requiredFields = [
      'email',
      'name',
      'surname',
      'address',
      'numciv',
      'cap',
      'city',
      'prov',
      'country',
      'phone',
    ];

    const errors = [];

    for (let field of requiredFields) {
      if (!dataCustomer[field] || dataCustomer[field].trim() === '') {
        errors.push(`Il campo ${fieldLabels[field]} non può essere vuoto`);
      }
    }

    if (errors.length > 0) {
      showMessage({
        message: 'Attenzione! Alcuni campi sono vuoti.',
        type: 'danger',
      });
      return errors;
    }

    return null;
  };



  const handleUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    try {
      setSaving(true);
      setErrorMessage(null);
      await updateCustomer(dataCustomer);
      showMessage({
        message: 'Profilo aggiornato con successo',
        type: 'success',
      });
      await refetch();
    } catch (err) {
      showMessage({
        message: 'Errore durante l’aggiornamento del profilo',
        type: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [route.params?.item])
  );

  const isBusy = loadingProfile || saving;

  return (
    <>
      {isBusy && <Loading />}
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 150}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {Array.isArray(errorMessage) ? (
              errorMessage.map((msg, idx) => (
                <CustomText key={idx} style={styles.error}>
                  {msg}
                </CustomText>
              ))
            ) : errorMessage ? (
              <CustomText style={styles.error}>{errorMessage}</CustomText>
            ) : null}


            {Object.entries(dataCustomer).map(([key, value]) => {
              if (key === 'iduser') return null;
              if (key === 'prov') {
                return (
                  <View key={key} style={styles.inputWrapper}>
                    <CustomText style={styles.label}>{fieldLabels[key] || key}</CustomText>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={(text) => {
                        const formatted = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
                        setDataCustomer((prev) => ({ ...prev, prov: formatted }));
                      }}
                      maxLength={2}
                      editable={!isBusy}
                    />
                  </View>
                );
              }

              if (key === 'country') {
                return (
                  <View key={key}>
                    <CustomText style={styles.label}>Paese</CustomText>
                    <Dropdown
                      style={styles.dropdown}
                      placeholder="Seleziona un paese"
                      data={countries.map((c) => ({ label: c, value: c }))}
                      labelField="label"
                      valueField="value"
                      value={dataCustomer.country}
                      onChange={(item) =>
                        setDataCustomer((prev) => ({
                          ...prev,
                          country: item.value,
                        }))
                      }
                      disable={isBusy}
                    />
                  </View>
                );
              }
              return (
                <View key={key} style={styles.inputWrapper}>
                  <CustomText style={styles.label}>
                    {fieldLabels[key] || key}
                  </CustomText>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) =>
                      setDataCustomer((prev) => ({ ...prev, [key]: text }))
                    }
                    editable={!isBusy}
                  />
                </View>
              );
            })}

            <Button
              title="Salva"
              onPress={handleUpdate}
              disabled={isBusy}
              style={styles.button}
            />
            <TouchableOpacity
              onPress={handleDeleteAccount}
              disabled={isBusy}
              style={[styles.button, styles.deleteButton]}
            >
              <Text style={styles.deleteButtonText}>Elimina account</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginTop: 20,
    color: "red",
    backgroundColor: backgroundcolor,
  },
  deleteButtonText: {
    color: "red",
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: backgroundcolor,
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: primaryColor,
  },
  error: {
    color: 'red',
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
