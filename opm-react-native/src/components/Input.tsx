import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import { Component } from "react";

type State = {
  isFocused: boolean;
};
type InputProps = {
  isValid: boolean;
};

class Input extends Component<TextInputProps & InputProps, State> {
  state = {
    isFocused: false,
  };
  render() {
    const { isFocused } = this.state;
    const { isValid } = this.props;
    return (
      <View
        style={{
          ...styles.container,
          ...(isFocused
            ? isValid
              ? styles.inputFocused
              : styles.invalidInput
            : {}),
        }}
      >
        <TextInput
          {...this.props}
          style={{ ...styles.input }}
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: "rgba(236, 236, 236, 0.8)",
    borderRadius: 5,
    width: "75%",
    height: 40,
    borderWidth: 1,
    backgroundColor: "rgba(236, 236, 236, 0.8)",
    marginTop: 25,
  },
  input: {
    fontSize: 19,
    fontFamily: "OpenSans",
    backgroundColor: "transparent",
    textAlign: "center",
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

export { Input };
