import { Appearance, Dimensions } from "react-native";
export const colorScheme = Appearance.getColorScheme();

export const { width: windowWidth, height: windowHeight } = Dimensions.get(
  "window"
);

export const appGroupIdentifier = "group.com.trippyllc.widgetsapp";
export const PrimaryRed = "#FF2D55";
export const PrimaryGreen = colorScheme === "light" ? "#34C759" : "#32D74B";
export const PrimaryOrange = "#FF9500";
export const PrimaryYellow = "#FFD60A";
export const PrimaryBlue = colorScheme === "light" ? "#017AFD" : "#0A84FF";
export const PrimaryLightBlue = "#5AC8FA";
export const SecondaryBlue = "rgba(25, 168, 252, 0.5)";
export const PrimaryPurple = "#5856D6";
export const PrimaryMajenta = "#AF52DE";
export const PrimaryPink = "#34C759";
export const SecondaryPink = "#FFD6F4";
export const SecondaryRed = "rgba(255, 59, 48, 0.2)";
export const PrimaryWhite = colorScheme === "light" ? "#ffffff" : "#1C1C1E";
export const SecondaryWhite = colorScheme === "light" ? "#F1F1F1" : "#303030";
export const PrimaryLightGrey = colorScheme === "light" ? "#E5E5EA" : "#262629";
export const SecondaryGrey = "rgba(197, 197, 197, 0.4)";
export const PrimaryBlack = "#1A1A1A";
export const AlternativeLightGrey = "#BAC0C9";
export const SecondaryText = colorScheme === "light" ? "#B0B0B4" : "white";
export const BorderBottom = "rgba(0, 0, 0, 0.1)";
export const PrimaryBorderColor =
  colorScheme === "light" ? "rgba(177, 177, 177, 1)" : "rgba(255,255,255, .3)";
export const PrimaryBoxShadow = "0px 1px 3px rgba(0, 0, 0, .05)";
export const NotificiationsBoxShadow = "0px .6px 1.6px rgba(0, 0, 0, .15)";
export const PrimaryBorderRadius = "16px";
export const PrimaryTextColor = colorScheme === "light" ? "black" : "white";
export const InversePrimaryTextColor =
  colorScheme === "light" ? "white" : "black";
export const BannerColor =
  colorScheme === "light" ? "rgba(245, 245, 245, 0.98)" : "rgba(1,1,1,.1)";
export const PrimaryTextInput = "#E4E3E9";
export const PrimaryBorderWidth = ".95px";
export const BackgroundColor = colorScheme === "light" ? "white" : "black";
export const SecondaryBackgroundColor =
  colorScheme === "light" ? "#F2F2F6" : "black";

export const PrimaryDividerColor =
  colorScheme === "light" ? "#E5E5EA" : "#3A3A3C";
export const BackgroundColorArray =
  colorScheme === "light" ? ["white", "#ffffff"] : ["black", "#1C1C1E"];
export const FriendsBackgroundColor =
  colorScheme === "light" ? "#d6d7dc" : "#2B2B2B";

export const circleDimensionMultiplier = 0.13;
