import React, { useState } from "react";
import { Select } from "native-base";

const RideType = () => {
  const [rideType, setRideType] = useState("");
  return (
    <Select
      selectedValue={rideType}
      w="175"
      accessibilityLabel="Ride Type"
      placeholder="Ride Type"
      onValueChange={(itemValue) => setRideType(itemValue)}
    >
      <Select.Item shadow={2} label="Ride Type" disabled={true} />
      <Select.Item shadow={2} label="Free" value="1" />
      <Select.Item shadow={2} label="Paid" value="2" />
    </Select>
  );
};

export default RideType;
