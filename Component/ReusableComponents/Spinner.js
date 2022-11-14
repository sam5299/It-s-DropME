import React from "react";
import { Heading, HStack } from "native-base";

const Spinner = () => {
  return (
    <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel="Loading.." size={"lg"} />
      <Heading color="primary.500" fontSize="md">
        Loading
      </Heading>
    </HStack>
  );
};

export default Spinner;
