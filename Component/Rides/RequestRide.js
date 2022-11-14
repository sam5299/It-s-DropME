import React, { useState, useEffect, useContext } from "react";
import { Alert as NewAlert } from "react-native";
import {
  Box,
  Text,
  Stack,
  Image,
  Button,
  ScrollView,
  Input,
  Spinner,
  useToast,
  AspectRatio,
  HStack,
  Heading,
  Divider,
  Center,
} from "native-base";
import {
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

const RequestRides = ({ navigation }) => {
  const [allRides, setUserRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [token, setToken] = useState(null);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const toast = useToast();
  const isFocused = useIsFocused();

  //temp variable for rerender logic
  let [tempRerender, setTempRerender] = useState(false);

  const showConfirmDialog = async (rideId, amount) => {
    let message = "";
    try {
      const isBooked = await axios.get(url + `/ride/checkIsBooked/${rideId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (isBooked.data)
        message = `Canceling a ride will reduce your safety points by ${parseInt(
          amount * 0.1
        )}.\nDo you want to cancel the ride?`;
      else message = "Do you want to cancel the ride?";
    } catch (error) {
      console.log("Check is booked ride Exception: ", error.response.data);
      setShowRides(false);
    }

    return NewAlert.alert("Are your sure?", message, [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          cancelRide(rideId);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]);
  };

  async function cancelRide(rideId) {
    try {
      const cancelRide = await axios.put(
        url + `/ride/cancelRide/${rideId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      let filteredData = [];
      allRides.forEach((ride) => {
        if (ride._id != rideId) {
          filteredData.push(ride);
        }
      });
      //console.log(filteredData);
      setUserRides(filteredData);

      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Ride cancelled successfully</Text>
            </Box>
          );
        },
        placement: "top",
      });
    } catch (error) {
      console.log("Cancel ride Exception: ", error.response.data);
      setShowRides(false);
    }
  }

  let handleNotification = async (notification) => {
    console.log("handle notification called in RequestRide page..");
    setTempRerender(!tempRerender);
  };

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setToken(userDetails.userToken);
        const allRides = await axios.get(url + "/ride/getUserRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        if (mounted) {
          setUserRides(allRides.data);
          console.log("Available Rides");
          setShowRides(false);

          //push notification wala thing handle here
          Notifications.addNotificationReceivedListener(handleNotification);

          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });
        }
      } catch (error) {
        console.log("Rides Exception: ", error);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, [isFocused, tempRerender]);

  function allUserRides() {
    return (
      <ScrollView flex={1} mb="12%" w={"90%"}>
        {allRides.map((ride) => (
          <Box alignItems="center" key={ride._id} mt={7}>
            <Box
              rounded="lg"
              overflow="hidden"
              borderColor="coolGray.200"
              borderWidth="1"
              shadow={2}
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
                      uri: ride.Vehicle.vehicleImage,
                    }}
                    alt="image"
                    borderRadius={10}
                  />
                </AspectRatio>
              </Box>
              <Stack p="4" space={3}>
                <Center>
                  <Heading size="md" ml="-1">
                    {ride.vehicleNumber}
                  </Heading>
                </Center>

                <Text fontWeight="400">
                  <Text fontSize={15} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-arrow"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {ride.source}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-end"
                      size={18}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {ride.destination}</Text>
                </Text>
                <Stack space={2} direction={"row"}>
                  <MaterialCommunityIcons
                    name="calendar-arrow-right"
                    size={20}
                    color="green"
                  />
                  <Text fontSize={15}>{ride.date}</Text>
                </Stack>

                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="green">
                    Available seats:
                  </Text>
                  <Text fontSize={20} fontWeight={"bold"}>
                    {ride.availableSeats}
                  </Text>
                </Text>
                <Stack direction={"row"} justifyContent={"center"} space={4}>
                  <Button
                    mt={2}
                    px={6}
                    borderRadius={10}
                    bg={"green.600"}
                    onPress={() =>
                      navigation.navigate("ViewRequest", {
                        rideId: ride._id,
                        token,
                        amount: ride.amount,
                        name: ride.User.name,
                        vehicleNumber: ride.vehicleNumber,
                      })
                    }
                    isDisabled={
                      ride.availableSeats == 0 ||
                      ride.requestedTripList.length == 0
                        ? true
                        : false
                    }
                  >
                    <Text bold fontSize={12}>
                      View Request
                    </Text>
                  </Button>
                  <Button
                    mt={2}
                    px={6}
                    borderRadius={10}
                    bg={"#e8000d"}
                    isDisabled={ride.status == "Created" ? false : true}
                    onPress={() => showConfirmDialog(ride._id, ride.amount)}
                  >
                    <Text color={"white"} bold fontSize={12}>
                      Cancel Ride
                    </Text>
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Box>

          // <Box
          //   key={ride._id}
          //   my={5}
          //   mx={5}
          //   rounded="lg"
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
          //   <Stack
          //     direction={"column"}
          //     alignItems="center"
          //     space={2}
          //     borderRadius={10}
          //     p={5}
          //   >
          //     <Image
          //       source={{
          //         uri: ride.Vehicle.vehicleImage,
          //         //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
          //       }}
          //       alt="Alternate Text"
          //       size={"xl"}
          //       borderRadius={10}
          //       bg="red.100"
          //     />

          //     <Text fontSize={22}>{ride.vehicleNumber}</Text>
          //     {ride.amount > 0 ? (
          //       <Text fontSize={18} fontWeight="bold">
          //         <FontAwesome name="rupee" size={18} color="black" />
          //         {ride.amount}
          //       </Text>
          //     ) : (
          //       <Text fontSize={18} fontWeight="bold" color={"green.500"}>
          //         Free
          //       </Text>
          //     )}

          //     <Box justifyContent={"flex-start"}>
          //       <Box>
          //         <Text fontSize={18} fontWeight="bold">
          //           From:
          //         </Text>
          //         <Text fontSize={15}>{ride.source}</Text>
          //       </Box>
          //       <Box>
          //         <Text fontSize={18} fontWeight="bold" mt={2}>
          //           To:
          //         </Text>
          //         <Text fontSize={15}>{ride.destination}</Text>
          //       </Box>
          //       <Box mt={2}>
          //         <Text fontSize={18} fontWeight="bold">
          //           Date:
          //         </Text>
          //         <Text fontSize={15}>{ride.date}</Text>
          //       </Box>
          //       <Text fontSize={18} fontWeight="bold" mt={2}>
          //         Available Seats: {ride.availableSeats}
          //       </Text>
          //     </Box>
          //     {/* <Box display={"flex"} flexDirection={"row"} justifyContent={'space-around'}>

          //     </Box> */}
          //     <Stack direction={"row"} space={5}>
          //       <Button
          //         mt={2}
          //         px={5}
          //         bg={"#03c03c"}
          //         onPress={() =>
          //           navigation.navigate("ViewRequest", {
          //             rideId: ride._id,
          //             token,
          //             amount: ride.amount,
          //             name: ride.User.name,
          //             vehicleNumber: ride.vehicleNumber,
          //           })
          //         }
          //         isDisabled={
          //           ride.availableSeats == 0 ||
          //           ride.requestedTripList.length == 0
          //             ? true
          //             : false
          //         }
          //       >
          //         View Request
          //       </Button>

          //       <Button
          //         mt={2}
          //         px={5}
          //         bg={"#e8000d"}
          //         isDisabled={ride.status == "Created" ? false : true}
          //         onPress={() => showConfirmDialog(ride._id, ride.amount)}
          //       >
          //         Cancel Ride
          //       </Button>
          //     </Stack>
          //   </Stack>
          // </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems={"center"}
        bg={"#F0F8FF"}
      >
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#e7feff"}>
        <Box flex={1} mt={2}>
          {allRides.length > 0 ? (
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

export default RequestRides;
