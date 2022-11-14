import { View } from "react-native";
import React from "react";
import { Box, Button, Icon, Stack, Text } from "native-base";

const AddRemoveScreen = ({ navigation }) => {
  return (
    <Box flex={1} justifyContent={"center"}>
      <Stack flexDirection="column" alignItems={"center"} space="5">
        <Button w={"70%"} onPress={() => navigation.navigate("AddVehicle")}>
          Add Vehicle
        </Button>
        <Button w={"70%"} onPress={() => navigation.navigate("ViewVehicles")}>
          <Text color={"white"}>View vehicles</Text>
        </Button>
      </Stack>
    </Box>
  );
};

export default AddRemoveScreen;
