import { View, Text } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Box, Button, Container, Modal } from "native-base";

const Date = () => {
  const [selectedTime, setTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const onChange = (event, selectedTime) => {
    setTime(selectedTime);
    setShowModal(false);
  };
  return (
    <Container>
      <Button onPress={() => setShowModal(true)}>Button</Button>
      {showModal && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="date"
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <Text>Time:{selectedTime.toString()}</Text>
    </Container>
  );
};

export default Date;
