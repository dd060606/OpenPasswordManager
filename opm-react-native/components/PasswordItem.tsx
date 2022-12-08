import { View, Text, useThemeColor } from "./OPMComponents";
import { StyleSheet, Image } from "react-native";
import type { Credentials } from "app/types/types";

const PasswordItem = (props: { credentials: Credentials }) => {
  const { id, sImageURL, name, username } = props.credentials;
  const textColor = useThemeColor({}, "text");
  return (
    <View style={style.container}>
      <View style={style.content}>
        <Image source={{ uri: sImageURL }} style={style.image} />
        <View style={style.textView}>
          <Text style={{ fontWeight: "bold" }}>{name}</Text>
          <Text>{username}</Text>
        </View>
      </View>
      <View style={[{ backgroundColor: textColor }, style.line]} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textView: {
    flexDirection: "column",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 15,
  },
  line: {
    height: 1,
    width: "95%",
    marginTop: 10,
  },
});
export default PasswordItem;
