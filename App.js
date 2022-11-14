import "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import {
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
  Dimensions,
  LogBox,
} from "react-native";

import { useToast } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./Component/Authentication/Main";
import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
// const socket = io.connect("http://192.168.43.195:3100");
export default function App() {
  LogBox.ignoreLogs(["Remote debugger"]);

  const [animating, setAnimating] = useState(false);
  let [pushToken, setPushToken] = useState("");
  let [notification, setNotification] = useState(null);
  let [updtatedRoute, setUpdatedRoute] = useState("sameer shinde");

  let registerForPushNotificationsAsync = async () => {
   
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    //setPushToken({ expoPushToken: token });
  

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  };
  let handleNotification = notification => {
    console.log("handle notification called in app..");
    setNotification(notification);
  };

  let handleNotificationResponse = response => {
     console.log("handle notification response called in App.js..",response.notification.request.content.data.notificationType);
    // console.log(response.notification.request.content);
    setUpdatedRoute(response.notification.request.content.data.notificationType);
  };
  useEffect(()=>{
    registerForPushNotificationsAsync();
        Notifications.addNotificationReceivedListener(handleNotification);
    
        Notifications.addNotificationResponseReceivedListener(handleNotificationResponse); 
  },[updtatedRoute])

  return (
    <SafeAreaProvider>
      <NativeBaseProvider style={styles.container}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
