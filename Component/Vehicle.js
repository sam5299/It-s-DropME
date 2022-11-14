import { View, Text } from "react-native";
import React, { useState } from "react";
import { Select } from "native-base";

const Vehicle = ({ vehicles }) => {
  const [service, setService] = useState("");

  return (
    <Select
      w="175"
      selectedValue={service}
      accessibilityLabel="Select Vehicle"
      placeholder="Select Vehicle "
      onValueChange={(itemValue) => setService(itemValue)}
    >
      <Select.Item shadow={2} label="Select Vehicle" disabled={true} />
      {vehicles.map((item) => (
        <Select.Item
          shadow={2}
          key={item.id}
          label={item.username}
          value={item.username}
        />
      ))}
    </Select>
  );
};

export default Vehicle;
