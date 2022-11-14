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

function RequestedTrips() {
  const [requestedTripList, setRequestedTripList] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [showModal, setShowModal] = useState(false);
  const [isRequestedTripFetchingDone, setIsRequestedTripFetchDone] =
    useState(true);
  let [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //toast field
  const toast = useToast();

  const showConfirmDialog = (tripId) => {
    return NewAlert.alert(
      "Are your sure?",
      `Do you really want to cancel the trip?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            CancelRequest(tripId);
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

  async function CancelRequest(tripId) {
    try {
      setIsButtonDisabled(true);
      // const User = await AsyncStorage.getItem("User");
      // const parseUser = JSON.parse(User);
      //console.log("deleting booked ride");
      let result = await axios.put(
        url + `/trip/cancelTrip/`,
        { tripId },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      );
      let newrequestedTripList = [];
      requestedTripList.forEach((trip) => {
        if (trip._id != tripId) {
          newrequestedTripList.push(trip);
        }
      });
      setRequestedTripList(newrequestedTripList);
      setIsButtonDisabled(false);

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
              <Text fontSize={"15"}>Exception in requested Trip </Text>
            </Box>
          );
        },
        placement: "top",
      });
      console.log("Exception in TripBooked", ex.response.data);
    }
  }
  useEffect(() => {
    let mounted = true;
    async function loadRequestedList() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let result = await axios.get(url + "/trip/getUserRequestedTrip", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        // console.log("result:", result.data);
        if (mounted) {
          console.log(" All requested Trips");
          setRequestedTripList(result.data);
          setToken(parseUser.userToken);
          setIsRequestedTripFetchDone(false);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsRequestedTripFetchDone(false);
      }
      return () => (mounted = false);
    }

    loadRequestedList();
    return () => (mounted = false);
  }, []);

  function getBookedTrips() {
    return (
      <ScrollView w={"85%"} bg={"#e7feff"} mb={"15%"}>
        {requestedTripList.map((trip) => (
          // console.log(trip.amount)
          <Box
            key={trip._id}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={10}
            my={5}
            p={5}
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
            <Box>
              <Stack p="4" space={3}>
                <Text fontWeight="400">
                  <Text fontSize={15} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-arrow"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}>{trip.source}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold" color="black">
                    <MaterialCommunityIcons
                      name="ray-start-end"
                      size={18}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.destination}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={18} fontWeight="bold" color="black">
                    <Ionicons
                      name="ios-location-outline"
                      size={20}
                      color="green"
                    />
                  </Text>
                  <Text fontSize={15}> {trip.pickupPoint}</Text>
                </Text>
                <Text fontWeight="400">
                  <Text fontSize={20} fontWeight="bold">
                    <EvilIcons name="calendar" size={20} color="green" />
                  </Text>
                  <Text fontSize={15}>
                    {trip.date} {trip.time}
                  </Text>
                </Text>
                <Button
                  borderRadius={10}
                  size={"md"}
                  px={10}
                  bg={"#e8000d"}
                  onPress={() => showConfirmDialog(trip._id)}
                  isDisabled={isButtonDisabled}
                >
                  <Text bold color={"white"}>
                    Cancel Request
                  </Text>
                </Button>
              </Stack>

              {/* <Stack direction={"column"} space={2}>
                <Text style={styles.details}>Source: </Text>
                <Text style={styles.TripDetails}>{trip.source}</Text>
                <Text style={styles.details}>Destination :</Text>
                <Text style={styles.TripDetails}>{trip.destination}</Text>
                <Text style={styles.details}>Pickup Point:</Text>
                <Text style={styles.TripDetails}>{trip.pickupPoint}</Text>
                <Text style={styles.details}>Date: </Text>
                <Text style={styles.TripDetails}>
                  {trip.date} : {trip.time}
                </Text>
                <Button
                  size={"md"}
                  px={10}
                  bg={"red.500"}
                  onPress={() => showConfirmDialog(trip._id)}
                  isDisabled={isButtonDisabled}
                >
                  Cancel Request
                </Button>
              </Stack> */}
            </Box>
          </Box>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box flex={1} alignItems={"center"} bg={"#e7feff"}>
      {isRequestedTripFetchingDone ? (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          <Spinner size="lg" />
        </Box>
      ) : requestedTripList.length ? (
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

export default RequestedTrips;

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
