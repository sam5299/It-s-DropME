import { View } from "react-native";
import React, { useContext, useEffect, useReducer, useState } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import PickupPoint from "../Component/BookRide/PickupPoint";
import {
  Button,
  FormControl,
  Text,
  Slider,
  Box,
  WarningOutlineIcon,
  ScrollView,
  useToast,
} from "native-base";
import { useValidation } from "react-native-form-validator";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";

const initialState = {
  source: "",
  s_lat: null,
  s_lon: null,
  destination: "",
  d_lat: null,
  d_lon: null,
  date: "",
  time: "",
  pickupPoint: "",
  seats: "1",
  distance: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "source":
      return {
        ...state,
        source: action.payload,
      };
    case "s_lat":
      return {
        ...state,
        s_lat: action.payload,
      };
    case "s_lon":
      return {
        ...state,
        s_lon: action.payload,
      };
    case "destination":
      return {
        ...state,
        destination: action.payload,
      };
    case "d_lat":
      return {
        ...state,
        d_lat: action.payload,
      };
    case "d_lon":
      return {
        ...state,
        d_lon: action.payload,
      };
    case "date":
      return {
        ...state,
        date: action.payload,
      };
    case "time":
      return {
        ...state,
        time: action.payload,
      };
    case "pickupPoint":
      return {
        ...state,
        pickupPoint: action.payload,
      };
    case "seats":
      return {
        ...state,
        seats: action.payload,
      };
    case "distance":
      return {
        ...state,
        distance: action.payload,
      };
    default:
      return {
        source: "",
        destination: "",
        date: "",
        time: "",
        pickupPoint: "",
        seats: "1",
        distance: null,
      };
  }
};

const BookRide = ({ route, navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gender, setGender] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  const todaysDate = new Date();

  const { source, destination, pickupPoint } = state;
  const { validate, isFieldInError } = useValidation({
    state: { source, destination, pickupPoint },
  });

  //handle push notification thing
  let handleNotificationResponse = (response) => {
    console.log("handle notification response called in book ride..");
    let notificationType =
      response.notification.request.content.data.notificationType;
    console.log("notification object in book ride.js:", notificationType);
    if (notificationType != "Login") {
      navigation.navigate("Slide", {
        notificationType: notificationType,
      });
    } //else {
    // navigation.navigate("Slide",{
    //   notificationType:notificationType
    //  });
    //}
  };

  useEffect(() => {
    let mounted = true;
    const bookRide = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        if (mounted) {
          setGender(userDetails.gender);
          setToken(userDetails.userToken);

          let hours = todaysDate.getHours();
          let minutes = todaysDate.getMinutes();
          let ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;

          const time = `${hours}:${minutes}:${ampm}`;

          dispatch({ type: "date", payload: todaysDate.toDateString() });
          dispatch({ type: "time", payload: time });
          //handling notification
          Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
          );
        }
      } catch (error) {
        console.log("BookRide: ", error.response.data);
      }
    };
    bookRide();
    return () => (mounted = false);
  }, []);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const handleForm = async () => {
    let isTrue = validate({
      source: { required: true },
      destination: { required: true },
      pickupPoint: { required: true },
    });
    if (state.source === state.destination) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Source and destination cannot be same</Text>
            </Box>
          );
        },
        placement: "top",
      });
      setLoading(false);
      return;
    }
    if (isTrue) {
      setLoading(true);
      try {
        const result = await axios.get(
          `${url}/map/api/reverseCoding/${state.s_lat}/${state.s_lon}`
        );
        const result2 = await axios.get(
          `${url}/map/api/reverseCoding/${state.d_lat}/${state.d_lon}`
        );

        //call direction api and send lon1,lat1;lon2,lat2
        let newResult = await axios.get(
          `${url}/map/api/directionApi/${state.s_lon}/${state.s_lat}/${state.d_lon}/${state.d_lat}`
        );
        //console.log("distance:" + parseFloat(newResult.data));
        dispatch({ type: "distance", payload: newResult.data });
        // console.log(state);
        setLoading(false);
      } catch (error) {
        console.log("exception Book Ride");
        console.log(error);
        setLoading(false);
      }
      setLoading(false);
      navigation.navigate("Available Rides", { ...state, gender, token });
    }
  };

  return (
    <Box flex={1} bg={"#e7feff"} justifyContent="center">
      <Box
        bg="white"
        py={"5"}
        mx={2}
        borderRadius="10"
        borderWidth={1}
        borderColor={"white"}
        shadow={3}
      >
        <ScrollView>
          <FormControl p={1}>
            <SourceDestination dispatch={dispatch} />
            <Box flexDirection={"row"} justifyContent="space-around">
              {isFieldInError("source") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter source field
                </FormControl.ErrorMessage>
              )}
              {isFieldInError("destination") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter destination field
                </FormControl.ErrorMessage>
              )}
            </Box>
            <DateTime dispatch={dispatch} />
            <PickupPoint dispatch={dispatch} />
            <Box ml={4}>
              {isFieldInError("pickupPoint") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter Pickup Point
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box mt={5} alignItems={"center"}>
              <Text textAlign="center">Selected Seats: {state.seats}</Text>
              <Slider
                isDisabled={false}
                mt={"2"}
                w="300"
                maxW="300"
                defaultValue={1}
                minValue={1}
                maxValue={8}
                accessibilityLabel="Available Seats"
                step={1}
                onChange={(v) => dispatch({ type: "seats", payload: v })}
              >
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
            </Box>
            <Button
              borderRadius={10}
              isLoading={isLoading}
              isLoadingText="Searching for rides.."
              size="md"
              mt={"5"}
              w="95%"
              ml={2}
              onPress={handleForm}
            >
              <Text fontSize={"lg"} color="white">
                Search Rides
              </Text>
            </Button>
          </FormControl>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default BookRide;
