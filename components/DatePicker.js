import { useState } from "react";
import { View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePicker = ({ show, setShow, onProductChange, setError }) => {
  const [date, setDate] = useState(new Date());

  /**
   * A function that handles date changes in the DateTimePicker fot android
   * @param {*} event
   * @param {*} selectedDate
   */
  const changeHandler = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);

    if (event.type === "set") {
      onProductChange("expirationDate", currentDate.toLocaleDateString());
      setError(null);
    }
  };

  /**
   * A function that handles date changes in the DateTimePickerModal for iOS
   * @param {*} event
   * @param {*} selectedDate
   */
  const confirmHandler = dateInput => {
    setShow(false);
    onProductChange("expirationDate", dateInput.toLocaleDateString());
    setError(null);
  };

  return (
    <View>
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={changeHandler}
          onCancel={() => setShow(false)}
        />
      )}
      {Platform.OS === "ios" && (
        <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={confirmHandler}
          onCancel={() => setShow(false)}
          display="inline"
        />
      )}
    </View>
  );
};

export default DatePicker;
