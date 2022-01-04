import { createTheme, makeStyles } from '@material-ui/core/styles';

export const darkTheme = {
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#FBBA72',
    },
    type: 'dark' as 'dark', // Switching the dark mode on is a single property value change.
  },
  sidebar: {
    width: 200,
  },
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        color: '#ffffffb3',
        backgroundColor: '#616161e6',
      },
    },
    MuiButtonBase: {
      root: {
        '&:hover:active::after': {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'currentColor',
          opacity: 0.3,
          borderRadius: 'inherit',
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};

export const lightTheme = {
  palette: {
    primary: {
      main: '#4f3cc9',
    },
    secondary: {
      light: '#5f5fc4',
      main: '#283593',
      dark: '#001064',
      contrastText: '#fff',
    },
    background: {
      default: '#fcfcfe',
    },
    type: 'light' as 'light',
  },
  shape: {
    borderRadius: 10,
  },
  sidebar: {
    width: 200,
  },
  overrides: {
    RaMenuItemLink: {
      root: {
        borderLeft: '3px solid #fff',
      },
      active: {
        borderLeft: '3px solid #4f3cc9',
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: 'none',
      },
      root: {
        border: '1px solid #e0e0e3',
        backgroundClip: 'padding-box',
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: '#fff',
        color: '#4f3cc9',
        boxShadow: 'none',
      },
    },
    MuiButtonBase: {
      root: {
        '&:hover:active::after': {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'currentColor',
          opacity: 0.3,
          borderRadius: 'inherit',
        },
      },
    },
    MuiAppBar: {
      colorSecondary: {
        color: '#808080',
        backgroundColor: '#fff',
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: '#f5f5f5',
      },
      barColorPrimary: {
        backgroundColor: '#d7d7d7',
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&$disabled': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        border: 'none',
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};

export const extendPage = {
  main: {
    // opacity: 0.2,
    background: '#eee',
    // backgroundImage: "url('https://assets.digitalocean.com/labs/images/community_bg.png')",
    width: "calc(100vw - 225px)",
    minHeight: "calc(100vh - 70px)",
  }
};
export const useStyles = makeStyles((theme: any) => ({
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
    background: "rgba(255, 255, 255, 0.8)",
    color: "rgba(0, 0, 0, 0.8)"
  },
  formContainer: {
    width: "40%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme?.breakpoints?.down?.("md")]: {
      width: "50%",
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: "100vw",
    minHeight: "100vh",
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: 'url(https://source.unsplash.com/random/1600x900)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    ... (theme?.main||{})
  },
  card: {
    minWidth: 400,
    marginTop: '0em',
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: theme?.palette?.secondary?.main,
  },
  hint: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: "60vh",
    color: theme?.palette?.grey[500],
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    marginTop: '1em',
  },
  actions: {
    padding: '1em 1em 1em 1em',
  },
  googleIcon: {
    width: 30,
    marginRight: theme?.spacing?.(2),
  },
  googleButton: {
    // marginTop: theme?.spacing?.(6),
    boxShadow: "0px 3px 11px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
    backgroundColor: "white",
    color: "black",
    // fontWeight: "700",
    fontSize: "0.9em",
    width: "100%",
    textTransform: "none",
  },
}));


// Peter move from login
/*
export const useStyles = makeStyles( (theme:any) => ({
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  logotypeContainer: {
    backgroundColor: theme?.palette?.primary?.main,
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme?.breakpoints?.down?.("md")]: {
      width: "50%",
    },
    [theme?.breakpoints?.down?.("md")]: {
      display: "none",
    },
  },
  logotypeImage: {
    width: 165,
    marginBottom: theme?.spacing?.(4),
  },
  logotypeText: {
    color: "white",
    fontWeight: 500,
    fontSize: 84,
    [theme?.breakpoints?.down?.("md")]: {
      fontSize: 48,
    },
  },
  formContainer: {
    width: "40%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme?.breakpoints?.down?.("md")]: {
      width: "50%",
    },
  },
  form: {
    width: 320,
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
  },
  greeting: {
    fontWeight: 500,
    textAlign: "center",
    marginTop: theme?.spacing?.(4),
  },
  subGreeting: {
    fontWeight: 500,
    textAlign: "center",
    marginTop: theme?.spacing?.(2),
  },
  googleButton: {
    marginTop: theme?.spacing?.(6),
    boxShadow: theme?.customShadows?.widget,
    backgroundColor: "white",
    width: "100%",
    textTransform: "none",
  },
  googleButtonCreating: {
    marginTop: 0,
  },
  googleIcon: {
    width: 30,
    marginRight: theme?.spacing?.(2),
  },
  creatingButtonContainer: {
    marginTop: theme?.spacing?.(2.5),
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountButton: {
    height: 46,
    textTransform: "none",
  },
  formDividerContainer: {
    marginTop: theme?.spacing?.(4),
    marginBottom: theme?.spacing?.(4),
    display: "flex",
    alignItems: "center",
  },
  formDividerWord: {
    paddingLeft: theme?.spacing?.(2),
    paddingRight: theme?.spacing?.(2),
  },
  formDivider: {
    flexGrow: 1,
    height: 1,
    backgroundColor: (theme?.palette?.text?.hint||"") + "40",
  },
  errorMessage: {
    textAlign: "center",
  },
  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme?.palette?.primary?.light,
    },
    "&:after": {
      borderBottomColor: theme?.palette?.primary?.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme?.palette?.primary?.light} !important`,
    },
  },
  textField: {
    borderBottomColor: theme?.palette?.background?.light,
  },
  formButtons: {
    width: "100%",
    marginTop: theme?.spacing?.(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgetButton: {
    textTransform: "none",
    fontWeight: 400,
  },
  loginLoader: {
    marginLeft: theme?.spacing?.(4),
  },
  copyright: {
    marginTop: theme?.spacing?.(4),
    whiteSpace: "nowrap",
    [theme?.breakpoints?.up?.("md")]: {
      position: "absolute",
      bottom: theme?.spacing?.(2),
    },
  },
}));
*/