import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  Stack,
  ScrollView,
  Button,
  Spinner,
  Modal,
} from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AcceptRating from "./AcceptRating";
import { useIsFocused } from "@react-navigation/native";

const NotificationScreen = ({ navigation }) => {
  const [notificationList, setNotification] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isUpdated, setUpdated] = useState(false);
  const [tripRideId, setTripRideId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [markReadNotificationObject, setMarkReadNotificationObject] =
    useState(null);

  const isFocused = useIsFocused();

  async function markAllRead() {
    try {
      console.log("Marking all notification's is called");
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      // alert("markAllRead");
      let result = await axios.put(
        url + "/notification/markAllRead",
        {},
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      //console.log(result.data);
      //alert("Done");
      setUpdated(true);
    } catch (ex) {
      console.log("Exception in mark all read notifications", ex.response);
      setUpdated(false);
    }
  }
  async function markReadNotification(notificationId) {
    try {
      console.log("Mark a notification called..");
      const User = await AsyncStorage.getItem("User");
      const parseUser = JSON.parse(User);
      let result = await axios.put(
        url + "/notification/markAsRead",
        {
          notificationId,
        },
        {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        }
      );
      // console.log(result.data);
      setUpdated(true);
    } catch (ex) {
      console.log("Exception in mark notification", ex.response);
      setUpdated(false);
    }
  }

  const redirectToPage = (notificationObj) => {
    let notificationType = notificationObj.notificationType;
    // alert(notificationType);
    // switch (notificationType) {
    //   case "Wallet": 
        if(notificationType!="Trip Completed") {
          navigation.navigate("Slide",{notificationType:notificationType});
          return;
        } else {
          setTripRideId(notificationObj.tripRideId);
        setMarkReadNotificationObject(notificationObj._id);
        console.log(notificationObj.tripRideId);
        setModalVisible(true);
        return;
        }
       
    //   case "Ride":
    //     navigation.navigate("RideStack");
    //     return;
    //   case "Trip":
    //     navigation.navigate("TripsStack");
    //     return;
    //   case "Trip Completed":
    //     setTripRideId(notificationObj.tripRideId);
    //     setMarkReadNotificationObject(notificationObj._id);
    //     console.log(notificationObj.tripRideId);
    //     setModalVisible(true);
    //     return;
    //   default:
    //     return;
    // }
  };

  useEffect(() => {
    let mounted = true;
    async function loadNotifications() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);

        let result = await axios.get(url + "/notification/getNotifications", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        //console.log(result.data);
        if (mounted) {
          setNotification(result.data);
          setLoading(false);
          setUpdated(false);

          //setToken(parseUser.userToken);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setLoading(false);
      }
      return () => (mounted = false);
    }

    loadNotifications();
    return () => (mounted = false);
  }, [isUpdated, isFocused]);

  function getNotification() {
    return (
      <ScrollView w={"100%"}>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Content maxWidth="100%">
            <Modal.CloseButton />
            <Modal.Header>
              <Text fontWeight={"bold"}>How was the ride?</Text>
            </Modal.Header>
            <Modal.Body>
              <AcceptRating
                tripRideId={tripRideId}
                setModalVisible={setModalVisible}
                notificationObject={markReadNotificationObject}
                markReadNotification={markReadNotification}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {notificationList.map((msg) => (
          <Stack
            key={msg._id}
            direction="row"
            p={3}
            m={2}
            borderRadius={10}
            bg={"white"}
            w="95%"
            shadow={2}
          >
            <Box
              alignItems={"center"}
              justifyContent="flex-start"
              maxW="90%"
              minWidth={"90%"}
            >
              <Text fontSize={15} onPress={() => redirectToPage(msg)}>
                {msg.message}
              </Text>
            </Box>
            <MaterialIcons
              name="cancel"
              size={30}
              color="rgba(6,182,212,1.00)"
              //color='red'
              onPress={() => markReadNotification(msg._id)}
            />
          </Stack>
        ))}
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box
        borderRadius={10}
        display="flex"
        flex={1}
        flexDirection={"column"}
        alignItems={"center"}
        bg={"#e7feff"}
        mb={"14%"}
      >
        {notificationList.length != 0 ? (
          getNotification()
        ) : (
          <Box flex={1} justifyContent={"center"}>
            <Text>No new notifications</Text>
          </Box>
        )}
        {notificationList.length > 0 && (
          <Button w={"40%"} p={2} m={4} onPress={markAllRead}>
            Mark all read
          </Button>
        )}
      </Box>
    );
  }
};

export default NotificationScreen;
