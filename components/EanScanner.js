import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { DABAS_API_KEY } from "@env";
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
    axios
      .get(
        `https://api.dabas.com/DABASService/V2/article/gtin/0${data}/JSON?apikey=${DABAS_API_KEY}`
      )
      .then(response => {
        if (response.data !== "") {
          props.setProduct(prevState => ({
            ...prevState,
            title: response.data?.Artikelbenamning,
            imageUrl: response.data?.Bilder[0].Lank,
            weight: response.data?.Bruttovikt,
          }));
        } else {
          throw new Error(
            "Det finns ingen information om den här varan.\nDu får lägga till varan manuellt."
          );
        }

        props.setError(null);
      })
      .catch(error => {
        props.setError(error.message);
        props.setProduct(prevState => ({
          ...prevState,
          title: "",
          imageUrl: "",
          weight: 500,
        }));
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
