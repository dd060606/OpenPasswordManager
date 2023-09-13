/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//import "react-native-gesture-handler";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

import { RootStackParamList } from "app/types/types";
import LinkingConfiguration from "./LinkingConfiguration";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import LoginScreen from "app/screens/auth/LoginScreen";
import RegisterScreen from "app/screens/auth/RegisterScreen";
import PasswordsScreen from "app/screens/PasswordsScreen";
import { useTranslation } from "react-i18next";
import SettingsScreen from "app/screens/SettingsScreen";
import SecurityScreen from "app/screens/SecurityScreen";
import { getTheme } from "app/utils/Config";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function RootNavigator() {
  return (
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
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const TabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Passwords") {
            return <MaterialIcons name="vpn-key" size={size} color={color} />;
          } else if (route.name === "Settings") {
            return (
              <Ionicons name="settings-outline" size={size} color={color} />
            );
          } else if (route.name === "Security") {
            return (
              <MaterialIcons name="lock-outline" size={size} color={color} />
            );
          }
        },
        tabBarActiveTintColor: "#54c2f0",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: getTheme() === "dark" ? "#000" : "#fff",
        },
      })}
    >
      <Tab.Screen
        name="Passwords"
        component={PasswordsScreen}
        options={{ headerShown: false, tabBarLabel: t("passwords.passwords") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false, tabBarLabel: t("settings.settings") }}
      />
      <Tab.Screen
        name="Security"
        component={SecurityScreen}
        options={{ headerShown: false, tabBarLabel: t("security.security") }}
      />
    </Tab.Navigator>
  );
};

/*


// * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
// * https://reactnavigation.org/docs/bottom-tab-navigator

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}


 // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

*/

export { Stack };
