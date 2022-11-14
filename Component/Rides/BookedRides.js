import { React, useState, useEffect, useContext } from "react";
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

import { Alert as NewAlert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
import { useIsFocused } from "@react-navigation/native";

const BookedRides = ({ navigation }) => {
  const [bookedRides, setBookedRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [userToken, setToken] = useState(null);
  const [passengerToken, setPassengerToken] = useState("");
  const [isTripStarted, setStarted] = useState("No");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  //toast field
  const toast = useToast();

  const isFocused = useIsFocused();

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setToken(userDetails.userToken);
        const allRides = await axios.get(url + "/ride/getBookedRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        if (mounted) {
          setBookedRides(allRides.data);
          console.log("Booked Rides");
          setShowRides(false);
        }
      } catch (error) {
        console.log("Booked Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, [isTripStarted, isFocused]);

  const startTrip = async (
    tripRideId,
    tripId,
    status,
    token,
    notificationToken
  ) => {
    if (passengerToken === "" || passengerToken != token) {
      console.log(passengerToken);
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{"Invalid trip token!"}</Text>
            </Box>
          );
        },
        placement: "top",
      });
      return;
    }
    try {
      setIsButtonDisabled(true);
      //send notification to route in body
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, token, notificationToken },
        { headers: { "x-auth-token": userToken } }
      );
      setStarted("Accepted");

      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip initiated!</Text>
            </Box>
          );
        },
        placement: "top",
      });
      setIsButtonDisabled(false);
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>
                {"error.response.data in booked rides"}
              </Text>
            </Box>
          );
        },
        placement: "top",
      });
      setIsButtonDisabled(false);
      console.log("Booked Rides: ", error.response.data);
    }
  };

  const endTrip = async (
    tripRideId,
    tripId,
    status,
    token,
    notificationToken
  ) => {
    try {
      setIsButtonDisabled(true);
      //send notification to route in body
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, token, notificationToken },
        { headers: { "x-auth-token": userToken } }
      );

      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip successfully completed!</Text>
            </Box>
          );
        },
        placement: "top",
      });
      setStarted("Ended");
      setIsButtonDisabled(false);
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{error.response.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });
      setIsButtonDisabled(false);
      console.log("Booked Rides: ", error);
    }
  };

  const showConfirmDialog = (
    tripRideId,
    tripId,
    status,
    amount,
    notificationToken
  ) => {
    return NewAlert.alert(
      "Are your sure?",
      `Canceling a ride will reduce your safety points by ${parseInt(
        amount * 0.1
      )}.\nDo you want to cancel the ride?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            cancelTrip(tripRideId, tripId, status, notificationToken);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  const cancelTrip = async (tripRideId, tripId, status, notificationToken) => {
    // let inp = confirmDelete();
    // if(inp){
    try {
      //send notification to route in body
      setIsButtonDisabled(true);
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, notificationToken },
        { headers: { "x-auth-token": userToken } }
      );

      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip cancelled successfully!</Text>
            </Box>
          );
        },
        placement: "top",
      });
      let updatedRides = bookedRides.filter((ride) => ride._id != tripRideId);
      setBookedRides(updatedRides);
      setIsButtonDisabled(false);
      // setStarted("Ended");
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{error.response.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });
      console.log("Cancel Rides: ", error.response.data);
      setIsButtonDisabled(false);
    }
  };

  //function to compare rides date and today's date
  let dateCompare = (date) => {
    if (
      new Date(Date.parse(Date())).getDay() ===
        new Date(Date.parse(date)).getDay() &&
      new Date(Date.parse(Date())).getMonth() ===
        new Date(Date.parse(date)).getMonth() &&
      new Date(Date.parse(Date())).getFullYear() ===
        new Date(Date.parse(date)).getFullYear()
    ) {
      return true;
    }
    return false;
  };

  function allUserRides() {
    return (
      <ScrollView w={"90%"} mb={"10%"}>
        {bookedRides.map((ride) => (
          <Box alignItems="center" key={ride._id} my={7} flex={1}>
            <Box
              flex={1}
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
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="calendar-arrow-right"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}>
                    {dateCompare(ride.tripId.date)}
                    {ride.tripId.date}
                  </Text>
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
                        borderRadius={10}
                        isDisabled={
                          isButtonDisabled || !dateCompare(ride.tripId.date)
                        }
                        bg={"green.600"}
                        onPress={() =>
                          startTrip(
                            ride._id,
                            ride.tripId._id,
                            "Initiated",
                            ride.token,
                            ride.PassengerId.notificationToken
                          )
                        }
                        px={6}
                      >
                        <Text color="white" fontSize={15} bold>
                          Start Trip
                        </Text>
                      </Button>
                      <Button
                        borderRadius={10}
                        px={5}
                        bg={"#e8000d"}
                        isDisabled={isButtonDisabled}
                        variant="outline"
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
                        <Text color="white" fontSize={15} bold>
                          Cancel Trip
                        </Text>
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      bg={"green.600"}
                      w={"100%"}
                      borderRadius={10}
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

          //  <Box
          //   flex={1}
          //   my={5}
          //   key={ride._id}
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
          //   {/* {console.log(ride.PassengerId.notificationToken)} */}
          //   <Stack
          //     direction={"column"}
          //     alignItems="center"
          //     space={2}
          //     borderRadius={10}
          //     p={5}
          //   >
          //     <Image
          //       source={{
          //         uri: ride.PassengerId.profile,
          //         //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
          //       }}
          //       alt="Alternate Text"
          //       size={"xl"}
          //       borderRadius={100}
          //       bg="red.100"
          //     />
          //     <Text fontSize={18} fontWeight="bold">
          //       {ride.PassengerId.name}
          //     </Text>
          //     <Stack justifyContent={"flex-start"} space={1}>
          //       <Text fontSize={18} fontWeight="bold">
          //         From:
          //       </Text>
          //       <Text fontSize={15}>{ride.tripId.source}</Text>
          //       <Text fontSize={18} fontWeight="bold">
          //         To:
          //       </Text>
          //       <Text fontSize={15}>{ride.tripId.destination}</Text>

          //       <Text fontSize={18} fontWeight="bold">
          //         Mobile No:
          //       </Text>
          //       <Text fontSize={15}>{ride.PassengerId.mobileNumber}</Text>
          //       <Text fontSize={18} fontWeight="bold">
          //         Pickup Point:
          //       </Text>
          //       <Text fontSize={15}>{ride.tripId.pickupPoint}</Text>
          //     </Stack>
          //     <Input
          //       isDisabled={ride.status === "Booked" ? false : true}
          //       maxLength={6}
          //       variant={"outline"}
          //       keyboardType="numeric"
          //       placeholder="Enter the token"
          //       onChangeText={(value) => setPassengerToken(value)}
          //     />

          //     <Divider color={"black"} mb={2} />
          //     {ride.status === "Booked" ? (
          //       <Stack direction={"row"} space={5} mt={2}>
          //         <Button
          //           isDisabled={isButtonDisabled}
          //           bg={"#03c03c"}
          //           onPress={() =>
          //             startTrip(
          //               ride._id,
          //               ride.tripId._id,
          //               "Initiated",
          //               ride.token,
          //               ride.PassengerId.notificationToken
          //             )
          //           }
          //           px={5}
          //         >
          //           <Text color="white"> Start Trip</Text>
          //         </Button>
          //         <Button
          //           px={5}
          //           bg={"#e8000d"}
          //           isDisabled={isButtonDisabled}
          //           onPress={() =>
          //             showConfirmDialog(
          //               ride._id,
          //               ride.tripId._id,
          //               "Cancelled",
          //               ride.amount,
          //               ride.PassengerId.notificationToken
          //             )
          //           }
          //         >
          //           <Text color="white">Cancel Trip</Text>
          //         </Button>
          //       </Stack>
          //     ) : (
          //       <Button
          //         bg={"#03c03c"}
          //         w={"100%"}
          //         onPress={() =>
          //           endTrip(ride._id, ride.tripId._id, "Completed", ride.token,ride.PassengerId.notificationToken)
          //         }
          //       >
          //         <Text color="white">End Trip</Text>
          //       </Button>
          //     )}
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
        {bookedRides.length ? (
          allUserRides()
        ) : (
          <Box
            flex={1}
            justifyContent="center"
            alignItems={"center"}
            bg={"#e7feff"}
          >
            <Text>No Booked Rides</Text>
          </Box>
        )}
      </Box>
    );
  }
};

export default BookedRides;
