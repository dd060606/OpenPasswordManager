import { View, Text, useThemeColor } from "./OPMComponents";
import { StyleSheet, Image, Pressable, Linking } from "react-native";
import { useState } from "react";
import type { Credentials } from "app/types/types";
import { FontAwesome } from "@expo/vector-icons";

const PasswordItem = (props: {
  credentials: Credentials;
  onPress: () => void;
}) => {
  const { sImageURL, name, username, url } = props.credentials;
  const textColor = useThemeColor({}, "text");
  const [isImgError, setImgError] = useState(false);
  return (
    <View style={style.container}>
      <Pressable onPress={props.onPress}>
        <View style={style.content}>
          {isImgError && (
            <View style={[style.logoView, style.image]}>
              <Text style={style.logoText}>{name.substring(0, 2)}</Text>
            </View>
          )}
          {!isImgError && (
            <Image
              source={{ uri: sImageURL }}
              style={style.image}
              onError={() => setImgError(true)}
            />
          )}

          <View style={style.opposed}>
            <View style={style.textView}>
              <Text style={{ fontWeight: "bold" }}>{name}</Text>
              <Text>{username}</Text>
            </View>
            <View>
              <FontAwesome
                name="external-link"
                style={{ color: textColor, marginRight: 10 }}
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
      </Pressable>

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
    width: "80%",
  },
  opposed: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "75%",
  },
  image: {
    width: 76,
    height: 50,
    resizeMode: "cover",
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 15,
  },
  logoView: {
    backgroundColor: "#54c2f0",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  line: {
    height: 1,
    width: "90%",
    marginTop: 10,
  },
});
export default PasswordItem;
