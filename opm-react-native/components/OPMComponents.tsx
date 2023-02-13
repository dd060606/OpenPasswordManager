import {
  Text as RNText,
  StyleSheet,
  Pressable,
  ButtonProps,
  SafeAreaView as RNSafeAreaView,
  View as RNView,
  ScrollView as RNScrollView,
  Platform,
  StatusBar,
} from "react-native";

import { useState } from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { getSecure, getTheme } from "app/utils/Config";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  let theme = useColorScheme();

  if (getTheme() === "dark") {
    theme = "dark";
  } else if (getTheme() === "light") {
    theme = "light";
  }
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};
export type TextProps = ThemeProps & RNText["props"];
export type ViewProps = ThemeProps & RNView["props"];

type StyledButtonType = {
  textStyle?: object;
  style?: object;
  JSX?: JSX.Element;
};

export function Text(props: TextProps): JSX.Element {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <RNText style={[styles.text, { color }, style]} {...otherProps} />;
}
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <RNView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps & StyledButtonType): JSX.Element {
  const { onPress, title, style, textStyle, JSX } = props;
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      style={
        pressed
          ? { ...styles.button, ...styles.pressedButton, ...style }
          : { ...styles.button, ...style }
      }
      onPress={onPress}
      onPressOut={() => setPressed(false)}
      onPressIn={() => setPressed(true)}
    >
      {JSX && JSX}
      {!JSX && (
        <Text style={{ ...styles.buttonText, ...textStyle }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function SafeAreaView(props: ViewProps): JSX.Element {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <RNSafeAreaView
      style={[style, styles.safeArea, { backgroundColor }]}
      {...otherProps}
    />
  );
}
export function ScrollView(props: ViewProps): JSX.Element {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <RNScrollView
      style={[style, styles.safeArea, { backgroundColor }]}
      {...otherProps}
    />
  );
}

export function StyledButton(
  props: ButtonProps & StyledButtonType
): JSX.Element {
  const { onPress, title, style, textStyle, JSX } = props;

  return (
    <Pressable style={style} onPress={onPress}>
      {JSX && JSX}
      {!JSX && <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "OpenSans",
  },
  button: {
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 6,
    backgroundColor: "#54c2f0",
  },
  pressedButton: {
    backgroundColor: "#54A3F0",
  },
  buttonText: {
    fontSize: 23,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  safeArea: {
    flex: 1,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight as number) + 13 : 0,
    backgroundColor: "transparent",
  },
});
