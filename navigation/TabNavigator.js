import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import ProductsScreen from "../screens/ProductsScreen";
import AccountScreen from "../screens/AccountScreen";
import Colors from "../constants/Colors";

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {
  return (
    <Tab.Navigator
      // The code is inspired from the official docs
      // https://reactnavigation.org/docs/tab-based-navigation
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Products":
              iconName = "list";
              break;
            case "Account":
              iconName = "user-alt";
              break;
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontFamily: "nunito-sans",
        },
        headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
        headerTitleStyle: {
          fontFamily: "nunito-sans-bold",
        },
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: "Matvaror" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
};
