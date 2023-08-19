import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import "./i18n";
import { getTheme, loadSettings } from "./utils/Config";
import { useState } from "react";
import { StatusBar } from "./components/OPMComponents";

export default function App() {
  const isLoadingComplete = useCachedResources();
  let colorScheme = useColorScheme();
  const [scheme, setScheme] = useState(colorScheme);
  loadSettings()
    .then(() => {
      if (getTheme() === "dark") {
        setScheme("dark");
      } else if (getTheme() === "light") {
        setScheme("light");
      }
    })
    .catch(() => {});
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={scheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
