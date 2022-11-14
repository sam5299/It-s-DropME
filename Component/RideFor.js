import { View, Text } from "react-native";
import React, { useState } from "react";
import { Select } from "native-base";

const RideFor = () => {
  const [rideFor, setRideFor] = useState("");
  return (
    <Select
      selectedValue={rideFor}
      w="175"
      accessibilityLabel="Ride For"
      placeholder="Ride For"
      onValueChange={(itemValue) => setRideFor(itemValue)}
    >
      <Select.Item shadow={2} label="Ride For" disabled={true} />
      <Select.Item shadow={2} label="Male" value="1" />
      <Select.Item shadow={2} label="Female" value="2" />
      <Select.Item shadow={2} label="Both" value="5" />
    </Select>
  );
};

export default RideFor;
