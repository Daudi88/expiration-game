import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

const CustomButton = props => {
  if (props.iconName) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.iconButton, props.style]}
        onPress={props.onPress}
      >
        <MaterialCommunityIcons
          name={props.iconName}
          size={props.size}
          color={props.color ? props.color : Colors.primary}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        props.inverted ? styles.invertedTextButton : styles.textButton,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <CustomText
        bold
        style={props.inverted ? styles.invertedTitle : styles.title}
      >
        {props.title}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 5,
  },
  textButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    width: "90%",
    borderRadius: 10,
    margin: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
  invertedTextButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    width: "90%",
    borderRadius: 10,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  invertedTitle: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.primary,
  },
});

export default CustomButton;
