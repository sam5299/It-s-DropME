import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestBookedHistory from "./RequestBookedHistory";
import TripRequest from "./TripRequest";
import TripBooked from "./TripBooked";
import { Button, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TripHistory from "./TripHistory";
import RequestedTrips from "./RequestedTrips";
const SliderStack = createNativeStackNavigator();

const TripsStack = ({ route, navigation }) => {

  useEffect(()=> {
    if(route.params) {
      console.log("route parameters available.");
      //navigation.navigate("TripRequest");
      navigation.navigate("TripBooked");
    }
  },[])

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <SliderStack.Navigator>
        <SliderStack.Screen
          name="RequestedTrips"
          component={RequestedTrips}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="RequestBookedHistory"
          component={RequestBookedHistory}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="TripRequest"
          component={TripRequest}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="TripBooked"
          component={TripBooked}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="TripHistory"
          component={TripHistory}
          options={{ headerShown: false }}
        />
      </SliderStack.Navigator>
    </View>
  );
};

export default TripsStack;
