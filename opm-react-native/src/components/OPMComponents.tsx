import {
  Text as RNText,
  StyleSheet,
  TextProps,
  Pressable,
  ButtonProps,
  SafeAreaView as RNSafeAreaView,
  ViewProps,
  Platform,
  StatusBar,
} from "react-native";

import { useState } from "react";

type StyledButtonType = {
  textStyle?: object;
  style?: object;
  JSX?: JSX.Element;
};

function Text(props: TextProps): JSX.Element {
  return (
    <RNText {...props} style={{ ...styles.text, ...(props.style as object) }} />
  );
}

function Button(props: ButtonProps & StyledButtonType): JSX.Element {
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

function SafeAreaView(props: ViewProps): JSX.Element {
  return <RNSafeAreaView {...props} style={styles.safeArea} />;
}

function StyledButton(props: ButtonProps & StyledButtonType): JSX.Element {
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
    backgroundColor: "white",
  },
});

export { Text, Button, StyledButton, SafeAreaView };
