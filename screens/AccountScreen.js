import { StyleSheet, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../data/firebase-config";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import * as userActions from "../store/actions/usersActions";
import CustomButton from "../components/CustomButton";
import CustomText from "../components/CustomText";
import Colors from "../constants/Colors";

const AccountScreen = () => {
  const user = useSelector(state =>
    state.users.users.find(user => user.id === auth.currentUser?.uid)
  );
  const dispatch = useDispatch();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(userActions.addUserId(null));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.screen}>
      <CustomText bold style={{ fontSize: 20 }}>
        Du har{" "}
        <CustomText
          bold
          style={{ color: user?.score >= 0 ? Colors.primary : "red" }}
        >
          {user?.score}
        </CustomText>{" "}
        poäng
      </CustomText>
      <CustomText style={styles.text}>
        Inloggad som: {user?.username}
      </CustomText>
      <CustomButton color="red" title="Logga ut" onPress={handleSignOut} />
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    margin: 10,
  },
});
