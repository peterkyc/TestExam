import React from 'react'
import google from "../../images/google.svg";
import { useStyles } from '../themes';


const ButtonContent = ({ children, icon }) => {
  var classes = useStyles();
  return (
    <span style={{ paddingRight: 10, fontWeight: 500, paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}>
      <img src={google} alt="google" className={classes.googleIcon} />
      {children}
    </span>
  )
};

export default ButtonContent
