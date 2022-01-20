import { useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import * as productsActions from "../store/actions/productsActions";
import ModalHeader from "../components/ModalHeader";
import EanScanner from "../components/EanScanner";
import Input from "../components/Input";
import DatePicker from "../components/DatePicker";
import CustomButton from "../components/CustomButton";
import Error from "../components/Error";
import Link from "../components/Link";

const AddScreen = props => {
  const [product, setProduct] = useState({
    ean: "",
    title: "",
    imageUrl: "",
    price: 10,
    expirationDate: "",
  });

  const [isScanned, setIsScanned] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState(null);
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();

  const submitHandler = () => {
    if (product.title.trim().length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Du måste ange ett namn.\nTesta att använda streckkodsläsaren");
      return;
    }

    if (product.expirationDate === "") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Du måste välja ett bäst före-datum!");
      return;
    }

    try {
      dispatch(
        productsActions.addProductToUser(
          userId,
          product.ean,
          product.title,
          product.imageUrl,
          product.price,
          product.expirationDate
        )
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      props.setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const productChangeHandler = (name, value) => {
    setProduct(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <ScrollView style={styles.screen}>
      <KeyboardAvoidingView behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <ModalHeader
              title="Ny vara"
              onCancel={() => {
                Haptics.selectionAsync();
                props.setShowModal(false);
              }}
            />
            <View style={styles.centered}>
              <EanScanner
                isScanned={isScanned}
                setIsScanned={setIsScanned}
                setProduct={setProduct}
                setError={setError}
              />
              {isScanned && (
                <Link
                  title="Skanna igen"
                  onPress={() => {
                    setIsScanned(false);
                    setError(null);
                  }}
                />
              )}
              {error && <Error message={error} />}
              <Input
                value={product.title}
                placeholder="Namn"
                autoCapitalize="words"
                onChangeText={text => {
                  productChangeHandler("title", text);
                  productChangeHandler("ean", "");
                  productChangeHandler("imageUrl", "");
                  productChangeHandler("price", 10);
                  setError(null);
                }}
              />
              <Input
                value={product.expirationDate}
                placeholder="Bäst före"
                onInputPress={() => setShowDatePicker(true)}
              />
              <DatePicker
                show={showDatePicker}
                setShow={setShowDatePicker}
                onProductChange={productChangeHandler}
                setError={setError}
              />
            </View>
            <View style={styles.centered}>
              <CustomButton title="Spara" onPress={submitHandler} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
  },
});
