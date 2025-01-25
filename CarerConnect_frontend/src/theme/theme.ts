import { colors } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

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
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#BDBDBD",
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

theme = responsiveFontSizes(theme);

export default theme;
