import { StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Spinner,
  Heading,
  Divider,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  useEffect(() => {
    let mounted = true;
    async function loadDetails() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        let profile = await axios.get(url + "/user/loadProfile", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setUserDetails(profile.data);
          setPageLoading(false);
        }
      } catch (ex) {
        console.log("Exception in profile", ex.response.data);
      }
    }

    loadDetails();
    return () => (mounted = false);
  }, []);
  if (pageLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"} bg="#F0F8FF">
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box
        flex={1}
        bg={"#e7feff"}
        justifyContent="center"
        alignItems={"center"}
      >
        <Box
          alignItems={"center"}
          m="5"
          borderColor="coolGray.200"
          borderRadius={10}
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
          shadow="5"
          height="50%"
          width={"75%"}
        >
          <Box
            borderColor="#48b1bf"
            borderTopRadius={10}
            borderWidth="1"
            backgroundColor={"#20b2aa"}
            width="100%"
            height="35%"
          >
            <Image
              source={{
                uri: userDetails.profile,
              }}
              alt="Image not available"
              borderRadius={100}
              size={"xl"}
              position="absolute"
              top="30%"
              left="30%"
            />
          </Box>
          <Box
            height={"30%"}
            width="100%"
            marginTop="15%"
            alignItems={"center"}
            justifyContent="space-around"
          >
            <Heading size="md">{userDetails.name}</Heading>
            <Text fontSize={"15"}>{userDetails.mobileNumber}</Text>
            <Text fontSize={"15"}>{userDetails.email}</Text>
          </Box>
          <Divider />
          <Stack
            borderColor="white"
            borderBottomRadius={10}
            borderWidth="1"
            direction={"row"}
            width={"100%"}
            height="21%"
          >
            <Box
              width={"50%"}
              flexDirection="column"
              justifyContent={"space-around"}
              alignItems="center"
              p="2"
            >
              <Heading size="md">{userDetails.totalNumberOfRides}</Heading>
              <Text fontSize={"15"}>Rides</Text>
            </Box>
            <Box
              width={"50%"}
              flexDirection="column"
              justifyContent={"space-around"}
              alignItems="center"
              p="2"
            >
              <Heading size="md">
                {userDetails.totalNumberOfRatedRides == 0
                  ? 0
                  : (
                      userDetails.sumOfRating /
                      userDetails.totalNumberOfRatedRides
                    ).toPrecision(2)}
              </Heading>
              <Text fontSize={"15"}>Rating</Text>
            </Box>
          </Stack>
        </Box>
      </Box>
    );
  }
};

export default UserProfile;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
