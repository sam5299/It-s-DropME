//import { View, Text } from 'react-native'
import { Text } from "native-base";
import React from "react";

const HelpModal = ({ type }) => {
  function getMessage() {
    //console.log(type);
    switch (type) {
      case "Create Ride":
        return `Before you can make a ride, you must first add the vehicle. To book a ride, enter the following details: source, destination, vehicle, date, time, and vehicle capacity.`;
      case "Create Trip":
        return `You must first provide the source, destination, date, and time of the trip, as well as the seat request, in order to obtain a ride. As a result, it provides instructions on how to make a transportation request. When a rider accepts or rejects your request, you will be notified.`;
      case "Book Ride":
        return `Riders can accept or reject trip requests from the request list under the ride tab, and passengers will be notified as a result.`;
      case "Pricing":
        return `The cost of a ride is determined by the vehicle's specifications (Class, Fuel type), as well as the distance travelled. The 10% DropMe commission is paid when the ride is completed. The calculation for a one-kilometer ride is shown in the following table.`;
      case "Wallet":
        return `You can add your credit point to the wallet. You can use the dummy payment interface to add your.`;
      case "Notification":
        return `In this section, you will receive notifications. You will be sent to the appropriate screen after clicking on the notification. You can mark all of the notifications as read, one by one, or all at once.`;
    }
  }

  return <Text fontSize={18}>{getMessage()}</Text>;
};

export default HelpModal;
