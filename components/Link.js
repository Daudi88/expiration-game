import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

const Link = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.link} activeOpacity={0.5} onPress={onPress}>
      <CustomText bold style={styles.linkText}>
        {title}
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
