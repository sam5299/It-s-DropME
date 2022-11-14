import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Box } from "native-base";
import TripBooked from "./TripBooked";
import TripHistory from "./TripHistory";
import RequestedTrips from "./RequestedTrips";

const Tab = createMaterialTopTabNavigator();

export default function TripsTopBar() {

  React.useEffect(()=>{
    console.log("In Tripstopbar!");
    let mounted = true;
    return() => (mounted=false);
  },[])

  return (
    <Box flex={1} mt={"1"}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#e7feff" },
        }}
        initialRouteName="RequestedTrips"
      >
        <Tab.Screen name="Trips" component={RequestedTrips} />
        <Tab.Screen name="Booked Trips" component={TripBooked} />
        <Tab.Screen name="History" component={TripHistory} />
      </Tab.Navigator>
    </Box>
  );
}
