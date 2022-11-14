import { View } from "react-native";
import React, { useContext, useEffect, useReducer, useState } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import VehicleAndClass from "../Component/VehicleAndClass";
import RideForType from "../Component/RideForType";
import {
  Box,
  Button,
  FormControl,
  ScrollView,
  Text,
  WarningOutlineIcon,
  useToast,
  Select,
  Slider,
  Spinner,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { AuthContext } from "../Component/Context";
import { useValidation } from "react-native-form-validator";
import { useIsFocused } from "@react-navigation/native";

const initialState = {
  source: "",
  s_lat: null,
  s_lon: null,
  destination: "",
  d_lat: null,
  d_lon: null,
  date: "",
  time: "",
  Vehicle: "",
  vehicleNumber: null,
  availableSeats: "1",
  rideFor: "Both",
  rideType: "Paid",
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
    case "Vehicle":
      return {
        ...state,
        Vehicle: action.payload,
      };
    case "vehicleNumber":
      return {
        ...state,
        vehicleNumber: action.payload,
      };
    case "availableSeats":
      return {
        ...state,
        availableSeats: action.payload,
      };
    case "rideFor":
      return {
        ...state,
        rideFor: action.payload,
      };
    case "rideType":
      return {
        ...state,
        rideType: action.payload,
      };
    default:
      return {
        source: "",
        destination: "",
        date: "",
        time: "",
        Vehicle: "",
        vehicleNumber: null,
        availableSeats: "1",
        rideFor: "Both",
        rideType: "Paid",
      };
  }
};

const CreateRide = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gender, setGender] = useState("");
  const [userToken, setToken] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(true);

  // vehicle and class states
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [availableCapacity, setavailableCapacity] = useState(1);

  // set vehicle capacity
  const vehicleCapacity = (v) => {
    const seats = Math.floor(v);
    setCapacity(seats);
    dispatch({ type: "availableSeats", payload: seats });
  };

  const isFocused = useIsFocused();

  const todaysDate = new Date();

  const toast = useToast();
  const { source, destination, Vehicle } = state;
  const { validate, isFieldInError } = useValidation({
    state: { source, destination, Vehicle },
  });

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  let registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };
  let handleNotificationResponse = (response) => {
    console.log("handle notification response called in create ride..");
    let notificationType =
      response.notification.request.content.data.notificationType;
    //console.log("notification type:",notificationType);
    if (notificationType != "Login") {
      //console.log("navigating to slide");
      navigation.navigate("Slide", {
        notificationType: notificationType,
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    const createRide = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setGender(userDetails.gender);
        const list = await axios.get(url + "/vehicle/getVehicleList", {
          headers: { "x-auth-token": userDetails.userToken },
        });
        if (mounted) {
          setVehicles(list.data);
          setToken(userDetails.userToken);

          let hours = todaysDate.getHours();
          let minutes = todaysDate.getMinutes();
          let ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;

          const time = `${hours}:${minutes}:${ampm}`;

          dispatch({ type: "date", payload: todaysDate.toDateString() });
          dispatch({ type: "time", payload: time });
          setPageLoaded(false);
        }
        registerForPushNotificationsAsync();
        //Notifications.addNotificationReceivedListener(handleNotification);

        Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
      } catch (error) {
        console.log("in catch of createRide");
        console.log(error);
        setPageLoaded(false);
      }
    };
    createRide();
    return () => (mounted = false);
  }, [isFocused]);

  const handleForm = async () => {
    setLoading(true);
    let isTrue = validate({
      source: { required: true },
      destination: { required: true },
      Vehicle: { required: true },
    });
    if (isTrue) {
      if (state.source === state.destination) {
        toast.show({
          render: () => {
            return (
              <Box bg="red.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>
                  Source and destination cannot be same
                </Text>
              </Box>
            );
          },
          placement: "top",
        });
        setLoading(false);
        return;
      }

      let distance = 0;
      try {
        //call api to get exact latitude longitude of source,destination lat,log
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
          //console.log("185" + typeof newResult.data);

          // state.distance = newResult.data;
          console.log(
            "distance between two places:" + typeof newResult.data[0]
          );
          distance = newResult.data[0];
          // distance = newResult.data;
          // dispatch({ type: "distance", payload: newResult.data });
        } catch (error) {
          console.log("exception is here..");
          console.log(error.response.data);
        }
        //state.distance = parseFloat(state.distance);
        const result = await axios.post(
          url + "/ride/createRide",
          { ...state, distance },
          { headers: { "x-auth-token": userToken } }
        );

        setLoading(false);

        toast.show({
          render: () => {
            return (
              <Box bg="green.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>Ride Created Successfully..!</Text>
              </Box>
            );
          },
          placement: "top",
        });
      } catch (error) {
        // console.log("While creating ride", error.response.data);
        setLoading(false);
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
      }
    }
    setLoading(false);
  };

  const VehiclenClass = (
    <Box>
      <Box mt={5} ml={3} alignItems="center" justifyContent="center">
        <Select
          mr="1"
          w="100%"
          backgroundColor={"white"}
          selectedValue={vehicle}
          placeholder={
            vehicles.length
              ? vehicle == ""
                ? "Select Vehicle"
                : vehicle
              : "Please Add Vehicle"
          }
          // isDisabled={vehicles.length ? false : true}
          onValueChange={(itemValue) => {
            setVehicle(itemValue.vehicleName);
            setVehicleClass(itemValue.vehicleClass);
            setavailableCapacity(itemValue.seatingCapacity);
            if (itemValue.seatingCapacity === 1) {
              setCapacity(1);
            }
            dispatch({ type: "Vehicle", payload: itemValue._id });
            dispatch({
              type: "vehicleNumber",
              payload: itemValue.vehicleNumber,
            });
          }}
        >
          {vehicles.map((item) => (
            <Select.Item
              shadow={2}
              key={item._id}
              label={item.vehicleName}
              value={item}
            />
          ))}
        </Select>
      </Box>
      <Box mt={5} alignItems={"center"}>
        <Text textAlign="center">Available Seats: {capacity}</Text>
        <Slider
          isDisabled={availableCapacity === 1 ? true : false}
          mt={"2"}
          w="300"
          maxW="300"
          defaultValue={1}
          minValue={1}
          maxValue={availableCapacity}
          accessibilityLabel="Available Seats"
          step={1}
          onChange={(v) => {
            vehicleCapacity(v);
          }}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
      </Box>
    </Box>
  );

  if (pageLoaded) {
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
            <FormControl>
              <SourceDestination dispatch={dispatch} />
              <Box
                ml="5"
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                {isFieldInError("source") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please Enter Source
                  </FormControl.ErrorMessage>
                )}
                {isFieldInError("destination") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please Enter Destination
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <DateTime dispatch={dispatch} />
              {VehiclenClass}
              <Box ml={5}>
                {isFieldInError("Vehicle") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please Select Vehicle
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <RideForType type={{ dispatch: dispatch, rideFor: gender }} />
              <Button
                borderRadius={10}
                isLoading={isLoading}
                isLoadingText="Creating ride.."
                size="md"
                mt={"5"}
                w="95%"
                ml={2}
                onPress={handleForm}
              >
                <Text fontSize={"lg"} color="white">
                  Create Ride
                </Text>
              </Button>
            </FormControl>
          </ScrollView>
        </Box>
      </Box>
    );
  }
};

export default CreateRide;
