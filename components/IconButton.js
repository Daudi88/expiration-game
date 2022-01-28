import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const IconButton = ({ name, size, color, onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.iconButton, style]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color ? color : Colors.primary}
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
