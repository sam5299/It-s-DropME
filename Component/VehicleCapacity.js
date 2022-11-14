import { View, Text } from "react-native";
import React, { useState } from "react";
import { Box, Select } from "native-base";

const VehicleCapacity = () => {
  const [capacity, setCapacity] = useState(0);
  return (
    <Box mt={5} ml={3} mr="2">
      <Select
        selectedValue={capacity}
        w="100%"
        accessibilityLabel="Select Capacity"
        placeholder="Select Capacity"
        onValueChange={(itemValue) => setCapacity(itemValue)}
      >
        <Select.Item shadow={2} label="Select Capacity" disabled={true} />
        <Select.Item shadow={2} label="1" value="1" />
        <Select.Item shadow={2} label="2" value="2" />
        <Select.Item shadow={2} label="3" value="3" />
        <Select.Item shadow={2} label="4" value="4" />
        <Select.Item shadow={2} label="5" value="5" />
      </Select>
    </Box>
  );
};

export default VehicleCapacity;
