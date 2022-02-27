import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

import type { RegisterProps } from "../../App";

import { registerStyles as styles } from "../../styles/AuthStyles";

type State = {};

class RegisterScreen extends Component<RegisterProps, State> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Register screen</Text>
        <Button
          title="Go to Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default RegisterScreen;
