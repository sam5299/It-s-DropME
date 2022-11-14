import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SimpleLineIcons } from "@expo/vector-icons";
import { React, useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { Box, Stack, Text, Button } from "native-base";
import { AirbnbRating } from "react-native-ratings";
const RideCompleted = ({ tripRideId, setModalVisible }) => {
  const [rating, setRating] = useState(0);

  async function saveRating() {
    console.log("Set rating in home ride completed..");
    alert(rating);
    // setRating(ratingCnt);
    setModalVisible(false);
    // try {
    //   console.log("Hey ");

    //   let result = await axios.get(
    //     "http://192.168.43.180:3100/notification/getNotification",
    //     {
    //       headers: {
    //         "x-auth-token":
    //           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIlVzZXIiOiI2MjZmOWZkZTRiNDRiZDQ2NGM5NzgzZjEiLCJpYXQiOjE2NTIwODI1MTl9.flvvWDWGaB78rh2HEvV9lhuiLX6d2Ap99M5naritNE4",
    //       },
    //     }
    //   );
    //   // console.log("hii ");
    //   console.log("result:", result.data);
    // } catch (ex) {
    //   console.log("Exception", ex.response.data);
    // }

    // Redirect to main screen
  }

  //   useEffect(() => {
  //     //alert(rating);
  //   }, [rating]);
  return (
    <Box display={"flex"} p={5} bg={"#F0F8FF"} borderRadius={10}>
      {/* {rating} */}
      <Box>
        <Stack
          direction={"column"}
          space={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SimpleLineIcons
            name="check"
            size={130}
            color="rgba(6,182,212,1.00)"
          />
          <Text fontWeight={"bold"} fontSize={20}>
            Ride Completed
          </Text>
          <Stack display={"flex"} direction={"row"} space={1}>
            <AirbnbRating
              count={5}
              defaultRating={1}
              reviews={["Average", "Good", "Very Good", "Excellent", "Amazing"]}
              readonly={true}
              size={20}
              reviewColor={"black"}
              reviewSize={15}
              isDisabled={false}
              onFinishRating={(val) => setRating(val)}
            />
          </Stack>
          <Box>
            <Button size="sm" px={10} onPress={() => saveRating()}>
              <Text fontSize={"sm"} color="white">
                OK
              </Text>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default RideCompleted;
