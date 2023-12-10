import { AppBar, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>
          <img src="/img/logo.png" alt="logo" className={classes.logo} />
          <ConnectButton />
        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    margin: "auto",
    padding: "0",
    "@media (max-width:1120px)": {
      padding: "0 20px",
    },
    "@media (max-width:599px)": {
      padding: "0 15px",
    },
  },
  logo: {
    height: 50,
    marginRight: 10,
    userDrag: "none",
    "user-drag": "none",
    "-webkit-user-drag": "none",
    "user-select": "none",
    "-moz-user-select": "none",
    "-webkit-user-select": "none",
    "-ms-user-select": "none",
  },
  nav: {
    height: "70px",
    padding: "0 30px",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default Navbar;
