import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { ThemeProps, useThemeColor } from "./OPMComponents";
import type { LegacyRef } from "react";
import * as Clipboard from "expo-clipboard";
import { getImageFromName } from "app/utils/ImageUtils";

type InputProps = {
  isValid: boolean;
  icon?: string;
  customIcon?: string;
  password?: boolean;
  onIconPress?: () => void;
  smallInput?: boolean;
  copyButton?: boolean;
};

const Input = (props: TextInputProps & InputProps & ThemeProps) => {
  const [focused, setFocused] = useState(false);
  const [textVisible, setTextVisible] = useState(props.password === undefined);
  const {
    isValid,
    icon,
    password,
    smallInput,
    lightColor,
    darkColor,
    copyButton,
    customIcon,
  } = props;
  const textColor = useThemeColor({}, "text");
  const iconStyle = [withIconStyles.icon, { color: textColor }];
  const fieldColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "field"
  );
  let inputStyle = password
    ? withIconStyles.passwordInput
    : icon
    ? withIconStyles.input
    : styles.input;
  const [customMargin, setCustomMargin] = useState(0);
  useEffect(() => {
    if (
      copyButton &&
      (!props.value || (props.value && props.value.length < 10))
    ) {
      setCustomMargin(-30);
    } else {
      setCustomMargin(0);
    }
  }, [props.value]);

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
        <TouchableOpacity
          onPress={() =>
            props.onIconPress !== undefined ? props.onIconPress() : () => {}
          }
        >
          <FontAwesome size={30} style={iconStyle} name={icon as any} />
        </TouchableOpacity>
      )}
      {customIcon !== undefined && (
        <TouchableOpacity
          onPress={() =>
            props.onIconPress !== undefined ? props.onIconPress() : () => {}
          }
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={getImageFromName(customIcon)}
          />
        </TouchableOpacity>
      )}

      <TextInput
        {...props}
        style={[
          { color: textColor },
          inputStyle,
          copyButton ? { marginRight: customMargin } : {},
        ]}
        placeholderTextColor={textColor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={!textVisible}
        placeholder={
          focused || props.value !== "" ? undefined : props.placeholder
        }
      />
      {copyButton !== undefined && (
        <TouchableOpacity
          onPress={() =>
            props.value !== undefined
              ? Clipboard.setStringAsync(props.value)
              : {}
          }
        >
          <FontAwesome style={iconStyle} name={"copy"} size={30} />
        </TouchableOpacity>
      )}
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
