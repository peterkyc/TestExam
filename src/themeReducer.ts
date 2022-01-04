import { Reducer } from 'redux';
import { getTheme } from "./authProvider";
import { CHANGE_THEME, CHANGE_NAME, changeTheme } from './pages/actions';
import { ThemeName } from './types';

type State = ThemeName;
type Action = | ReturnType<typeof changeTheme> | { type: 'OTHER_ACTION'; payload?: any };

export const themeReducer: Reducer<State, Action> = (previousState, action) => {
  !previousState && (previousState = getTheme());
  ["light","dark"].indexOf(previousState)
  if (action.type === CHANGE_THEME) {
    return action.payload;
  }
  return previousState;
};
export const nameReducer: Reducer<string, Action> = (previousState = " ", action) => {
  if (action.type === CHANGE_NAME) {
    return action.payload;
  }
  return previousState;
};

// export default themeReducer;
