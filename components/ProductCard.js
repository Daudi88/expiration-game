import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import CustomText from "./CustomText";
import Colors from "../constants/Colors";

/**
 * Shows a card with product information
 * @param {*} props
 * @returns
 */
const ProductCard = props => {
  const expirationDate = new Date(props.expirationDate).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  let days = Math.round((expirationDate - today) / 86400000);

  // Decides the color symbol and message for the card
  // based on how many days to expiry
  let color, symbol, message, isExpired;
  if (days > 1) {
    color = Colors.primary;
    symbol = "thumbs-up";
    message = `${days} dagar kvar`;
    isExpired = false;
  } else if (days >= 0) {
    color = "orange";
    symbol = "warning";
    message = days > 0 ? "Går ut i övermorgon" : "Går ut imorgon";
    isExpired = false;
  } else {
    color = "red";
    symbol = "thumbs-down";
    message = `Gick ut för ${Math.abs(days)} dagar sedan`;
    isExpired = true;
  }

  let points;
  if (props.weight <= 1000) {
    points = 2;
  } else if (props.weight <= 2000) {
    points = 4;
  } else if (props.weight <= 3000) {
    points = 6;
  } else if (props.weight <= 4000) {
    points = 8;
  } else {
    points = 10;
  }

  // https://www.youtube.com/watch?v=JxN9W9PRlUQ
  const LeftActions = () => {
    return (
      <View style={[styles.actionContainer, styles.leftActionContainer]}>
        <TouchableOpacity
          style={styles.action}
          activeOpacity={0.5}
          onPress={() =>
            props.onProductDelete(props.index, isExpired ? 0 : points)
          }
        >
          <FontAwesome name="check" size={30} color="white" />
          <CustomText style={styles.stateText}>Förbrukad</CustomText>
          <CustomText bold style={{ color: "white" }}>
            +{isExpired ? 0 : points}p
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  const RightActions = () => {
    return (
      <View style={[styles.actionContainer, { flexDirection: "row" }]}>
        <View
          style={[styles.rightActionContainer, { backgroundColor: "orange" }]}
        >
          <TouchableOpacity
            style={styles.action}
            activeOpacity={0.5}
            onPress={() =>
              props.onProductDelete(props.index, isExpired ? 0 : points / 2)
            }
          >
            <FontAwesome name="trash-o" size={30} color="white" />
            <CustomText style={styles.stateText}>Öppnad</CustomText>
            <CustomText bold style={{ color: "white" }}>
              +{isExpired ? 0 : points / 2}p
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={[styles.rightActionContainer, { backgroundColor: "red" }]}>
          <TouchableOpacity
            style={styles.action}
            activeOpacity={0.5}
            onPress={() => props.onProductDelete(props.index, -points)}
          >
            <FontAwesome name="trash-o" size={30} color="white" />
            <CustomText style={styles.stateText}>Obruten</CustomText>
            <CustomText bold style={{ color: "white" }}>
              -{points}p
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.itemWrapper}
      activeOpacity={0.8}
      onPress={() => {
        Haptics.selectionAsync();
      }}
    >
      <View
        style={[
          styles.itemContainer,
          props.index === 0
            ? styles.topContainer
            : props.index === props.length - 1
            ? styles.bottomContainer
            : styles.middleContainer,
        ]}
      >
        <Swipeable
          renderLeftActions={LeftActions}
          renderRightActions={RightActions}
          overshootLeft={false}
          overshootRight={false}
          // Sets a ref to the row and closes it if another row is opened.
          // https://www.youtube.com/watch?v=xyTrWDIgE3Y
          onSwipeableOpen={() => props.closeRow(props.index)}
          ref={ref => (props.row[props.index] = ref)}
        >
          <View style={styles.productItem}>
            <View style={styles.padded}>
              <Image
                style={styles.image}
                source={
                  props.image === ""
                    ? {
                        uri: "https://static.vecteezy.com/system/resources/previews/004/458/389/non_2x/dairy-products-flat-linear-long-shadow-icon-yogurt-bottle-and-glass-of-milk-eggs-and-cheese-grocery-store-items-line-symbol-vector.jpg",
                      }
                    : { uri: props.image }
                }
              />
            </View>
            <View style={styles.info}>
              <CustomText numberOfLines={1} bold style={styles.title}>
                {props.title}
              </CustomText>
              <CustomText style={{ color: color, marginBottom: 3 }}>
                {message}
              </CustomText>
              <CustomText style={styles.date}>
                Bäst före: {props.expirationDate}
              </CustomText>
            </View>
            <View style={styles.padded}>
              <FontAwesome name={symbol} size={24} color={color} />
            </View>
          </View>
        </Swipeable>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  itemWrapper: {
    alignItems: "center",
  },
  itemContainer: {
    width: "90%",
    overflow: "hidden",
  },
  topContainer: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  middleContainer: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  bottomContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  productItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  padded: {
    paddingHorizontal: 10,
  },
  image: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
    margin: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
  },
  actionContainer: {
    justifyContent: "center",
  },
  leftActionContainer: {
    backgroundColor: Colors.primary,
  },
  rightActionContainer: {
    alignItems: "flex-end",

    justifyContent: "center",
  },
  action: {
    alignItems: "center",
    padding: 30,
  },
  stateText: {
    color: "white",
    fontSize: 10,
  },
});
