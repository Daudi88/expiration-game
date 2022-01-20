import { StyleSheet } from "react-native";
import CustomText from "./CustomText";

const Error = props => {
  return (
    <CustomText bold style={styles.error}>
      {props.message}
    </CustomText>
  );
};

export default Error;

const styles = StyleSheet.create({
  error: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
    overflow: "hidden",
  },
});
