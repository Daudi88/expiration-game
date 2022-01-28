import { StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import CustomText from "./CustomText";

const ModalHeader = ({ title, onCancel }) => {
  return (
    <View style={styles.header}>
      <IconButton
        style={styles.cancelButton}
        name="close-circle-outline"
        size={35}
        onPress={onCancel}
      />
      <CustomText bold style={styles.title}>
        {title}
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
