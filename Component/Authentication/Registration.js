import React, { useState, useReducer, useEffect, useContext } from "react";
import { useValidation } from "react-native-form-validator";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Radio,
  Stack,
  Text,
  WarningOutlineIcon,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
//import { Permissions, Notifications } from "expo";
// import * as Permissions from 'expo-permissions';
// import  * as Notifications from 'expo-notifications';

import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../Context";
import axios from "axios";
import { TouchableHighlight } from "react-native";

const Registration = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [showAlert, setShowAlert] = useState(false);
  const [alertField, setAlertField] = useState({
    status: "success",
    title: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState(false);
  const initialState = {
    name: "",
    mobileNumber: "",
    email: "",
    gender: "Male",
    password: "",
    profile:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
  };
  // const [expoToken, setExpoToken] = useState(null);
  const reducer = (state, action) => {
    switch (action.type) {
      case "name":
        return {
          ...state,
          name: action.payload,
        };
      case "mobileNumber":
        return {
          ...state,
          mobileNumber: action.payload,
        };
      case "email":
        return {
          ...state,
          email: action.payload,
        };
      case "gender":
        return {
          ...state,
          gender: action.payload,
        };
      case "password":
        return {
          ...state,
          password: action.payload,
        };
      case "profile":
        return {
          ...state,
          profile: action.payload,
        };
      case "default":
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { name, email, mobileNumber, password } = state;
  const { validate, isFieldInError } = useValidation({
    state: { name, email, mobileNumber, password },
  });

  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: false,
  //     shouldSetBadge: false,
  //   }),
  // });

  const registerForPushNotificationsAsync = async () => {
    // const { status: existingStatus } = await Permissions.getAsync(
    //   Permissions.NOTIFICATIONS
    // );
    // let finalStatus = existingStatus;

    // // let tmp=Notifications.Push
    // // only ask if permissions have not already been determined, because
    // // iOS won't necessarily prompt the user a second time.
    // if (existingStatus !== "granted") {
    //   // Android remote notification permissions are granted during the app
    //   // install, so this will only ask on iOS
    //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   finalStatus = status;
    // }

    // // Stop here if the user did not grant permissions
    // if (finalStatus !== "granted") {
    //   return;
    // }

    try {
      // Get the token that uniquely identifies this device
      // let token = await Notifications.getExpoPushTokenAsync();
      const settings = await Notifications.getPermissionsAsync();
      console.log("Setting:", settings);
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();

      console.log("2222", token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // // registerForPushNotificationsAsync().then(token => setExpoToken(token));
    // let getPermission = async () => {
    //   try {

    //     // Get the token that uniquely identifies this device
    //     let token = await registerForPushNotificationsAsync();
    //   //  console.log(token.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // getPermission();

    return () => (mounted = false);
  }, []);

  const uploadImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5,
        base64: true,
      });

      if (!result.cancelled) {
        dispatch({
          type: "profile",
          payload: "data:image/png;base64," + result.base64,
        });
        //setPic("data:image/png;base64," + result.base64);
      }
    } catch (error) {
      dispatch({
        type: "profile",
        payload:
          "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      });
    }
  };

  const handleRegistration = async () => {
    let isTrue = validate({
      name: { minlength: 3, required: true },
      email: { email: true, required: true },
      mobileNumber: { minlength: 10, required: true },
      password: {
        minlength: 8,
        hasNumber: true,
        hasUpperCase: true,
        hasLowerCase: true,
        hasSpecialCharacter: true,
        required: true,
      },
    });
    if (isTrue) {
      let pattern = /[7-9]{1}[0-9]{9}/;
      if (!pattern.test(mobileNumber)) {
        setMobileNumberError(true);
        return;
      } else setMobileNumberError(false);
      // make a call to backend and store user details
      setIsLoading(true);
      try {
        const result = await axios.post(url + "/user/register", state);
        setAlertField({ status: "success", title: "Registration successful." });
        setShowAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setShowAlert(false);
          navigation.navigate("DropMe");
        }, 3000);
      } catch (error) {
        console.log(error);
        setAlertField({ status: "error", title: error.response.data });
        setShowAlert(true);
        setIsLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    }
  };

  let AlertField = (
    <Alert w="100%" status={alertField.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {alertField.title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" color="coolGray.600" />}
          />
        </HStack>
      </VStack>
    </Alert>
  );

  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#e7feff"}
      minH="20%"
    >
      <Box
        width={"90%"}
        rounded="lg"
        overflow="hidden"
        borderColor="white"
        borderWidth="1"
        backgroundColor={"white"}
        alignItems={"center"}
        shadow={3}
      >
        {showAlert ? AlertField : ""}
        <FormControl m={5} alignItems={"center"}>
          <Text
            color="rgba(6,182,212,1.00)"
            fontSize={"xl"}
            mb="2"
            textAlign={"center"}
          >
            Hello!
          </Text>

          <TouchableHighlight
            onPress={() => uploadImage()}
            underlayColor="rgba(0,0,0,0)"
          >
            <Avatar
              bg="green.500"
              size="xl"
              source={{
                uri: state.profile,
              }}
            >
              <Avatar.Badge bg="green.500" />
            </Avatar>
          </TouchableHighlight>

          <Stack space={6} m="2">
            <Box display={"flex"} justifyContent={"center"}>
              <Input
                size={"md"}
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="account" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Enter the full name"
                onChangeText={(value) =>
                  dispatch({ type: "name", payload: value })
                }
              />
              {isFieldInError("name") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Username must be greater than 3
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                keyboardType="numeric"
                maxLength={10}
                size={"md"}
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="phone" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Mobile No"
                onChangeText={(value) =>
                  dispatch({ type: "mobileNumber", payload: value })
                }
              />
              {isFieldInError("mobileNumber") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Mobile No must be 10 digit
                </FormControl.ErrorMessage>
              )}
              {mobileNumberError && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please type valid mobile number
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                size={"md"}
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="email" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Email"
                onChangeText={(value) =>
                  dispatch({ type: "email", payload: value })
                }
              />
              {isFieldInError("email") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter valid Email
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box flexDirection={"row"}>
              <Text fontSize={"md"} mr="2">
                Gender:
              </Text>
              <Radio.Group
                name="Gender"
                defaultValue="Male"
                accessibilityLabel="Gender"
                onChange={(value) =>
                  dispatch({ type: "gender", payload: value })
                }
              >
                <Stack
                  mt={"1"}
                  direction={{
                    base: "row",
                    md: "column ",
                  }}
                  space={3}
                  maxW="300px"
                >
                  <Radio value="Male" size="sm">
                    Male
                  </Radio>
                  <Radio value="Female" size="sm">
                    Female
                  </Radio>
                  <Radio value="Other" size="sm">
                    Other
                  </Radio>
                </Stack>
              </Radio.Group>
            </Box>
            <Box>
              <Input
                size={"md"}
                type={show ? "text" : "password"}
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name={"security"} />}
                    size={6}
                    ml="2"
                    color="#06B6D4"
                  />
                }
                InputRightElement={
                  <Icon
                    as={
                      <MaterialCommunityIcons name={show ? "eye" : "eye-off"} />
                    }
                    size={6}
                    mr="2"
                    color="#06B6D4"
                    onPress={() => setShow(!show)}
                  />
                }
                placeholder="Create Password"
                onChangeText={(value) =>
                  dispatch({ type: "password", payload: value })
                }
              />
              {isFieldInError("password") && (
                <>
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Password should be at least 8 characters.
                  </FormControl.ErrorMessage>
                  <FormControl.ErrorMessage
                    isInvalid={true}
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Contains at least one upper, lower, special character &
                    number.
                  </FormControl.ErrorMessage>
                </>
              )}
            </Box>
            {/* <Button onPress={handleRegistration}>Sign Up</Button> */}
            <Box>
              <Button
                isLoading={isLoading}
                isLoadingText="Signing up.."
                size="md"
                onPress={handleRegistration}
              >
                <Text fontSize={"lg"} color="white">
                  Sign Up
                </Text>
              </Button>
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Registration;
