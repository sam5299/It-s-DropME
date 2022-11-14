import React, { useMemo, useReducer, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../Screens/Home";
import Login from "./Login";
import Registration from "./Registration";
import Splash from "../Splash";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Forgot from "./Forgot";
import * as Notifications from "expo-notifications";

const Stack = createNativeStackNavigator();

const Main = ({ routingPath }) => {
  //const url = "http://192.168.101.15:3100";
  const url = "https://drop-me-backend.herokuapp.com";
  // const url = "https://192.168.142.17:19000";
  const initialState = {
    userName: null,
    userToken: null,
    animating: true,
  };
  let [pushToken, setPushToken] = useState("");

  const reducer = (state, action) => {
    switch (action.type) {
      case "RETRIVE_TOKEN":
        return {
          ...state,
          userToken: action.token,
          animating: false,
        };
      case "LOGIN":
        return {
          ...state,
          userName: action.id,
          userToken: action.token,
          animating: false,
        };
      case "LOGOUT":
        return {
          ...state,
          userName: null,
          userToken: null,
          animating: false,
        };
      case "REGISTER":
        return {
          ...state,
          userName: action.id,
          userToken: action.token,
          animating: false,
        };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const authContext = useMemo(
    () => ({
      signIn: async (userName, result, userToken) => {
        try {
          // await AsyncStorage.clear();
          // const result = await axios.get(url + "/user/getUser", {
          //   headers: { "x-auth-token": userToken },
          // });
          result["userToken"] = userToken;
          const data = JSON.stringify(result);
          await AsyncStorage.setItem("User", data);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.log(e.response.data);
        }
        dispatch({ type: "LOGOUT" });
      },
      getUrl: () => {
        return url;
      },
    }),
    []
  );

  let registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    //console.log(token);
    setPushToken({ expoPushToken: token });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  // let handleNotification = notification => {
  //   console.log("handle notification called in main..");
  //   //this.setState({ notification: notification });
  // };

  let handleNotificationResponse = (response) => {
    //console.log("handle notification response called in main..");
    //console.log(response);
  };

  useEffect(() => {
    let mounted = true;
    let userToken = null;
    if (routingPath) {
      console.log(routingPath);
    }

    setTimeout(async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        if (User !== null) {
          const parseUser = JSON.parse(User);
          userToken = parseUser.userToken;
        }

        registerForPushNotificationsAsync();
        //Notifications.addNotificationReceivedListener(handleNotification);

        Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      } catch (e) {
        console.log("main", e);
      }
      if (mounted) {
        dispatch({ type: "RETRIVE_TOKEN", token: userToken });
      }
    }, 2000);
    return () => (mounted = false);
  }, []);

  if (state.animating) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      {state.userToken === null ? (
        <Stack.Navigator>
          <Stack.Screen name="DropMe" component={Login} />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{ headerStyle: { height: 10 } }}
          />
          <Stack.Screen name="Forgot Password" component={Forgot} />
        </Stack.Navigator>
      ) : (
        <Home />
      )}
    </AuthContext.Provider>
  );
};

export default Main;
