import { useState, useEffect } from "react";
import { registerRootComponent } from "expo";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as Font from "expo-font";

import "./i18n";

//Screens
import LoginScreen from "@app/screens/auth/LoginScreen";
import RegisterScreen from "@app/screens/auth/RegisterScreen";
import HomeScreen from "@app/screens/HomeScreen";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
type RegisterProps = NativeStackScreenProps<RootStackParamList, "Register">;
type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Stack = createNativeStackNavigator();

function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={async () =>
          Font.loadAsync({
            OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
            OpenSansBold: require("../assets/fonts/OpenSans-Bold.ttf"),
            OpenSansItalic: require("../assets/fonts/OpenSans-Italic.ttf"),
            OSSemiBold: require("../assets/fonts/OpenSans-SemiBold.ttf"),
          })
        }
        onFinish={() => setDataLoaded(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);

export type { LoginProps, RegisterProps, HomeProps };
export default App;
