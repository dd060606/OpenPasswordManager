import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, Button } from "react-native";

import type { LoginProps } from "../../App";

import { loginStyles as styles } from "../../styles/AuthStyles";

type State = {};

class LoginScreen extends Component<LoginProps, State> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Login screen</Text>
        <Button
          title="Go to register"
          onPress={() => this.props.navigation.navigate("Register")}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default LoginScreen;
