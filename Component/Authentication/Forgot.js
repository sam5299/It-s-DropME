import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
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
  VStack,
  WarningOutlineIcon,
  Spinner,
  Heading,
  IconButton,
  CloseIcon,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../Context";

const Forgot = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [status, setStatus] = useState({ status: "", title: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const handleForgotPassword = async () => {
    //console.log(mobileNumber);

    let pattern = /^([7-9][0-9]{9})$/;
    if (mobileNumber.trim() === "") {
      setErrorMessage("Please enter mobile number");
      setError(true);
      setTimeout(() => setError(false), 5000);
      return;
    }
    if (!pattern.test(mobileNumber)) {
      setErrorMessage("Please enter valid mobile number");
      setError(true);
      setTimeout(() => setError(false), 5000);
      return;
    }

    const body = { mobileNumber: mobileNumber };
    try {
      setIsLoading(true);
      let result = await axios.put(url + "/user/forgotPassword", body);
      setIsLoading(false);
      setStatus({
        status: "success",
        title: "New password sent to your mail.",
      });
      setShowAlert(true);

      console.log("Result:" + result.data);
    } catch (ex) {
      setIsLoading(false);
      setStatus({ status: "error", title: ex.response.data });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      console.log("exception:" + ex.response.data);
    }
  };

  let AlertField = (
    <Alert w="100%" status={status.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {status.title}
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

  useEffect(() => {
    setShowSpinner(false);
    setShowAlert(false);
  }, []);

  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#F0F8FF"}
    >
      <Box
        width={"90%"}
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
        {showAlert ? AlertField : ""}
        <FormControl m={"5"} isInvalid={error}>
          <Text color="rgba(6,182,212,1.00)" fontSize="lg" mb="2">
            Forgot password!
          </Text>
          <Stack space={6} m="2">
            <Input
              maxLength={10}
              size={"md"}
              w="85%"
              keyboardType="numeric"
              InputLeftElement={
                <Text ml={1} pt={1}>
                  <AntDesign
                    name="mobile1"
                    size={25}
                    color="rgba(6,182,212,1.00)"
                  />
                </Text>
              }
              placeholder="Registered mobile number"
              onChangeText={(value) => setMobileNumber(value)}
            />
            <Box>
              <Button
                isLoading={isLoading}
                isLoadingText="Sending password.."
                size="md"
                w={"85%"}
                onPress={handleForgotPassword}
              >
                <Text fontSize={"lg"} color="white">
                  Send password on mail
                </Text>
              </Button>
            </Box>
          </Stack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errorMessage}
          </FormControl.ErrorMessage>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Forgot;
