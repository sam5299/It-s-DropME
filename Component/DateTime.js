import React, { useState } from "react";
import { Box, Icon, Button, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTime = ({ dispatch }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const [selectedTime, setTime] = useState(new Date());
  const [showClock, setClock] = useState(false);

  let hour = selectedTime.getHours();
  let minute = selectedTime.getMinutes();
  let suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;

  const t = `${hour}:${minute} ${suffix}`;
  const [currentTime, setCurrentTime] = useState(t);

  //function to handle time change
  const onChange = (event, selectedTime) => {
    setClock(false);

    let hours = selectedTime.getHours();
    let minutes = selectedTime.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const time = `${hours}:${minutes}:${ampm}`;
    setCurrentTime(time);
    dispatch({ type: "time", payload: time });
  };

  //function to handle date change
  const onDateChange = (event, date) => {
    if (event.type === "set") {
      setShowModal(false);
      setSelectedStartDate(date);
      const curr = date.toDateString();
      dispatch({ type: "date", payload: curr });
      setClock(true);
    }
    setShowModal(false);
  };

  const curr = selectedStartDate.toDateString() + " ; " + currentTime;

  return (
    <Box ml={3} mt="5" w={"95%"} flexDir={"row"}>
      <Button
        w={"100%"}
        variant="outline"
        backgroundColor={"white"}
        rightIcon={
          <Icon
            as={<MaterialCommunityIcons name="calendar-arrow-left" />}
            size={6}
            color="rgba(6,182,212,1.00)"
          />
        }
        onPress={() => setShowModal(true)}
      >
        <Box pr={"44%"}>
          <Text color={"gray.700"} fontSize="13">
            {curr}
          </Text>
        </Box>
      </Button>
      {showModal && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedStartDate}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showClock && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={false}
          onChange={onChange}
        />
      )}
    </Box>
  );
};

export default DateTime;
