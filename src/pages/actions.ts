import { setTheme } from "../authProvider";
import { ThemeName } from '../types';

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_NAME = 'CHANGE_NAME';

export const changeTheme = (theme: ThemeName) => {
  let action = { type: CHANGE_THEME, payload: theme, };
  setTheme(theme);
  return action;
};
export const changeName = (userName: string) => {
  let action = { type: CHANGE_NAME, payload: userName, };
  return action;
};
