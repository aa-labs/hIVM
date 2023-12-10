import { makeStyles } from "@mui/styles";

const Footer = () => {
  const classes = useStyles();

  return (
    <footer
      className={classes.footer}
      style={
        {
          // backgroundColor: "#AFC8AD",
        }
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 20px",
          maxWidth: 1280,
          margin: "auto",
        }}
      >
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <img src="/img/logo-black.png" alt="logo" className={classes.logo} /> */}
          <p className={classes.text}>
            Team <span style={{ textDecoration: "underline" }}>AA</span>:
            <a
              style={{ textDecoration: "underline", padding: "0 10px" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/ankurdubey521"
            >
              @ankurdubey521
            </a>
            <a
              style={{ textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/AmanRaj1608"
            >
              @amanraj1608
            </a>
          </p>
          {/* <p className={classes.text}>GitHub - </p> */}
        </div>
      </div>
    </footer>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme,
  footer: {
    position: "relative",
    borderTop: "2px solid #88AB8E",
    display: "block",
    padding: "20px 0 15px 0",
    background: "url(/img/floor.svg) center repeat",
  },
  logo: {
    height: "60px",
    margin: "auto",
    marginBottom: "10px",
  },
  text: {
    color: "#000",
    fontSize: "16px",
    fontWeight: 300,
    paddingBottom: 5,
    backgroundColor: "#AFC8AD",
    clipPath: "polygon(3% 0, 100% 0%, 97% 100%, 0% 100%)",
    padding: "5px 20px",
  },
}));

export default Footer;
