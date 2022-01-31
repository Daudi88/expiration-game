import { useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import * as productsActions from "../store/actions/productsActions";
import ModalHeader from "../components/ModalHeader";
import EanScanner from "../components/EanScanner";
import DatePicker from "../components/DatePicker";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import Error from "../components/Error";
import Link from "../components/Link";
import { auth } from "../data/firebase-config";
import Colors from "../constants/Colors";

const AddScreen = ({ setShowModal }) => {
  const [product, setProduct] = useState({
    title: "",
    imageUrl: "",
    weight: 500,
    expirationDate: "",
  });

  const [isScanned, setIsScanned] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(state =>
    state.users.users.find(user => user.id === auth.currentUser.uid)
  );
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
          user.id,
          product.title,
          product.imageUrl,
          product.weight,
          product.expirationDate
        )
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowModal(false);
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
                setShowModal(false);
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
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize="words"
                  style={styles.input}
                  value={product.title}
                  placeholder="Namn"
                  placeholderTextColor="#aaa"
                  onChangeText={text => {
                    productChangeHandler("title", text);
                    productChangeHandler("imageUrl", "");
                    productChangeHandler("weight", 10);
                    setError(null);
                  }}
                />
                <TouchableOpacity
                  style={styles.input}
                  activeOpacity={0.5}
                  onPress={() => setShowDatePicker(true)}
                >
                  <CustomText
                    style={{
                      color:
                        product.expirationDate.length > 0 ? "black" : "#aaa",
                      fontSize: 18,
                    }}
                  >
                    {product.expirationDate.length > 0
                      ? product.expirationDate
                      : "Bäst före"}
                  </CustomText>
                </TouchableOpacity>
              </View>
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
  inputContainer: {
    alignItems: "center",
    width: "92%",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    margin: 5,
    fontSize: 18,
  },
});
