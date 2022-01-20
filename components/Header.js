import { StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

const Header = props => {
  return <Text style={styles.header}>{props.title}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "nunito-sans-black",
    fontSize: 40,
    paddingHorizontal: 35,
    paddingTop: 40,
    paddingBottom: 20,
    color: Colors.primary,
  },
});

export default Header;
