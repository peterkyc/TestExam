import * as React from 'react';
import { forwardRef } from 'react';
import { AppBar, UserMenu, MenuItemLink, useTranslate } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { Person, Settings } from '@material-ui/icons';
// import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import { AppState } from "../types";

// import Logo from '../../.bak/Logo';

const useStyles = makeStyles({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  spacer: {
    flex: 1,
  },
});

const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  return (
    <MenuItemLink
      ref={ref}
      to="/configuration"
      primaryText={translate('pos.configuration')}
      leftIcon={<Settings />}
      onClick={props.onClick}
      sidebarIsOpen
    />
  );
});
const UserProfileMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  return (
    <MenuItemLink
      ref={ref}
      to="/userProfile"
      primaryText={translate('pos.userProfile')}
      leftIcon={<Person />}
      onClick={props.onClick}
      sidebarIsOpen
    />
  );
});

const CustomUserMenu = (props: any) => (
  <UserMenu {...props}>
    <UserProfileMenu />
    <ConfigurationMenu />
  </UserMenu>
);

const CustomAppBar = (props: any) => {
  const classes = useStyles();
  useSelector((state: AppState) => state.userName); // force rerender on theme change
  return (
    <AppBar {...props} elevation={1} userMenu={<CustomUserMenu />}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      />
      {/* <Logo /> */}
      <span className={classes.spacer} />
    </AppBar>
  );
};

export default CustomAppBar;
