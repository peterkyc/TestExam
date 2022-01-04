import { ReactNode, createElement } from 'react';
import {
  TextField,
} from '@material-ui/core';
import visitors from '../others/visitors';
import orders from '../others/orders';
import invoices from '../others/invoices';
import products from '../others/products';
import categories from '../others/categories';
import reviews from '../others/reviews';
import { VpnKey as Key, Email, Label, Mail, Person } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Box, Typography, Divider } from '@material-ui/core';
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  ReduxState,
} from 'react-admin';
import cartouche from '../images/cartouche.png';
import cartoucheDark from '../images/cartoucheDark.png';


export interface User {
  // createdAt: Date | string;
  signedUpAt: Date | string;
  lastLoginAt: Date | string;
  lastSessionAt: Date | string;
  loginCount: number;
  name: string;
  status: string;
  type: string;
  // userId: string;
  mail: string;
}
export interface DashState {
  signedUp?: number;
  activeSession?: number;
  activeWeeks?: number;
  averageActive?: number;
  users?: User[];
}
export interface Props {
  name?: string;
  value?: string | number;
  children?: ReactNode;
}

export const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '0.5em' },
  rightCol: { flex: 1, marginLeft: '0.5em' },
  singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const useStyles = makeStyles(theme => ({
  card: {
    minHeight: 52,
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  main: (props: Props) => ({
    overflow: 'inherit',
    padding: 16,
    background: `url(${theme.palette.type === 'dark' ? cartoucheDark : cartouche
      }) no-repeat`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .icon': {
      color: theme.palette.type === 'dark' ? 'inherit' : '#dc2440',
    },
  }),
  title: {},
}));


export const Spacer = () => <span style={{ width: '1em' }} />;
export const VerticalSpacer = () => <span style={{ height: '1em' }} />;
export const CardWithIcon = (props: any) => {
  const { icon, title, subtitle, children } = props;
  const classes = useStyles({});
  return (
    <Card className={classes.card}>
      <div className={classes.main}>
        <Box width="3em" className="icon">
          {createElement(icon, { fontSize: 'large' })}
        </Box>
        <Box textAlign="right">
          <Typography className={classes.title} color="textSecondary" >
            {title}
          </Typography>
          <Typography variant="h5" component="h2">
            {subtitle || ' '}
          </Typography>
        </Box>
      </div>
      {/* <Link to={to}></Link> */}
      {children && <Divider />}
      {children}
    </Card>
  );
};


const defaultIcon = () => (<Label />);

const iconFunc = (icon) => typeof Icons[icon] == "function" ? Icons[icon] : defaultIcon;
export const MenuItem = (name, dense, icon = name, state = { _scrollToTop: true }) => {
  const translate = useTranslate();
  const icFunc = iconFunc(icon);
  const primaryText = translate(`resources.${name}.name`, { smart_count: 2 });
  const leftIcon = icFunc(), pathname = `/${name}`, to = { pathname, state };
  const options = { to, primaryText, leftIcon, dense };
  return <MenuItemLink {...options} />
};
export const Icons = {
  products: () => <products.icon />,
  orders: () => <orders.icon />,
  invoices: () => <invoices.icon />,
  categories: () => <categories.icon />,
  visitors: () => <visitors.icon />,
  reviews: () => <reviews.icon />,

  resendMail: () => <Mail />,
  resetPassword: () => <Key />,
  userProfile: () => <Person />,
}

export const renderInput = ({
  meta: { touched, error } = { touched: false, error: undefined },
  input: { ...inputProps },
  ...props
}) => {
  let e:any = window.event,rt = e?.relatedTarget,tag= rt?.tagName||"";
  console.log(`tag:${tag}, touched:${touched},error:${error}`,inputProps,props);
  if(tag.toUpperCase() == "BUTTON") {
    touched = false;
    error = null;
  }
  return (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
)};



export const NotificationOptions: any = {
  multiLine: true,
  // undoable: true,
  // autoHideDuration: 60000,// debug
  anchorOrigin: {
    vertical: 'bottom',   // 'top',      // | 
    horizontal: 'center', //'left' | 'center' | 'right';,
  },
  // className: "notification",
};


/**
 * Encode object to url parameters
 *
 * @param      {Object} paramsObj The object needs to encode as url parameters
 * @return     {String} Encoded url parameters
 */
export const objectToParams = obj => '?' + Object.keys(obj).map(name => `${name}=${encodeURIComponent(obj[name])}`).join('&');

const kc = key => encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&');
const regEx = key => new RegExp(`^(?:.*[&\\?]${kc(key)}(?:\\=([^&]*))?)?.*$`, 'i');
/**
 * Extract the value for a given key in a url-encoded parameter string
 *
 * @param      {String} str The encoded parameter string
 * @param      {String} key The target key
 * @return     {Object} Decoded value for given parameter key
 */

export const decodeParam = (str, key) => decodeURIComponent(str.replace(regEx(key), '$1'));


const eles = ['button', 'input', 'select', 'textarea', 'optgroup', 'option', 'fieldset'];
export const shouldAddDisabledProp = (tag) => eles.indexOf(String(tag).toLowerCase()) >= 0;