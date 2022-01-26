import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const IconButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.iconButton, props.style]}
      onPress={props.onPress}
    >
      <MaterialCommunityIcons
        name={props.iconName}
        size={props.size}
        color={props.color}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  iconButton: {
    padding: 5,
  },
});
