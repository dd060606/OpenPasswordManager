import Colors from "app/constants/Colors";
import { commonStyles } from "app/styles/CommonStyles";
import { getImageFromName } from "app/utils/ImageUtils";
import { useTranslation } from "react-i18next";
import { Modal, Image, View, StyleSheet } from "react-native";
import {
  Button,
  useThemeColor,
  View as ThemedView,
  Text,
  StyledButton,
} from "./OPMComponents";

type Props = {
  visible: boolean;
  message: string;
  onConfirm?: () => void;
  setVisible: (visible: boolean) => void;
  background?: keyof typeof Colors.light & keyof typeof Colors.dark;
};
const ErrorModal = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
    >
      <View style={commonStyles.centeredView}>
        <ThemedView
          style={[
            commonStyles.modalView,
            { backgroundColor: useThemeColor({}, "background2") },
          ]}
        >
          <Image
            style={commonStyles.modalImg}
            source={getImageFromName("error")}
          />

          <Text style={commonStyles.modalTitle}>{t("error")}</Text>

          <Text style={commonStyles.modalText}>{props.message}</Text>
          <Button
            onPress={() => props.setVisible(false)}
            style={commonStyles.modalButton}
            textStyle={commonStyles.modalButtonText}
            title={t("ok")}
          />
        </ThemedView>
      </View>
    </Modal>
  );
};
const ConfirmModal = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
    >
      <View style={commonStyles.centeredView}>
        <ThemedView
          style={[
            commonStyles.modalView,
            {
              backgroundColor: useThemeColor(
                {},
                `${props.background ? props.background : "background"}`
              ),
              height: 350,
            },
          ]}
        >
          <Image
            style={commonStyles.modalImg}
            source={getImageFromName("question")}
          />

          <Text style={commonStyles.modalTitle}>{t("confirmation")}</Text>

          <Text style={commonStyles.modalText}>{props.message}</Text>
          <View style={commonStyles.modalButtonBox}>
            <Button
              onPress={() =>
                props.onConfirm !== undefined ? props.onConfirm() : () => {}
              }
              style={commonStyles.modalButton}
              textStyle={commonStyles.modalButtonText}
              title={t("confirm")}
            />
            <Button
              onPress={() => props.setVisible(false)}
              style={commonStyles.modalButton}
              textStyle={commonStyles.modalButtonText}
              title={t("cancel")}
            />
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

export { ErrorModal, ConfirmModal };
