import { View, Text, useThemeColor } from "./OPMComponents";
import { StyleSheet, Image, Pressable, Linking } from "react-native";
import type { Credentials } from "app/types/types";
import { FontAwesome } from "@expo/vector-icons";

const PasswordItem = (props: { credentials: Credentials }) => {
  const { sImageURL, name, username, url } = props.credentials;
  const textColor = useThemeColor({}, "text");
  return (
    <View style={style.container}>
      <View style={style.content}>
        <Image source={{ uri: sImageURL }} style={style.image} />
        <View style={style.opposed}>
          <View style={style.textView}>
            <Text style={{ fontWeight: "bold" }}>{name}</Text>
            <Text>{username}</Text>
          </View>
          <View>
            <FontAwesome
              name="external-link"
              style={{ color: textColor }}
              size={30}
              onPress={() => {
                Linking.canOpenURL(url).then((supported) => {
                  if (supported) {
                    Linking.openURL(url);
                  }
                });
              }}
            />
          </View>
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
  opposed: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "75%",
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
