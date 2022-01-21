import { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import CustomText from "../components/CustomText";
import Colors from "../constants/Colors";

const LeaderboardScreen = ({ navigation }) => {
  const users = useSelector(state => state.users.users);
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 2],
    extrapolate: "clamp",
  });

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
  });

  const renderUser = ({ item, index }) => {
    return (
      <View style={styles.cardsContainer}>
        <View
          style={[
            styles.card,
            index === 0
              ? styles.topCard
              : index === users.length - 1
              ? styles.bottomCard
              : styles.middleCard,
          ]}
        >
          <CustomText bold style={{ fontSize: 20 }}>
            {index + 1}. {item.username}
          </CustomText>
          <CustomText bold style={{ fontSize: 18 }}>
            {item.score}
          </CustomText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.FlatList
        data={users.sort((a, b) => a.score < b.score)}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header title="Topplistan" />}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: yOffset } } }],
          { useNativeDriver: true }
        )}
      />
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topCard: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  middleCard: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  bottomCard: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
