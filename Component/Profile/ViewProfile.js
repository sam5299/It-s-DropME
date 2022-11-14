import { StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Spinner,
  Divider,
  Heading,
  Flex,
  Button,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
const ViewProfile = () => {
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
      <Box flex={1} bg={"#F0F8FF"} justifyContent="center">
        <Box
          alignItems={"center"}
          m="5"
          p="2"
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
        >
          <Stack direction={"column"} space={5}>
            <Stack justifyContent={"center"} alignItems={"center"} space={3}>
              <Image
                source={{
                  uri: userDetails.profile,
                }}
                alt="Image not available"
                borderRadius={100}
                size={"xl"}
              />
              <Text style={styles.details}>{userDetails.name}</Text>
              <Text>{userDetails.mobileNumber}</Text>
              <Text>{userDetails.email}</Text>
              {/* <Text style={styles.details}>{userDetails.gender}</Text> */}
            </Stack>
            <Box alignItems="center">
              <Flex direction="row" h="58" p="4">
                <Text>{userDetails.totalNumberOfRatedRides}</Text>
                <Divider
                  bg="black"
                  thickness="2"
                  mx="2"
                  orientation="vertical"
                />
                <Text>
                  {userDetails.totalNumberOfRatedRides == 0
                    ? 0.0
                    : (
                        userDetails.sumOfRating /
                        userDetails.totalNumberOfRatedRides
                      ).toPrecision(2)}
                </Text>
              </Flex>
              <Button>Log Out</Button>
            </Box>
            {/* <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              width="60%"
            >
              <Box
                alignItems={"center"}
                justifyContent={"center"}
                // bg={"white"}
                borderRadius={10}
              >
                <Text style={styles.details}>
                  {userDetails.totalNumberOfRatedRides}
                </Text>
                <Text>Total Rides</Text>
              </Box>
              <Box
                alignItems={"center"}
                justifyContent={"center"}
                // bg={"white"}
                borderRadius={10}
              >
                <Text style={styles.details}>
                  {userDetails.totalNumberOfRatedRides == 0
                    ? 0.0
                    : (
                        userDetails.sumOfRating /
                        userDetails.totalNumberOfRatedRides
                      ).toPrecision(2)}
                </Text>

                <Text>Average Rating</Text>
              </Box>
            </Box> */}
          </Stack>
        </Box>
      </Box>
    );
  }
};

export default ViewProfile;

const styles = StyleSheet.create({
  details: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 3,
  },
});
