import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { GET_USER } from '../store/selectors/userSelector';
import useFetchProfile from '../hooks/useFetchProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import CustomText from '../components/atoms/CustomText';
import { backgroundcolor, primaryColor } from '../constants/colors';

export default function UserDetailsRecap() {
  const customer = useSelector(GET_USER);
  const { customerDetails, refetch, loading } = useFetchProfile({ iduser: customer.iduser });
  const [refreshing, setRefreshing] = useState(false);
const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (loading) return <Loading />;

  const data = customerDetails || {};

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.item}>
          <CustomText style={styles.label}>Nome</CustomText>
          <CustomText style={styles.value}>{data.name || '-'} {data.surname || '-'}</CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={styles.label}>Email</CustomText>
          <CustomText style={styles.value}>{data.email || '-'}</CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={styles.label}>Codice fiscale</CustomText>
          <CustomText style={styles.value}>{data.codfis || '-'}</CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={styles.label}>Indirizzo</CustomText>
          <CustomText style={styles.value}>{data.address || '-'}, {data.numciv || '-'}, {data.cap || '-'}</CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={styles.label}>Città</CustomText>
          <CustomText style={styles.value}>{data.city || '-'}, {data.prov || '-'} {data.country || '-'}</CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={styles.label}>Telefono</CustomText>
          <CustomText style={styles.value}>{data.phone || '-'}</CustomText>
        </View>
         <TouchableOpacity
          style={styles.buttonEdit}
          onPress={() => navigation.navigate("UserDetails")}
        >
          <CustomText style={styles.buttonText}>Modifica</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonEdit:{
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText:{
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: backgroundcolor,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  item: {
    marginBottom: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
});
