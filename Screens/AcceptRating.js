import { SimpleLineIcons } from "@expo/vector-icons";
import { React, useContext, useEffect, useState } from "react";
import { Rating, AirbnbRating } from "react-native-ratings";
import { Box, Button, Stack, Text } from "native-base";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Component/Context";

const AcceptRating = ({
  tripRideId,
  setModalVisible,
  notificationObject,
  markReadNotification,
}) => {
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [rating, setRating] = useState(0);

  async function saveRating() {
    //alert(ratingCnt);
    //setRating(ratingCnt);
    //api call and set rating to trip
    try {
      setModalVisible(false);
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      let result = await axios.put(
        url + "/trip/setRating",
        {
          tripRideId: tripRideId,
          rating: rating,
        },
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      // alert("rating done!");

      //set notification as read
      let notificationResult = await markReadNotification(notificationObject);
      console.log("marking notification as read done");
    } catch (error) {
      console.log("error while setting rating to trip!");
      console.log(error);
    }

    //set rating alert disabled
  }

  return (
    <Box display={"flex"}>
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
              defaultRating={0}
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

export default AcceptRating;
