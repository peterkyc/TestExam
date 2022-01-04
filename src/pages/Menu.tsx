import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// import LabelIcon from '@material-ui/icons/Label';
// import { VpnKey as Key, Email } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
  useTranslate,
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  ReduxState,
} from 'react-admin';

import visitors from '../others/visitors';
import orders from '../others/orders';
import invoices from '../others/invoices';
import products from '../others/products';
import categories from '../others/categories';
import reviews from '../others/reviews';
import SubMenu from './SubMenu';
import { AppState } from '../types';
import { MenuItem } from "./utils";

type MenuName = 'menuCatalog' | 'menuSales' | 'menuCustomers';

const Menu = ({ dense = false }: MenuProps) => {
  const [state, setState] = useState({
    menuCatalog: true,
    menuSales: true,
    menuCustomers: true,
  });
  const translate = useTranslate();
  const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
  useSelector((state: AppState) => state.theme); // force rerender on theme change
  const classes = useStyles();
  const handleToggle = (menu: MenuName) => {
    setState(state => ({ ...state, [menu]: !state[menu] }));
  };
  return (
    <div className={classnames(classes.root, { [classes.open]: open, [classes.closed]: !open, })}>
      {' '}
      <DashboardMenuItem />

      {MenuItem("userProfile", dense)}
      {MenuItem("resendMail", dense)}
      {MenuItem("resetPassword", dense)}

      <SubMenu
        handleToggle={() => handleToggle('menuSales')}
        isOpen={state.menuSales}
        name="pos.menu.sales"
        icon={<orders.icon />}
        dense={dense}
      >
        {/* <MenuItemLink
                    to={{
                        pathname: '/commands',
                        state: { _scrollToTop: true },
                    }}
                    primaryText={translate(`resources.commands.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<orders.icon />}
                    dense={dense}
                /> */
          MenuItem("commands", dense, "orders")
        }
        {/* <MenuItemLink
          to={{
            pathname: '/invoices',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`resources.invoices.name`, {
            smart_count: 2,
          })}
          leftIcon={<invoices.icon />}
          dense={dense}
        /> */
          MenuItem("invoices", dense)
        }
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuCatalog')}
        isOpen={state.menuCatalog}
        name="pos.menu.catalog"
        icon={<products.icon />}
        dense={dense}
      >
        {/* <MenuItemLink
          to={{
            pathname: '/products',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`resources.products.name`, {
            smart_count: 2,
          })}
          leftIcon={<products.icon />}
          dense={dense}
        /> */
          MenuItem("products", dense)
        }
        {/* <MenuItemLink
          to={{
            pathname: '/categories',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`resources.categories.name`, {
            smart_count: 2,
          })}
          leftIcon={<categories.icon />}
          dense={dense}
        /> */
          MenuItem("categories", dense)
        }
      </SubMenu>
      <SubMenu
        handleToggle={() => handleToggle('menuCustomers')}
        isOpen={state.menuCustomers}
        name="pos.menu.customers"
        icon={<visitors.icon />}
        dense={dense}
      >
        {/* <MenuItemLink
          to={{
            pathname: '/customers',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`resources.customers.name`, {
            smart_count: 2,
          })}
          leftIcon={<visitors.icon />}
          dense={dense}
        /> */
          MenuItem("customers", dense, "visitors")
        }
        {/* <MenuItemLink
          to={{
            pathname: '/segments',
            state: { _scrollToTop: true },
          }}
          primaryText={translate(`resources.segments.name`, {
            smart_count: 2,
          })}
          leftIcon={<LabelIcon />}
          dense={dense}
        /> */
          MenuItem("segments", dense)
        }
      </SubMenu>
      {/* <MenuItemLink
        to={{
          pathname: '/reviews',
          state: { _scrollToTop: true },
        }}
        primaryText={translate(`resources.reviews.name`, {
          smart_count: 2,
        })}
        leftIcon={<reviews.icon />}
        dense={dense}
      /> */
        MenuItem("reviews", dense)
      }
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  open: {
    width: 200,
  },
  closed: {
    width: 55,
  },
}));

export default Menu;
