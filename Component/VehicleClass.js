import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import axios from "axios";

const VehicleClass = () => {
  const [vehicleClass, setVehicleClass] = useState("");
  const [vehicleClasses, setVehicleClasses] = useState([]);

  useEffect(async () => {
    try {
      const list = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setVehicleClasses(list.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Select
      mr={1}
      w="175"
      selectedValue={vehicleClass}
      accessibilityLabel="Select Vehicle Class"
      placeholder="Select Vehicle Class "
      onValueChange={(itemValue) => setVehicleClass(itemValue)}
    >
      <Select.Item shadow={2} label="Select Vehicle Class" disabled={true} />
      {vehicleClasses.map((item) => (
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

export default VehicleClass;
