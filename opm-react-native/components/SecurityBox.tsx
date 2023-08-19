import { View, Text } from "./OPMComponents";
import { StyleSheet, Image } from "react-native";
import { Credentials } from "app/types/types";
import { useState } from "react";
import { decryptString } from "app/utils/Utils";
import { getPassword } from "app/utils/Config";

type Props = {
  creds: Credentials;
  passwordStrength: 15 | 30 | 50 | 70;
};
const SecurityBox = (props: Props) => {
  const colorMap = {
    15: "#F02A0B",
    30: "#F0680B",
    50: "#82F00B",
    70: "#0BF06B",
  };
  const [isImgError, setImgError] = useState(false);

  const creds = props.creds;
  let password = decryptString(creds.password, getPassword());
  let hiddenPassword =
    password.substring(0, 2) +
    (password.length > 2 ? "*".repeat(password.length - 2) : "");
  return (
    <View style={style.main} darkColor="#3D3D3D">
      <View style={style.box} darkColor="#3D3D3D">
        <View style={style.infoView} darkColor="#3D3D3D">
          {isImgError && (
            <View style={[style.logoView, style.image]}>
              <Text style={style.logoText}>{creds.name.substring(0, 2)}</Text>
            </View>
          )}
          {!isImgError && (
            <Image
              source={{ uri: creds.sImageURL }}
              style={style.image}
              onError={() => setImgError(true)}
            />
          )}

          <Text style={style.title}>{creds.name}</Text>
          <Text style={style.text}>
            {creds.username.length > 19
              ? creds.username.substring(0, 19) + "..."
              : creds.username}
          </Text>
          <Text style={[style.text, { fontWeight: "700" }]}>
            {hiddenPassword.length > 19
              ? hiddenPassword.substring(0, 19) + "..."
              : hiddenPassword}
          </Text>
        </View>
      </View>
      <View
        style={[
          {
            width: `${props.passwordStrength}%`,
            backgroundColor: colorMap[props.passwordStrength],
          },
          style.strengthBar,
        ]}
      ></View>
    </View>
  );
};

const style = StyleSheet.create({
  main: {
    marginTop: 5,
    width: "90%",
    alignSelf: "center",
    marginBottom: 30,
  },
  box: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  strengthBar: {
    height: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  infoView: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
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
    maxHeight: 50,
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
});

export default SecurityBox;
