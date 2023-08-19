import { useTranslation } from "react-i18next";
import "@app/i18n";
import { View, Image } from "react-native";
import { Text } from "@app/components/OPMComponents";
import { credentialsElementStyles as styles } from "@app/styles/HomeStyles";

import type { Credentials } from "@app/utils/Types";

type Props = {
  credentials: Credentials;
  onClick?: (credentials: Credentials) => void;
};
const CredentialsElement = (props: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: props.credentials.sImageURL,
        }}
      />
      <Text style={styles.title}>{props.credentials.name}</Text>
    </View>
  );
};

export default CredentialsElement;
