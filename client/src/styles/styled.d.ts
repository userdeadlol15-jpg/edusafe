import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      surfaceLight: string;
      text: string;
      textSecondary: string;
      textMuted: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      border: string;
      borderLight: string;
      shadow: string;
      shadowSecondary: string;
      gradient: string;
      gradientDark: string;
    };
    fonts: {
      primary: string;
      mono: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      neon: string;
      neonSecondary: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    animations: {
      fadeIn: string;
      slideUp: string;
      slideDown: string;
      pulse: string;
      glow: string;
    };
  }
}
