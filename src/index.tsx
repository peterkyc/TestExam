/** @jsxRuntime classic */
import { Fetch } from "./global";
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'proxy-polyfill';
// IE11 needs "jsxRuntime classic" for this initial file which means that "React" needs to be in scope
// https://github.com/facebook/create-react-app/issues/9906
import * as React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
console.log(`is fetch inject=${Fetch !== fetch}`)
ReactDOM.render(<App />, document.getElementById('root'));
