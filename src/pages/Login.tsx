import * as React from 'react';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field, withTypes } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import {
  // Grid,
  // Typography,
  // Fade,
  Tabs,
  Tab,
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import LockIcon from '@material-ui/icons/Lock';
import {
  Notification, useTranslate, useNotify,
  // useAuthProvider, resetNotification, showNotification, FieldProps
} from 'react-admin';


import { lightTheme, useStyles } from './themes';
import { GoogleLogout, GoogleLogin } from './google/index'
import { useHistory } from 'react-router-dom';
import { clientId, mapSearch, validateEmail, validatePassword, FormValues } from "../../common/utils";

import { useLogin, useRegister } from "../authProvider";
import { NotificationOptions, renderInput } from "./utils";
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from "./Facebook";


const { Form } = withTypes<FormValues>();
const win: any = window;
const inject = history => win.__history = history;



const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const register = useRegister();
  const location = useLocation<{ nextPathname: string } | null>();
  // debug only
  const history = useHistory();
  inject(history);
  // let search = mapSearch(props?.location), initTabId = search["page"] == "register" ? 1 : 0;
  let search = mapSearch(window.location), initTabId = search["page"] == "register" ? 1 : 0;
  let cacheId = search["cacheId"];
  // var [activeTabId, setActiveTabId] = useState(() => initTabId);
  var activeTabId = initTabId, formValue;
  const field = ({ name, label = "login." + name, validate = null, autoFocus = false, type = "input", require = true }) => {
    // 
    let opts = { name, label: translate(label), validate, type, autoFocus, disabled: loading, component: renderInput };
    // @ts-ignore
    return (<Field {...opts} />
    );
  };
  const validEmail = (userId) => {
    if (!userId) {
      return translate('ra.validation.required');
    } else if (!validateEmail(userId)) {
      return translate('login.invalidMail');
    }
  }
  const validPassword = (password) => {
    if (!password) {
      return translate('ra.validation.required');
    } else if (!validatePassword(password)) {
      return translate('login.invalidPassword');
    }
  }
  const validRePassword = (repassword) => {
    let pass = formValue?.password;
    if (!repassword) {
      return translate('ra.validation.required');
    } else if (pass != repassword) {
      return translate('login.invalidRePassword');
    }
  }
  const validate = (values: FormValues) => {
    const errors: FormValues = {}, { userId, password, repassword } = values;
    let err;
    const valid = (name, func) => (err = func(values[name])) && (errors[name] = err);
    formValue = values;
    valid("userId", validEmail);
    valid("password", validPassword);
    if (initTabId === 1 && (err = validRePassword(repassword))) {
      errors.repassword = err;
    }
    return errors;
  };
  const proceError = (error: Error) => {
    const err = typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message;
    const type = 'warning', _ = err, messageArgs = { _ };
    setLoading(false);
    notify(err, { type, messageArgs });
  };
  const responseFacebook = (response) => {
    // console.log(`responseFacebook:${JSON.stringify(response)}\nresp:`, response);
    const { id, name, email, tokenObj } = response || {}, type = "FB", userId = email||id;
    // const { email: userId, name, googleId, imageUrl } = profileObj, type = "GO";
    const auth = { userId, name, id, type, tokenObj };
    console.log(`Facebook onSuccess:`, response) // eslint-disable-line
    if (initTabId === 1) {
      register(auth, '/').then(ret => {
        console.log(`after login`, ret);
      }).catch(proceError);
    } else {
      login(auth, location.state ? location.state.nextPathname : '/').catch(proceError);
    }
  }
  const handleSubmit = (auth: FormValues) => {
    setLoading(true);
    if (initTabId === 1) {
      register(auth, '/').then(ret => {
        setLoading(false);
        console.log(`after register`, ret);
      }).catch(proceError);
    } else {
      login(auth, location.state ? location.state.nextPathname : '/').then(ret => {
        setLoading(false);
        console.log(`after login`, ret);
      }).catch(proceError);
    }
  };
  /******** Start Peter Add ********/
  const onGoogleSuccess = response => {
    const { profileObj = {}, tokenObj = {} } = response || {};
    const { email: userId, name, googleId, imageUrl } = profileObj, type = "GO";
    const auth = { userId, name, googleId, imageUrl, type, tokenObj };
    console.log(`onSuccess:`, response) // eslint-disable-line
    if (initTabId === 1) {
      register(auth, '/').then(ret => {
        console.log(`after login`, ret);
      }).catch(proceError);
    } else {
      login(auth, location.state ? location.state.nextPathname : '/').catch(proceError);
    }
  }
  const onFailure = response => {
    let { error = "login failure" } = response;
    // == "popup_blocked_by_browser" "popup_closed_by_user"
    if (response && response.error && response.error.indexOf("popup") >= 0) {
      error += `,  please type right top block button to arrow popup`;
      alert(error);
    }
    console.error(`login failure`, response) // eslint-disable-line
  }
  const onRequest = () => {
    console.log('loading') // eslint-disable-line
  }
  const logout = () => {
    console.log('logout') // eslint-disable-line
  }
  /** Google OAuth client Id */
  const gaProps = { onSuccess: onGoogleSuccess, onFailure, onRequest, clientId };
  const formType = (type) => {
    const hints = ["hintLogin", "hintRegister"];
    const hint = translate(`login.${hints[type]}`);
    const label = type == 0 ? "login.password" : "login.newPassword";
    return (
      <Card className={classes.card}>
        <div className={classes.avatar}>
          <Avatar className={classes.icon}> <LockIcon /> </Avatar>
        </div>
        <div className={classes.hint}>
          {hint}
        </div>
        <div className={classes.form}>
          {
            type == 1 &&
            <div className={classes.input}>
              {field({ name: "name" })}
            </div>
          }
          <div className={classes.input}>
            {field({ name: "userId", validate: validEmail, autoFocus: true })}
          </div>
          <div className={classes.input}>
            {field({ name: "password", label, validate: validPassword, type: "password" })}
          </div>
          {
            type == 1 &&
            <div className={classes.input}>
              {field({ name: "repassword", validate: validRePassword, type: "password" })}
            </div>
          }
        </div>
        <CardActions className={classes.actions}>
          {/* "inherit" | "default" | "primary" | "secondary" */}
          <Button className={classes.googleButton} variant="contained" type="submit" color="default" disabled={loading} fullWidth >
            {loading && (<CircularProgress size={25} thickness={2} />)}
            {translate('ra.auth.sign_in')}
          </Button>
        </CardActions>
        <CardActions className={classes.actions}>
          <GoogleLogin {...gaProps} >
            Sign in with Google
          </GoogleLogin>
        </CardActions>
        <CardActions className={classes.actions}>
          <FacebookLogin appId="1705536093073820" autoLoad={true} icon="fa-facebook" fields="name,email,picture"
            callback={responseFacebook} />
        </CardActions>

      </Card>
    );
  };
  const onChange = (e, id) => {
    let loginUrl = "/login", url = id == 1 ? (loginUrl + "?page=register") : loginUrl;
    console.log(`onChange:${id},${url}`);
    history.push(url)
    //setActiveTabId(id);
  };
  const loginForm = ({ handleSubmit, form, submitting, pristine, values }) => {
    formValue = values;
    console.log("loginForm:", form, values);
    return (
      <form onSubmit={handleSubmit} >
        <div className={classes.main}>
          <Tabs value={activeTabId} indicatorColor="primary" textColor="primary" centered
            style={{ marginTop: '3em' }} onChange={onChange} >
            <Tab label="Login" classes={{ root: classes.tab }} />
            <Tab label="Sign Up" classes={{ root: classes.tab }} />
          </Tabs>
          {formType(activeTabId)}
          <Notification {...NotificationOptions} />
        </div>
      </form>
    )
  };
  // debugger
  if (!!cacheId) {
    // debugger;
    login({ cacheId }, location.state ? location.state.nextPathname : '/').then(ret => {
      console.log(`after login`, ret);
    }).catch(proceError);

  }

  return (
    <Form onSubmit={handleSubmit} validate={validate} render={loginForm} />
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const LoginWithTheme = (props: any) => (
  <ThemeProvider theme={createTheme(lightTheme)}>
    <Login {...props} />
  </ThemeProvider>
);

export default LoginWithTheme;
