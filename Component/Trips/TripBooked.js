import { View, StyleSheet, ShadowPropTypesIOS } from "react-native";
import { Alert as NewAlert } from "react-native";
import React, { useState, useContext, useEffect } from "react";
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
  Modal,
} from "native-base";
import {
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  EvilIcons,
} from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

function TripBooked() {
  const [bookedTripList, setBookedTripList] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [showModal, setShowModal] = useState(false);
  const [isBookedTripFetchingDone, setIsBookedTripFetchDone] = useState(true);
  let [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const isFocused = useIsFocused();

  //toast field
  const toast = useToast();

  const [showButton, setShowButton] = useState(true);

  //trip token temp variable
  const [tripToken, setTripToken] = useState(0);

  const showConfirmDialog = (tripRideId, amount, notificationToken) => {
    return NewAlert.alert(
      "Are your sure?",
      `Canceling a trip reduce your credit points by Rs.${parseInt(
        amount * 0.1
      )}.\nDo you want to cancel the trip?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            CancelTrip(tripRideId, notificationToken);
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

  async function CancelTrip(tripRideId, notificationToken) {
    try {
      setIsButtonDisabled(true);
      console.log("notification token:", notificationToken);
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      //console.log("deleting booked ride");
      let result = await axios.delete(
        url + `/trip/deleteBookedTrip/${tripRideId}/${notificationToken}`,
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      let newBookedTripList = [];
      bookedTripList.forEach((trip) => {
        if (trip._id != tripRideId) {
          newBookedTripList.push(trip);
        }
      });
      setBookedTripList(newBookedTripList);
      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip Cancelled Successfully!</Text>
            </Box>
          );
        },
        placement: "top",
      });
    } catch (ex) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Exception in Trip Booked</Text>
            </Box>
          );
        },
        placement: "top",
      });
      console.log("Exception in TripBooked", ex.response.data);
    }
  }

  //handle upcoming push notification event disable the button will be disabled and shown as ride inititated
  let handleNotification = async (notification) => {
    console.log("handle notification called in Trip booked..");
    setShowButton(false);
  };

  useEffect(() => {
    let mounted = true;
    async function loadBookedList() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let result = await axios.get(url + "/trip/getBookedTrips", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        // console.log("result:", result.data);
        if (mounted) {
          console.log(" All Booked Trips");
          setBookedTripList(result.data);
          setToken(parseUser.userToken);
          setIsBookedTripFetchDone(false);

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
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsBookedTripFetchDone(false);
      }
    }

    loadBookedList();
    return () => (mounted = false);
  }, [isFocused]);

  function getBookedTrips() {
    return (
      <ScrollView w={"85%"} bg={"#e7feff"} mb="12%">
        {bookedTripList.map((trip) => (
          <Box alignItems="center" key={trip._id} my={7} flex={1}>
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
              {showModal ? (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                  <Modal.Content width={"90%"} p={2}>
                    <Modal.CloseButton />
                    <Modal.Header>
                      <Text fontWeight={"bold"} fontSize={20}>
                        Rider Details
                      </Text>
                    </Modal.Header>
                    <ScrollView>
                      <Stack
                        direction={"column"}
                        alignItems={"center"}
                        space={2}
                      >
                        <Image
                          source={{
                            uri: trip.RaiderId.profile,
                          }}
                          alt="image not available"
                          size="xl"
                          borderRadius={100}
                        />
                        <Text fontWeight={"bold"} fontSize={20}>
                          {trip.RaiderId.name}
                        </Text>
                        <Stack direction={"column"} space={3}>
                          <Stack space={2} direction={"row"}>
                            <AntDesign name="mobile1" size={20} color="green" />
                            <Text fontSize={18}>
                              {trip.RaiderId.mobileNumber}
                            </Text>
                          </Stack>

                          <Stack space={2} direction={"row"}>
                            <FontAwesome name="car" size={20} color="green" />
                            <Text fontSize={18}>{trip.vehicleNumber}</Text>
                          </Stack>

                          <Stack space={2} direction={"row"}>
                            <MaterialCommunityIcons
                              name="keyboard"
                              size={25}
                              color="green"
                            />
                            <Text fontSize={18}>{trip.token}</Text>
                          </Stack>

                          <Center
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                          >
                            {trip.amount > 0 ? (
                              <>
                                <FontAwesome
                                  name="rupee"
                                  size={19}
                                  color="green"
                                />
                                <Text color={"green.700"} fontSize={20} bold>
                                  {trip.amount}
                                </Text>
                              </>
                            ) : (
                              <Text color={"green.800"} fontSize={20}>
                                Free
                              </Text>
                            )}
                          </Center>

                          {showButton && trip.status === "Booked" ? (
                            <Button
                              size={"lg"}
                              bg={"#e8000d"}
                              px={5}
                              borderRadius={10}
                              disabled={isButtonDisabled}
                              onPress={() => {
                                showConfirmDialog(
                                  trip._id,
                                  trip.amount,
                                  trip.RaiderId.notificationToken
                                );
                              }}
                            >
                              <Text color={"white"} bold fontSize={15}>
                                Cancel trip
                              </Text>
                            </Button>
                          ) : (
                            <Button size={"lg"} px={10} isDisabled={true}>
                              Trip initiated
                            </Button>
                          )}
                        </Stack>
                        {/* <Text style={styles.riderDetails}>
                          Vehicle Number: {trip.vehicleNumber}
                        </Text>
                        {trip.amount == 0 ? (
                          <Text color={"green.500"}>Free</Text>
                        ) : (
                          <Text
                            style={styles.riderDetails}
                            color={"green"}
                            fontSize={20}
                          >
                            <FontAwesome name="rupee" size={20} color="green" />
                            {trip.amount}
                          </Text>
                        )}
                        <Text style={styles.riderDetails}>
                          Token: {trip.token}
                        </Text> */}

                        {/* {trip.status === "Booked" ? (
                          <Button
                            size={"lg"}
                            bg={"#e8000d"}
                            px={5}
                            disabled={isButtonDisabled}
                            onPress={() => {
                              showConfirmDialog(
                                trip._id,
                                trip.amount,
                                trip.RaiderId.notificationToken
                              );
                            }}
                          >
                            Cancel trip
                          </Button>
                        ) : (
                          <Button size={"lg"} px={10} isDisabled={true}>
                            Trip initiated
                          </Button>
                        )} */}
                      </Stack>
                    </ScrollView>
                  </Modal.Content>
                </Modal>
              ) : null}

              <Stack p="4" space={3}>
                <Text fontWeight="400">
                  <Text fontSize={15} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-arrow"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}>{trip.tripId.source}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-end"
                      size={18}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.tripId.destination}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    <Ionicons
                      name="ios-location-outline"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.tripId.pickupPoint}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold">
                    <EvilIcons name="calendar" size={20} color="green" />
                  </Text>
                  <Text fontSize={15}>
                    {trip.tripId.date}:{trip.tripId.time}
                  </Text>
                </Text>
                <Button
                  borderRadius={10}
                  size={"md"}
                  px={10}
                  disabled={isButtonDisabled}
                  onPress={() => setShowModal(true)}
                >
                  Show More
                </Button>
              </Stack>
            </Box>
          </Box>

          // <Box
          //   key={trip._id}
          //   display={"flex"}
          //   flexDirection={"column"}
          //   borderRadius={10}
          //   my={5}
          //   p={5}
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
          //   {showModal ? (
          //     <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          //       <Modal.Content width={"90%"} p={2}>
          //         <Modal.CloseButton />
          //         <Modal.Header>
          //           <Text fontWeight={"bold"} fontSize={20}>
          //             Rider Details
          //           </Text>
          //         </Modal.Header>
          //         <ScrollView>
          //           <Stack direction={"column"} alignItems={"center"} space={2}>
          //             <Image
          //               source={{
          //                 uri: trip.RaiderId.profile,
          //               }}
          //               alt="image not available"
          //               size="xl"
          //               borderRadius={100}
          //             />
          //             <Text style={styles.riderDetails}>
          //               {trip.RaiderId.name}
          //             </Text>
          //             <Text style={styles.riderDetails}>
          //               Mobile Number: {trip.RaiderId.mobileNumber}
          //             </Text>
          //             <Text style={styles.riderDetails}>
          //               Vehicle Number: {trip.vehicleNumber}
          //             </Text>
          //             {trip.amount == 0 ? (
          //               <Text color={"green.500"}>Free</Text>
          //             ) : (
          //               <Text style={styles.riderDetails} color={"green.500"}>
          //                 Amount: {trip.amount}
          //               </Text>
          //             )}
          //             <Text style={styles.riderDetails}>
          //               Token: {trip.token}
          //             </Text>

          //             {trip.status === "Booked" ? (
          //               <Button
          //                 size={"lg"}
          //                 bg={"#e8000d"}
          //                 px={5}
          //                 disabled={isButtonDisabled}
          //                 onPress={() => {
          //                   showConfirmDialog(
          //                     trip._id,
          //                     trip.amount,
          //                     trip.RaiderId.notificationToken
          //                   );
          //                 }}
          //               >
          //                 Cancel trip
          //               </Button>
          //             ) : (
          //               <Button size={"lg"} px={10} isDisabled={true}>
          //                 Trip initiated
          //               </Button>
          //             )}
          //           </Stack>
          //         </ScrollView>
          //       </Modal.Content>
          //     </Modal>
          //   ) : null}
          //   <Box>
          //     <Stack direction={"column"} space={2}>
          //       <Text style={styles.details}>Source: </Text>
          //       <Text style={styles.TripDetails}>{trip.tripId.source}</Text>
          //       <Text style={styles.details}>Destination :</Text>
          //       <Text style={styles.TripDetails}>
          //         {trip.tripId.destination}
          //       </Text>
          //       <Text style={styles.details}>Pickup Point:</Text>
          //       <Text style={styles.TripDetails}>
          //         {trip.tripId.pickupPoint}
          //       </Text>
          //       <Text style={styles.details}>Date: </Text>
          //       <Text style={styles.TripDetails}>
          //         {trip.tripId.date} : {trip.tripId.time}
          //       </Text>
          //       <Button
          //         size={"md"}
          //         px={10}
          //         disabled={isButtonDisabled}
          //         onPress={() => setShowModal(true)}
          //       >
          //         Show More
          //       </Button>
          //     </Stack>
          //   </Box>
          // </Box>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box flex={1} alignItems={"center"} bg={"#e7feff"}>
      {isBookedTripFetchingDone ? (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          <Spinner size="lg" />
        </Box>
      ) : bookedTripList.length ? (
        getBookedTrips()
      ) : (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          No trips found
        </Box>
      )}
      {/* {getBookedTrips()}{" "} */}
    </Box>
  );
}

export default TripBooked;

const styles = StyleSheet.create({
  details: {
    fontSize: 18,
    fontWeight: "bold",
  },
  riderDetails: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 3,
  },
  TripDetails: { fontSize: 15 },
});
