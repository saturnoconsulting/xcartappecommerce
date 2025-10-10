import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CustomText from './atoms/CustomText';

const QRCodeModal = ({ visible, onClose, subscription }) => {
  const qrCodeValue = subscription?.qr_code ?? "";


  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#333" />
          </TouchableOpacity>
          <CustomText style={styles.title}>Accesso allo stadio </CustomText>
          <Image
            source={{ uri: qrCodeValue }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", width: "80%", padding: 20, borderRadius: 10, alignItems: "center", position: "relative" },
  closeButton: { position: "absolute", top: 10, right: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
});

export default QRCodeModal;
