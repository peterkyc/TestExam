import * as React from 'react';
import { useSelector } from 'react-redux';
import { Layout, LayoutProps } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';
import { darkTheme, lightTheme } from './themes';
import { AppState } from '../types';

export default (props: LayoutProps) => {
  const theme = useSelector((state: AppState) => {
    console.log(`theme state:`, state);
    return state.theme === 'dark' ? darkTheme : lightTheme
  });
  const userName = useSelector((state: AppState) => {
    console.log(`userName state:`, state);
    return state.userName;
  });
  const opts = { ...props, userName }
  return <Layout {...opts} appBar={AppBar} menu={Menu} theme={theme} />;
};
