import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

const Input = props => {
  return (
    <View style={styles.inputRow}>
      {props.onInputPress ? (
        <TouchableOpacity
          style={styles.input}
          activeOpacity={0.5}
          onPress={props.onInputPress}
        >
          <CustomText
            style={{
              color: props.value.length > 0 ? "black" : "#aaa",
              fontSize: 18,
            }}
          >
            {props.value.length > 0 ? props.value : props.placeholder}
          </CustomText>
        </TouchableOpacity>
      ) : (
        <TextInput
          {...props}
          style={styles.input}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor="#aaa"
          onChangeText={props.onChangeText}
        />
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    margin: 5,
    fontSize: 18,
  },
});
