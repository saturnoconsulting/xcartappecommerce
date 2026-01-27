import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import CheckoutWeb from "./CheckoutWeb";
import { GET_USER } from "../store/selectors/userSelector";
import ReturnsModal from "./ReturnsModal";

export const ModalComponent = ({
  couponType,
  couponCode,
  modal,
  onClose,
  cartdata,
  total,
  couponAmount,
  refetchCart,
  resetCart,
  fromOrderDetails,
  orderDetails
}) => {
  const customer = useSelector(GET_USER);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(modal);
  }, [modal]);

  const handleClose = () => {
    setModalVisible(false);
    if (onClose) onClose();
  };

const renderFormContent = () => (
  fromOrderDetails ? (
    <ReturnsModal
     onClose={onClose}  
     orderDetails={orderDetails}
     />
  ) : (
    <CheckoutWeb
      resetCart={resetCart}
      couponAmount={couponAmount}
      total={total}
      onClose={onClose}  
      couponCode={couponCode}
      customer={customer}
      cartdata={cartdata}
      refetchCart={refetchCart}
      couponType={couponType}
    />
  )
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
    margin: 10,
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
