import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import { useFonts } from 'expo-font';

export const COLORS = {
  //BASE COLORS
  primary: "#D4003C", //main color
  secondary: "#CDA0AD",
  lightPrimary: "#EABECB",
  lightSecondary: "#FFD7E2",

  //COLORS
  gray: "#CDCDD2",
  lightWhite: '#F9FAFB',
  lightGray: "#F5F5F6",
  lightGray2: "#F6F6F7",
  lightGray3: "#EFEFF1",
  lightGray4: "#F8F8F9",
  transparent: "transparent",
  darkgray: "#898C95",
  darkMode: "#333248",

  //iPhone color
  blue: "#007AFF",
  skyBlue: "#1479FF",

  //TAG COLORS
  tag_red: "#D4003C",
  tag_pink: "#FF7979",
  tag_purple: "#7B46EA",
  tag_blue: "#2E86DE",
  tag_green: "#20C997",
  tag_yellow: "#FACF7A",
  tag_orange: "#F0942B",
  tag_gray: "#95AFC0",
  tag_darkblue: "#23A6B3"
};

export const SIZES = {
  //GLOBAL SIZES
  base: 8,
  font: 14,
  radius: 6,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  //app dimentions
  width,
  height,
};

const appTheme = { COLORS, SIZES };

export default appTheme;
