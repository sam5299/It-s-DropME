import { View, Text } from "react-native";
import React from "react";
import PaymentInterface from "./PaymentInterface";
import Balance from "./Balance";
import { Button, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WalletHistory from "./WalletHistory";

const SliderStack = createNativeStackNavigator();

const WalletStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <SliderStack.Navigator initialRouteName="Balance">
        <SliderStack.Screen
          name="Balance"
          component={Balance}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="PaymentInterFace"
          component={PaymentInterface}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="Transactions"
          component={WalletHistory}
          options={{ headerShown: true }}
        />
      </SliderStack.Navigator>
    </View>
  );
};

export default WalletStack;
