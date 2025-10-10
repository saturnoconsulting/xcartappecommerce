import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import CheckoutWeb from "./CheckoutWeb";
import { primaryColor } from "../constants/colors";
import { GET_USER } from "../store/selectors/userSelector";
import CustomText from "./atoms/CustomText";

export const ModalComponent = ({
  couponType,
  couponCode,
  paymentMethod,
  modal,
  onClose,
  cartdata,
  total,
  couponAmount,
  refetchCart,
  resetCart
}) => {
  const customer = useSelector(GET_USER);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(modal);
  }, [modal]);

  const handleClose = () => {
    setModalVisible(false);
    if (onClose) onClose(); // Chiusura normale, non post-checkout
  };

  const renderFormContent = () => (
    <CheckoutWeb
      resetCart={resetCart}
      couponAmount={couponAmount}
      total={total}
      onClose={onClose} // onClose(true) viene chiamato da CheckoutWeb in caso di successo
      couponCode={couponCode}
      customer={customer}
      cartdata={cartdata}
      refetchCart={refetchCart}
      couponType={couponType}
    />
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <CustomText style={styles.modalTitle}>Checkout</CustomText>
          {renderFormContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    paddingTop: 10,
    width: "95%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ModalComponent;
