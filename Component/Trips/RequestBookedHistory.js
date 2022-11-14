import { View, Text } from "react-native";
import React from "react";
import { Box, Button, Stack } from "native-base";

const RequestBookedHistory = ({ navigation }) => {
  return (
    <Box flex={1} justifyContent={"center"}>
      <Stack flexDirection="column" alignItems={"center"} space="5">
        <Button w={"70%"} onPress={() => navigation.navigate("TripBooked")}>
          Booked Trips
        </Button>
        <Button w={"70%"} onPress={() => navigation.navigate("TripHistory")}>
          Trip History
        </Button>
      </Stack>
    </Box>
  );
};

export default RequestBookedHistory;
