import { useEffect, useState, useCallback, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as usersActions from "../store/actions/usersActions";
import Header from "../components/Header";
import CustomText from "../components/CustomText";
import Error from "../components/Error";
import Colors from "../constants/Colors";

const LeaderboardScreen = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const users = useSelector(state => state.users.users);
  const yOffset = useRef(new Animated.Value(0)).current;
  const headerOpacity = yOffset.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 2],
    extrapolate: "clamp",
  });

  const dispatch = useDispatch();

  const fetchUsers = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      dispatch(usersActions.fetchUsers());
    } catch (error) {
      setError("Någonting gick fel!\nDra för att uppdatera");
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

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

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={
          <RefreshControl onRefresh={fetchUsers} refreshing={isRefreshing} />
        }
      >
        <Error message={error} />
      </ScrollView>
    );
  }

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
          <CustomText style={{ fontSize: 16 }}>
            {index + 1}. <CustomText bold>{item.username}</CustomText>
          </CustomText>
          <CustomText
            bold
            style={{
              fontSize: 16,
              color: item.score >= 0 ? Colors.primary : "red",
            }}
          >
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
        onRefresh={fetchUsers}
        refreshing={isRefreshing}
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
  centered: {
    flex: 1,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 12,
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
