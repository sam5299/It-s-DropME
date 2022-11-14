import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, ScrollView } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const Rides = () => {
  const [allRides, setUserRides] = useState([]);
  const [showRides, setShowRides] = useState(true);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        const allRides = await axios.get(url + "/ride/getUserRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        if (mounted) {
          setUserRides(allRides.data);
          setShowRides(false);
        }
      } catch (error) {
        console.log("Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, []);

  function allUserRides() {
    return (
      <ScrollView>
        {allRides.map((ride) => (
          <Box alignItems="center" key={ride._id} my={7} flex={1}>
            <Box
              flex={1}
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
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
                <AspectRatio w={"70%"} mt={3}>
                  <Image
                    source={{
                      uri: ride.PassengerId.profile,
                    }}
                    alt="image"
                    borderRadius={10}
                  />
                </AspectRatio>
              </Box>
              <Stack p="4" space={3}>
                <Center>
                  <Heading size="md" ml="-1">
                    {ride.PassengerId.name}
                  </Heading>
                </Center>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    <AntDesign name="mobile1" size={20} color="green" />
                  </Text>
                  <Text fontSize={15}> {ride.PassengerId.mobileNumber}</Text>
                </Text>

                <Text fontWeight="400">
                  <Text fontSize={15} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-arrow"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {ride.tripId.source}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-end"
                      size={18}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {ride.tripId.destination}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    <Ionicons
                      name="ios-location-outline"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {ride.tripId.pickupPoint}</Text>
                </Text>

                <Input
                  isDisabled={ride.status === "Booked" ? false : true}
                  maxLength={6}
                  variant={"outline"}
                  keyboardType="numeric"
                  placeholder="Enter the token"
                  onChangeText={(value) => setPassengerToken(value)}
                />
                <Divider color={"black"} mb={2} />
                <Center>
                  {ride.status === "Booked" ? (
                    <Stack direction={"row"} space={5} mt={2}>
                      <Button
                        isDisabled={isButtonDisabled}
                        bg={"#03c03c"}
                        onPress={() =>
                          startTrip(
                            ride._id,
                            ride.tripId._id,
                            "Initiated",
                            ride.token,
                            ride.PassengerId.notificationToken
                          )
                        }
                        px={5}
                      >
                        <Text color="white"> Start Trip</Text>
                      </Button>
                      <Button
                        px={5}
                        bg={"#e8000d"}
                        isDisabled={isButtonDisabled}
                        onPress={() =>
                          showConfirmDialog(
                            ride._id,
                            ride.tripId._id,
                            "Cancelled",
                            ride.amount,
                            ride.PassengerId.notificationToken
                          )
                        }
                      >
                        <Text color="white">Cancel Trip</Text>
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      bg={"#03c03c"}
                      w={"100%"}
                      onPress={() =>
                        endTrip(
                          ride._id,
                          ride.tripId._id,
                          "Completed",
                          ride.token,
                          ride.PassengerId.notificationToken
                        )
                      }
                    >
                      <Text color="white">End Trip</Text>
                    </Button>
                  )}
                </Center>
              </Stack>
            </Box>
          </Box>

          // <Box key={ride._id} mb={5} mx={5}>
          //   <Stack
          //     direction={"column"}
          //     alignItems="center"
          //     bg={"#F0F8FF"}
          //     space={2}
          //     borderRadius={10}
          //     p={5}
          //   >
          //     <Image
          //       source={{
          //         uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
          //       }}
          //       alt="Alternate Text"
          //       size={"xl"}
          //       borderRadius={100}
          //       bg="red.100"
          //     />

          //     <Text fontSize={25}>{ride.vehicleNumber}</Text>
          //     <Text fontSize={18} fontWeight="bold">
          //       <FontAwesome name="rupee" size={18} color="black" />
          //       {ride.amount}
          //     </Text>
          //     <Box justifyContent={"flex-start"}>
          //       <Box>
          //         <Text fontSize={18} fontWeight="bold">
          //           From:
          //         </Text>
          //         <Text fontSize={15}>{ride.source}</Text>
          //       </Box>
          //       <Box>
          //         <Text fontSize={18} fontWeight="bold">
          //           To:
          //         </Text>
          //         <Text fontSize={15}>{ride.destination}</Text>
          //         <Text fontSize={18} fontWeight="bold">
          //           Seats:
          //         </Text>
          //         <Text fontSize={15}>{ride.availableSeats}</Text>
          //       </Box>
          //     </Box>
          //   </Stack>
          // </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"}>
        <Box mt={2}>
          {allRides.length ? (
            allUserRides()
          ) : (
            <Box flex={1} justifyContent="center" alignItems={"center"}>
              <Text>No Rides!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default Rides;
