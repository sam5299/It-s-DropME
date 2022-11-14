import { TouchableHighlight } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
  Spinner,
  Heading,
  Select,
  Radio,
  CheckIcon,
  Slider,
  Avatar,
  ScrollView,
} from "native-base";

import { useValidation } from "react-native-form-validator";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

const AddVehicle = ({ route, navigation }) => {
  let [Picture, setPic] = useState(null);
  const [pictureError, setPictureError] = useState(false);
  let [vehicleType, setVehicleType] = useState("Bike");
  let [vehicleClass, setVehicleClass] = useState("");
  let [vehicleNumber, setVehicleNumber] = useState("");
  let [vehicleName, setVehicleName] = useState("");
  let [fuelType, setFuelType] = useState("");
  let [seatingCapacity, setSeatingCapacity] = useState(1);
  let [fuelTypeArray, setFuelTypeArray] = useState(["Petrol", "Electric"]);
  let [vehicleClassArray, setVehicleClassArray] = useState([
    "Normal Bike",
    "Sport Bike",
    "Scooter",
  ]);
  let FuelTypeArray = ["Petrol", "Diesel", "CNG", "Electric"];
  const [isLoading, setIsLoading] = useState(false);

  const [errorVehicleNumber, setErrorVehicleNumber] = useState(false);

  const clearFields = () => {
    setPic(null);
    setVehicleType("Bike");
    setVehicleClass("");
    setVehicleNumber("");
    setVehicleName("");
    setFuelType("");
    setSeatingCapacity(1);
    setFuelTypeArray(["Petrol", "Electric"]);
    setVehicleClassArray(["Normal Bike", "Sport Bike", "Scooter"]);
    FuelTypeArray = ["Petrol", "Diesel", "CNG", "Electric"];
    setIsLoading(false);
    setPictureError(false);
  };

  if (route.params) {
    //console.log("params available..");
    clearFields();
    delete route.params;
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setErrorVehicleNumber(false);
    }

    return () => (mounted = false);
  }, [vehicleClass, slider, Picture]);

  //validation

  const { validate, isFieldInError } = useValidation({
    state: { vehicleClass, vehicleName, vehicleNumber, fuelType },
  });

  const handleAddVehicle = async () => {
    let isTrue = validate({
      vehicleName: { required: true },
      vehicleClass: { required: true },
      vehicleNumber: { minlength: 12, maxLength: 13, required: true },
      fuelType: { required: true },
    });
    let pattern = /^[A-Za-z]{2} [0-9]{2,3} [A-Za-z]{1,2} [0-9]{1,4}$/;
    // /^([A-Z]{2}\s{1}\d{2}\s{1}\[A-Z]{1,2}\s{1}\d{1,4})?([A-Z|a-z]{3}\s{1}\d{1,4})?$/;
    console.log("matching vehicle number");

    if (Picture === null) {
      console.log("Vehicle not available");
      setPictureError(true);
      if (!pattern.test(vehicleNumber)) setErrorVehicleNumber(true);
      return;
    } else {
      setPictureError(false);
    }
    if (!pattern.test(vehicleNumber)) {
      console.log("not matched");
      // isFieldInError.vehicleNumber = "Please enter valid vehicle number.";
      setErrorVehicleNumber(true);
      return;
    } else {
      setErrorVehicleNumber(false);
    }
    console.log(isTrue);

    if (isTrue) {
      console.log("Move to upload document");
      // navigation.setOptions = {
      //   clearFields: (props) => clearFields,
      // };
      navigation.navigate("UploadDocumentForVehicle", {
        Picture,
        vehicleType,
        vehicleClass,
        vehicleName,
        vehicleNumber: vehicleNumber.toUpperCase(),
        fuelType,
        seatingCapacity,
      });
    }
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });
    setPic(null);
    if (!result.cancelled) {
      setPic("data:image/png;base64," + result.base64);
    }
  };

  let selectForVehicleClass = (
    <Box w="3/4" maxW="400">
      <Select
        selectedValue={vehicleClass}
        minWidth="300"
        accessibilityLabel={`Choose ${vehicleType} Class`}
        placeholder={`Choose ${vehicleType} Class`}
        _selectedItem={{
          bg: "rgba(6,182,212,1.00)",
          endIcon: <CheckIcon size="5" />,
        }}
        mt={1}
        onValueChange={(itemValue) => {
          setVehicleClass(itemValue);
        }}
      >
        {vehicleClassArray.map((value) => (
          <Select.Item key={value} label={value} value={value} />
        ))}
      </Select>
      {isFieldInError("vehicleClass") && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          Please select vehicle class
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  let slider = (
    <Box alignItems={"center"}>
      <Text textAlign="center">
        Available Seats: {vehicleType === "Bike" ? 1 : seatingCapacity}
      </Text>
      <Slider
        isDisabled={vehicleType === "Bike" ? true : false}
        mt={"2"}
        w="300"
        maxW="300"
        defaultValue={seatingCapacity}
        minValue={1}
        maxValue={6}
        accessibilityLabel="Seating Capacity"
        step={1}
        onChange={(v) => {
          setSeatingCapacity(parseInt(v));
        }}
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
    </Box>
  );

  let buttonField = (
    <Stack direction={"row"} space="20" justifyContent={"center"}>
      <Button
        isLoading={isLoading}
        isLoadingText="Adding vehicle.."
        size="md"
        onPress={handleAddVehicle}
        px={5}
      >
        <Text fontSize={"lg"} color="white">
          Add Vehicle
        </Text>
      </Button>
    </Stack>
  );

  return (
    <ScrollView maxW="100%" h="80" bg={"#e7feff"} mt={"2"} mb="15%">
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        flex="1"
        bg={"#F0F8FF"}
      >
        <Box
          p={2}
          width={"90%"}
          rounded="lg"
          overflow="hidden"
          borderColor={"coolGray.200"}
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
          <FormControl justifyContent="center" alignItems={"center"}>
            <Box>
              <TouchableHighlight
                onPress={() => uploadImage()}
                // underlayColor="rgba(0,0,0,0)"
              >
                <Avatar
                  size="xl"
                  source={{
                    uri: Picture,
                  }}
                  borderRadius="100"
                  bg="white"
                  borderColor="gray.400"
                  borderWidth={0.5}
                >
                  <AntDesign
                    name="upload"
                    size={30}
                    color="rgba(6,182,212,0.70)"
                  />
                  {/* <MaterialCommunityIcons name="upload" size={30} /> */}
                  {/* <MaterialCommunityIcons name="cloudupload" size={30} /> */}
                  <Text fontSize={"sm"}>Upload Image</Text>

                  {/* <Avatar.Badge bg="green.500" /> */}
                </Avatar>
              </TouchableHighlight>
            </Box>
            <Box>
              {pictureError && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Image required!
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Stack space={6} mt="2">
              <Radio.Group
                name="Vehicle Type"
                defaultValue="Bike"
                accessibilityLabel="Select Vehicle"
                onChange={(value) => {
                  //setPic(null);
                  clearFields();
                  setVehicleType(value);
                  if (value === "Bike") {
                    setFuelTypeArray(["Petrol", "Electric"]);

                    setVehicleClassArray([
                      "Normal Bike",
                      "Sport Bike",
                      "Scooter",
                    ]);
                  } else {
                    setFuelTypeArray(["Petrol", "Diesel", "CNG", "Electric"]);
                    setVehicleClassArray(["Hatch Back", "Sedan", "SUV"]);
                  }
                }}
              >
                <Stack
                  direction={{
                    base: "row",
                    md: "column ",
                  }}
                  mr="2"
                  ml={"22%"}
                  space={10}
                  maxW="300px"
                >
                  <Radio value="Bike" size="md">
                    Bike
                  </Radio>
                  <Radio value="Car" size="md">
                    Car
                  </Radio>
                </Stack>
              </Radio.Group>
              {selectForVehicleClass}
              {/* {vehicleType === "Bike" ? selectForBike : selectForCar} */}
              <Box>
                <Input
                  maxLength={50}
                  size={"md"}
                  w="100%"
                  InputLeftElement={
                    <Icon
                      as={<MaterialCommunityIcons name="car" />}
                      size={6}
                      ml="2"
                      color="rgba(6,182,212,1.00)"
                    />
                  }
                  placeholder="Vehicle Name"
                  value={vehicleName}
                  onChangeText={(value) => setVehicleName(value)}
                />
                {isFieldInError("vehicleName") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Vehicle name is required
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <Box>
                <Input
                  maxLength={13}
                  size={"md"}
                  w="100%"
                  InputLeftElement={
                    <Icon
                      as={<MaterialCommunityIcons name="card" />}
                      size={6}
                      ml="2"
                      color="rgba(6,182,212,1.00)"
                    />
                  }
                  placeholder="Vehicle Number"
                  value={vehicleNumber}
                  onChangeText={(value) => {
                    setVehicleNumber(value);
                  }}
                />
                {errorVehicleNumber && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Please type valid number Ex. MH 16 HT 7221
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <Box w="3/4" maxW="400">
                <Select
                  selectedValue={fuelType}
                  minWidth="300"
                  accessibilityLabel="Fuel Type"
                  placeholder="Fuel Type"
                  _selectedItem={{
                    bg: "rgba(6,182,212,1.00)",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={(itemValue) => {
                    setFuelType(itemValue);
                  }}
                >
                  <Select.Item label="Select fuel type" disabled={true} />
                  {fuelTypeArray.map((ftype) => (
                    <Select.Item key={ftype} label={ftype} value={ftype} />
                  ))}
                </Select>
                {isFieldInError("fuelType") && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {"Please select fuel type"}
                  </FormControl.ErrorMessage>
                )}
              </Box>
              {slider}
              {buttonField}
            </Stack>
          </FormControl>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default AddVehicle;
