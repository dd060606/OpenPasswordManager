import { SafeAreaView } from "@app/components/OPMComponents";
import { View, Animated, Easing, Image } from "react-native";
import { loadingStyles as styles } from "@app/styles/HomeStyles";
import { getImageFromName } from "@app/utils/ImageUtils";

function Loading(): JSX.Element {
  let spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <SafeAreaView>
      <Animated.View
        style={{ ...styles.animatedView, transform: [{ rotate: spin }] }}
      >
        <View style={styles.spinner}></View>
      </Animated.View>
      <Image source={getImageFromName("icon")} style={styles.icon} />
    </SafeAreaView>
  );
}

export default Loading;
