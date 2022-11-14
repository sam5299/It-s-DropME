import { View, Text } from "react-native";
import React from "react";
import { Input } from "native-base";

const PickupPoint = ({ dispatch }) => {
  return (
    <Input
      mx="3"
      mt={5}
      placeholder="Enter Pickup Point"
      w="95%"
      onChangeText={(event) =>
        dispatch({ type: "pickupPoint", payload: event })
      }
    />
  );
};

export default PickupPoint;
