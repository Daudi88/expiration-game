import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../data/firebase-config";
import * as userActions from "../store/actions/userActions";

import StartupScreen from "../screens/StartupScreen";
import AuthScreen from "../screens/AuthScreen";
import { TabsNavigator } from "./TabNavigator";

const AppNavigator = () => {
  const isAuth = useSelector(state => !!state.user.userId);
  const didTryAutoLogin = useSelector(state => !!state.user.tryAutoLogin);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(userActions.addUserId(user.uid));
      }

      dispatch(userActions.tryAutoLogin());
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
