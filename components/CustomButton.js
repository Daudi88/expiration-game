import { TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

const CustomButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: props.color ? props.color : Colors.primary },
      ]}
      onPress={props.onPress}
    >
      <CustomText bold style={styles.title}>
        {props.title}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "90%",
    paddingVertical: 12,
    borderRadius: 10,
    margin: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
});

export default CustomButton;
