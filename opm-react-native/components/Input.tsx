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
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  const iconStyle = [withIconStyles.icon, { color: textColor }];
  const fieldColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "field"
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: fieldColor, borderColor: fieldColor },
        focused ? (isValid ? styles.inputFocused : styles.invalidInput) : {},
        smallInput ? { width: "49%" } : {},
        props.style,
      ]}
    >
      {icon !== undefined && (
        <FontAwesome size={30} style={iconStyle} name={icon as any} />
      )}
      <TextInput
        {...props}
        style={[
          { color: textColor },
          password
            ? withIconStyles.passwordInput
            : icon
            ? withIconStyles.input
            : styles.input,
        ]}
        placeholderTextColor={textColor}
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
    borderRadius: 5,
    width: "90%",
    height: 50,
    borderWidth: 1,
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
