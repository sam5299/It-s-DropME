import { View } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
//import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Text,
  WarningOutlineIcon,
  useToast,
  Spinner,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useValidation } from "react-native-form-validator";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";

const UploadDocumentForVehicle = ({ route, navigation }) => {
  let [userData, setUserData] = useState({});
  let [licenseNumber, setLicenseNumber] = useState(null);
  let [licenseImage, setLicenseImage] = useState(null);
  let [rcBookImage, setRcBookImage] = useState(null);
  let [pucImage, setPucImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [userToken, setToken] = useState(null);
  const [rcError, setRcError] = useState(false);
  const [pucError, setPucError] = useState(false);
  const [licenseNumberError, setLicenseNumberError] = useState(false);
  const [licenseImageError, setLicenseImageError] = useState(false);
  let [isPageLoading, setIsPageLoading] = useState(false);

  //toast field
  const toast = useToast();

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const {
    Picture,
    vehicleType,
    vehicleClass,
    vehicleName,
    vehicleNumber,
    fuelType,
    seatingCapacity,
  } = route.params;

  useEffect(() => {
    let mounted = true;
    setIsPageLoading(true);
    async function fetchUserData() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        //console.log("parseUser@@@:", parseUser.userToken.trim());
        setToken(parseUser.userToken);

        let result = await axios.get(url + "/user/getUser", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setToken(parseUser.userToken);
          setUserData(result.data);
          setIsPageLoading(false);
          console.log("Upload Vehicle Documents");
        }
      } catch (ex) {
        console.log("Exception:", ex);
        toast.show({
          render: () => {
            return (
              <Box bg="red.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>
                  {error.name === "AxiosError"
                    ? "Sorry cannot reach to server!"
                    : error.response.data}
                </Text>
              </Box>
            );
          },
          placement: "top",
        });
        setIsPageLoading(false);

        // console.log(ex.response.data);
      }
    }
    fetchUserData();

    return () => (mounted = false);
  }, []);

  const uploadImage = async (docName) => {
    console.log("document name:" + docName);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      if (docName === "licenseImage")
        setLicenseImage("data:image/png;base64," + result.base64);
      if (docName === "rcBookImage")
        setRcBookImage("data:image/png;base64," + result.base64);
      if (docName === "pucImage")
        setPucImage("data:image/png;base64," + result.base64);
    }
  };

  //validation
  const { validate, isFieldInError } = useValidation({
    state: { rcBookImage, pucImage, licenseNumber, licenseImage },
  });

  const handleUploadDocument = async () => {
    let body = {
      vehicleName: vehicleName,
      vehicleNumber: vehicleNumber,
      vehicleType: vehicleType,
      seatingCapacity: seatingCapacity,
      vehicleClass: vehicleClass,
      vehicleImage: Picture,
      rcBookImage: rcBookImage,
      fuelType: fuelType,
      pucImage: pucImage,
    };
    //  console.log(body);
    let rcError = false;
    let pucError = false;

    if (userData.licenseNumber === null && userData.licenseImage === null) {
      let pattern =
        /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
      if (!pattern.test(licenseNumber)) {
        console.log("license number not valid");
        setLicenseNumberError(true);
        //return;
      } else {
        setLicenseNumberError(false);
      }
      if (licenseImage === null) {
        setLicenseImageError(true);
        //return;
      } else {
        setLicenseImageError(false);
      }
      //add license properties
      body.licenseNumber = licenseNumber.toUpperCase();
      body.licenseImage = licenseImage;
    }

    if (rcBookImage === null) {
      setRcError(true);
      if (pucImage === null) setPucError(true);
      else setPucError(false);
      return;
    } else {
      setRcError(false);
    }
    if (pucImage === null) {
      //console.log("pucImage not present");
      setPucError(true);
      return;
    } else {
      setPucError(false);
    }
    if (licenseImageError || licenseNumberError) {
      //console.log("one of the field is with error");
      return;
    }
    console.log("below return");

    let isTrue = validate({
      rcBookImage: { required: true, hasLowerCase: true },
      pucImage: { required: true, hasLowerCase: true },
      licenseImage: {
        required: userData.licenseNumber === null ? true : false,
      },
      licenseNumber: {
        required: userData.licenseNumber === null ? true : false,
      },
    });
    // console.log("pucError:" + pucError);
    //console.log("rcError:" + rcError);
    if (pucError === false && rcError === false && isTrue) {
      console.log("Validation done");
      try {
        setIsLoading(true);
        let result = await axios.post(url + "/vehicle/addVehicle", body, {
          headers: {
            "x-auth-token": userToken,
          },
        });
        setIsLoading(false);

        toast.show({
          render: () => {
            return (
              <Box bg="green.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>Vehicle Added.!</Text>
              </Box>
            );
          },
          placement: "top",
        });
        setTimeout(() => {
          navigation.navigate("AddVehicle", { isChanged: true });
        }, 1000);
      } catch (ex) {
        setIsLoading(false);
        console.log("exception name:" + ex.name);
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
        console.log(
          "exception in upload vehicle documents:" + ex.response.data
        );
      }
    }
  };

  let licenseNumberInput = (
    <Box>
      <Input
        maxLength={16}
        size={"md"}
        w="80%"
        mt={2}
        mb={1}
        InputLeftElement={
          <Icon
            as={<MaterialCommunityIcons name="card" />}
            size={6}
            ml="2"
            color="rgba(6,182,212,1.00)"
          />
        }
        placeholder="License Number"
        onChangeText={(value) => setLicenseNumber(value.toLocaleUpperCase())}
      />
      {licenseNumberError && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          Please type valid Number Ex. MH20 00000000000
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  let licenseImageInput = (
    <Box alignItems={"center"} mb={5}>
      <Box ml={3} w={"95%"} flexDir={"row"}>
        <Box mt="5" w={"95%"} flexDir={"row"} alignItems="center">
          <Avatar
            size="xl"
            source={{
              uri: licenseImage,
            }}
            borderRadius="100"
            bg="white"
            borderColor="gray.400"
            borderWidth={0.5}
          >
            <AntDesign name="upload" size={30} color="rgba(6,182,212,0.70)" />
            <Text fontSize={"sm"}>License Image</Text>
          </Avatar>
          <Button
            w={"200"}
            h={10}
            ml={2}
            mb={2}
            variant="outline"
            colorScheme="primary"
            onPress={() => uploadImage("licenseImage")}
          >
            Add License Image
          </Button>
        </Box>
      </Box>
      {licenseImageError && (
        <FormControl.ErrorMessage
          isInvalid={true}
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          License Image is required!
        </FormControl.ErrorMessage>
      )}
    </Box>
  );

  if (isPageLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <ScrollView mt={5} mb="10%">
        <Box
          alignItems={"center"}
          justifyContent={"center"}
          flex="1"
          bg={"#e7feff"}
        >
          <Box
            rounded="lg"
            overflow="hidden"
            borderColor={"coolGray.200"}
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
            <FormControl justifyContent="center" alignItems={"center"}>
              <Text color="rgba(6,182,212,1.00)" fontSize="xl">
                {"Add Vehicle Details"}
              </Text>
              {userData.licenseNumber === null ? licenseNumberInput : ""}
              {userData.licenseImage === null ? licenseImageInput : ""}
              <Box alignItems={"center"}>
                <Box ml={3} w={"95%"} flexDir={"row"}>
                  <Box
                    w={"95%"}
                    flexDir={"row"}
                    alignItems="center"
                    justifyContent={"flex-start"}
                  >
                    <Avatar
                      size="xl"
                      source={{
                        uri: rcBookImage,
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
                      <Text fontSize={"sm"}>RC Book</Text>
                    </Avatar>
                    <Button
                      w={"200"}
                      h={10}
                      ml={2}
                      mb={2}
                      variant="outline"
                      colorScheme="primary"
                      onPress={() => uploadImage("rcBookImage")}
                    >
                      Add RC Book Image
                    </Button>
                  </Box>
                </Box>
                {rcError && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    RC Book Image is required!
                  </FormControl.ErrorMessage>
                )}
              </Box>
              <Box alignItems={"center"}>
                <Box ml={3} w={"95%"} flexDir={"row"}>
                  <Box
                    mt="5"
                    w={"95%"}
                    flexDir={"row"}
                    alignItems="center"
                    justifyContent={"flex-start"}
                  >
                    <Avatar
                      size="xl"
                      source={{
                        uri: pucImage,
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
                      <Text fontSize={"sm"}>PUC Image</Text>
                    </Avatar>
                    <Button
                      w={"200"}
                      h={10}
                      ml={2}
                      mb={2}
                      variant="outline"
                      colorScheme="primary"
                      onPress={() => uploadImage("pucImage")}
                    >
                      Add PUC Image
                    </Button>
                  </Box>
                </Box>
                {pucError && (
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    PUC Image is required!
                  </FormControl.ErrorMessage>
                )}
              </Box>
              {/* add button to handle click event */}
              {/* {showSpinner ? ShowSpinner : buttonField} */}
              <Box>
                <Button
                  isLoading={isLoading}
                  isLoadingText="Adding vehicle.."
                  size="md"
                  onPress={handleUploadDocument}
                  mt="5%"
                  mb={"5%"}
                >
                  <Text fontSize={"lg"} color="white">
                    Upload Document
                  </Text>
                </Button>
              </Box>
            </FormControl>
          </Box>
        </Box>
      </ScrollView>
    );
  }
};

export default UploadDocumentForVehicle;
