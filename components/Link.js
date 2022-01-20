import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

const Link = props => {
  return (
    <TouchableOpacity
      style={styles.link}
      activeOpacity={0.5}
      onPress={props.onPress}
    >
      <CustomText bold style={styles.linkText}>
        {props.title}
      </CustomText>
    </TouchableOpacity>
  );
};

export default Link;

const styles = StyleSheet.create({
  link: {
    padding: 10,
    marginHorizontal: "5%",
  },
  linkText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: "left",
  },
});
