import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  Modal,
  StatusBar,
  ScrollView,
  RefreshControl,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector, useDispatch } from "react-redux";
import Error from "../components/Error";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import AddScreen from "./AddScreen";
import IconButton from "../components/IconButton";
import * as productsActions from "../store/actions/productsActions";
import * as usersActions from "../store/actions/usersActions";
import Colors from "../constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { db } from "../data/firebase-config";
import { doc, updateDoc } from "firebase/firestore";

const ProductsScreen = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = useSelector(state => state.users.userId);
  const user = useSelector(state =>
    state.users.users.find(user => user.id === userId)
  );
  const products = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  // Found the code for this at https://stackoverflow.com/a/63487672/14094081
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 2],
    extrapolate: "clamp",
  });

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      dispatch(productsActions.fetchProducts(userId));
    } catch (error) {
      setError("Någonting gick fel!\nDra för att uppdatera");
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(usersActions.fetchUsers());
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        opacity: headerOpacity,
      },
      headerBackground: () => (
        <Animated.View
          style={{
            backgroundColor:
              Platform.OS === "android" ? Colors.primary : "white",
            ...StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
          }}
        />
      ),
      headerTransparent: true,
    });
  }, [headerOpacity, navigation]);

  // For managing opening and closing rows
  let row = [];
  let prevOpenedRow;

  /**
   * Got this code from https://www.youtube.com/watch?v=xyTrWDIgE3Y
   * @param {*} index - index of row
   */
  const closeRow = index => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const handleProductDelete = async (index, points) => {
    const product = products[index];
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(productsActions.removeProductFromUser(user.id, product.id));
    await updateDoc(doc(db, "users", user.id), {
      score: user.score + points,
    });
    dispatch(usersActions.fetchUsers());
  };

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={
          <RefreshControl onRefresh={loadProducts} refreshing={isRefreshing} />
        }
      >
        <Error message={error} />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <GestureHandlerRootView>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={loadProducts}
          refreshing={isRefreshing}
          ListHeaderComponent={<Header title="Matvaror" />}
          contentContainerStyle={styles.cardsContainer}
          data={products.sort(
            (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)
          )}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: yOffset } } }],
            { useNativeDriver: true }
          )}
          renderItem={itemData => (
            <ProductCard
              image={itemData.item.imageUrl}
              title={itemData.item.title}
              weight={itemData.item.weight}
              expirationDate={itemData.item.expirationDate}
              onProductDelete={handleProductDelete}
              index={itemData.index}
              length={products.length}
              row={row}
              closeRow={closeRow}
            />
          )}
        />
      </GestureHandlerRootView>
      <IconButton
        style={styles.addButton}
        name="plus"
        size={30}
        color="white"
        onPress={() => {
          Haptics.selectionAsync();
          setShowModal(true);
        }}
      />
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        visible={showModal}
      >
        <AddScreen setShowModal={setShowModal} userId={userId} />
      </Modal>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardsContainer: {
    height: "100%",
    paddingBottom: 110,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});
