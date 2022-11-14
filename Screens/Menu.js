import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect } from "react";
import {
  Badge,
  Box,
  Heading,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import { AuthContext } from "../Component/Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

const Menu = ({ route, navigation }) => {
  const { signOut } = useContext(AuthContext);

  let handleNotificationResponse = (response) => {
    console.log("handle notification response called in menu page..");
    let notificationType =
      response.notification.request.content.data.notificationType;
    console.log("notification type in menu page:", notificationType);
    if (notificationType != "Login") {
      console.log("navigating to slide");
      navigation.navigate("Slide", {
        notificationType: notificationType,
      });
    }
  };

  useEffect(() => {
    if (route.params) {
      // const {notificationType} = route.params;
      // console.log("notificationType:",notificationType);

      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  });

  return (
    <VStack flex={1} mt={1} bg={"#e7feff"}>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("RideStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="bike"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Rides</Heading>
            <Text>Manage Rides</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("TripsStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="car-settings"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Trips</Heading>
            <Text>Manage Trips</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Vehicle")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="car-multiple"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Vehicles</Heading>
            <Text>Manage Vehicles</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Profile")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="account-box-outline"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Profile</Heading>
            <Text>View Profile</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("WalletStack")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="wallet-outline"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Wallet</Heading>
            <Text>Manage Payments</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
      {/*
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => navigation.navigate("Help")}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialCommunityIcons
            name="help-rhombus-outline"
            size={30}
            color="rgba(6,182,212,1.00)"
          />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Help</Heading>
            <Text>Help page</Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
  */}
      <Pressable
        justifyContent={"space-between"}
        w="100%"
        h="11%"
        bg="white"
        flexDir="row"
        alignItems={"center"}
        borderColor="#D0CFCF"
        borderWidth={1}
        onPress={() => signOut()}
      >
        <Box flexDir={"row"} alignItems={"center"} pl="5">
          <MaterialIcons name="logout" size={30} color="rgba(6,182,212,1.00)" />
          <Stack ml={"5"} space={1}>
            <Heading size="md">Logout</Heading>
            <Text>Logout From Device </Text>
          </Stack>
        </Box>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={40}
          color="rgba(6,182,212,1.00)"
        />
      </Pressable>
    </VStack>
  );
};

export default Menu;
