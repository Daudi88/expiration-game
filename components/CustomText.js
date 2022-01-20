import { StyleSheet, Text } from "react-native";

// inspiration from https://medium.com/nerd-for-tech/react-native-create-a-custom-text-component-with-custom-font-family-61c5fcdf9388
const CustomText = props => {
  let fontWeight = styles.regular;
  if (props.bold) {
    fontWeight = styles.bold;
  }

  return (
    <Text numberOfLines={props.numberOfLines} style={[fontWeight, props.style]}>
      {props.children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  regular: {
    fontFamily: "nunito-sans",
  },
  bold: {
    fontFamily: "nunito-sans-bold",
  },
});
