import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomTheme {
  }

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1" } /* component props */,
          style: {
            fontWeight: 400,
            fontSize: "2.5rem",
            lineHeight: "normal",
            letterSpacing: "normal",
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "rgb(255,254,246, 0.4)",
          boxShadow: "none",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1400px !important",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#30475E",
    },
  },
});

export default theme;
