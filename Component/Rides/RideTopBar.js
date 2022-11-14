import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Box } from "native-base";
import RideHistory from "./RideHistory";
import BookedRides from "./BookedRides";
import RideStack from "./RideStack";

const Tab = createMaterialTopTabNavigator();

export default function RideTopBar({ route, navigation }) {
  React.useEffect(() => {
    if (route.params) {
      console.log("navigated to RideStack");
      navigation.navigate("RideStack");
    }
  }, []);

  return (
    <Box flex={1} mt={"1"}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#e7feff" },
        }}
        initialRouteName="Rides"
      >
        <Tab.Screen name="Rides" component={RideStack} />
        <Tab.Screen name="Booked Rides" component={BookedRides} />
        <Tab.Screen name="History" component={RideHistory} />
      </Tab.Navigator>
    </Box>
  );
}
