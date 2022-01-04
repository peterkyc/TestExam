import { useState, useCallback } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { extendPage, lightTheme, useStyles } from './themes';
import { Field, withTypes } from 'react-final-form';
import { FormValues, noNeedVerify } from "../../common/utils";
import { Email, Mail } from '@material-ui/icons';
import {
  Notification, useTranslate, useNotify,
} from 'react-admin';
import { resendVerifyMail, resetPassword } from "../api/request";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { NotificationOptions } from "./utils";
// import { getUserData } from "../authProvider";
import authProvider from "../authProvider";

const ResendMail = (props: any) => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const ud = authProvider.getUserData(), { type } = ud, disabled = noNeedVerify(type);
  let hint = type == "GO" ? "Google" : type == "FB" ? "Facebook" : null;
  if (hint) {
    hint = `You use ${hint} account to log in, no need to resend verification mail`;
  } else {
    hint = translate("login.hintResendMail");
  }
  const proceError = (error: Error) => {
    const err = typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message;
    const type = 'warning', _ = err, messageArgs = { _ };
    setLoading(false);
    notify(err, { type, messageArgs });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    resendVerifyMail().then(ret => {
      setLoading(false);
      notify(translate('login.resentMailOK'), "info");
      console.log(`after resendVerifyMail`, ret);
    }).catch(proceError);
  };

  return (
    <form >
      <div className={classes.main}>
        <Card className={classes.card} style={{ marginTop: "10vh", opacity: 1 }}>
          <div className={classes.avatar}>
            <Avatar className={classes.icon}> <Email /> </Avatar>
          </div>
          <div className={classes.hint}>
            {hint}
          </div>
          <CardActions className={classes.actions}>
            <Button onClick={handleSubmit} className={classes.googleButton} variant="contained" type="submit" color="default" disabled={disabled || loading} fullWidth >
              {loading && (<CircularProgress size={25} thickness={2} />)}
              {translate('login.resendMail')}
            </Button>
          </CardActions>
        </Card>
        <Notification {...NotificationOptions} />
      </div>
    </form>
  );

};
// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const ResendMailTheme = (props: any) => (
  <ThemeProvider theme={createTheme({ ...lightTheme, ...extendPage })}>
    <ResendMail {...props} />
  </ThemeProvider>
);

export default ResendMailTheme;
function validPassword() {
  throw new Error("Function not implemented.");
}

