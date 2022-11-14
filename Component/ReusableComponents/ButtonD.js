import { View } from "react-native";
import React from "react";
import { Button, Text } from "native-base";

const ButtonD = ({ name }) => {
  return (
    <Button size="md" mt={3} w="95%" mx={3}>
      <Text fontSize={"lg"} color="white">
        {name}
      </Text>
    </Button>
  );
};

export default ButtonD;
