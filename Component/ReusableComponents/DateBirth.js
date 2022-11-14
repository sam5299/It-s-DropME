import { View } from "react-native";
import React from "react";
import { Box, Button, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DateBirth = () => {
  return (
    <Button
      mt={"5"}
      w="390"
      variant="outline"
      rightIcon={
        <Icon
          as={<MaterialCommunityIcons name="calendar-arrow-left" />}
          size={6}
          color="rgba(6,182,212,1.00)"
        />
      }
    >
      <Text color={"gray.400"} mr={"70%"}>
        Date Of Birth
      </Text>
    </Button>
  );
};

export default DateBirth;
