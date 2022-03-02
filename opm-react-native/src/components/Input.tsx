import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Component } from "react";
import { getIconFromName } from "../utils/ImageUtils";

type State = {
  isFocused: boolean;
  isTextVisible: boolean;
};
type InputProps = {
  isValid: boolean;
  icon?: number;
  password?: boolean;
};

class Input extends Component<TextInputProps & InputProps, State> {
  state = {
    isFocused: false,
    isTextVisible: this.props.password === undefined,
  };
  render() {
    const { isFocused, isTextVisible } = this.state;
    const { isValid, icon, password } = this.props;

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
        {icon !== undefined && (
          <Image style={withIconStyles.icon} source={icon} />
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
            <Image
              style={withIconStyles.icon}
              source={
                isTextVisible
                  ? getIconFromName("eye")
                  : getIconFromName("eyeSlash")
              }
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
    width: "80%",
    height: 40,
    borderWidth: 1,
    backgroundColor: "rgba(236, 236, 236, 0.8)",
    marginTop: 25,
  },
  input: {
    justifyContent: "center",
    flex: 1,
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

export { Input };
