import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../data/firebase-config";
import * as usersActions from "../store/actions/usersActions";

import StartupScreen from "../screens/StartupScreen";
import AuthScreen from "../screens/AuthScreen";
import { TabsNavigator } from "./TabNavigator";

const AppNavigator = () => {
  const isAuth = useSelector(state => !!state.users.userId);
  const didTryAutoLogin = useSelector(state => !!state.users.tryAutoLogin);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(usersActions.addUserId(user.uid));
      }
      dispatch(usersActions.tryAutoLogin());
    });
    return unsubscribe;
  });

  return (
    <NavigationContainer>
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
      {!isAuth && didTryAutoLogin && <AuthScreen />}
      {isAuth && <TabsNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
