import "./App.css";
import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import authProvider from './authProvider';
import { themeReducer, nameReducer } from './themeReducer';
import { Login, Layout } from './pages';
import Dashboard from './pages/Dashboard';
import customRoutes from './routes';
import englishMessages from './i18n/en';

import visitors from './others/visitors';
import orders from './others/orders';
import products from './others/products';
import invoices from './others/invoices';
import categories from './others/categories';
import reviews from './others/reviews';
import dataProviderFactory from './dataProvider';
import { useHistory } from 'react-router-dom';
// import LabelIcon from '@material-ui/icons/Label';
import { VpnKey as Key, Email, Person } from '@material-ui/icons';

import ResendMail from "./pages/ResendMail";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";


const Components = {
  resendMail: ResendMail,
  resetPassword: ResetPassword,
  userProfile: UserProfile,
};
const ICons = {
  resendMail: Email,
  resetPassword: Key,
  userProfile: Person,
};
type CN = keyof typeof Components;

const resOption = (name, list = Components[name], icon = ICons[name]) => ({ name, list, icon });
const resource = (name: CN) => <Resource {...resOption(name)} />

const i18nProvider = polyglotI18nProvider(locale => {
  if (locale === 'fr') {
    return import('./i18n/fr').then(messages => messages.default);
  }

  // Always fallback on english
  return englishMessages;
}, 'en');

const win: any = window;
const inject = history => win.__history = history;

const App = () => {
  const history = useHistory();
  const reducer = { theme: themeReducer, userName: nameReducer }; //, userName: nameReducer 
  inject(history);
  return (
    <Admin title="Peter's Test Program"
      dataProvider={dataProviderFactory(process.env.REACT_APP_DATA_PROVIDER || '')}
      customReducers={reducer}
      customRoutes={customRoutes}
      authProvider={authProvider}
      dashboard={Dashboard}
      loginPage={Login}
      layout={Layout}
      i18nProvider={i18nProvider}
      disableTelemetry
    >
      {/** Start Peter Add */}
      {[
        resource("resendMail"),
        resource("resetPassword"),
      ]}
      {/** End Peter Add */}

      <Resource name="customers" {...visitors} />
      <Resource
        name="commands"
        {...orders}
        options={{ label: 'Orders' }}
      />
      <Resource name="invoices" {...invoices} />
      <Resource name="products" {...products} />
      <Resource name="categories" {...categories} />
      <Resource name="reviews" {...reviews} />
    </Admin>
  );
};

export default App;
