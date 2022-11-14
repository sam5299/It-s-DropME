// Vehicle, Vehicle Class and Vehicle Type

import { Text } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Select, Slider } from "native-base";
import axios from "axios";
import { AuthContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VehicleAndClass = ({ dispatch }) => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [vehicleClass, setVehicleClass] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [availableCapacity, setavailableCapacity] = useState(1);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const vehicleCapacity = (v) => {
    const seats = Math.floor(v);
    setCapacity(seats);
    dispatch({ type: "availableSeats", payload: seats });
  };

  useEffect(() => {
    let mounted = true;
    const getVehicles = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        const userToken = parseUser.userToken;
        const list = await axios.get(url + "/vehicle/getVehicleList", {
          headers: { "x-auth-token": userToken },
        });
        if (mounted) {
          setVehicles(list.data);
        }
      } catch (error) {
        console.log("no vehicle found error:", error);
      }
    };
    getVehicles();
    return () => (mounted = false);
  }, [vehicles.length]);

  return (
    <Box>
      <Box mt={5} ml={3} alignItems="center" justifyContent="center">
        <Select
          mr="1"
          w="100%"
          selectedValue={vehicle}
          placeholder={
            vehicles.length
              ? vehicle == ""
                ? "Select Vehicle"
                : vehicle
              : "Please Add Vehicle"
          }
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
          <Select.Item label="Select Vehicle" disabled={true} />
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
};

export default VehicleAndClass;
