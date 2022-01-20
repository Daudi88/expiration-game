import { useState } from "react";
import { View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePicker = props => {
  const [date, setDate] = useState(new Date());

  /**
   * A function that handles date changes in the DateTimePickerModal for iOS
   * @param {*} event
   * @param {*} selectedDate
   */
  const confirmHandler = dateInput => {
    props.setShow(false);
    props.onProductChange("expirationDate", dateInput.toLocaleDateString());
    props.setError(null);
  };

  /**
   * A function that handles date changes in the DateTimePicker fot android
   * @param {*} event
   * @param {*} selectedDate
   */
  const changeHandler = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    props.setShow(false);
    setDate(currentDate);

    if (event.type === "set") {
      props.onProductChange("expirationDate", currentDate.toLocaleDateString());
      props.setError(null);
    }
  };

  return (
    <View>
      {Platform.OS === "android" && props.show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={changeHandler}
          onCancel={() => props.setShow(false)}
        />
      )}
      {Platform.OS === "ios" && (
        <DateTimePickerModal
          isVisible={props.show}
          mode="date"
          onConfirm={confirmHandler}
          onCancel={() => props.setShow(false)}
          display="inline"
        />
      )}
    </View>
  );
};

export default DatePicker;
