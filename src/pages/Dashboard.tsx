import React, { useState, useEffect, useCallback, CSSProperties } from 'react';
import { useVersion, useDataProvider, useTranslate } from 'react-admin';
import {
  useMediaQuery, Theme,
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination,
} from '@material-ui/core';
import { GroupAdd as SignedUpIcon, ContactMail as SessionIcon, DateRange as AverageIcon } from '@material-ui/icons';


// import { Link } from 'react-router-dom';
// import { subDays } from 'date-fns';

import Welcome from './Welcome';


// import PendingOrders from './PendingOrders';
// import OrderChart from './OrderChart';

// import { Customer, Order, Review } from '../../types';
import { listUsers } from "../api/request";
// import { getUserData } from "../authProvider";
import authProvider from "../authProvider";
import { dateFormat, diffDays } from "../../common/utils";
import { DashState, CardWithIcon, styles, Props, Spacer, VerticalSpacer } from "./utils";

const icons = {
  signedUp: SignedUpIcon,
  session: SessionIcon,
  average: AverageIcon,
};

const UserStatistics = (props: Props) => {
  const { name, value, children } = props;
  const tl = useTranslate(), icon = icons[name], title = tl(`pos.dashboard.${name}`), subtitle = value;
  const opts = { icon, title, subtitle };
  return <CardWithIcon {...opts} />;
};

// signedUpAt: Date | string;
// lastLoginAt: Date | string;
// lastSessionAt: Date | string;
// loginCount: number;
// name: string;
// status: string;
// type: string;
// mail: string;
const Types = { default: "eMail", GO: "Google", FB: "Facebook" }
const typeFormat = (value) => Types[value]||Types.default;

const column = (key, label, format = null, minWidth = 120, align = "left") => ({ key, label, format, minWidth, align, });

const columns = [
  column("mail", "Mail"),
  column("name", "Name"),
  column("type", "Type", typeFormat),
  column("loginCount", "login count", null, 80, "right"),
  column("signedUpAt", "signed Up At", dateFormat, 180),
  column("lastLoginAt", "last Login At", dateFormat, 180),
  column("lastSessionAt", "last Session At", dateFormat, 180),
];

const UsersDashboard = ({ users, columns }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper style={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column: any) => (
                <TableCell {...column} >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column: any) => {
                    const value = row[column.key];
                    return (
                      <TableCell key={column.key} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={users.length}
        rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} />
    </Paper>
  );
};



const Dashboard = () => {
  const [state, setState] = useState<DashState>({});
  const version = useVersion();
  // const dataProvider = useDataProvider();
  const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const fetchUsers = useCallback(async () => {
    const today = new Date(), tt = today.getTime();
    const ud = authProvider.getUserData(), userId = ud?.userId;
    listUsers({ userId }).then(ret => {
      const datas: any[] = ret?.datas || [];
      let signedUp = 0, activeSession = 0, activeWeeks = 0;
      let users = datas.map(user => {
        if (!user?.userId) {
          return null;
        }
        let {
          userId: mail, createdAt: signedUpAt,
          lastLoginAt, lastSessionAt, loginCount, name, status, type,
        } = user;
        // const signupDate = new Date(user?.createdAt||null);
        const activeDate = new Date(lastSessionAt || null);
        signedUp++;
        // check Total number of users with active sessions today.
        if (today.setHours(0, 0, 0, 0) == activeDate.setHours(0, 0, 0, 0)) {
          activeSession++;
        }
        // check number of active session users in the last 7 days rolling.
        let diff = diffDays(today, activeDate);
        if (diff <= 7) {
          activeWeeks++;
        }
        return { mail, signedUpAt, lastLoginAt, lastSessionAt, loginCount, name, status, type };
      });
      let averageActive = Number((activeWeeks / 7).toFixed(2));
      setState({ signedUp, activeSession, activeWeeks, averageActive, users })
    }).catch(err => {
      console.log(`err:`, err);
    });
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [version]); // eslint-disable-line react-hooks/exhaustive-deps
  const { signedUp, activeSession, activeWeeks, averageActive, users } = state;
  const xsmall = () => (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
        <UserStatistics name="signedUp" value={signedUp} />
        <VerticalSpacer />
        <UserStatistics name="session" value={activeSession} />
        <VerticalSpacer />
        <UserStatistics name="average" value={averageActive} />
      </div>
    </div>
  );
  const small = () => (
    <div style={styles.flexColumn as CSSProperties}>
      <div style={styles.singleCol}>
        <Welcome />
      </div>
      <div style={styles.flex}>
        <UserStatistics name="signedUp" value={signedUp} />
        <Spacer />
        <UserStatistics name="session" value={activeSession} />
        <Spacer />
        <UserStatistics name="average" value={averageActive} />
      </div>
      <div style={styles.singleCol}>
        <UsersDashboard users={users || []} columns={columns} />
      </div>

      {/* 
      <div style={styles.singleCol}>
        <OrderChart orders={recentOrders} />
      </div>
      <div style={styles.singleCol}>
        <PendingOrders orders={pendingOrders} customers={pendingOrdersCustomers} />
      </div> */}
    </div>
  );
  return isXSmall ? xsmall() : small();
};

export default Dashboard;

/*

  const fetchOrders = useCallback(async () => {
    const aMonthAgo = subDays(new Date(), 30);
    const { data: recentOrders } = await dataProvider.getList<Order>(
      'commands',
      {
        filter: { date_gte: aMonthAgo.toISOString() },
        sort: { field: 'date', order: 'DESC' },
        pagination: { page: 1, perPage: 50 },
      }
    );
    const aggregations = recentOrders
      .filter(order => order.status !== 'cancelled')
      .reduce(
        (stats: OrderStats, order) => {
          if (order.status !== 'cancelled') {
            stats.revenue += order.total;
            stats.nbNewOrders++;
          }
          if (order.status === 'ordered') {
            stats.pendingOrders.push(order);
          }
          return stats;
        },
        {
          revenue: 0,
          nbNewOrders: 0,
          pendingOrders: [],
        }
      );
    setState(state => ({
      ...state,
      recentOrders,
      revenue: aggregations.revenue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      nbNewOrders: aggregations.nbNewOrders,
      pendingOrders: aggregations.pendingOrders,
    }));
    const { data: customers } = await dataProvider.getMany<Customer>(
      'customers',
      {
        ids: aggregations.pendingOrders.map(
          (order: Order) => order.customer_id
        ),
      }
    );
    setState(state => ({
      ...state,
      pendingOrdersCustomers: customers.reduce(
        (prev: CustomerData, customer) => {
          prev[customer.id] = customer; // eslint-disable-line no-param-reassign
          return prev;
        },
        {}
      ),
    }));
  }, [dataProvider]);

  const fetchReviews = useCallback(async () => {
    const { data: reviews } = await dataProvider.getList<Review>(
      'reviews',
      {
        filter: { status: 'pending' },
        sort: { field: 'date', order: 'DESC' },
        pagination: { page: 1, perPage: 100 },
      }
    );
    const nbPendingReviews = reviews.reduce((nb: number) => ++nb, 0);
    const pendingReviews = reviews.slice(0, Math.min(10, reviews.length));
    setState(state => ({ ...state, pendingReviews, nbPendingReviews }));
    const { data: customers } = await dataProvider.getMany<Customer>(
      'customers',
      {
        ids: pendingReviews.map(review => review.customer_id),
      }
    );
    setState(state => ({
      ...state,
      pendingReviewsCustomers: customers.reduce(
        (prev: CustomerData, customer) => {
          prev[customer.id] = customer; // eslint-disable-line no-param-reassign
          return prev;
        },
        {}
      ),
    }));
  }, [dataProvider]);

*/