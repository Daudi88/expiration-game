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
      <CustomText style={styles.text}>{user?.username}</CustomText>
      <CustomText bold style={styles.text}>
        Du har{" "}
        <CustomText
          bold
          style={{ color: user?.score >= 0 ? Colors.primary : "red" }}
        >
          {user?.score}
        </CustomText>{" "}
        poäng
      </CustomText>
      <View style={styles.button}>
        <CustomButton color="red" title="Logga ut" onPress={handleSignOut} />
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    marginHorizontal: 25,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
});
