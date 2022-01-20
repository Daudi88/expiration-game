import { StyleSheet, View } from "react-native";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";

const ModalHeader = props => {
  return (
    <View style={styles.header}>
      <CustomButton
        style={styles.cancelButton}
        iconName="close-circle-outline"
        size={35}
        onPress={props.onCancel}
      />
      <CustomText bold style={styles.title}>
        {props.title}
      </CustomText>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  cancelButton: {
    position: "absolute",
    left: 15,
  },
  title: {
    fontSize: 18,
    color: "black",
  },
});
