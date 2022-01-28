import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../data/firebase-config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import Colors from "../constants/Colors";
import Link from "../components/Link";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  /**
   * If the user chooses to register as a new user the username is checked separately
   * before the email address and password is checked since they
   * @returns
   */
  const checkUsername = async () => {
    if (username.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Varning", "Du måste ange ett användarnamn.", [
        { text: "Okej" },
      ]);

      return;
    }

    getDocs(collection(db, "users"))
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const user = doc.data();
          if (user.username.toLowerCase() === username.toLowerCase()) {
            throw new Error("Användarnamnet finns redan.");
          }
        });
      })
      .then(() => {
        handleSignup();
      })
      .catch(error => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Varning", error.message, [{ text: "Okej" }]);
      });
  };

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        setDoc(doc(db, "users", user.uid), {
          username: username,
          score: 0,
        });
        sendEmailVerification(user);
        setIsRegister(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch(error => {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          Alert.alert("Varning", "E-postadressen finns redan.", [
            { text: "Okej" },
          ]);
        } else if (email.length === 0) {
          Alert.alert("Varning", "Du måste ange en e-postadress.", [
            { text: "Okej" },
          ]);
        } else if (password.length === 0) {
          Alert.alert("Varning", "Du måste ange ett lösenord.", [
            { text: "Okej" },
          ]);
        } else {
          Alert.alert("Varning", "Ogiltig e-postadress.", [{ text: "Okej" }]);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        if (!user.emailVerified) {
          Alert.alert(
            "Overifierad E-post",
            "Du måste verifiera din epostadress innan du kan logga in.",
            [{ text: "Okej" }]
          );
          signOut(auth);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch(() => {
        Alert.alert("Varning", "Ogiltig e-postadress eller lösenord.", [
          { text: "Okej" },
        ]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      });
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Återställ lösenordet",
          `Ett återställningsmail har skickats till ${email}.`,
          [{ text: "Okej" }]
        );
      })
      .catch(error => {
        if (error.message === "Firebase: Error (auth/missing-email).") {
          Alert.alert("Varning", "Ange en e-postadress.", [{ text: "Okej" }]);
        } else {
          Alert.alert("Varning", "E-postadressen har ännu inte registrerats.", [
            { text: "Okej" },
          ]);
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <View style={styles.centered}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={100}
              color={Colors.primary}
            />
          </View>
          <View style={styles.inputContainer}>
            {isRegister && (
              <TextInput
                style={styles.input}
                value={username}
                placeholder="Användarnamn"
                onChangeText={setUsername}
                autoCapitalize="words"
              />
            )}
            <TextInput
              style={styles.input}
              value={email}
              placeholder="E-postadress"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Lösenord"
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>
        {!isRegister && (
          <Link title="Glömt lösenordet?" onPress={handlePasswordReset} />
        )}
        <View style={styles.centered}>
          <CustomButton
            title={isRegister ? "Registrera" : "Logga in"}
            onPress={isRegister ? checkUsername : handleLogin}
          />
          <Link
            title={isRegister ? "Logga in" : "Registrera"}
            onPress={() => setIsRegister(!isRegister)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  centered: {
    alignItems: "center",
  },
  iconContainer: {
    margin: 15,
  },
  inputContainer: {
    alignItems: "center",
    width: "92%",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    margin: 5,
    fontSize: 18,
  },
});
