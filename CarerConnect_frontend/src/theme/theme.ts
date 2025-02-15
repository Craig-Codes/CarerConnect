// theme file is provided to entire app to allow components to share simialr look and feel

import { colors } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Main colours are defined here and used in the theme to customsie components
let theme = createTheme({
  palette: {
    primary: {
      main: "#8c64aa",
    },
    secondary: {
      main: "#330066",
    },
    error: {
      main: colors.red.A700,
    },
  },
});

theme = createTheme(theme, {
  // components are overwritten to customise look and feel
  components: {
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: theme.palette.secondary.main,
        },
        h6: {
          color: theme.palette.secondary.main,
        },
        subtitle1: {
          color: theme.palette.secondary.main,
          fontWeight: 800,
        },
        body1: {
          color: theme.palette.secondary.main,
        },
        body2: {
          color: theme.palette.error.main,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main, // Red border on error
          },
          "&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main, // Red border when focused on error
          },
          "&:hover.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.error.main, // Red border on hover when there's an error
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: theme.palette.error.main, // Red helper text on error
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: grey[300],
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "Primary" },
          style: {
            color: "#FFFFFF",
            backgroundColor: "#223257",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#FFFFFF",
            "&:hover": {
              background: theme.palette.primary.light,
              color: colors.blue[500],
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.blue[500],
            },
            "&:disabled": {
              backgroundColor: colors.grey[300],
            },
          },
        },
        {
          props: { variant: "Success" },
          style: {
            color: "#FFFFFF",
            backgroundColor: "#223257",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#FFFFFF",
            "&:hover": {
              background: theme.palette.primary.light,
              color: colors.teal.A400,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.teal[500],
            },
          },
        },
        {
          props: { variant: "Error" },
          style: {
            color: "#FFFFFF",
            backgroundColor: "#223257",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#FFFFFF",
            "&:hover": {
              background: theme.palette.primary.light,
              color: colors.red.A700,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.red.A700,
            },
          },
        },
      ],
    },
  },
});

// This ensure typography blocks scale based on screen size
theme = responsiveFontSizes(theme);

export default theme;
