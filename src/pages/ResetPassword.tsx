import { useState, useCallback, useRef } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { extendPage, lightTheme, useStyles } from './themes';
import { Field, withTypes } from 'react-final-form';
import { FormValues, noNeedVerify, validatePassword } from "../../common/utils";
import {
  Notification, useTranslate, useNotify,
} from 'react-admin';
import { resetPassword } from "../api/request";
import { NotificationOptions, renderInput } from "./utils";
// import { getUserData } from "../authProvider";
import authProvider from "../authProvider";


const { Form } = withTypes<FormValues>();
let formValue;

const ResetPassword = (props: any) => {
  const [loading, setLoading] = useState(false);
  // const [focus, setFocus] = useState("password");
  const inputRef:any = useRef();
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const ud = authProvider.getUserData(), { type } = ud, disabled = noNeedVerify(type);
  let hint = type == "GO" ? "Google" : type == "FB" ? "Facebook" : null;
  if (hint) {
    hint = `You use ${hint} account to log in, no need to change your password`;
  } else {
    hint = translate("login.hintResetPassword");
  }
  const proceError = (error: Error) => {
    const err = typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message;
    const type = 'warning', _ = err, messageArgs = { _ };
    setLoading(false);
    notify(err, { type, messageArgs });
  };
  const validate = (values: FormValues) => {
    const errors: FormValues = {}, { newPassword, password, repassword } = values;
    formValue = values;
    if (!password) {
      errors.password = translate('ra.validation.required');
    } else if (!validatePassword(password)) {
      errors.password = translate('login.invalidPassword');
    }
    if (!newPassword) {
      errors.newPassword = translate('ra.validation.required');
    } else if (!validatePassword(newPassword)) {
      errors.newPassword = translate('login.invalidPassword');
    }
    if (!repassword) {
      errors.repassword = translate('ra.validation.required');
    } else if (newPassword != repassword) {
      errors.repassword = translate('login.invalidRePassword');
    }
    return errors;
  };
  const handleSubmit = (auth: FormValues) => {
    const { password, newPassword } = auth;
    const ud = authProvider.getUserData(), { userId } = ud;
    auth = { password, newPassword, userId };
    setLoading(true);
    resetPassword(auth).then(ret => {
      setLoading(false);
      if (ret.status != 0 && ret.message) {
        notify(ret.message, "warning");
        if(inputRef?.current?.focus) {
          inputRef.current.focus();
        }
      } else {
        notify(translate('login.resetPasswordOK'), "info");
      }
      console.log(`after resetPassword`, ret);
    }).catch(proceError);
  };
  const field = ({ name, label = "login." + name, validate = null, type = "input", require = true, inputRef = null }) => {
    let autoFocus = name == "password";
    let opts = { name, label: translate(label), validate, type, autoFocus, disabled: disabled || loading, component: renderInput };
    // @ts-ignore
    return (<Field {...opts} />
    );
  };
  const resetPasswordForm = ({ handleSubmit, values }) => {
    return (
      <form onSubmit={handleSubmit} >
        <div className={classes.main}>
          <Card className={classes.card} style={{ marginTop: "10vh", opacity: 1 }}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}> <LockIcon /> </Avatar>
            </div>
            <div className={classes.hint}>
              {hint}
            </div>
            <div className={classes.form}>
              <div className={classes.input}>
                {field({ name: "password", type: "password", inputRef })}
              </div>
              <div className={classes.input}>
                {field({ name: "newPassword", type: "password" })}
              </div>
              <div className={classes.input}>
                {field({ name: "repassword", type: "password" })}
              </div>
            </div>
            <CardActions className={classes.actions}>
              <Button className={classes.googleButton} variant="contained" type="submit" color="default" disabled={disabled || loading} fullWidth >
                {loading && (<CircularProgress size={25} thickness={2} />)}
                {translate('login.resetPassword')}
              </Button>
            </CardActions>
          </Card>
          <Notification {...NotificationOptions} />
        </div>
      </form>
    )
  };

  return (
    <Form onSubmit={handleSubmit} validate={validate} render={resetPasswordForm} />
  );

};
// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const ResetPasswordTheme = (props: any) => (
  <ThemeProvider theme={createTheme({ ...lightTheme, ...extendPage })}>
    <ResetPassword {...props} />
  </ThemeProvider>
);
export default ResetPasswordTheme;
// export default ResetPassword;

