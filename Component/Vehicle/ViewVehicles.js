//import { View,Alert } from "react-native";
import { React, useState, useEffect, useContext } from "react";
import { Alert as NewAlert } from "react-native";
import {
  Box,
  Stack,
  Image,
  Text,
  Button,
  ScrollView,
  Spinner,
  useToast,
} from "native-base";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const ViewVehicles = () => {
  const [vehicleDetails, setVehicle] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [fetching, setFetching] = useState(true);

  const isFocused = useIsFocused();
  //toast field
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    async function getVehicleDetails() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let result = await axios.get(url + "/vehicle/getVehicleList", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setVehicle(result.data);
          setToken(parseUser.userToken);
          console.log("Available Vehicles");
          setFetching(false);
        }
      } catch (error) {
        console.log("Exception in view vehicles", error.response.data);
        setFetching(false);
      }
    }

    getVehicleDetails();
    return () => (mounted = false);
  }, [isFocused]);

  const showConfirmDialog = (vehicle) => {
    return NewAlert.alert(
      "Are your sure?",
      `Do you really want to remove vehicle?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            removeVehicle(vehicle);
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

  async function removeVehicle(vehicle) {
    try {
      let result = await axios.delete(
        `${url}/vehicle/deleteVehicle/${vehicle.vehicleNumber}`,
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      );
      // setVehicle(newVehicle);
      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{result.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });

      let newVehicle = vehicleDetails.filter(
        (vehicleObj) => vehicleObj._id != vehicle._id
      );
      setVehicle(newVehicle);
    } catch (ex) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{ex.response.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });
      console.log(ex.response.data);
    }
  }

  function getVehicle() {
    return (
      <ScrollView mb="12%">
        {vehicleDetails.map((vehicle) => (
          <Stack
            key={vehicle._id}
            direction={"column"}
            m={5}
            alignItems={"center"}
            bg={"#F0F8FF"}
            p={5}
            rounded="lg"
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
            <Box>
              <Image
                source={{
                  uri: vehicle.vehicleImage,
                }}
                alt="Image not available"
                size={"2xl"}
                borderRadius={20}
              />
            </Box>
            <Text fontSize={20} fontWeight="bold" p={1}>
              {vehicle.vehicleName}
            </Text>
            <Text fontSize={20} fontWeight="bold" p={1}>
              {vehicle.vehicleNumber}
            </Text>
            <Box>
              <Button
                size="md"
                mt={5}
                onPress={() => {
                  showConfirmDialog(vehicle);
                }}
              >
                <Text fontSize={"lg"} color="white">
                  Remove vehicle
                </Text>
              </Button>
            </Box>
          </Stack>
        ))}
      </ScrollView>
    );
  }

  if (fetching) {
    return (
      <Box
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        bg="#F0F8FF"
      >
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} bg={"#e7feff"}>
        <Box flex={1} alignItems={"center"} justifyContent={"center"}>
          {vehicleDetails.length ? (
            getVehicle()
          ) : (
            <Text>Please add vehicle</Text>
          )}
          <Box></Box>
        </Box>
      </Box>
    );
  }
};

export default ViewVehicles;
