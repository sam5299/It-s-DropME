import { Text, View, Pressable, FlatList, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Input, Box, Stack, Icon } from "native-base";
import { AuthContext } from "./Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// import { Location } from "./location";

const SourceDestination = ({ dispatch }) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [showFlatList, setShowFlatList] = useState(false);
  const [startOrEnd, setStartOrEnd] = useState(0);
  const [data, setData] = useState();
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const onChangeText = async (text, locationName) => {
    try {
      {
        if (locationName === "startLocation") {
          setStartLocation(text);
          dispatch({ type: "source", payload: text });
          setStartOrEnd(0);
        }
        if (locationName == "endLocation") {
          setEndLocation(text);
          dispatch({ type: "destination", payload: text });
          setStartOrEnd(1);
        }
      }
      if (text.length === 0) {
        setShowFlatList(false);
        return setData([]);
      }
      if (text.length > 2) {
        let endpoint = `${url}/map/api/search?location=${text}&limit=${50}&countrycodes=in`;
        const res = await fetch(endpoint);
        if (res) {
          const data = await res.json();
          if (data.length > 0) {
            setData(data);
            setShowFlatList(true);
          }
        }
      } else {
        setShowFlatList(false);
      }
    } catch (exception) {
      console.log("exception:" + exception);
    }
  };

  const getItemText = (item) => {
    let mainText = item.display_name;

    if (item.type === "city" && item.address.state)
      mainText += ", " + item.address.name + ", " + item.address.state;
    return (
      <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
        <View style={{ marginLeft: 10, flexShrink: 1 }}>
          <Text style={{ fontWeight: "700" }}>{mainText}</Text>
          <Text style={{ fontSize: 12 }}>{item.address.country}</Text>
        </View>
      </View>
    );
  };

  let flatList = (
    <ScrollView nestedScrollEnabled={true} style={{ width: "100%" }}>
      <View>
        <ScrollView horizontal={true} style={{ width: "100%" }}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  {
                    //console.log("item:", item);
                    if (startOrEnd === 0) {
                      setStartLocation(item.display_name);
                      dispatch({ type: "source", payload: item.display_name });
                      dispatch({ type: "s_lat", payload: item.lat });
                      dispatch({ type: "s_lon", payload: item.lon });
                    }
                    if (startOrEnd === 1) {
                      setEndLocation(item.display_name);
                      dispatch({
                        type: "destination",
                        payload: item.display_name,
                      });
                      dispatch({ type: "d_lat", payload: item.lat });
                      dispatch({ type: "d_lon", payload: item.lon });
                    }

                    startOrEnd === 0
                      ? setStartLocation(item.display_name)
                      : setEndLocation(item.display_name);
                  }
                  setShowFlatList(false);
                }}
              >
                {getItemText(item)}
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );

  return (
    <Box flexDirection="column">
      <Input
        mx="3"
        backgroundColor={"white"}
        placeholder="Source"
        value={startLocation}
        w="95%"
        onChangeText={(item) => onChangeText(item, "startLocation")}
        InputRightElement={
          <Icon
            as={<MaterialCommunityIcons name="close-circle" />}
            size={5}
            mr="2"
            color="rgba(6,182,212,1.00)"
            onPress={() => {
              setStartLocation(null);
              dispatch({ type: "source", payload: "" });
            }}
          />
        }
      />
      {showFlatList ? (startOrEnd === 0 ? flatList : null) : null}
      <Input
        mt={5}
        backgroundColor={"white"}
        mx="3"
        placeholder="Destination"
        value={endLocation}
        w="95%"
        onChangeText={(item) => onChangeText(item, "endLocation")}
        InputRightElement={
          <Icon
            as={<MaterialCommunityIcons name="close-circle" />}
            size={5}
            mr="2"
            color="rgba(6,182,212,1.00)"
            onPress={() => {
              setEndLocation(null);
              dispatch({ type: "destination", payload: "" });
            }}
          />
        }
      />
      {showFlatList ? (startOrEnd === 1 ? flatList : null) : null}
    </Box>

    // <Stack direction={"column"} width={"100%"}>
    //   <Text
    //     style={{
    //       marginLeft: 12,
    //       marginVertical: 5,
    //       fontSize: 12,
    //       marginTop: 45,
    //     }}
    //   >
    //     Source
    //   </Text>
    //   <TextInput
    //     placeholder="source"
    //     value={startLocation}
    //     onChangeText={(item) => onChangeText(item, "startLocation")}
    //     style={{
    //       height: 48,
    //       marginHorizontal: 12,
    //       borderWidth: 1,
    //       paddingHorizontal: 10,
    //       borderRadius: 5,
    //     }}
    //   />
    //   {showFlatList ? (startOrEnd === 0 ? flatList : null) : null}
    // </Stack>
    // <Stack direction={"column"} width={"50%"}>
    //   <Text
    //     style={{
    //       marginLeft: 12,
    //       marginVertical: 5,
    //       fontSize: 12,
    //       marginTop: 45,
    //     }}
    //   >
    //     Destination
    //   </Text>
    //   <TextInput
    //     placeholder="destination"
    //     value={endLocation}
    //     onChangeText={(item) => onChangeText(item, "endLocation")}
    //     style={{
    //       height: 48,
    //       marginHorizontal: 12,
    //       borderWidth: 1,
    //       paddingHorizontal: 10,
    //       borderRadius: 5,
    //     }}
    //   />
    //   {showFlatList ? (startOrEnd === 1 ? flatList : null) : null}
    // </Stack>
  );
};

export default SourceDestination;
