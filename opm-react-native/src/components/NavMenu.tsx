import { Component } from "react";
import {
  View,
  Dimensions,
  Pressable,
  PressableProps,
  Image,
} from "react-native";
import {
  withTranslation,
  WithTranslation,
  useTranslation,
} from "react-i18next";

import { styles } from "@app/styles/NavStyles";
import SideMenu from "react-native-side-menu-updated";
import { getIconFromName } from "@app/utils/ImageUtils";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@app/App";
import { Text } from "@app/components/OPMComponents";

type State = {
  isOpen: boolean;
};

type NavMenuProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

class NavMenu extends Component<NavMenuProps & WithTranslation, State> {
  state = {
    isOpen: false,
  };
  render() {
    const { isOpen } = this.state;
    const screenWidth = Dimensions.get("screen").width;
    return (
      <SideMenu
        menu={
          <Menu
            closeMenu={() => this.setState({ isOpen: false })}
            navigation={this.props.navigation}
          />
        }
        disableGestures={true}
        openMenuOffset={screenWidth}
        isOpen={isOpen}
      >
        <View
          style={{ backgroundColor: "white", height: "100%", width: "100%" }}
        >
          <NavButton
            isMenuOpen={false}
            onPress={() => this.setState({ isOpen: true })}
          />
          {this.props.children}
        </View>
      </SideMenu>
    );
  }
}

type NavButtonProps = {
  onPress: () => void;
  isMenuOpen: boolean;
};
function NavButton(props: NavButtonProps): JSX.Element {
  return (
    <Pressable onPress={props.onPress} style={styles.navButton}>
      <View>
        <View
          style={
            !props.isMenuOpen
              ? styles.navButtonPart
              : { ...styles.navButtonPart, ...styles.navButtonClose1 }
          }
        />
        <View
          style={
            !props.isMenuOpen
              ? styles.navButtonPart
              : { ...styles.navButtonPart, ...styles.navButtonClose2 }
          }
        />
        {!props.isMenuOpen && <View style={styles.navButtonPart} />}
      </View>
    </Pressable>
  );
}

type MenuProps = {
  closeMenu: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};
function Menu(props: MenuProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <View style={styles.menu}>
      <NavButton isMenuOpen={true} onPress={props.closeMenu} />
      <View style={styles.navMenu}>
        <MenuLink
          text={t("my-passwords")}
          navLink={"Home"}
          iconName={"lock"}
          navigation={props.navigation}
          closeMenu={props.closeMenu}
        />
      </View>
    </View>
  );
}

type MenuLinkProps = {
  iconName?: string;
  text: string;
  navLink: "Home";
  closeMenu: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};
function MenuLink(props: PressableProps & MenuLinkProps): JSX.Element {
  return (
    <Pressable
      {...props}
      style={styles.menuLink}
      onPress={() => {
        props.closeMenu();
        props.navigation.navigate(props.navLink);
      }}
    >
      {props.iconName && (
        <Image
          style={styles.menuLinkIcon}
          source={getIconFromName(props.iconName)}
        />
      )}
      <Text style={styles.menuLinkText}>{props.text}</Text>
    </Pressable>
  );
}

export default withTranslation()(NavMenu);
