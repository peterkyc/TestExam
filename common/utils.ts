import moment from "moment";


export interface RunOpts {
  id?: string | number;
  command?: string;
  listener?: Func;

}
export enum MethodType {
  register = "/api/test/register",
  login = "/api/test/login",
  logout = "/api/test/logout",
  // changeUserInfo = "/api/test/changeUserInfo",
  // mailTo = "/api/test/mailTo",
  resetPassword = "/api/test/resetPassword",
  resendVerifyMail = "/api/test/resendVerifyMail",
  verifyMail = "/api/test/verifyMail",
  updateUserProfile = "/api/test/updateUserProfile",
  listUsers = "/api/test/listUsers",
}
export enum Status {
  Error = -1,
  OK = 0,
  UserNotFound = -100,
  IncorrectPassword = -101,
  UserExists = -102,
  VerifyEMail = -103,
  invalidMail = -104,
  invalidPassword = -105,


}

export type Func = (...args: any[]) => any;


export const registerMailContent = (name, mailAddress, url) => `

<h2>
Hello, ${name}!
</h2>
<p>
Welcome to SignUp this program! You recently created an account at our site with the email ${mailAddress}.
</p>

<p>
Your account will be finalized once you confirm your email address.
</p>

<p>
<a href="${url}" target="testLogin" rel="noopener noreferrer" data-auth="NotApplicable" style="padding:10px; width:336px; display:block; text-decoration:none; border:0; text-align:center; font-weight:bold; font-size:22px; font-family:sans-serif; color:#ffffff; background:#fd8d14; border:1px solid #fd8d14; -moz-border-radius:6px; -webkit-border-radius:6px; border-radius:6px; line-height:35px" data-linkindex="1">
  Activate Your Account
</a>
<a href="${url}" target="testLogin">
  Activate Your Account
</a>
</p>
`;


export const log = (fmt, ...args) => {
  let date = moment().format("YYYY-MM-DD HH:mm:ss.SSS"), msg = `${date} ${fmt}`;
  console.log.apply(console, [msg, ...args]);
};

export const dateFormat = value => {
  try {
    return moment(value).format("YYYY-MM-DD HH:mm:ss.SSS");    
  } catch(e){
    return value||"";
  }
}

/**
 * 
 * the password must be validated by the following conditions.
 * contains at least one lower character 
 * contains at least one upper character 
 * contains at least one digit character 
 * contains at least one special character
 * contains at least 8 characters
 */
const MinPasswordLength = 8;
const SpecialChar = "!@#\$%\^&\*\\+\\-\\/_\\(\\)\\{\\}\\[\\]";
export const validatePassword = (str: string) => {
  if (!str || str.length < MinPasswordLength)
    return;
  const verfyReg = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[${SpecialChar}])(?=.{${MinPasswordLength},})`);
  let test = str.match(verfyReg)
  return !!test;
};

/**
 * the email validate 
 */
export const validateEmail = (email: string) => {
  const verifyReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  let test = email.match(verifyReg);
  return !!test;
};

export const noNeedVerify = (type) => ["GO", "FB"].indexOf(type) >= 0;
export const isVerify = (type, status?: string) => {
  let ok = noNeedVerify(type);
  return ok || (status && status.toLowerCase() == 'a');
}


export interface FormValues {
  userId?: string;
  password?: string;
  repassword?: string;
  type?: string;
  name?: string;
  [index: string]: string;
}
// export const Apis = {
//   register: "/api/test/register",
//   login: "/api/test/login",
//   logout: "/api/test/logout",
//   changeUserInfo: "/api/test/changeUserInfo",
//   mailTo: "/api/test/mailTo",
// };
export const Apis = { ...MethodType };
console.log("Apis:", Apis, MethodType);

const sep = "/";
export const pathJoin = (...parts: any[]) => parts.join(sep).replace(new RegExp(`[${sep}]+`, 'g'), sep);

export const rs = (...args) => args[args.length - 1];


export const mapSearch = (location = window.location) => {
  let map = {};
  let search = (location?.search || location?.href || "").split("?"), ss = search[1] || search[0] || "";
  const setVar = (arr) => arr instanceof Array && arr.length >= 2 && (map[arr[0]] = arr[1]);
  ss.split("&").forEach(n => n && setVar(n.split("=")));
  return map;
}

/** Google OAuth client Id */
export const clientId = "970619546012-36c5siov65i091h0615codicab9ced34.apps.googleusercontent.com";
export const clientPass = "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";


export const join = (...args: string[]) => {
  const regEx = /^\/|\/$/g;
  return args.map(str => str.replace(regEx, "")).join('/');
}

export enum TM {

  Second = 1000,
  Minute = 60 * Second,
  Hour = 60 * Minute,
  Day = 24 * Hour,
  Week = 7 * Day,

}
export const diffDays = (date: Date, date2: Date, tm: TM = TM.Day) => {
  let t1 = date.getTime(), t2 = date2.getTime();
  return (t1 - t2) / tm;
}