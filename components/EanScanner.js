import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../data/firebase-config";
import axios from "axios";

// From official docs https://reactnative.dev/docs/dimensions
const windowWidth = Dimensions.get("window").width;

const EanScanner = props => {
  const [hasPermissions, setHasPermissions] = useState();

  useEffect(() => {
    const askForCameraPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermissions(status === "granted");
      return;
    };

    askForCameraPermissions();
  }, []);

  /**
   * A function that tries to fetch information from an api using the bar code.
   * @param {*} type, data
   */
  const barCodeScannedHandler = async ({ data }) => {
    props.setIsScanned(true);

    // Checks if product already exists on firebase.
    // If so it gets info from there and returns.
    // Code from https://firebase.google.com/docs/firestore/query-data/get-data?authuser=1#get_a_document
    const docRef = doc(db, "products", data);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const doc = docSnap.data();
      props.setProduct(prevState => ({
        ...prevState,
        ean: data,
        title: doc.title,
        imageUrl: doc.imageUrl,
        price: doc.price,
      }));

      props.setError(null);
      return;
    }

    // axios
    //   .get(
    //     "https://api.dabas.com/DABASService/V2/article/gtin/07300327872001/json?apikey=${DABAS_API_KEY}"
    //   )
    //   .then(response => console.log(response));

    const productsRef = collection(db, "products");
    axios
      .get(`https://handla.api.ica.se/api/upclookup?upc=${data}`)
      .then(response => {
        const title = response.data.Items[0].ItemDescription;

        setDoc(doc(productsRef, data), {
          title: title,
          imageUrl: "",
          price: 10,
        });

        props.setProduct(prevState => ({
          ...prevState,
          ean: data,
          title: title,
        }));
        props.setError(null);
      })
      .catch(() => {
        setDoc(doc(productsRef, data), {
          title: "",
          imageUrl: "",
          price: 10,
        });
        props.setError(
          "Det finns ingen information om den här varan.\nDu får lägga till varan manuellt."
        );
      });
  };

  return (
    <>
      {hasPermissions && (
        <View style={styles.barCodeContainer}>
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
            onBarCodeScanned={
              props.isScanned ? undefined : barCodeScannedHandler
            }
            style={{ width: windowWidth, height: 500 }}
          />
        </View>
      )}
    </>
  );
};

export default EanScanner;

const styles = StyleSheet.create({
  barCodeContainer: {
    alignItems: "center",
    height: 200,
    width: "90%",
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 10,
  },
});
