import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  Stack,
  Image,
  ScrollView,
  Spinner,
  Center,
  HStack,
  Skeleton,
  VStack,
  AspectRatio,
  Heading,
} from "native-base";
import {
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const RideHistory = () => {
  const [rideHistoryList, setRideHistory] = useState([]);
  const [userToken, setToken] = useState(null);

  const isFocused = useIsFocused();

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function getHistory() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let result = await axios.get(url + "/ride/getRaiderHistory", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        //console.log("@@2", result.data.);
        if (mounted) {
          setIsLoading(false);
          setRideHistory(result.data);
          setToken(parseUser.userToken);
          console.log("Ride History");
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsLoading(false);
      }
      return () => (mounted = false);
    }

    getHistory();
    return () => (mounted = false);
  }, [isFocused]);

  function getHistory() {
    return (
      <ScrollView flex={1} mb="15%">
        {rideHistoryList.map((trip) => (
          <Box alignItems="center" key={trip._id} my={7}>
            <Box
              w={"80%"}
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              shadow={1}
              _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700",
              }}
              _web={{
                shadow: 2,
                borderWidth: 0,
              }}
              _light={{
                backgroundColor: "gray.50",
              }}
            >
              <Box alignItems={"center"} justifyContent={"center"}>
                <AspectRatio w={"80%"} mt={3}>
                  <Image
                    source={{
                      uri: trip.PassengerId.profile,
                    }}
                    alt="image"
                    borderRadius={10}
                  />
                </AspectRatio>
              </Box>
              <Stack p="4" space={3}>
                <Stack>
                  {trip.status == "Completed" ? (
                    <AirbnbRating
                      count={5}
                      reviews={[
                        "Average",
                        "Good",
                        "Very Good",
                        "Amazing",
                        "Excellent",
                      ]}
                      readonly={true}
                      size={15}
                      reviewColor={"green"}
                      reviewSize={18}
                      isDisabled={true}
                      defaultRating={trip.tripRating || 0}
                    />
                  ) : null}
                </Stack>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="400"
                >
                  {trip.amount > 0 ? (
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <FontAwesome name="rupee" size={20} color="green" />
                      <Text fontSize={20} fontWeight="bold" color={"green.800"}>
                        {trip.amount}
                      </Text>
                    </Stack>
                  ) : (
                    <Text fontSize={18} fontWeight="bold" color={"green.600"}>
                      Free
                    </Text>
                  )}
                </Text>

                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    {/* From: */}
                    <MaterialCommunityIcons
                      name="ray-start-arrow"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.tripId.source}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    {/* To: */}
                    <MaterialCommunityIcons
                      name="ray-start-end"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.tripId.destination}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    {/* Pickup: */}
                    <Ionicons
                      name="ios-location-outline"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.tripId.pickupPoint}</Text>
                </Text>
                <Stack space={2} direction={"row"}>
                  <MaterialCommunityIcons
                    name="calendar-arrow-right"
                    size={20}
                    color="green"
                  />
                  <Text fontSize={15}>{trip.date}</Text>
                </Stack>
                <HStack
                  alignItems="center"
                  space={4}
                  justifyContent="space-between"
                >
                  <HStack alignItems="center">
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      fontWeight="400"
                    >
                      {trip.status === "Completed" ? (
                        <Text
                          fontSize={18}
                          fontWeight="bold"
                          color={"green.500"}
                        >
                          {trip.status}
                        </Text>
                      ) : (
                        <Text fontSize={18} fontWeight="bold" color={"red.500"}>
                          {trip.status}
                        </Text>
                      )}
                    </Text>
                  </HStack>
                </HStack>
              </Stack>
            </Box>
          </Box>

          // <Box
          //   key={trip._id}
          //   borderRadius={10}
          //   display="flex"
          //   flexDirection={"column"}
          //   alignItems={"center"}
          //   justifyContent={"space-between"}
          //   p={4}
          //   my={5}
          //   borderColor="coolGray.200"
          //   borderWidth="1"
          //   _dark={{
          //     borderColor: "coolGray.600",
          //     backgroundColor: "gray.700",
          //   }}
          //   _web={{
          //     shadow: 2,
          //     borderWidth: 0,
          //   }}
          //   _light={{
          //     backgroundColor: "gray.50",
          //   }}
          // >
          //   <Image
          //     source={{
          //       uri: trip.PassengerId.profile,
          //     }}
          //     size={"xl"}
          //     alt="Image not available"
          //     borderRadius={100}
          //   />
          //   {trip.status == "Completed" ? (
          //     <AirbnbRating
          //       count={5}
          //       reviews={[
          //         "Average",
          //         "Good",
          //         "Very Good",
          //         "Amazing",
          //         "Excellent",
          //       ]}
          //       readonly={true}
          //       size={15}
          //       reviewColor={"black"}
          //       reviewSize={20}
          //       isDisabled={true}
          //       defaultRating={trip.tripRating || 0}
          //     />
          //   ) : null}

          //   <Stack direction={"column"} alignItems="center" space={3} m={2}>
          //     <Stack direction={"row"}>
          //       <Text fontSize={18} fontWeight="bold" color="black">
          //         From:
          //       </Text>
          //       <Text fontSize={18}> {trip.tripId.source}</Text>
          //     </Stack>

          //     <Stack direction={"row"}>
          //       <Text fontSize={18} fontWeight="bold" color="black">
          //         To:
          //       </Text>
          //       <Text fontSize={18}> {trip.tripId.destination}</Text>
          //     </Stack>

          //     <Stack direction={"row"}>
          //       <Text fontSize={18} fontWeight="bold" color="black">
          //         Pickup Point:
          //       </Text>
          //       <Text fontSize={18}> {trip.tripId.pickupPoint}</Text>
          //     </Stack>

          //     <Stack direction={"row"}>
          //       <Text fontSize={18} fontWeight="bold" color="black">
          //         Date:
          //       </Text>
          //       <Text fontSize={18}> {trip.tripId.date}</Text>
          //     </Stack>

          //     {trip.amount > 0 ? (
          //       <Text fontSize={18} fontWeight="bold">
          //         <FontAwesome name="rupee" size={18} color="black" />
          //         {trip.amount}
          //       </Text>
          //     ) : (
          //       <Text fontSize={18} fontWeight="bold" color={"green.500"}>
          //         Free
          //       </Text>
          //     )}
          //     <Stack direction={"row"} space={2}>
          //       <Text fontSize={18} fontWeight="bold" color="black">
          //         Status:
          //       </Text>
          //       {trip.status === "Completed" ? (
          //         <Text fontSize={18} fontWeight="bold" color={"green.500"}>
          //           {trip.status}
          //         </Text>
          //       ) : (
          //         <Text fontSize={18} fontWeight="bold" color={"red.500"}>
          //           {trip.status}
          //         </Text>
          //       )}
          //     </Stack>
          //   </Stack>
          // </Box>
        ))}
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <Box
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"#F0F8FF"}
      >
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} bg={"#e7feff"}>
        {rideHistoryList.length ? (
          getHistory()
        ) : (
          <Box flex={1} justifyContent="center" alignItems={"center"}>
            No details found
          </Box>
        )}
      </Box>
    );
  }
};

export default RideHistory;
