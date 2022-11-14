import { React, useState, useEffect, useContext } from "react";
import { Box, Stack, Text, Button, Spinner, useToast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../Context";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const Balance = ({ route, navigation }) => {
  const [isPageLoading, setIspageLoading] = useState(false);
  const [userToken, setToken] = useState(null);
  const [wallet, setBalance] = useState({});

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const toast = useToast();

  useEffect(() => {
    let mounted = true;

    async function fetchUserData() {
      try {
        setIspageLoading(true);
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        setToken(parseUser.userToken);

        let result = await axios.get(url + "/wallet/getWalletDetails", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          console.log("View Balance");
          setToken(parseUser.userToken);
          setBalance(result.data);
          setIspageLoading(false);
        }
      } catch (ex) {
        console.log("Exception in Balance: ", ex);
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
      }
    }
    fetchUserData();

    return () => (mounted = false);
  }, [isFocused]);

  let reedeemSafetyPoints = async () => {
    //  console.log("method called");

    //check if safety points greater than 0 to reedeem
    if (wallet.safetyPoint <= 0) {
      setIsLoading(false);

      // pop up error message if safety points less than 0.
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>
                Safety points must be greater than 0 to redeem!
              </Text>
            </Box>
          );
        },
        placement: "top",
      });
    } else {
      try {
        setIsLoading(true);
        let result = await axios.put(
          url + "/wallet/reedeemSafetyPoints",
          {},
          {
            headers: {
              "x-auth-token": userToken,
            },
          }
        );
        setBalance(result.data); //adding data into wallet to changed into ui
        setIsLoading(false);

        //once safety points redeem, success message will be pop up.
        toast.show({
          render: () => {
            return (
              <Box bg="green.400" px="10" py="3" rounded="sm">
                <Text fontSize={"15"}>
                  Safety Points Redeemed Successfully!
                </Text>
              </Box>
            );
          },
          placement: "top",
        });
      } catch (ex) {
        console.log("Exception:", ex);
        setIsLoading(false);

        //pop up errro message if we get error from server
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
      }
    }
  };

  //rendering page
  if (isPageLoading) {
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
      <Box flex={1} alignItems={"center"} display={"flex"} bg={"#e7feff"}>
        <Box
          justifyContent={"center"}
          borderRadius={10}
          flexDirection="row"
          rounded="lg"
          borderColor="coolGray.200"
          shadow={2}
          mt="30%"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.500",
          }}
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "gray.100",
          }}
        >
          <Stack space={5} direction={"column"} m="5">
            <Box
              backgroundColor={"blue.100"}
              borderRadius={10}
              alignContent="center"
              alignItems="center"
            >
              <Text fontWeight={"bold"} mx={5} fontSize={30}>
                {wallet.creditPoint}
              </Text>
              <Text fontWeight={"bold"} fontSize={15} my={2}>
                Credit Points
              </Text>
            </Box>
            <Button
              onPress={() => {
                navigation.navigate("PaymentInterFace");
              }}
            >
              <Text fontSize={"sm"} fontWeight={"bold"} color="white">
                Add Credits
              </Text>
            </Button>
          </Stack>
          <Stack space={5} direction={"column"} m="5">
            <Box
              backgroundColor={"blue.100"}
              borderRadius={10}
              alignContent="center"
              alignItems="center"
            >
              <Text fontWeight={"bold"} mx={5} fontSize={30}>
                {wallet.safetyPoint}
              </Text>
              <Text fontWeight={"bold"} fontSize={15} my={2}>
                Safety Points
              </Text>
            </Box>
            <Button
              isLoading={isLoading}
              isLoadingText="converting..."
              onPress={() => reedeemSafetyPoints()}
            >
              <Text fontSize={"sm"} fontWeight={"bold"} color="white">
                Redeem Points
              </Text>
            </Button>
          </Stack>
        </Box>
        <Box
          justifyContent={"center"}
          borderRadius={10}
          flexDirection="row"
          rounded="lg"
        >
          <Box
            _dark={{
              borderColor: "coolGray.600",
              backgroundColor: "gray.500",
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: "gray.100",
            }}
            borderRadius={10}
            alignContent="center"
            alignItems="center"
            my={2}
            px={2}
            shadow={2}
          >
            <Text fontWeight={"bold"} mx={5} fontSize={30}>
              {wallet.usedCreditPoint}
            </Text>
            <Text fontWeight={"bold"} fontSize={15} my={2}>
              Used Credit
            </Text>
          </Box>
        </Box>

        <Box width={"70%"}>
          <Button onPress={() => navigation.navigate("Transactions")}>
            <Text fontSize={"sm"} fontWeight={"bold"} color="white">
              Transactions
            </Text>
          </Button>
        </Box>
      </Box>
    );
  }
};

export default Balance;
