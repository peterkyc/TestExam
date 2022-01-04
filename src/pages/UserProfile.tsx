import { useState, useCallback } from 'react';
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
import { Person } from '@material-ui/icons';
import { extendPage, lightTheme, useStyles } from './themes';
import { Field, withTypes } from 'react-final-form';
import { FormValues, validatePassword } from "../../common/utils";
import {
  Notification, useTranslate, useNotify, minValue,
} from 'react-admin';
import { updateUserProfile } from "../api/request";
import { NotificationOptions } from "./utils";
// import { getUserData, setUserData } from "../authProvider";
import authProvider from "../authProvider";
import { changeName } from './actions';
import { useDispatch } from "react-redux";

const { Form } = withTypes<FormValues>();
let formValue;

const UserProfile = (props: any) => {
  const userData: any = authProvider.getUserData() || {}, { userId, name, imageUrl } = userData;
  const [data, setData] = useState(userData);
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const dispatch = useDispatch();

  const proceError = (error: Error) => {
    const err = typeof error === 'string' ? error : typeof error === 'undefined' || !error.message ? 'ra.auth.sign_in_error' : error.message;
    const type = 'warning', _ = err, messageArgs = { _ };
    setLoading(false);
    notify(err, { type, messageArgs });
  };
  const handleSubmit = (e) => {
    let newName = data?.name;
    if (newName == name) {
      notify("login.nameNoChanged", "warning");
      return;
    }
    const auth = { userId, name: newName };
    setLoading(true);
    updateUserProfile(auth).then(ret => {
      setLoading(false);
      if (ret.status != 0 && ret.message) {
        notify(ret.message, "warning");
        console.error(`after userProfile`, ret);
      } else {
        if(ret.name == newName) {
          let ud = authProvider.getUserData();
          ud.name = newName;
          authProvider.setUserData(ud);
          dispatch(changeName(newName));
        }
        // let message = translate('login.userProfileOK');
        notify("login.userProfileOK", "info");
        console.log(`after userProfile`, ret);
      }

    }).catch(proceError);
  };
  const onChange = event => {
    console.log(event.target.value);
    const userInput = event.target.value;
    setData({ name: userInput });
  };
  const field = (name, disabled?) => {
    // { name, label = "login." + name, validate = null, autoFocus = false, type = "input", require = true }
    let inputProps: any = {
      name, label: translate(`login.${name}`), defaultValue: userData[name], disabled: loading || disabled,
      helperText: translate(`login.${name}Hint`) || undefined, variant: "outlined", fullWidth: true, onChange
    };
    return (
      <TextField {...inputProps} />
    );
  };
  return (
    <form >
      <div className={classes.main}>
        <Card className={classes.card} style={{ marginTop: "10vh", opacity: 1 }}>
          <div className={classes.avatar}>
            <Avatar className={classes.icon}> <Person /> </Avatar>
          </div>
          <div className={classes.hint}>
            {translate('login.hintUserProfile')}
          </div>
          <div className={classes.form}>
            <div className={classes.input}>
              {field("userId", true)}
              {/* <TextField id="userId" label="email" defaultValue={userId} disabled variant="outlined" /> */}
            </div>
            <div className={classes.input}>
              {field("name")}
              {/* <TextField id="name" label="Name" defaultValue={name} helperText="Please enter your name" variant="outlined" /> */}
            </div>
          </div>
          <CardActions className={classes.actions}>
            <Button className={classes.googleButton} onClick={handleSubmit} variant="contained" type="submit" color="default" disabled={loading} fullWidth >
              {loading && (<CircularProgress size={25} thickness={2} />)}
              {translate('login.userProfile')}
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
const UserProfileTheme = (props: any) => (
  <ThemeProvider theme={createTheme({ ...lightTheme, ...extendPage })}>
    <UserProfile {...props} />
  </ThemeProvider>
);
export default UserProfileTheme;
// export default UserProfile;

