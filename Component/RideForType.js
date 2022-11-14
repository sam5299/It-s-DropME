import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, Radio, Stack, Checkbox, Text } from "native-base";

const RideForType = ({ type }) => {
  const t = "Only For " + type.rideFor;
  const selectType = (value) => {
    if (value == true) {
      type.dispatch({ type: "rideFor", payload: type.rideFor });
    } else {
      type.dispatch({ type: "rideFor", payload: "Both" });
    }
  };

  return (
    <Box
      flexDirection="row"
      justifyContent={"space-between"}
      mr="2"
      mt={5}
      ml={3}
    >
      <Box flexDirection={"row"}>
        <Checkbox
          accessibilityLabel="Only"
          onChange={(value) => selectType(value)}
        ></Checkbox>
        <Text ml={"2"}>{t}</Text>
      </Box>
      <Radio.Group
        name="Ride Type"
        defaultValue="Paid"
        accessibilityLabel="Ride Type"
        onChange={(value) =>
          type.dispatch({ type: "rideType", payload: value })
        }
      >
        <Stack
          direction={{
            base: "row",
            md: "column ",
          }}
          mr="2"
          space={3}
          maxW="300px"
        >
          <Radio value="Paid" size="md">
            Paid
          </Radio>
          <Radio value="Free" size="md">
            Free
          </Radio>
        </Stack>
      </Radio.Group>
    </Box>
  );
};

export default RideForType;
