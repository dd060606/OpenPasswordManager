import { commonStyles } from "app/styles/CommonStyles";
import { getImageFromName } from "app/utils/ImageUtils";
import { useTranslation } from "react-i18next";
import { Modal, Image, View } from "react-native";
import { Button, Text } from "./OPMComponents";

type Props = {
  visible: boolean;
  message: string;
  setVisible: (visible: boolean) => void;
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
        <View style={commonStyles.modalView}>
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
        </View>
      </View>
    </Modal>
  );
};

export { ErrorModal };
