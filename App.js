import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import userReducer from "./store/reducers/usersReducer";
import productsReducer from "./store/reducers/productsReducer";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_700Bold,
  NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans";
import AppNavigator from "./navigation/AppNavigator";

// Takes care of combining all reducers into one root reducer
const rootReducer = combineReducers({
  users: userReducer,
  products: productsReducer,
});

// The redux store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  // Inspiration from https://www.youtube.com/watch?v=ER83EI-b4Xk
  // and the official docs https://docs.expo.dev/guides/using-custom-fonts/
  let [fontsLoaded] = useFonts({
    "nunito-sans": NunitoSans_400Regular,
    "nunito-sans-bold": NunitoSans_700Bold,
    "nunito-sans-black": NunitoSans_900Black,
  });

  // this is shown utill the fonts are loaded
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
