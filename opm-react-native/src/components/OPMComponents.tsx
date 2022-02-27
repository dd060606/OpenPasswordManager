import { Text as RNText, StyleSheet, TextProps } from "react-native";

function Text(props: TextProps): JSX.Element {
  return (
    <RNText {...props} style={{ ...styles.text, ...(props.style as object) }} />
  );
}
const styles = StyleSheet.create({
  text: {
    fontFamily: "OpenSans",
  },
});

export { Text };
