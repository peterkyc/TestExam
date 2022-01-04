import * as React from 'react';
import { Box, Card, CardActions, Button, Typography } from '@material-ui/core';
import { Home, Code, Apps } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-admin';

import { useLogout } from 'react-admin';
import MenuItem from '@material-ui/core/MenuItem';
import { PowerSettingsNew as ExitIcon } from '@material-ui/icons';

import publishArticleImage from '../images/welcome_illustration.svg';
import { getUserData } from "../authProvider";
const useStyles = makeStyles(theme => ({
  root: {
    background:
      theme.palette.type === 'dark'
        ? '#535353'
        : `linear-gradient(to right, #7589fb 0%, #6b74e7 35%), linear-gradient(to bottom, #7589fb 0%, #4c6feb 50%), #4c6feb`,

    color: '#fff',
    padding: 20,
    marginTop: theme.spacing(2),
    marginBottom: '1em',
  },
  media: {
    background: `url(${publishArticleImage}) top right / cover`,
    marginLeft: 'auto',
  },
  actions: {
    [theme.breakpoints.down('md')]: {
      padding: 0,
      flexWrap: 'wrap',
      '& a': {
        marginTop: '1em',
        marginLeft: '0!important',
        marginRight: '1em',
      },
    },
  },
}));

const icons = {
  cv: <Home />,
  demo: <Code />,
  swagger: <Apps />,
};

const Welcome = () => {
  const translate = useTranslate(), classes = useStyles();
  const tl = name => translate(`pos.dashboard.welcome.${name}`);
  const button = ({ name, text = tl(name), startIcon = icons[name], href = tl(name + "Url"), variant = "contained", target = "_blank" }) => {
    const opts: any = { variant, href, startIcon, target };
    return <Button {...opts}> {text}</Button>;
  };
  const logout = useLogout();
  const handleClick = () => logout();
  const ud = getUserData(), { userId: id, name = "", imageUrl } = ud || {};

  return (
    <Card className={classes.root}>
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            {`Hello ${name}, `} {tl("title")}
          </Typography>
          <Box maxWidth="40em">
            <Typography variant="body1" component="p" gutterBottom>
              {tl("subtitle")}
            </Typography>
          </Box>
          <CardActions className={classes.actions}>
            {button({ name: "cv" })}
            {button({ name: "demo" })}
            {button({ name: "swagger" })}
            <MenuItem onClick={handleClick}>
              <ExitIcon /> Logout
            </MenuItem>
          </CardActions>
        </Box>

        <Box
          display={{ xs: 'none', sm: 'none', md: 'block' }}
          className={classes.media}
          width="16em"
          height="9em"
          overflow="hidden"
        />
      </Box>
    </Card>
  );
};

export default Welcome;
