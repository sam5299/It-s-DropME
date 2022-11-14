import { View } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestRide from "./RequestRide";
import AcceptRejectRequest from "./AcceptRejectRequest";
const rideStack = createNativeStackNavigator();

const RideStack = ({ route,navigation }) => {

  useEffect(()=> {
    if(route.params) {
      console.log("in RideStack.js");
      navigation.navigate("RequestRide");
    }
  })

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <rideStack.Navigator>
        <rideStack.Screen
          name="RequestRide"
          component={RequestRide}
          options={{ headerShown: false }}
        />
        <rideStack.Screen
          name="ViewRequest"
          component={AcceptRejectRequest}
          options={{ headerShown: false }}
        />
      </rideStack.Navigator>
    </View>
  );
};

export default RideStack;
