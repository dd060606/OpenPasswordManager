import { Component } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { commonStyles } from "app/styles/CommonStyles";
import {
  Button,
  Text,
  useThemeColor,
  View as ThemedView,
} from "./OPMComponents";
import { Modal, View, StyleSheet } from "react-native";
import { Slider as DefaultSlider } from "@miblanchard/react-native-slider";
import DefaultCheckBox from "react-native-bouncy-checkbox";
type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onConfirm: (password: string) => void;
};
type State = {
  passwordLength: number;
  numbersEnabled: boolean;
  lowercaseEnabled: boolean;
  uppercaseEnabled: boolean;
  symbolsEnabled: boolean;
};
class GeneratePassModal extends Component<Props & WithTranslation, State> {
  state = {
    passwordLength: 20,
    numbersEnabled: true,
    lowercaseEnabled: true,
    uppercaseEnabled: true,
    symbolsEnabled: true,
  };

  setVisible = (visible: boolean) => {
    if (visible === false) {
      this.setState({
        passwordLength: 20,
        numbersEnabled: true,
        lowercaseEnabled: true,
        uppercaseEnabled: true,
        symbolsEnabled: true,
      });
    }
    this.props.setVisible(visible);
  };

  generatePassword = () => {
    const {
      passwordLength,
      numbersEnabled,
      lowercaseEnabled,
      uppercaseEnabled,
      symbolsEnabled,
    } = this.state;

    let generatedPassword = "";
    const specialsChars = [..."@$!%*#?&"];
    const letters = [..."abcdefghijklmnopqrstuvwxyz"];
    const numbers = [..."0123456789"];

    if (
      !numbersEnabled &&
      !lowercaseEnabled &&
      !uppercaseEnabled &&
      !symbolsEnabled
    ) {
      return "";
    }

    while (generatedPassword.length <= passwordLength) {
      const randomResult = this.getRandomNumber(4);
      if (generatedPassword.length === passwordLength - 1) {
        const containLowercase = /^(?=.*[a-z])[a-zA-Z\d@$!%*#?&_]{8,}$/;
        const containUppercase = /^(?=.*[A-Z])[a-zA-Z\d@$!%*#?&_]{8,}$/;
        const containSpecialChar = /^(?=.*[$!%*#?&_])[a-zA-Z\d@$!%*#?&_]{8,}$/;
        const containNumber = /^(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/;
        if (!containLowercase.test(generatedPassword) && lowercaseEnabled) {
          generatedPassword += letters[this.getRandomNumber(letters.length)];
        } else if (
          !containUppercase.test(generatedPassword) &&
          uppercaseEnabled
        ) {
          generatedPassword +=
            letters[this.getRandomNumber(letters.length)].toUpperCase();
        } else if (
          !containSpecialChar.test(generatedPassword) &&
          symbolsEnabled
        ) {
          generatedPassword +=
            specialsChars[this.getRandomNumber(specialsChars.length)];
        } else if (!containNumber.test(generatedPassword) && numbersEnabled) {
          generatedPassword += numbers[this.getRandomNumber(numbers.length)];
        }
        break;
      }
      if (randomResult === 0) {
        if (symbolsEnabled) {
          generatedPassword +=
            specialsChars[this.getRandomNumber(specialsChars.length)];
        }
      } else if (randomResult === 1) {
        if (uppercaseEnabled) {
          generatedPassword +=
            letters[this.getRandomNumber(letters.length)].toUpperCase();
        }
      } else if (randomResult === 2) {
        if (lowercaseEnabled) {
          generatedPassword += letters[this.getRandomNumber(letters.length)];
        }
      } else {
        if (numbersEnabled) {
          generatedPassword += numbers[this.getRandomNumber(numbers.length)];
        }
      }
    }
    return generatedPassword;
  };

  getRandomNumber(max: number) {
    return Math.floor(Math.random() * max);
  }

  handleOptionsChange = (
    optionName:
      | "uppercaseEnabled"
      | "lowercaseEnabled"
      | "numbersEnabled"
      | "symbolsEnabled",
    value: boolean
  ) => {
    this.setState({ ...this.state, [optionName]: value });
  };

  render() {
    const { visible, t, onConfirm } = this.props;
    const {
      passwordLength,
      uppercaseEnabled,
      lowercaseEnabled,
      numbersEnabled,
      symbolsEnabled,
    } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => this.setVisible(false)}
      >
        <View style={commonStyles.centeredView}>
          <ThemedView
            style={[commonStyles.modalView, style.modalView]}
            darkColor={"#000"}
          >
            <Text style={commonStyles.modalTitle}>
              {t("passwords.generate")}
            </Text>
            <Text style={[commonStyles.modalText, { fontSize: 18 }]}>
              {t("passwords.length")}: {passwordLength}
            </Text>
            <Slider
              value={passwordLength}
              onValueChange={(value) =>
                this.setState({ passwordLength: value })
              }
            />
            <View style={style.optionBox}>
              <CheckBox
                onPress={() =>
                  this.handleOptionsChange(
                    "uppercaseEnabled",
                    !uppercaseEnabled
                  )
                }
                checked={uppercaseEnabled}
                label={t("passwords.uppercase")}
              ></CheckBox>
              <CheckBox
                onPress={() =>
                  this.handleOptionsChange(
                    "lowercaseEnabled",
                    !lowercaseEnabled
                  )
                }
                checked={lowercaseEnabled}
                label={t("passwords.lowercase")}
              ></CheckBox>

              <CheckBox
                onPress={() =>
                  this.handleOptionsChange("numbersEnabled", !numbersEnabled)
                }
                checked={numbersEnabled}
                label={t("passwords.numbers")}
              ></CheckBox>

              <CheckBox
                onPress={() =>
                  this.handleOptionsChange("symbolsEnabled", !symbolsEnabled)
                }
                checked={symbolsEnabled}
                label={t("passwords.symbols")}
              ></CheckBox>
            </View>
            <View style={commonStyles.modalButtonBox}>
              <Button
                onPress={() => {
                  this.setVisible(false);
                  onConfirm(this.generatePassword());
                }}
                style={commonStyles.modalButton}
                textStyle={commonStyles.modalButtonText}
                title={t("passwords.generate")}
              />
              <Button
                onPress={() => this.setVisible(false)}
                style={commonStyles.modalButton}
                textStyle={commonStyles.modalButtonText}
                title={t("cancel")}
              />
            </View>
          </ThemedView>
        </View>
      </Modal>
    );
  }
}

const Slider = (props: {
  value: number;
  onValueChange: (value: number) => void;
}) => {
  return (
    <DefaultSlider
      minimumValue={1}
      maximumValue={50}
      step={1}
      value={props.value}
      thumbTintColor={useThemeColor(
        { light: "#fff", dark: "#000" },
        "background"
      )}
      minimumTrackTintColor="#54c2f0"
      maximumTrackTintColor="rgba(84,194,240,0.5)"
      onValueChange={(value) => props.onValueChange(value as number)}
      trackStyle={style.sliderTrack}
      thumbStyle={style.sliderThumb}
    />
  );
};

const CheckBox = (props: {
  onPress: () => void;
  checked: boolean;
  label: string;
}) => {
  return (
    <DefaultCheckBox
      size={35}
      style={style.checkbox}
      text={props.label}
      isChecked={props.checked}
      onPress={props.onPress}
      textStyle={[style.optionText, { color: useThemeColor({}, "text") }]}
      unfillColor={useThemeColor({}, "background")}
      iconStyle={{ borderRadius: 5 }}
      innerIconStyle={{ borderRadius: 5 }}
      fillColor="#54c2f0"
    />
  );
};
const style = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 460,
  },
  slider: {
    width: 300,
    opacity: 1,
    height: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  sliderTrack: {
    width: 300,
    height: 5,
  },
  sliderThumb: {
    width: 30,
    borderColor: "#54c2f0",
    borderWidth: 2,
    borderStyle: "solid",
    height: 30,
    borderRadius: 50,
  },
  optionBox: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "auto",
  },
  optionText: {
    fontWeight: "900",
    fontSize: 22,
    textDecorationLine: "none",
  },
  checkbox: {
    marginTop: 10,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: 220,
  },
});

export default withTranslation()(GeneratePassModal);
