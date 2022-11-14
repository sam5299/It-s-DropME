import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BookRide from "./BookRide";
import AvailableRides from "./AvailableRides";

const SliderStack = createNativeStackNavigator();

const BookeRideStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <SliderStack.Navigator initialRouteName="BookRide">
        <SliderStack.Screen
          name="BookRide"
          component={BookRide}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen name="Available Rides" component={AvailableRides} />
      </SliderStack.Navigator>
    </View>
  );
};

export default BookeRideStack;
