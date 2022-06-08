import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Component } from "react";
import { FontAwesome } from "@expo/vector-icons";

type State = {
  isFocused: boolean;
  isTextVisible: boolean;
};
type InputProps = {
  isValid: boolean;
  icon?: string;
  password?: boolean;
  smallInput?: boolean;
};

class Input extends Component<TextInputProps & InputProps, State> {
  state = {
    isFocused: false,
    isTextVisible: this.props.password === undefined,
  };

  render() {
    const { isFocused, isTextVisible } = this.state;
    const { isValid, icon, password, smallInput } = this.props;

    return (
      <View
        style={{
          ...styles.container,
          ...(isFocused
            ? isValid
              ? styles.inputFocused
              : styles.invalidInput
            : {}),
          ...(smallInput ? { width: "49%" } : {}),
        }}
      >
        {icon !== undefined && (
          <FontAwesome
            size={30}
            style={withIconStyles.icon}
            name={icon as any}
          />
        )}
        <TextInput
          {...this.props}
          style={
            password
              ? withIconStyles.passwordInput
              : icon
              ? withIconStyles.input
              : styles.input
          }
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
          secureTextEntry={!isTextVisible}
        />
        {password !== undefined && (
          <TouchableOpacity
            onPress={() => this.setState({ isTextVisible: !isTextVisible })}
          >
            <FontAwesome
              style={withIconStyles.icon}
              name={isTextVisible ? "eye" : "eye-slash"}
              size={30}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

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
