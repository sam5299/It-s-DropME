import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Box } from "native-base";
import ViewVehicles from "./ViewVehicles";
import AddRemoveStack from "./AddRemoveStack";

const Tab = createMaterialTopTabNavigator();

export default function VehicleTopBar() {
  return (
    <Box flex={1} mt={"1"}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#e7feff" },
        }}
        initialRouteName="Vehicles"
      >
        <Tab.Screen name="Vehicles" component={ViewVehicles} />
        <Tab.Screen name="Add Vehicle" component={AddRemoveStack} />
      </Tab.Navigator>
    </Box>
  );
}
