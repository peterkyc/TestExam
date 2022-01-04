import * as React from 'react';
import { Route } from 'react-router-dom';
import Configuration from './pages/Configuration';
import UserProfile from './pages/UserProfile';
import Segments from './others/segments/Segments';

export default [
  <Route exact path="/configuration" render={() => <Configuration />} />,
  <Route exact path="/userProfile" render={() => <UserProfile />} />,
  <Route exact path="/segments" render={() => <Segments />} />,
];
