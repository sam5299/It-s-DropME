import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  Stack,
  Text,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useValidation } from "react-native-form-validator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const PaymentInterface = ({ navigation }) => {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [userToken, setToken] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  // Toast to show any success or error message
  const toast = useToast();

  const { validate, isFieldInError } = useValidation({
    state: { cardHolderName, cardCvv, cardNumber, amount },
  });

  useEffect(() => {
    let mounted = true;
    async function fetchUserData() {
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      //console.log("parseUser@@@:", parseUser.userToken.trim());
      if (mounted) {
        setToken(parseUser.userToken);
      }
    }
    fetchUserData();
    return () => (mounted = false);
  }, []);

  const handleAddCreditPoint = async () => {
    let isTrue = validate({
      cardHolderName: { required: true },
      cardNumber: { required: true },
      cardCvv: { required: true, minlength: 3 },
      amount: { required: true },
    });

    if (isTrue) {
      let pattern = /\d{16}/;
      let namePattern = / \w*/; // /{\w+' '}+/;
      if (!pattern.test(cardNumber)) {
        console.log("card number is not right");

        // pop up toast if card number is invalid
        toast.show({
          render: () => {
            return (
              <Box bg="red.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>Invalid Card Number!</Text>
              </Box>
            );
          },
          placement: "top",
        });
      } else if (!namePattern.test(cardHolderName)) {
        // pop up toast if card holder name is invalid
        toast.show({
          render: () => {
            return (
              <Box bg="red.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>Invalid Card Holder Name!</Text>
              </Box>
            );
          },
          placement: "top",
        });
      } else {
        setIsLoading(true);
        try {
          let body = {
            message: "Card Payment",
            date: new Date().toDateString(),
            amount: amount,
          };
          const result = await axios.post(
            `${url}/walletHistory/addHistory`,
            body,
            {
              headers: {
                "x-auth-token": userToken,
              },
            }
          );
          setIsLoading(false);

          // pop up toast to show credit added message
          toast.show({
            render: () => {
              return (
                <Box bg="green.400" px="10" py="3" rounded="sm">
                  <Text fontSize={"15"}>Credit Added Successfully...!</Text>
                </Box>
              );
            },
            placement: "top",
          });
          console.log("Add balance done.");
          setTimeout(() => {
            navigation.navigate("Balance", { amount });
          }, 3000);
        } catch (exception) {
          console.log(
            "exception at PaymentInterface:",
            exception.response.data
          );
          setIsLoading(false);

          // pop up toast if amount is invalid
          toast.show({
            render: () => {
              return (
                <Box bg="red.400" px="10" py="3" rounded="sm">
                  <Text fontSize={"15"}>Please Add Valid Amount!</Text>
                </Box>
              );
            },
            placement: "top",
          });
        }
      }
    }
  };

  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      flex="1"
      bg={"#e7feff"}
    >
      <Box
        width={"90%"}
        rounded="lg"
        overflow="hidden"
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
        <FormControl m="5" isInvalid={error}>
          <Text color="rgba(6,182,212,1.00)" fontSize={"lg"} mb="2">
            Add Credit points
          </Text>
          <Stack space={6} m="2">
            <Box>
              <Input
                maxLength={50}
                keyboardType="default"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="account" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Card holder name"
                onChangeText={(value) => setCardHolderName(value)}
              />
              {isFieldInError("cardHolderName") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add card holder name
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                maxLength={16}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="card" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Card number"
                onChangeText={(value) => {
                  setCardNumber(value);
                }}
              />
              {isFieldInError("cardNumber") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add card number
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                type="password"
                maxLength={3}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="card" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Card CVV"
                onChangeText={(value) => setCardCvv(value)}
              />
              {isFieldInError("cardCvv") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please enter valid cvv
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Input
                maxLength={20}
                keyboardType="numeric"
                size={"md"}
                w="85%"
                InputLeftElement={
                  <Icon
                    as={<MaterialCommunityIcons name="cash" />}
                    size={6}
                    ml="2"
                    color="rgba(6,182,212,1.00)"
                  />
                }
                placeholder="Amount"
                onChangeText={(value) => setAmount(value)}
              />
              {isFieldInError("amount") && (
                <FormControl.ErrorMessage
                  isInvalid={true}
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please add amount to credit
                </FormControl.ErrorMessage>
              )}
            </Box>
            <Box>
              <Button
                isLoading={isLoading}
                isLoadingText="Adding credits..."
                size="md"
                w={"85%"}
                onPress={handleAddCreditPoint}
              >
                <Text fontSize={"lg"} color="white">
                  Proceed To Payment
                </Text>
              </Button>
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Box>
  );
};

export default PaymentInterface;
