import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { ThemeProps, useThemeColor } from "./OPMComponents";

type InputProps = {
  isValid: boolean;
  icon?: string;
  password?: boolean;
  smallInput?: boolean;
};

const Input = (props: TextInputProps & InputProps & ThemeProps) => {
  const [focused, setFocused] = useState(false);
  const [textVisible, setTextVisible] = useState(props.password === undefined);
  const { isValid, icon, password, smallInput, lightColor, darkColor } = props;
  const iconStyle = [
    withIconStyles.icon,
    { color: useThemeColor({ light: lightColor, dark: darkColor }, "text") },
  ];

  return (
    <View
      style={{
        ...styles.container,
        ...(focused
          ? isValid
            ? styles.inputFocused
            : styles.invalidInput
          : {}),
        ...(smallInput ? { width: "49%" } : {}),
      }}
    >
      {icon !== undefined && (
        <FontAwesome size={30} style={iconStyle} name={icon as any} />
      )}
      <TextInput
        {...props}
        style={
          password
            ? withIconStyles.passwordInput
            : icon
            ? withIconStyles.input
            : styles.input
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={!textVisible}
        placeholder={
          focused || props.value !== "" ? undefined : props.placeholder
        }
      />
      {password !== undefined && (
        <TouchableOpacity onPress={() => setTextVisible(!textVisible)}>
          <FontAwesome
            style={iconStyle}
            name={textVisible ? "eye" : "eye-slash"}
            size={30}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(236, 236, 236, 0.8)",
    borderRadius: 5,
    width: "90%",
    height: 50,
    borderWidth: 1,
    backgroundColor: "rgba(236, 236, 236, 0.8)",
    marginTop: 20,
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "OpenSans",
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
  inputFocused: {
    borderColor: "#54c2f0",
  },
  invalidInput: {
    borderColor: "#F42D0E",
  },
});
const withIconStyles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
    marginLeft: 5,
  },
  input: {
    ...styles.input,
    marginRight: 15,
    width: "85%",
  },
  passwordInput: {
    ...styles.input,
    width: "75%",
  },
});

export default Input;
